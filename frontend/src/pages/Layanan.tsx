import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const DetailLayanan = [
  {
    kategori: "Cuci Satuan",
    layanan: [
      {
        nama_layanan: "Cuci Sepatu",
        harga: "RP. 15.000 - 20.000",
        satuan: "Pcs",
        estimasi: null,
        description: `Bersihkan dan segarkan kembali sepatu favorit Anda dengan layanan 
          Cuci Sepatu Profesional dari kami. Kami menggunakan teknik khusus dan
          bahan berkualitas tinggi untuk memastikan setiap noda dan kotoran terangkat 
          sempurna tanpa merusak material sepatu.`,
      },
      {
        nama_layanan: "Cuci Helm",
        harga: "RP. 10.000",
        satuan: "Pcs",
        estimasi: "1 Hari",
        description: `Bersihkan helm Anda secara menyeluruh dengan teknik khusus 
          yang aman dan efektif, memastikan setiap bagian bersih dan nyaman dipakai.`,
      },
    ],
  },
  {
    kategori: "Cuci + Setrika",
    layanan: [
      {
        nama_layanan: "Reguler",
        harga: "RP. 7.000",
        satuan: "kg",
        estimasi: "2 - 3 Hari",
        description: `Cuci dan setrika pakaian Anda dengan rapi, bersih, dan wangi.`,
      },
      {
        nama_layanan: "Express",
        harga: "RP. 10.000",
        satuan: "kg",
        estimasi: "1 Hari",
        description: `Layanan express untuk Anda yang membutuhkan pakaian bersih 
          dalam waktu cepat dan tetap berkualitas.`,
      },
    ],
  },
];

const footer = {
  alamat: `Jl. Sadarmanah No.155, Cibeber 
              Kec. Cimahi Sel., Kota Cimahi 
              Jawa Barat 15032`,
};

const Layanan = () => {
  // Inisialisasi state dengan index pertama dari setiap kategori
  const initialState = DetailLayanan.reduce((acc, _, index) => {
    acc[index] = 0; // Set index pertama sebagai default
    return acc;
  }, {} as Record<number, number>);

  const [activeLayanan, setActiveLayanan] =
    useState<Record<number, number>>(initialState);

  // Fungsi untuk mengubah index layanan aktif per kategori
  const handleSelectLayanan = (categoryIndex: number, layananIndex: number) => {
    setActiveLayanan((prev) => ({
      ...prev,
      [categoryIndex]: layananIndex,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <section className="py-10">
        <div className="container mx-auto px-4">
          {DetailLayanan.map((item, categoryIndex) => (
            <div key={categoryIndex} className="px-2 pb-10">
              <h1 className="text-2xl text-left mb-4">{item.kategori}</h1>

              {/* Tombol untuk memilih layanan */}
              <div className="flex w-full my-5 p-5 bg-pink-100 gap-2">
                {item.layanan.map((layanan, layananIndex) => (
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
                    {layanan.nama_layanan}
                  </button>
                ))}
              </div>

              {/* Detail Layanan yang dipilih */}
              {activeLayanan[categoryIndex] !== undefined && (
                <div className="py-4">
                  <h2 className="text-xl">
                    {item.layanan[activeLayanan[categoryIndex]].nama_layanan}
                  </h2>
                  <div className="flex gap-5 pt-4">
                    <p>
                      {item.layanan[activeLayanan[categoryIndex]].harga} /{" "}
                      {item.layanan[activeLayanan[categoryIndex]].satuan}
                    </p>
                    {item.layanan[activeLayanan[categoryIndex]].estimasi && (
                      <p>
                        Estimasi (
                        {item.layanan[activeLayanan[categoryIndex]].estimasi})
                      </p>
                    )}
                  </div>
                  <p className="py-4">
                    {item.layanan[activeLayanan[categoryIndex]].description}
                  </p>
                  <a
                    href={`https://wa.me/6281221874683`}
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
};

export default Layanan;
