import Router from '@koa/router';

const api = new Router();
import imageRoutes from './image/index.mjs';
import imageMetadataRoutes from './image-metadata/index.mjs';
import tagRoutes from './tag/index.mjs';
import imageTagRoutes from './image-tag/index.mjs';

const routes = [
    imageRoutes,
    imageMetadataRoutes,
    tagRoutes,
    imageTagRoutes
];

for(const route of routes) {
    api.use('/api', route.routes(), route.allowedMethods());
}

export default api;
