import type { Schema, Struct } from '@strapi/strapi';

export interface TransaksiDetailTransaksi extends Struct.ComponentSchema {
  collectionName: 'components_transaksi_detail_transaksis';
  info: {
    description: '';
    displayName: 'Detail_Transaksi';
    icon: 'archive';
  };
  attributes: {
    jumlah: Schema.Attribute.Integer;
    layanan: Schema.Attribute.Relation<'oneToOne', 'api::layanan.layanan'>;
    subtotal: Schema.Attribute.Integer;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'transaksi.detail-transaksi': TransaksiDetailTransaksi;
    }
  }
}
