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
      // Menghitung total_harga sebelum update pada transaksi
      if (
        context.uid == "api::transaksi.transaksi" &&
        context.action == "update"
      ) {
        const recordId = context.params.documentId;
        let totalHarga = 0;

        // Ambil data transaksi beserta detailnya
        const transaksi = await strapi
          .documents("api::transaksi.transaksi")
          .findOne({
            documentId: recordId,
            populate: ["detail_transaksis"],
          });

        // Pastikan detail_transaksis ada dan merupakan array
        if (transaksi && Array.isArray(transaksi.detail_transaksis)) {
          transaksi.detail_transaksis.forEach((item) => {
            totalHarga += item.subtotal;
          });
        }

        context.params.data.total_harga = totalHarga;
      }

      // Menghitung subtotal pada detail transaksi
      if (
        context.uid == "api::detail-transaksi.detail-transaksi" &&
        context.action == "update"
      ) {
        const recordId = context.params.documentId;

        const layanans = await strapi
          .documents("api::detail-transaksi.detail-transaksi")
          .findOne({
            documentId: recordId,
            populate: ["layanan"],
          });

        if (context.params.data.layanan && context.params.data.jumlah) {
          const hargaLayanan = Number(layanans.layanan?.harga ?? 0);
          const jumlah = Number(context.params.data.jumlah ?? 0);
          context.params.data.subtotal = hargaLayanan * jumlah;
        }
      }

      return next();
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
