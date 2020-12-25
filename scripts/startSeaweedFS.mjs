import {exec} from 'child_process';
import {WEED_DIR} from "../config.mjs";
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const weedBin = path.join(__dirname, '../bin', `${process.platform}_weed`);
console.log('Starting SeaweedFS Master Port: 9333. Volume Port: 8080.');
exec(`${weedBin} server -s3 -dir=${WEED_DIR}`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});
