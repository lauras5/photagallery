import Router from "@koa/router";
import {getImageMetadata, listImageMetadata} from "../../utils/sql-utils.mjs";
const router = new Router();

async function getImageMetadataHandler(ctx, next) {
    const {id} = ctx.request.query;
    ctx.body = await getImageMetadata(id);
}

async function listImageMetadataHandler(ctx, next) {
    const {limit, page} = ctx.request.query;
    ctx.body = await listImageMetadata(page, limit);
}

async function imageMetadataGetHandler(ctx, next) {
    const {id} = ctx.request.query;
    if(id) {
        await getImageMetadataHandler(ctx, next);
    } else {
        await listImageMetadataHandler(ctx, next);
    }
}

router.get('/', imageMetadataGetHandler);

export default router;
