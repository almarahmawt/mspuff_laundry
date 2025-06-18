import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getLayananByDocumentId, getAllLayanans } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner"; // atau library toast lain jika sudah ada

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  layananId?: string | null;
  pelangganId: string;
}

interface LayananOption {
  documentId: string;
  nama: string;
  harga: number;
  satuan: string;
}

interface DetailTransaksiForm {
  layananId: string;
  layananNama: string;
  harga: number;
  satuan: string;
  jumlah: number | "";
  subtotal: number | "";
}

export function OrderDialog({
  open,
  onOpenChange,
  layananId,
  pelangganId,
}: OrderDialogProps) {
  const [allLayanans, setAllLayanans] = useState<LayananOption[]>([]);
  const [detailTransaksis, setDetailTransaksis] = useState<DetailTransaksiForm[]>(
    []
  );
  const [catatan, setCatatan] = useState("");

  // Tambahkan state tanggal_pesan
  const [tanggalPesan] = useState(() => new Date().toISOString().slice(0, 10));

  // Ambil semua layanan untuk select option
  useEffect(() => {
    const fetchAllLayanans = async () => {
      const data = await getAllLayanans();
      setAllLayanans(
        data.data.map((item: any) => ({
          documentId: item.documentId,
          nama: item.nama,
          harga: item.harga,
          satuan: item.satuan,
        }))
      );
    };
    if (open) fetchAllLayanans();
  }, [open]);

  // Ambil layanan default dari tombol "Pesan Sekarang"
  useEffect(() => {
    const fetchLayanan = async () => {
      if (layananId) {
        const data = await getLayananByDocumentId(layananId);
        const l = data.data[0];
        setDetailTransaksis([
          {
            layananId: l?.documentId || "",
            layananNama: l?.nama || "",
            harga: l?.harga || 0,
            satuan: l?.satuan || "",
            jumlah: "",
            subtotal: "",
          },
        ]);
      }
    };
    if (open && layananId) fetchLayanan();
  }, [layananId, open]);

  // Handler tambah detail transaksi
  const handleAddDetail = () => {
    setDetailTransaksis((prev) => [
      ...prev,
      {
        layananId: allLayanans[0]?.documentId || "",
        layananNama: allLayanans[0]?.nama || "",
        harga: allLayanans[0]?.harga || 0,
        satuan: allLayanans[0]?.satuan || "",
        jumlah: "",
        subtotal: "",
      },
    ]);
  };

  // Handler hapus detail transaksi
  const handleRemoveDetail = (idx: number) => {
    setDetailTransaksis((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handler perubahan field detail transaksi
  const handleDetailChange = (
    idx: number,
    field: keyof DetailTransaksiForm,
    value: any
  ) => {
    setDetailTransaksis((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        // Jika field layananId berubah, update nama, harga, satuan juga
        if (field === "layananId") {
          const selected = allLayanans.find((l) => l.documentId === value);
          return {
            ...item,
            layananId: value,
            layananNama: selected?.nama || "",
            harga: selected?.harga || 0,
            satuan: selected?.satuan || "",
            jumlah: "",
            subtotal: "",
          };
        }
        // Jika jumlah berubah, update subtotal
        if (field === "jumlah") {
          const jumlah = Number(value);
          return {
            ...item,
            jumlah: value,
            subtotal: jumlah && item.harga ? jumlah * item.harga : "",
          };
        }
        return { ...item, [field]: value };
      })
    );
  };

  // Hitung total dari semua subtotal
  const totalHarga = detailTransaksis.reduce(
    (acc, curr) => acc + (Number(curr.subtotal) || 0),
    0
  );

  // Handler submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. POST detail-transaksis satu per satu
      const detailIds: string[] = [];
      for (const detail of detailTransaksis) {
        const res = await fetch(
          `${import.meta.env.VITE_URL_API}/api/detail-transaksis`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: {
                layanan: { connect: detail.layananId },
                jumlah: detail.jumlah,
                subtotal: detail.subtotal,
              },
            }),
          }
        );
        const data = await res.json();
        // Pastikan ambil documentId dari response
        detailIds.push(data.data.documentId);
      }

      // 2. POST transaksis
      await fetch(
        `${import.meta.env.VITE_URL_API}/api/transaksis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: {
              tanggal_pesan: tanggalPesan,
              total_harga: totalHarga,
              catatan,
              pelanggan: { connect: pelangganId },
              detail_transaksis: { connect: detailIds },
            },
          }),
        }
      );

      toast.success("Pesanan berhasil dibuat!");
      onOpenChange(false);
    } catch (err) {
      toast.error("Gagal membuat pesanan!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ paddingBottom: 0 }}
      >
        <DialogHeader>
          <DialogTitle className="text-pink-400">Form Pesanan</DialogTitle>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Pelanggan ID (hidden) */}
          <input type="hidden" name="pelangganId" value={pelangganId} />
          {/* Detail Transaksi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-pink-400">
                Detail Pesanan
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDetail}
                className="gap-1 border-pink-400 text-pink-400 hover:bg-pink-50"
                disabled={allLayanans.length === 0}
              >
                <Plus size={16} /> Tambah Layanan
              </Button>
            </div>
            <div className="space-y-4">
              {detailTransaksis.map((detail, idx) => (
                <div
                  key={idx}
                  className="border rounded p-3 bg-gray-50 relative"
                >
                  {detailTransaksis.length > 1 && (
                    <button
                      type="button"
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveDetail(idx)}
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="mb-2">
                    <label className="block text-xs font-medium mb-1">Layanan</label>
                    <Select
                      value={detail.layananId}
                      onValueChange={(val) =>
                        handleDetailChange(idx, "layananId", val)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih layanan" />
                      </SelectTrigger>
                      <SelectContent>
                        {allLayanans.map((l) => (
                          <SelectItem key={l.documentId} value={l.documentId}>
                            {l.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">Harga</label>
                      <input
                        type="text"
                        value={detail.harga ? `Rp${detail.harga.toLocaleString()}` : ""}
                        disabled
                        className="w-full border rounded px-3 py-2 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Jumlah</label>
                      <input
                        type="number"
                        min={1}
                        value={detail.jumlah}
                        onChange={(e) =>
                          handleDetailChange(idx, "jumlah", e.target.value)
                        }
                        className="w-full border rounded px-3 py-2"
                        placeholder="Jumlah"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">Subtotal</label>
                      <input
                        type="text"
                        value={
                          detail.subtotal
                            ? `Rp${Number(detail.subtotal).toLocaleString()}`
                            : ""
                        }
                        disabled
                        className="w-full border rounded px-3 py-2 bg-gray-100"
                        placeholder="Subtotal"
                      />
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Satuan: {detail.satuan}
                  </div>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="flex justify-end mt-4">
              <div className="w-full md:w-1/2">
                <label className="block text-sm font-semibold mb-1 text-pink-400">
                  Total
                </label>
                <input
                  type="text"
                  value={`Rp${totalHarga.toLocaleString()}`}
                  disabled
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-lg font-bold border-pink-400 text-pink-400"
                />
              </div>
            </div>
          </div>
          <div>
            <input
             type="date"
              name="catatan"
              className="w-full border rounded px-3 py-2"
              value={new Date().toISOString().slice(0, 10)}
              hidden
            />
          </div>
          {/* Catatan */}
          <div>
            <label className="block text-sm font-medium mb-1">Catatan</label>
            <textarea
              name="catatan"
              className="w-full border rounded px-3 py-2"
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Catatan tambahan"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="my-2 border-pink-400 text-pink-400 hover:bg-pink-50"
            >
              Tutup
            </Button>
            <Button
              type="submit"
              className="my-2 bg-pink-400 hover:bg-pink-500 text-white"
              // disabled={isLoading} // tambahkan state loading jika perlu
            >
              Pesan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
