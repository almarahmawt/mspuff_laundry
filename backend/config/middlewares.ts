export default ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
          ],
          "frame-src": [
            "'self'",
            env("CLIENT_URL") || "http://localhost:3000"
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];