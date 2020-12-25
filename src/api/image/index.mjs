import Router from '@koa/router';
import routes from './image_routes.mjs';

const router = new Router();

router.use(`/image`, routes.routes(), routes.allowedMethods());

export default router;
