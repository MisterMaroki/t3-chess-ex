declare namespace NodeJS {
	export interface ProcessEnv {
		readonly UPSTASH_REDIS_REST_TOKEN: string;
		readonly UPSTASH_REDIS_REST_URL: string;
		readonly NEXT_PUBLIC_PUSHER_APP_KEY: string;
		readonly PUSHER_APP_ID: string;
		readonly PUSHER_APP_SECRET: string;
		readonly GOOGLE_CLIENT_ID: string;
		readonly GOOGLE_CLIENT_SECRET: string;
	}
}
