export default {
    async beforeUpdate(event){
        const { data, where } = event.params;

        const recordId = where.id;

        const layanans = await strapi.query('api::detail-transaksi.detail-transaksi').findOne({
            where: {id : recordId},
            populate: ['layanan']
        });

        if(data.layanan && data.jumlah){
           const hargaLayanan = layanans.layanan.harga;
           data.subtotal = hargaLayanan * data.jumlah;
        } 
    }
}