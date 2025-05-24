import { RedisClient } from "bun";

class Cache {
    client: RedisClient

    constructor() {
        this.client = new RedisClient();
    }

    async store(key: string, value: any) {
        const encodedValue = JSON.stringify(value)
        await this.client.set(key, encodedValue);
        await this.client.expire(key, 3600);
    }

    async fetch(key: string) {
        const encodedValue = await this.client.get(key);
        return encodedValue && JSON.parse(encodedValue);
    }

    async initialize() {
        this.client.connect();
    }
}

const cache = new Cache();

export default cache;