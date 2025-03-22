import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { BackgroundSyncPlugin, NetworkOnly, BackgroundSyncQueue } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: '/offline', // the page that'll display if user goes offline
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

const queue = new BackgroundSyncQueue("myQueueName1");
const backgroundSync = new BackgroundSyncPlugin("myQueueName2", {
  maxRetentionTime: 24 * 60, // Retry for a maximum of 24 Hours (specified in minutes)
});

self.addEventListener("fetch", (event) => {
  // Add in your own criteria here to return early if this
  // isn't a request that should use background sync.
  if (event.request.method !== "POST") {
    return;
  }

  const backgroundSync = async () => {
    try {
      const response = await fetch(event.request.clone());
      return response;
    } catch (error) {
      await queue.pushRequest({ request: event.request });
      return Response.error();
    }
  };

  event.respondWith(backgroundSync());
});


serwist.registerCapture(
  /\/api\/.*\/*.json/,
  new NetworkOnly({
    plugins: [backgroundSync],
  }),
  "POST",
);


serwist.addEventListeners();