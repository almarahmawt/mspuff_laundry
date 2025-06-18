import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan import ini
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getTransaksiWithDetailTransaksi } from "@/lib/fetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Receipt, Loader2 } from "lucide-react";

const footer = {
  alamat: `Jl. Sadarmanah No.155, Cibeber 
              Kec. Cimahi Sel., Kota Cimahi 
              Jawa Barat 15032`,
};

const formatRupiah = (number: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);

export default function RiwayatTransaksi() {
  const [transaksis, setTransaksis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Tambahkan ini

  useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    if (!parsedUser) {
      // Redirect ke halaman login jika belum login
      navigate("/authentication", { replace: true });
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const res = await getTransaksiWithDetailTransaksi(parsedUser.documentId);
      console.log("Transaksi Data:", res);
      setTransaksis(res.data || []);
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-pink-400">
          Riwayat Transaksi
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-pink-400" size={32} />
          </div>
        ) : transaksis.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <Receipt className="mx-auto mb-2 text-pink-400" size={40} />
            Belum ada transaksi.
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {transaksis.map((trx: any, idx: number) => (
              <AccordionItem
                key={idx}
                value={`item-${trx.id}`}
                className="bg-white rounded-lg shadow border border-pink-100"
              >
                <AccordionTrigger className="flex flex-col md:flex-row md:items-center gap-2 px-4 py-3 hover:no-underline">
                  <div className="flex-1">
                    <div className="font-semibold text-pink-400 text-lg">
                      {trx.pelanggan?.nama}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <CalendarDays size={16} className="text-pink-400" />
                      {trx.tanggal_pesan}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-1">
                    <Badge
                      className={`bg-pink-400 text-white px-3 py-1 rounded-full text-xs`}
                    >
                      {trx.status_pengerjaan}
                    </Badge>
                    <Badge
                      className={`${
                        trx.status_pembayaran === "Lunas"
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      } text-white px-3 py-1 rounded-full text-xs`}
                    >
                      {trx.status_pembayaran}
                    </Badge>
                    <div className="font-bold text-pink-400 text-lg">
                      {formatRupiah(trx.total_harga)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-pink-50 px-6 py-4 rounded-b-lg">
                  <div className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold text-pink-400">Catatan:</span>{" "}
                    {trx.catatan || "-"}
                  </div>
                  <div className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold text-pink-400">Tanggal Selesai:</span>{" "}
                    {trx.tanggal_selesai || "-"}
                  </div>
                  <div className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold text-pink-400">Detail Pesanan:</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border">
                      <thead>
                        <tr className="bg-pink-100 text-pink-600">
                          <th className="py-2 px-3 border">Layanan</th>
                          <th className="py-2 px-3 border">Jumlah</th>
                          <th className="py-2 px-3 border">Satuan</th>
                          <th className="py-2 px-3 border">Harga</th>
                          <th className="py-2 px-3 border">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trx.detail_transaksis?.map((dt: any) => (
                          <tr key={dt.id} className="bg-white">
                            <td className="py-2 px-3 border">
                              {dt.layanan?.nama}
                            </td>
                            <td className="py-2 px-3 border text-center">
                              {dt.jumlah}
                            </td>
                            <td className="py-2 px-3 border text-center">
                              {dt.layanan?.satuan}
                            </td>
                            <td className="py-2 px-3 border text-right">
                              {formatRupiah(dt.layanan?.harga)}
                            </td>
                            <td className="py-2 px-3 border text-right font-semibold text-pink-400">
                              {formatRupiah(dt.subtotal)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
      <Footer data={footer} />
    </div>
  );
}