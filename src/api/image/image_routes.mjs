import Router from "@koa/router";
import {promises as fs} from "fs";
import {imageStats, resize} from "../../utils/image-utils.mjs";
import {
    // BUCKET_FULL_RES,
    // BUCKET_LOW_RES,
    // BUCKET_MED_RES,
    WAITING_ON_BUG_BUCKET,
    PREVIEW_IMAGE_DIMENSION,
    SEARCH_RESULT_DIMENSION
} from "../../../config.mjs";
import {addImageMetadata} from "../../utils/sql-utils.mjs";
import nodePath from "path";
import os from "os";
import {getObject, putObject} from "../../utils/weed-utils.mjs";
import {validateQueryParamsAll} from "../../utils/koa-utilities.mjs";
import compose from 'koa-compose';

const router = new Router();

async function imagePostHandler(ctx, next) {
    const {files} = ctx.request;
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

        const lowTempPath = nodePath.join(os.tmpdir(), `${id}_low`);
        const medTempPath = nodePath.join(os.tmpdir(), `${id}_med`);
        const fullTempPath = nodePath.join(os.tmpdir(), `${id}_full`);
        await fs.writeFile(lowTempPath, lowResImage);
        await fs.writeFile(medTempPath, mediumResImage);
        await fs.rename(path, fullTempPath);

        // await putObject(lowTempPath, BUCKET_LOW_RES);
        // await putObject(medTempPath, BUCKET_MED_RES);
        // await putObject(path, BUCKET_FULL_RES);

        await putObject(lowTempPath, WAITING_ON_BUG_BUCKET);
        await putObject(medTempPath, WAITING_ON_BUG_BUCKET);
        await putObject(fullTempPath, WAITING_ON_BUG_BUCKET);

        await fs.unlink(lowTempPath);
        await fs.unlink(medTempPath);
        await fs.unlink(fullTempPath);
    }
    ctx.body = {success: true};
}

router.post('/', imagePostHandler);

async function imageGetHandler(ctx, next) {
    const {res, id} = ctx.request.query;
    const stream = getObject(`${id}_${res}`, WAITING_ON_BUG_BUCKET);
    stream.on('error', (e) => console.log(e));
    ctx.body = stream.stdout;
}

router.get('/', compose([
    validateQueryParamsAll(['res', 'id']),
    imageGetHandler,
]));

export default router;
