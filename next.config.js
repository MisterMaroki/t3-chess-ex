/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
		serverActions: true,
	},
	images: {
		domains: ['lh3.googleusercontent.com'],
	},
};
module.exports = config;
