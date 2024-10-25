export class ArticleMllClient {
    private static instance: ArticleMllClient | undefined;
    private constructor() {}

	public static getInstance(): ArticleMllClient {
		if (this.instance) {
			return this.instance;
		}

		this.instance = new ArticleMllClient();
        return this.instance;
	}
}