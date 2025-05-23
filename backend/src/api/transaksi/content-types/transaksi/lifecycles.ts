export default {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    const recordId = where.id;
    let totalHarga = 0;

    // Ambil data transaksi beserta detailnya
    const transaksi = await strapi.query('api::transaksi.transaksi').findOne({
      where: { id: recordId },
      populate: ['detail_transaksis'],
    });

    // Pastikan detail_transaksis ada dan merupakan array
    if (transaksi && Array.isArray(transaksi.detail_transaksis)) {
      transaksi.detail_transaksis.forEach((item) => {
        totalHarga += item.subtotal;
      });
    }

    // Update field total_harga pada event.params.data, bukan ke database langsung
    event.params.data.total_harga = totalHarga;
  },

};
