import mysql from 'mysql2/promise';
import {makeId} from "./utils.mjs";

export const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'photagallery',
    password: process.env.MYSQL_PW
});

// Image Sql Utilities

export async function imageIdExists(id) {
    const sql = `SELECT id FROM image_metadata WHERE id = ? LIMIT 1;`;
    return (await connection.query(sql, [id]))[0].length === 1;
}

export async function addImageMetadata({name, file_size, extension_type, width, height}) {
    const sql = `INSERT INTO image_metadata (id, name, file_size, extension_type, width, height) VALUES (?, ?, ?, ?, ?, ?);`;
    let id = makeId();
    while(await imageIdExists(id)) id = makeId();
    await connection.query(sql, [id, name, file_size, extension_type, width, height]);
    return id;
}

export async function getImageMetadata(id) {
    const sql = `SELECT * FROM image_metadata WHERE id = ? LIMIT 1`;
    return (await connection.query(sql, [id]))[0][0];
}

export async function listImagesMetadata(page = 0, limit = 20) {
    const sql = `SELECT * FROM image_metadata LIMIT ? OFFSET ?`;
    const offset = limit * page;
    return (await connection.query(sql, [limit, offset]))[0];
}

export async function deleteImageMetadata(id) {
    const sql = `DELETE FROM image_metadata where id = ?;`;
    await connection.query(sql, [id]);
}

// Tag Sql Utilities

export async function tagIdExists(id) {
    const sql = `SELECT id FROM tag WHERE id = ? LIMIT 1;`;
    return (await connection.query(sql, [id]))[0].length === 1;
}

export async function addTag(tag) {
    const sql = `INSERT INTO tag (id, tag) VALUES (?, ?);`;
    let id = makeId();
    while(await imageIdExists(id)) id = makeId();
    await connection.query(sql, [id, tag]);
    return id;
}

export async function getTag(id) {
    const sql = `SELECT * FROM tag WHERE id = ? LIMIT 1`;
    return (await connection.query(sql, [id]))[0][0];
}

export async function listTags(page = 0, limit = 20) {
    const sql = `SELECT * FROM tag LIMIT ? OFFSET ?`;
    const offset = limit * page;
    return (await connection.query(sql, [limit, offset]))[0];
}

export async function deleteTag(id) {
    const sql = `DELETE FROM tag WHERE id=?`;
    await connection.query(sql, [id]);
}

// ImageTag Sql Utilities

export async function addImageTag({image_id, tag_id}) {
    const sql = `INSERT INTO image_tag (image_id, tag_id) VALUES (?, ?);`
    await connection.query(sql, [image_id, tag_id]);
}

export async function deleteImageTag({image_id, tag_id}) {
    const sql = `DELETE FROM image_tag WHERE image_id = ? AND tag_id = ?;`
    await connection.query(sql, [image_id, tag_id]);
}

export async function listImageTags(image_id) {
    const sql = `SELECT * FROM image_tag WHERE image_id = ?;`;
    return (await connection.query(sql, [image_id]))[0];
}

export async function listTagImages(tag_id, page = 0, limit = 20) {
    const sql = `SELECT * FROM image_tag WHERE tag_id = ? LIMIT ? OFFSET ?`;
    const offset = limit * page;
    return (await connection.query(sql, [tag_id, limit, offset]))[0];
}
