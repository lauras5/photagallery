import Router from "@koa/router";
import {
    addImageTag,
    deleteImageTag,
    imageIdExists,
    listTagImages,
    tagIdExists
} from "../../utils/sql-utils.mjs";
const router = new Router();
import compose from 'koa-compose';
import {validateQueryParamsAll, validateQueryParamsAny} from "../../utils/koa-utilities.mjs";
import {listImageTags} from "../../utils/sql-utils.mjs";

async function listImageTagsHandler(ctx, next) {
    const {image_id} = ctx.request.query;
    ctx.body = await listImageTags(image_id);
}

async function listTagImagesHandler(ctx, next) {
    const {tag_id, limit, page} = ctx.request.query;
    ctx.body = await listTagImages(tag_id, page, limit);
}

async function imageTagGetHandler(ctx, next) {
    const {image_id, tag_id} = ctx.request.query;
    if(image_id) {
        await listImageTagsHandler(ctx, next);
    } else {
        await listTagImagesHandler(ctx, next);
    }
}

router.get('/', compose([
    validateQueryParamsAny(['image_id', 'tag_id']),
    imageTagGetHandler
]));

async function postImageTagHandler(ctx, next) {
    const {query: params} = ctx.request;
    await addImageTag(params);
    ctx.body = {sucess: true};
}

router.post('/', compose([
    validateQueryParamsAll(['image_id', 'tag_id']),
    postImageTagHandler
]));

async function imageTagDeleteHandler(ctx, next) {
    const {image_id, tag_id} = ctx.request.query;
    const tagExists = await tagIdExists(tag_id);
    if (!tagExists) {
        ctx.status = 412;
        ctx.body = {error: 'No tag exists with id ' + tag_id}
        return;
    }

    const imageExists = await imageIdExists(image_id);
    if (!imageExists) {
        ctx.status = 412;
        ctx.body = {error: 'No image exists with id ' + image_id}
        return;
    }

    await deleteImageTag({image_id, tag_id});
    ctx.body = {success: true};
}


router.delete('/', compose([
    validateQueryParamsAll(['image_id', 'tag_id']),
    imageTagDeleteHandler,
]));

export default router;
