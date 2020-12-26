import Router from '@koa/router';
import routes from './image_tag_routes.mjs';

const router = new Router();

router.use('/image-tag', routes.routes(), routes.allowedMethods());

export default router;
