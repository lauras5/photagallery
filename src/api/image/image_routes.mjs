import Router from "@koa/router";
import {promises as fs} from "fs";
import nodeFs from 'fs';
import {imageStats, resize} from "../../utils/image-utils.mjs";
import {
    BUCKET_FULL_RES,
    BUCKET_LOW_RES,
    BUCKET_MED_RES,
    // WAITING_ON_BUG_BUCKET,
    PREVIEW_IMAGE_DIMENSION,
    SEARCH_RESULT_DIMENSION
} from "../../../config.mjs";
import {addImageMetadata, deleteImageMetadata, imageIdExists} from "../../utils/sql-utils.mjs";
import nodePath from "path";
import os from "os";
import {getObject, putObject, removeObject} from "../../utils/weed-utils.mjs";
import {validateQueryParamsAll} from "../../utils/koa-utilities.mjs";
import compose from 'koa-compose';

const router = new Router();

const lowDir = nodePath.join(os.tmpdir(), 'low');
if(!nodeFs.existsSync(lowDir)) {
    await fs.mkdir(lowDir);
}

const medDir = nodePath.join(os.tmpdir(), 'med');
if(!nodeFs.existsSync(medDir)) {
    await fs.mkdir(medDir);
}

const fullDir = nodePath.join(os.tmpdir(), 'full');
if(!nodeFs.existsSync(fullDir)) {
    await fs.mkdir(fullDir);
}

async function imagePostHandler(ctx, next) {
    const {files} = ctx.request;
    const ids = [];
    for (const file of Object.keys(files)) {
        const {size: file_size, path, name} = files[file];
        const data = await fs.readFile(path);
        const {width, height, ext} = await imageStats(data);

        const longSide = width > height ? width : height;
        const shortSide = width > height ? height : width;
        const ratio1 = SEARCH_RESULT_DIMENSION / longSide;
        const lowResLength = Math.round(shortSide * ratio1);

        const ratio2 = PREVIEW_IMAGE_DIMENSION / longSide;
        const mediumResLength = Math.round(shortSide * ratio2);

        let lowResImage;
        let mediumResImage;
        if (width > height) {
            lowResImage = await resize(data, SEARCH_RESULT_DIMENSION, lowResLength);
            mediumResImage = await resize(data, PREVIEW_IMAGE_DIMENSION, mediumResLength);
        } else {
            lowResImage = await resize(data, lowResLength, SEARCH_RESULT_DIMENSION);
            mediumResImage = await resize(data, mediumResLength, PREVIEW_IMAGE_DIMENSION);
        }

        const id = await addImageMetadata({name, file_size, extension_type: ext, width, height})
        ids.push(id);

        const lowTempPath = nodePath.join(lowDir, id);
        const medTempPath = nodePath.join(medDir, id);
        const fullTempPath = nodePath.join(fullDir, id);

        await fs.writeFile(lowTempPath, lowResImage);
        await fs.writeFile(medTempPath, mediumResImage);
        await fs.rename(path, fullTempPath);

        const putLow = !!await putObject(lowTempPath, BUCKET_LOW_RES);
        const putMed = !!await putObject(medTempPath, BUCKET_MED_RES);
        const putFull = !!await putObject(fullTempPath, BUCKET_FULL_RES);

        if (!putLow || !putMed || !putFull) {
            if (putLow) {
                await removeObject(lowTempPath, BUCKET_LOW_RES);
            }
            if (putMed) {
                await removeObject(medTempPath, BUCKET_MED_RES);
            }
            if (putFull) {
                await removeObject(fullTempPath, BUCKET_FULL_RES);
            }

            await deleteImageMetadata(id);

            const index = ids.indexOf(id);
            ids.splice(index, 1);
        }

        await fs.unlink(lowTempPath);
        await fs.unlink(medTempPath);
        await fs.unlink(fullTempPath);
    }
    ctx.body = ids;
}

router.post('/', imagePostHandler);

async function imageGetHandler(ctx, next) {
    const {res, id} = ctx.request.query;
    let bucket;
    if(res === 'low') {
        bucket = BUCKET_LOW_RES;
    } else if(res === 'med') {
        bucket = BUCKET_MED_RES;
    } else if(res === 'full') {
        bucket = BUCKET_FULL_RES;
    } else {
        ctx.status = 500;
        ctx.body = {error: 'res must be value low, med, or full'};
        return;
    }

    const stream = getObject(id, bucket);
    stream.on('error', (e) => console.log(e));
    ctx.body = stream.stdout;
}

router.get('/', compose([
    validateQueryParamsAll(['res', 'id']),
    imageGetHandler,
]));

async function imageDeleteHandler(ctx, next) {
    const {id} = ctx.request.query;
    const exists = await imageIdExists(id);
    if(!exists) {
        ctx.status = 412;
        ctx.body = {error: 'No image exists with id ' + id}
        return;
    }

    await deleteImageMetadata(id);
    await removeObject(id, BUCKET_LOW_RES);
    await removeObject(id, BUCKET_MED_RES);
    await removeObject(id, BUCKET_FULL_RES);
    ctx.body = {success: true};
}

router.delete('/', compose([
    validateQueryParamsAll(['id']),
    imageDeleteHandler,
]));

export default router;
