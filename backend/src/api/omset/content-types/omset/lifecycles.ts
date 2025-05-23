export default{
    async beforeCreate(event){
        const { data } = event.params;

        let totalOmset = 0;
        const transaksi = await strapi.documents('api::transaksi.transaksi').findMany();

        if(transaksi){
            transaksi.forEach((item) => {
                totalOmset += item.total_harga;
            });
        }

        data.total_omset = totalOmset;
    },

    async beforeUpdate(event){
        const { data } = event.params;

        let totalOmset = 0;
        const transaksi = await strapi.documents('api::transaksi.transaksi').findMany();

        if(transaksi){
            transaksi.forEach((item) => {
                totalOmset += item.total_harga;
            });
        }

        data.total_omset = totalOmset;
    },
}