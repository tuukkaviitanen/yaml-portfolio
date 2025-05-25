import { RedisClient } from "bun";

class Cache {
    client: RedisClient

    constructor() {
        this.client = new RedisClient();
    }

    async store(key: string, value: any) {
        try {
            const encodedValue = JSON.stringify(value)
            await this.client.set(key, encodedValue);
            await this.client.expire(key, 3600);
        } catch (error) {
            console.error("Failed storing to Redis", { error })
        }

    }

    async fetch(key: string) {
        try {
            const encodedValue = await this.client.get(key);
            return encodedValue && JSON.parse(encodedValue);
        } catch (error) {
            console.error("Failed fetching from Redis", { error })
            return null;
        }

    }

    async initialize() {
        this.client.connect();
    }
}

const cache = new Cache();

export default cache;