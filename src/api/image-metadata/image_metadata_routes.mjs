import Router from "@koa/router";
import {getImageMetadata, listImagesMetadata} from "../../utils/sql-utils.mjs";
const router = new Router();

async function getImageMetadataHandler(ctx, next) {
    const {id} = ctx.request.query;
    ctx.body = await getImageMetadata(id);
}

async function listImagesMetadataHandler(ctx, next) {
    const {limit, page} = ctx.request.query;
    ctx.body = await listImagesMetadata(page, limit);
}

async function imageMetadataGetHandler(ctx, next) {
    const {id} = ctx.request.query;
    if(id) {
        await getImageMetadataHandler(ctx, next);
    } else {
        await listImagesMetadataHandler(ctx, next);
    }
}

router.get('/', imageMetadataGetHandler);

export default router;
