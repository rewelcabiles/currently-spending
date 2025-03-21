import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/service-worker/app-worker.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  cacheOnNavigation: true,
  additionalPrecacheEntries: [{ url: "/offline", revision: null }],
});

export default withSerwist({
	experimental: {
		serverActions: {
			allowedOrigins: ['legendary-xylophone-4jr7w75xvgj25jj4-3000.app.github.dev', 'localhost', 'localhost:3000']
		},
	}
});