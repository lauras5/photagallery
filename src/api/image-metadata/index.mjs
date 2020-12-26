import Router from '@koa/router';
import routes from './image_metadata_routes.mjs';

const router = new Router();

router.use('/image-metadata', routes.routes(), routes.allowedMethods());

export default router;
