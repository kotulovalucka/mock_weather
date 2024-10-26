export class RedisClient {
  private static instance: RedisClient | undefined;
  private constructor() {}

  public static getInstance(): RedisClient {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new RedisClient();
    return this.instance;
  }
}
