import type { Core } from "@strapi/strapi";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use(async (context, next) => {
      const result = await next();

      // Menghitung subtotal pada detail transaksi
      if (
        context.uid == "api::detail-transaksi.detail-transaksi" &&
        context.action == "create"
      ) {
        let documentId = null;
        let subTotal = 0;

        if (result && typeof result === "object" && "documentId" in result) {
          documentId = result.documentId;
        } else {
          console.log(
            "Transaksi updated, tapi result tidak punya documentId:",
            result
          );
        }

        const dataDetailTransaksi = await strapi
          .documents("api::detail-transaksi.detail-transaksi")
          .findOne({
            documentId: documentId,
            populate: ["layanan", "transaksi"],
          });

        const dataLayanan = await strapi
          .documents("api::layanan.layanan")
          .findOne({
            documentId: dataDetailTransaksi.layanan.documentId,
          });

        if (
          dataDetailTransaksi.layanan &&
          dataDetailTransaksi.subtotal !== subTotal
        ) {
          const hargaLayanan = Number(dataLayanan.harga ?? 0);
          const jumlah = Number(dataDetailTransaksi.jumlah ?? 0);
          subTotal = hargaLayanan * jumlah;

          await strapi
            .documents("api::detail-transaksi.detail-transaksi")
            .update({
              documentId: documentId,
              data: { subtotal: subTotal },
            });
        }

        if (dataDetailTransaksi.transaksi) {
          await strapi.documents("api::transaksi.transaksi").update({
            documentId: dataDetailTransaksi.transaksi.documentId,
          });
        }
      }

      if (
        context.uid == "api::transaksi.transaksi" &&
        context.action == "update"
      ) {
        let documentId = null;
        let totalHarga = 0;

        if (result && typeof result === "object" && "documentId" in result) {
          documentId = result.documentId;
        } else {
          console.log(
            "Transaksi updated, tapi result tidak punya documentId:",
            result
          );
        }

        const dataTransaksi = await strapi
          .documents("api::transaksi.transaksi")
          .findOne({
            documentId: documentId,
          });

        const dataDetailTransaksi = await strapi
          .documents("api::detail-transaksi.detail-transaksi")
          .findMany({
            filters: {
              transaksi: {
                documentId: documentId,
              },
            },
          });

        if (dataDetailTransaksi && Array.isArray(dataDetailTransaksi)) {
          dataDetailTransaksi.forEach((item) => {
            totalHarga += item.subtotal;
          });
        }

        if (totalHarga !== 0 && dataTransaksi.total_harga !== totalHarga) {
          await strapi.documents("api::transaksi.transaksi").update({
            documentId: documentId,
            data: { total_harga: totalHarga },
          });
        }
      }

      return result;
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
