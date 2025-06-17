import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

const DialogEditProfile: React.FC<{ user: any; onUpdate: (user: any) => void }> = ({
  user,
  onUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    registerDate: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.nama || "",
        email: user.email || "",
        phone: user.nomor_telepon || "",
        address: user.alamat || "",
        registerDate: user.tanggal_register || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [user, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (form.oldPassword !== user.password) {
      toast.error("Password lama salah.");
      return;
    }

    const updateData: any = {
      nama: form.name,
      email: form.email,
      nomor_telepon: form.phone,
      alamat: form.address,
      tanggal_register: form.registerDate,
      status_member: user.status_member,
    };
    if (form.newPassword) {
      updateData.password = form.newPassword;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL_API}/api/pelanggans/${user.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: updateData }),
        }
      );

      if (res.ok) {
        const updated = await res.json();
        const updatedUser = {
          ...user,
          ...updated.data.attributes,
          password: form.newPassword ? form.newPassword : user.password,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        onUpdate(updatedUser);
        toast.success("Profil berhasil diupdate!");
        setOpen(false);
      } else {
        const error = await res.json();
        toast.error(
          error?.message ||
            "Gagal update profil. Pastikan data sudah benar."
        );
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghubungi server.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-100 rounded transition">
          <Pencil size={16} /> Edit Data Profile
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-md"
        style={{
          height: "520px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DialogHeader>
          <DialogTitle>Edit Profil</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="name" className="py-2">Nama</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                className="focus:border-pink-400"
              />
            </div>
            <div>
              <Label htmlFor="email" className="py-2">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="focus:border-pink-400"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="py-2">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                className="focus:border-pink-400"
              />
            </div>
            <div>
              <Label htmlFor="address" className="py-2">Alamat</Label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="focus:border-pink-400 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="registerDate" className="py-2">Tanggal Register</Label>
              <Input
                id="registerDate"
                name="registerDate"
                type="date"
                value={form.registerDate}
                readOnly
                className="focus:border-pink-400 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <Label htmlFor="oldPassword" className="py-2">Password Lama</Label>
              <Input
                id="oldPassword"
                name="oldPassword"
                type="password"
                value={form.oldPassword}
                onChange={handleChange}
                required
                className="focus:border-pink-400"
              />
            </div>
            <div>
              <Label htmlFor="newPassword" className="py-2">Password Baru (Opsional)</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                className="focus:border-pink-400"
              />
            </div>
            {/* Tombol simpan tetap di dalam form agar bisa submit dengan Enter */}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full bg-pink-400 hover:bg-pink-500 text-white"
              >
                Simpan Perubahan
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="w-full mt-2">
                  Batal
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditProfile;