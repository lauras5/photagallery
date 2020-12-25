import Koa from 'koa';
import {appendFileSync} from 'fs';
import api from './api/index.mjs';
import {Errors} from "./errors.mjs";
import KoaBody from "koa-body";
import koaStatic from 'koa-static';
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Koa();

const errorSet = new Set();
for (const err in Errors) {
    errorSet.add(Errors[err]);
}


const koaBody = KoaBody({multipart: true, formLimit: 10 ** 16});
app.use(koaBody);

app.use(koaStatic(path.join(__dirname, './static')));

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        const {error: errorType} = error;
        if (errorSet.has(errorType)) {
            console.error(errorType);
            ctx.status = 400;
            ctx.body = {error: errorType}
        } else {
            console.log(error);
            ctx.status = 500;
            let errorText;
            errorText = `${new Date()}\n`;
            errorText += error + '\n';
            appendFileSync('unknown_errors.txt', errorText);
            ctx.body = {error: 'Unknown error occurred'};
        }

        let errorText;
        if (error.error) {
            errorText = `${new Date()}\n`;
            errorText += 'Error:\n';
            errorText += error.error + '\n';
            errorText += 'Stack Trace:\n';
            if (error.stacktrace) errorText += error.stacktrace.stack + '\n\n';
        } else {
            errorText = error.stack;
        }
        appendFileSync('error_logs.txt', errorText);
    }
});

app.use(api.routes()).use(api.allowedMethods());

app.listen(3000, () => console.log('running on port 3000'))
