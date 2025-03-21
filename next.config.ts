import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
		serverActions: {
			allowedOrigins: ['legendary-xylophone-4jr7w75xvgj25jj4-3000.app.github.dev']
		},
	}

};

export default nextConfig;
