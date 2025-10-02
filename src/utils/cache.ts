import { RedisClient } from "bun";

class Cache {
  client: RedisClient;

  constructor() {
    this.client = new RedisClient();
  }

  async store(key: string, value: any) {
    try {
      const encodedValue = JSON.stringify(value);
      await this.client.set(key, encodedValue);
      await this.client.expire(key, 300); // 5 minutes
    } catch (error) {
      console.error(`Failed storing ${key} to Redis`, { error });
    }
  }

  async fetch(key: string) {
    try {
      const encodedValue = await this.client.get(key);
      return encodedValue && JSON.parse(encodedValue);
    } catch (error) {
      console.error(`Failed fetching ${key} from Redis`, { error });
      return null;
    }
  }

  async checkConnection() {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  async initialize() {
    await this.client.connect();
  }
}

const cache = new Cache();

export default cache;
