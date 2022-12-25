/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  dynamicStartUrl: false,
  runtimeCaching: [
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin
        if (!isSameOrigin) return false
        return true
      },
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'same-origin',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        }
      }
    },
    {
      urlPattern: ({ url }) => {
        const isSameOrigin = self.origin === url.origin
        return !isSameOrigin
      },
      handler: 'NetworkFirst',
      options: {
        cacheName: 'cross-origin',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 365 days
        },
        networkTimeoutSeconds: 10
      }
    }
  ],
});

module.exports = withPWA({
  // config
});
