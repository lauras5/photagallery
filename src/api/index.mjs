import Router from '@koa/router';

const api = new Router();
import imageRoutes from './image/index.mjs';

const routes = [
    imageRoutes
];

for(const route of routes) {
    api.use('/api', route.routes(), route.allowedMethods());
}

export default api;
