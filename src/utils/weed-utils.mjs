import {exec, spawn} from 'child_process';

export async function putBucket(name) {
    return new Promise((res, rej) => {
        exec(`aws --endpoint-url http://localhost:8333 s3 mb s3://${name}`, (error, stdout, stderr) => {
            if (error) {
                rej(error);
            } else {
                res(true)
            }
        });
    });
}

function processBuckets(str) {
    const out = [];
    for (const line of str.split('\n')) {
        if (!line) continue;
        out.push(line.split(' ')[2])
    }
    return out;
}

function processFiles(str) {
    const out = [];
    for (const line of str.split('\n')) {
        if (!line) continue;
        const split = line.replace(/\s+/g, ' ').split(' ');
        out.push({file: split[3], fileSize: split[2]});
    }
    return out;
}

export async function listBuckets() {
    return new Promise((res, rej) => {
        exec('aws --endpoint-url http://localhost:8333 s3 ls', (error, stdout, stderr) => {
            if (error) {
                rej(error);
            } else {
                res(processBuckets(stdout))
            }
        });
    })
}

export async function listFiles(bucket) {
    return new Promise((res, rej) => {
        exec(`aws --endpoint-url http://localhost:8333 s3 ls s3://${bucket}`, (error, stdout, stderr) => {
            if (error) {
                rej(error);
            } else {
                res(processFiles(stdout))
            }
        });
    });
}

export async function putObject(file, bucket) {
    return new Promise((res, rej) => {
        exec(`aws --endpoint-url http://localhost:8333 s3 cp ${file} s3://${bucket}`, (error, stdout, stderr) => {
            if (error) {
                rej(error);
            } else {
                res(true)
            }
        });
    });
}

export function getObject(file, bucket) {
    return spawn('aws', ['--endpoint-url', "http://localhost:8333/", 's3', 'cp', `s3://${bucket}/${file}`, '-'],
        {
            env: {
                PATH: process.env.PATH
            },
        });
}

export async function removeObject(file, bucket) {
    return new Promise((res, rej) => {
        exec(`aws --endpoint-url http://localhost:8333 s3 rm s3://${bucket}/${file}`, (error, stdout, stderr) => {
            if (error) {
                rej(error);
            } else {
                res(true)
            }
        });
    });
}

export async function removeBucket(bucket) {
    return new Promise((res, rej) => {
        exec(`aws --endpoint-url http://localhost:8333 s3 rb s3://${bucket}`, (error, stdout, stderr) => {
            if (error) {
                rej(error);
            } else {
                res(true)
            }
        });
    });
}
