import mysql from 'mysql2/promise';
import {readFileSync} from 'fs';
import path, {join} from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function grabSql(file, option) {
    return readFileSync(join(__dirname, 'sql', file), option).toString('utf-8');
}

const createDatabase = grabSql('./createDatabase.sql', 'utf-8');
const useDatabase = grabSql('./useDatabase.sql', 'utf-8');

const createImageTable = grabSql('./createImageTable.sql', 'utf-8');
const createImageIndex = grabSql('./createIndexImage.sql', 'utf-8');

const createTagTable = grabSql('./createTagTable.sql', 'utf-8');
const createTagIndex = grabSql('./createIndexTag.sql', 'utf-8');

const createImageTagTable = grabSql('./createImageTagTable.sql', 'utf-8');
const createImageTagIndex = grabSql('./createIndexImageTag.sql', 'utf-8');

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: process.env.MYSQL_PW
        });

        await connection.query(createDatabase);
        await connection.query(useDatabase);

        await connection.query(createImageTable);
        await connection.query(createImageIndex);

        await connection.query(createTagTable);
        await connection.query(createTagIndex);

        await connection.query(createImageTagTable);
        await connection.query(createImageTagIndex);

        connection.destroy();
    } catch (error) {
        console.error(error)
    }
})();
