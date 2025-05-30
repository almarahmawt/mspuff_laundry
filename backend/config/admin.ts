const getPreviewPathname = (uid, { document }) => {
  if (!document) {
    console.warn(`[Preview] Document for ${uid} is null or undefined!`);
    return null;
  }
  if (uid === "api::omset.omset") {
    return `/preview`;
  }
  return null;
};

export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  preview: {
    enabled: true,
    config: {
      allowedOrigins: [process.env.CLIENT_URL],
      async handler(uid, { documentId }) {
        try {
          const document = await strapi.documents(uid).findOne({ documentId });
          
          if (!document) {
            console.warn(`⚠️ [Preview] Document for ${uid} with id ${documentId} not found!`);
            return null;
          }
          
          const pathname = getPreviewPathname(uid, { document });
          
          if (!pathname) {
            console.warn(`⚠️ [Preview] No valid preview path for ${uid} with id: ${documentId}`);
            return null;
          }
          
          const previewUrl = `${process.env.CLIENT_URL}${pathname}?secret=${process.env.PREVIEW_SECRET}`;
          console.log(previewUrl);
          return previewUrl;
        } catch (error) {
          console.error(`🔴 [Preview] Error fetching document:`, error);
          return null;
        }
      },
    },
  },
});
