declare namespace NodeJS {
	export interface ProcessEnv {
		readonly UPSTASH_REDIS_REST_TOKEN: string;
		readonly UPSTASH_REDIS_REST_URL: string;
	}
}
