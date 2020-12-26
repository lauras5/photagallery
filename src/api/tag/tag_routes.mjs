import Router from "@koa/router";
import {addTag, deleteTag, getTag, listTags, tagIdExists} from "../../utils/sql-utils.mjs";
const router = new Router();
import compose from 'koa-compose';
import {validateQueryParamsAll} from "../../utils/koa-utilities.mjs";

async function getTagHandler(ctx, next) {
    const {id} = ctx.request.query;
    ctx.body = await getTag(id);
}

async function listTagsHandler(ctx, next) {
    const {limit, page} = ctx.request.query;
    ctx.body = await listTags(page, limit);
}

async function tagGetHandler(ctx, next) {
    const {id} = ctx.request.query;
    if(id) {
        await getTagHandler(ctx, next);
    } else {
        await listTagsHandler(ctx, next);
    }
}

router.get('/', tagGetHandler);

async function postTagHandler(ctx, next) {
    const {tag} = ctx.request.query;
    const id = await addTag(tag);
    ctx.body = {id};
}

router.post('/', compose([
    validateQueryParamsAll(['tag']),
    postTagHandler
]));

async function tagDeleteHandler(ctx, next) {
    const {id} = ctx.request.query;
    const exists = await tagIdExists(id);
    if (!exists) {
        ctx.status = 412;
        ctx.body = {error: 'No tag exists with id ' + id}
        return;
    }

    await deleteTag(id);
    ctx.body = {success: true};
}


router.delete('/', compose([
    validateQueryParamsAll(['id']),
    tagDeleteHandler,
]));

export default router;
