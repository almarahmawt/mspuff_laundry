import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getKategoriLayananWithLayanan } from "../lib/fetch";

interface KategoriLayanan {
  nama_kategori: string;
  layanans: {
    nama: string;
    deskripsi: string;
    satuan: string;
    estimasi_waktu: string;
    harga: number;
  }[];
}

interface LayananProps {
  data: KategoriLayanan[];
}

const footer = {
  alamat: `Jl. Sadarmanah No.155, Cibeber 
              Kec. Cimahi Sel., Kota Cimahi 
              Jawa Barat 15032`,
};

// Fungsi untuk format rupiah
const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function Layanan() {
  const [layanan, setLayanan] = useState<LayananProps>({
    data: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Pindahkan semua useState ke atas, sebelum kondisi apapun
  const [activeLayanan, setActiveLayanan] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const layananData = await getKategoriLayananWithLayanan();
        setLayanan(layananData);

        // Inisialisasi activeLayanan setelah data berhasil dimuat
        const initialState = layananData.data.reduce(
          (acc: Record<number, number>, _: any, index: number) => {
            acc[index] = 0; // Set index pertama sebagai default
            return acc;
          },
          {}
        );

        setActiveLayanan(initialState);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk mengubah index layanan aktif per kategori
  const handleSelectLayanan = (categoryIndex: number, layananIndex: number) => {
    setActiveLayanan((prev) => ({
      ...prev,
      [categoryIndex]: layananIndex,
    }));
  };

  // Tampilkan loading state jika data masih diambil
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-pink-600 font-medium">Loading...</p>
      </div>
    );
  }

  console.log(layanan);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="py-10">
        <div className="container mx-auto px-4">
          {layanan.data.map((item, categoryIndex) => (
            <div key={categoryIndex} className="px-2 pb-10">
              {categoryIndex !== 0 ? (
                <div className="border-t-2 border-pink-300 mb-8"/>
              ) : null}
              <h1 className="text-2xl text-left mb-4">{item.nama_kategori}</h1>

              {/* Tombol untuk memilih layanan */}
              <div className="relative flex w-full my-5 p-5 bg-pink-100 gap-2 overflow-x-auto">
                {item.layanans.map((layanan, layananIndex) => (
                  <button
                    key={layananIndex}
                    onClick={() =>
                      handleSelectLayanan(categoryIndex, layananIndex)
                    }
                    className={`border border-pink-400 p-2 rounded ${
                      activeLayanan[categoryIndex] === layananIndex
                        ? "bg-pink-400 text-white"
                        : "bg-white text-pink-400"
                    }`}
                  >
                    {layanan.nama}
                  </button>
                ))}
              </div>

              {/* Detail Layanan yang dipilih */}
              {activeLayanan[categoryIndex] !== undefined &&
                item.layanans[activeLayanan[categoryIndex]] && (
                  <div className="py-4">
                    <h2 className="text-xl">
                      {item.layanans[activeLayanan[categoryIndex]].nama}
                    </h2>
                    <div className="flex gap-5 pt-4">
                      <p>
                        {formatRupiah(
                          item.layanans[activeLayanan[categoryIndex]].harga
                        )}{" "}
                        / {item.layanans[activeLayanan[categoryIndex]].satuan}
                      </p>
                      {item.layanans[activeLayanan[categoryIndex]]
                        .estimasi_waktu && (
                        <p>
                          Estimasi (
                          {
                            item.layanans[activeLayanan[categoryIndex]]
                              .estimasi_waktu
                          }
                          )
                        </p>
                      )}
                    </div>
                    <p className="py-4">
                      {item.layanans[activeLayanan[categoryIndex]].deskripsi}
                    </p>
                    <a
                      href={`https://wa.me/${import.meta.env.VITE_NO_WHATSAPP}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <button className="bg-pink-400 text-white px-4 py-2 text-xl rounded hover:bg-pink-600">
                        Pesan Sekarang
                      </button>
                    </a>
                  </div>
                )}
            </div>
          ))}
        </div>
      </section>
      <Footer data={footer} />
    </div>
  );
}
