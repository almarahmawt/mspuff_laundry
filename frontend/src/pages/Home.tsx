import { Banknote, Truck, Clock3, MoveRight } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getLayananHome, getPromosi } from "../lib/fetch";

interface Layanan {
  documentId: string;
  nama: string;
  deskripsi: string;
  satuan: string;
  estimasi_waktu: string;
  harga: number;
  image: {
    name: string;
    url: string;
  };
  kategori_layanan: {
    nama_kategori: string;
  };
}

interface Promosi {
  title: string;
  description: string;
}

interface LayananType {
  data: Layanan[];
}

interface PromosiType {
  data: Promosi;
}

const footer = {
  alamat: `l. Sadarmanah No.155, Cibeber 
              Kec. Cimahi Sel., Kota Cimahi 
              Jawa Barat 15032`,
};

const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Ubah dari async function ke regular function component
export default function MsPuffLaundryHome() {
  // Gunakan state untuk menyimpan data
  const [layanans, setLayanans] = useState<LayananType>({ data: [] });
  const [promosi, setPromosi] = useState<PromosiType>({
    data: { title: "", description: "" },
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [layanansData, promosiData] = await Promise.all([
          getLayananHome(),
          getPromosi(),
        ]);

        setLayanans(layanansData);
        setPromosi(promosiData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tampilkan loading state jika data masih diambil
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-pink-600 font-medium">Loading...</p>
      </div>
    );
  }

  const filteredLayanans: Layanan[] = layanans.data
    .filter(
      (item) =>
        item.kategori_layanan.nama_kategori === "Cuci Satuan" &&
        item.nama !== "Cuci Spesial"
    )
    .slice(0, 4);

  console.log(promosi);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-pink-400 text-white relative">
        <div className="container mx-auto px-4 py-12 pb-24">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Ms. Puff Laundry
          </h1>
          <p className="text-center max-w-3xl mx-auto mb-8">
            Hemat waktu dan pikiran Anda dengan berlangganan paket laundry
            bulanan kami. Kami menyediakan layanan pembersihan pakaian harian
            Anda dengan harga tetap setiap bulan. Dengan harga mulai 200 Ribu
            Per Bulan.
          </p>
        </div>
      </section>

      {/* Info Cards (DIKELUARKAN DARI SECTION) */}
      <div className="container mx-auto px-4 mb-8">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto max-[950px]:mx-10 max-md:my-10 max-md:mx-1
               md:absolute md:left-0 md:right-0 md:transform md:-translate-y-1/2"
        >
          <div className="bg-white border border-pink-400 rounded p-4 text-center text-gray-800 shadow hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Banknote size={30} className="text-pink-500" />
            </div>
            <h3 className="font-semibold transition-all duration-300 hover:text-pink-500">
              Paket Laundry Bulanan
            </h3>
            <p className="text-sm mt-1">
              Hemat Waktu, Tenaga, Biaya Listrik, Air dan Detergen
            </p>
          </div>

          <div className="bg-white border border-pink-400 rounded p-4 text-center text-gray-800 shadow hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Truck size={30} className="text-pink-500" />
            </div>
            <h3 className="font-semibold transition-all duration-300 hover:text-pink-500">
              Bebas Biaya Antar dan Jemput
            </h3>
            <p className="text-sm mt-1">Terima Beres sampai kerumah</p>
          </div>

          <div className="bg-white border border-pink-400 rounded p-4 text-center text-gray-800 shadow hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-center mb-2">
              <Clock3 size={30} className="text-pink-500" />
            </div>
            <h3 className="font-semibold transition-all duration-300 hover:text-pink-500">
              Layanan 7/10
            </h3>
            <p className="text-sm mt-1">
              Layanan aktif dari Jam 08.00 WIB hingga Jam 19.00 WIB Senin sampai
              Minggu
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="md:pt-28 pb-10">
        <div className="container mx-auto px-4">
          <a href="/layanan">
            <h2 className="group inline-flex items-center text-2xl font-semibold mb-6 pb-3 text-gray-800 transition-all duration-200 hover:text-pink-600">
              Layanan Kami
              <MoveRight size={24} className="ml-2 opacity-0 transform translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"/>
            </h2>
          </a>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredLayanans.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded overflow-hidden shadow hover:border-l-4 hover:border-l-pink-400 transition-all duration-200"
              >
                <img
                  src={`${import.meta.env.VITE_URL_API}${item.image.url}`}
                  alt={item.image.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-pink-600 transition duration-300 hover:translate-x-1">
                    {item.nama}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatRupiah(item.harga)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-pink-400 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-semibold mb-5">
              {promosi.data.title}
            </h2>
            <p className="mb-5 max-w-[600px]">{promosi.data.description}</p>
            <a
              href={`https://wa.me/${import.meta.env.VITE_NO_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="bg-white text-pink-600 px-6 py-2 rounded font-medium hover:bg-gray-100 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                Pesan Sekarang
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer data={footer} />
    </div>
  );
}
