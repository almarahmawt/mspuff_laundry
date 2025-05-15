import { Banknote, Truck, Clock3 } from "lucide-react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Data statis untuk website
const laundryData = {
  name: "Ms. Puff Laundry",
  tagline:
    "Hemat waktu dan pikiran Anda dengan berlangganan paket laundry bulanan kami. Kami menyediakan layanan pembersihan pakaian harian Anda dengan harga tetap setiap bulan. Dengan harga mulai 200 Ribu Per Bulan.",
  contact: {
    phone: "+62 859-7153-5431",
    address: `Jl. Sadarmanah No.155, Cibeber 
              Kec. Cimahi Sel., Kota Cimahi 
              Jawa Barat 15032`,
    operationalHours: "09:00 - 21:00",
  },
  services: [
    {
      id: 1,
      name: "Cuci Karpet",
      description: "15K - 25K /Pcs",
      image: "/karpet.jpg",
    },
    {
      id: 2,
      name: "Setrika Reguler",
      description: "5K /kg",
      image: "/setrika.jpg",
    },
    {
      id: 3,
      name: "Cuci Satuan",
      description: "7K - 10K /Pcs",
      image: "/wash_pillow.jpg",
    },
    {
      id: 4,
      name: "Cuci Sepatu",
      description: "15K - 25K /Pcs",
      image: "/clean-shoes.jpg",
    },
  ],
  packages: {
    title: "Paket Bulanan, Kiloan dan Satuan",
    description:
      "Sekarang paket bulanan mulai dari 200K/Bulan, gratis antar jemput di wilayah cimahi dan kuota sampai 20 Kg",
  },
  social: {
    instagram: "@ms.puff_laundry",
    followers: 1250,
  },
};

const footer = {
  alamat: `l. Sadarmanah No.155, Cibeber 
              Kec. Cimahi Sel., Kota Cimahi 
              Jawa Barat 15032`,
};

export default function MsPuffLaundryHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-pink-400 text-white relative">
        <div className="container mx-auto px-4 py-12 pb-24">
          <h1 className="text-3xl font-bold mb-4 text-center">
            {laundryData.name}
          </h1>
          <p className="text-center max-w-3xl mx-auto mb-8">
            {laundryData.tagline}
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
            <h2 className="text-2xl font-semibold mb-6 pb-3 text-gray-800">
              Layanan Kami
            </h2>
          </a>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {laundryData.services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded overflow-hidden shadow hover:border-l-4 hover:border-l-pink-400 transition-all duration-200"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-52 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-pink-600 transition duration-300 hover:translate-x-1">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
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
              {laundryData.packages.title}
            </h2>
            <p className="mb-5 max-w-[600px]">
              {laundryData.packages.description}
            </p>
            <a 
              href={`https://wa.me/6281221874683`} 
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
