import Router from '@koa/router';
import routes from './tag_routes.mjs';

const router = new Router();

router.use('/tag', routes.routes(), routes.allowedMethods());

export default router;
