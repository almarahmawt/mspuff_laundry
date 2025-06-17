import { Heart, Menu, User2, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import DialogEditProfile from "@/components/edit-profile";
import { getPelanggan } from "@/lib/fetch";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const local = localStorage.getItem("user");
    if (local) {
      const { documentId } = JSON.parse(local);
      const fetchUser = async () => {
        const userData = await getPelanggan(documentId);
        // Pastikan ambil data user dari response (misal: userData.data[0].attributes)
        if (userData?.data?.[0]) {
          setUser(userData.data[0]);
        }
      };
      fetchUser();
    }
  }, []);

  console.log("Fetching user data for documentId:", user);

  const handleOrderClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user) {
      e.preventDefault();
      toast.error(
        "Anda belum login, login atau registrasi terlebih dahulu untuk memesan."
      );
      setTimeout(() => {
        navigate("/authentication");
      }, 1200);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Anda Berhasil Logout");
    setUser(null);
    setTimeout(() => {
      navigate("/authentication");
    }, 1200);
  };

  const handleUpdateUser = () => {
    const updated = localStorage.getItem("user");
    setUser(updated ? JSON.parse(updated) : null);
  };
  console.log("User data loaded:", user)

  const UserDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
          <User2 className="text-pink-400" size={20} />
          <span className="font-medium text-gray-700">
            {user?.nama || "User"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <DialogEditProfile user={user} onUpdate={handleUpdateUser} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-2 text-red-500 cursor-pointer"
        >
          <LogOut size={16} /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/">
          <div className="flex items-center space-x-2">
            <img src="/Logo.png" alt="Logo Ms.Puff" width={64} />
            <span className="font-semibold text-3xl text-gray-800">
              Ms. Puff Laundry
            </span>
          </div>
        </a>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-gray-700">
                <Menu size={28} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <SheetHeader>
                <SheetTitle className="text-pink-400 text-lg font-bold">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="p-4 space-y-4">
                <a
                  href="/layanan"
                  className="flex items-center gap-3 transition-all group"
                >
                  <Heart
                    size={22}
                    className="text-pink-400 group-hover:fill-pink-400"
                  />
                  <p className="text-gray-700">Layanan Kami</p>
                </a>
                <div className="flex gap-2 mt-4">
                  {!user ? (
                    <button
                      className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                      onClick={() => navigate("/authentication")}
                    >
                      Login
                    </button>
                  ) : (
                    <>
                      <a
                        href={`https://wa.me/${import.meta.env.VITE_NO_WHATSAPP}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <button
                          className="bg-pink-400 text-white px-4 py-1 rounded hover:bg-pink-600 transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                          onClick={handleOrderClick}
                        >
                          Pesan Sekarang
                        </button>
                      </a>
                      {UserDropdown}
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <a href="/layanan" className="group">
            <div className="flex items-center gap-3 px-4 py-1 transition-all">
              <Heart
                size={22}
                className="text-pink-400 group-hover:fill-pink-400"
              />
              <p className="text-gray-700">Layanan Kami</p>
            </div>
          </a>
          {!user ? (
            <button
              className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600"
              onClick={() => navigate("/authentication")}
            >
              Login
            </button>
          ) : (
            <>
              <a
                href={`https://wa.me/${import.meta.env.VITE_NO_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <button
                  className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600 w-full"
                  onClick={handleOrderClick}
                >
                  Pesan Sekarang
                </button>
              </a>
              {UserDropdown}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
