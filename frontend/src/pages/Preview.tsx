import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getLayananWithOmset } from "../lib/fetch";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { cn } from "../lib/utils";

interface OmsetData {
  id: number;
  documentId: string;
  total_harga: number;
  tanggal_pesan: string;
  tanggal_selesai: string;
  status_pembayaran: string;
  status_pengerjaan: string;
  catatan?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface OmsetLayanan {
  documentId: string;
  nama_kategori: string;
  layanans: {
    nama: string;
    harga: number;
    detail_transaksis: {
      documentId: string;
      createdAt: string;
      jumlah: number;
      subtotal: number;
    }[];
  }[];
}

interface OmsetResponse {
  data: OmsetData[];
  meta: Record<string, unknown>;
}

interface OmsetLayananProps {
  data: OmsetLayanan[];
}

export default function PreviewOwner() {
  const [omsetData, setOmsetData] = useState<OmsetData[] | null>(null);
  const [omsetLayanan, setOmsetLayanan] = useState<OmsetLayanan[] | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  const secret: string | null = searchParams.get("secret");

  useEffect(() => {
    const fetchOmsetData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        if (!secret || secret !== import.meta.env.VITE_PREVIEW_SECRET) {
          throw new Error("Invalid preview access");
        }

        const responseOmset = await fetch(
          `${import.meta.env.VITE_URL_API}/api/transaksis`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!responseOmset.ok) {
          throw new Error(`HTTP error! status: ${responseOmset.status}`);
        }

        const result: OmsetResponse = await responseOmset.json();
        const responseLayanan: OmsetLayananProps = await getLayananWithOmset();
        setOmsetData(result.data);
        setOmsetLayanan(responseLayanan.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("Error fetching omset data:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOmsetData();
  }, [secret]);

  const isWithinRange = (tanggal: string): boolean => {
    if (!startDate || !endDate) return true;
    const date = new Date(tanggal);
    return date >= new Date(startDate) && date <= new Date(endDate);
  };

  const filteredOmset = omsetData?.filter((item) =>
    isWithinRange(item.tanggal_pesan)
  );

  const filteredLayanan = omsetLayanan
    ?.filter((kategori) =>
      selectedKategori ? kategori.nama_kategori === selectedKategori : true
    )
    .map((kategori) => ({
      ...kategori,
      layanans: kategori.layanans.map((layanan) => ({
        ...layanan,
        detail_transaksis: layanan.detail_transaksis.filter((dt) => {
          // Cari transaksi yang ada di filteredOmset berdasarkan documentId
          return filteredOmset?.some(
            (omset) => omset.documentId === dt.documentId
          );
        }),
      })),
    }));

  const totalOmset = filteredOmset?.reduce(
    (total, item) => total + item.total_harga,
    0
  );

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Preview Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded mb-8 shadow-sm">
        <p className="text-lg font-semibold flex items-center gap-2">
          🔍 <span>Laporan Omset</span>
        </p>
      </div>

      <div className="mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filters</Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className={cn(
              "w-60 p-3 mt-2 border border-pink-400 rounded-md bg-white shadow-lg",
              "animate-in fade-in zoom-in-95 duration-200 ease-out"
            )}
            align="start"
          >
            <DropdownMenuGroup>
              {/* === Filter Periode Waktu === */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="p-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                  📅 Periode Waktu
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className={cn(
                      "w-56 ml-2 mt-1 p-3 rounded-md bg-white border border-pink-400 shadow-md",
                      "animate-in fade-in zoom-in-90 duration-200 ease-out"
                    )}
                  >
                    <div className="pb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Dari Tanggal
                      </label>
                      <input
                        type="date"
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="pb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Sampai Tanggal
                      </label>
                      <input
                        type="date"
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-400"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>

              {/* === Filter Kategori Layanan === */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="p-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md">
                  📁 Kategori Layanan
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className={cn(
                      "w-56 ml-2 mt-1 p-3 rounded-md bg-white border border-pink-400 shadow-md",
                      "animate-in fade-in zoom-in-90 duration-200 ease-out"
                    )}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pilih Kategori
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-1 focus:ring-pink-400"
                        value={selectedKategori}
                        onChange={(e) => setSelectedKategori(e.target.value)}
                      >
                        <option value="">Semua Kategori</option>
                        {omsetLayanan?.map((kategori, index) => (
                          <option key={index} value={kategori.nama_kategori}>
                            {kategori.nama_kategori}
                          </option>
                        ))}
                      </select>
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dari Tanggal
          </label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sampai Tanggal
          </label>
          <input
            type="date"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Kategori Layanan
          </label>
          <select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {omsetLayanan?.map((kategori, index) => (
              <option key={index} value={kategori.nama_kategori}>
                {kategori.nama_kategori}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Data Omset</h1>
          <p className="text-gray-500 mb-1">Total Omset</p>
          <p className="text-4xl font-extrabold text-green-600 mb-8">
            {totalOmset ? formatCurrency(totalOmset) : "Rp 0"}
          </p>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Omset per Layanan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredLayanan?.map((kategori, idx) => (
                <div
                  key={idx}
                  className="bg-pink-50 border border-pink-300 rounded-xl p-5 shadow-sm"
                >
                  <h3 className="text-xl font-semibold text-pink-700 mb-3">
                    {kategori.nama_kategori}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {kategori.layanans.map((layanan, index) => {
                      const filteredOmsets = layanan.detail_transaksis.filter(
                        (item) => isWithinRange(item.createdAt)
                      );

                      console.log(filteredOmsets);

                      const totalSubtotal = filteredOmset
                        ? filteredOmsets.reduce(
                            (sum, dt) => sum + dt.subtotal,
                            0
                          )
                        : layanan.detail_transaksis.reduce(
                            (sum, dt) => sum + dt.subtotal,
                            0
                          );
                      return (
                        <div
                          key={index}
                          className="bg-white border rounded-lg p-4 shadow-sm"
                        >
                          <p className="font-medium text-gray-800">
                            {layanan.nama}
                          </p>
                          <p className="text-green-600 font-semibold">
                            {formatCurrency(totalSubtotal)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Disewa: {layanan.detail_transaksis.length} kali
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
