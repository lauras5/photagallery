import redis from 'redis';
const client = redis.createClient();
import { promisify } from "util";
const redisGetAsync = promisify(client.get).bind(client);
const redisSetAsync = promisify(client.set).bind(client);

export async function setMem(key, value, ttl = 60 * 5) {
    await redisSetAsync(key, value, 'EX', ttl);
}

export async function getMem(key) {
    return await redisGetAsync(key);
}
