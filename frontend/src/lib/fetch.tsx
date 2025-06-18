import qs from "qs";

const apiUrl = import.meta.env.VITE_URL_API;

// Get data layanan for home page
export async function getLayananHome() {
  const query = qs.stringify({
    populate: {
      image: {
        fields: ["name", "url"],
      },
      kategori_layanan: {
        fields: ["nama_kategori"],
      },
    },
  });

  const res = await fetch(`${apiUrl}/api/layanans?${query}`);
  const data = await res.json();

  return data;
}

// Get Data Promosi for Home Page
export async function getPromosi() {
  const res = await fetch(`${apiUrl}/api/promo`);
  const data = await res.json();

  return data;
}

// Get all data layanan
export async function getKategoriLayananWithLayanan() {
  const query = qs.stringify({
    populate: {
      layanans: {
        fields: ["nama", "deskripsi", "satuan", "estimasi_waktu", "harga"],
      },
    },
  });

  const res = await fetch(`${apiUrl}/api/kategori-layanans?${query}`);
  const data = await res.json();

  return data;
}

// Get data Layanan for Owner
export async function getLayananWithOmset() {
  const query = qs.stringify({
    populate: {
      layanans: {
        fields: ["nama", "harga"],
        populate: {
          detail_transaksis: {
            fields: ["jumlah", "subtotal", "createdAt"],
          },
        },
      },
    },
  });

  const res = await fetch(`${apiUrl}/api/kategori-layanans?${query}`);
  const data = await res.json();

  return data;
}

// Get data Layanan for Owner
export async function getPelanggan(documentId: string) {
  const res = await fetch(
    `${apiUrl}/api/pelanggans?filters[documentId][$eq]=${documentId}`
  );
  const data = await res.json();

  return data;
}

// Get data Layanan by documentId
export async function getAllLayanans() {
  const res = await fetch(`${apiUrl}/api/layanans`);
  const data = await res.json();

  return data;
}

// Get data Layanan by documentId
export async function getLayananByDocumentId(documentId: string) {
  const res = await fetch(
    `${apiUrl}/api/layanans?filters[documentId][$eq]=${documentId}`
  );
  const data = await res.json();

  return data;
}

// Get data Layanan by documentId
export async function getTransaksiWithDetailTransaksi(documentId: string) {
  const query = qs.stringify({
    filters: {
      pelanggan: {
        documentId: {
          $eq: documentId,
        },
      },
    },
    populate: {
      pelanggan: {
        fields: ["nama", "email"],
      },
      detail_transaksis: {
        populate: {
          layanan: {
            fields: ["nama", "satuan", "harga"],
          },
        },
        fields: ["jumlah", "subtotal"],
      },
    },
  });

  const res = await fetch(`${apiUrl}/api/transaksis?${query}`);
  const data = await res.json();

  return data;
}
