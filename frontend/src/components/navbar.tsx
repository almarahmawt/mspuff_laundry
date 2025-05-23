import { Heart, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
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
                <a
                  href={`https://wa.me/${import.meta.env.VITE_NO_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <button className="ml-2 bg-pink-400 text-white px-4 py-1 rounded hover:bg-pink-600 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
                    Pesan Sekarang
                  </button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <a href="/layanan" className="group">
            <div className="flex items-center gap-3 px-4 py-1 transition-all">
              <Heart
                size={22}
                className="text-pink-400 group-hover:fill-pink-400"
              />
              <p className="text-gray-700">Layanan Kami</p>
            </div>
          </a>
          <a
            href={`https://wa.me/${import.meta.env.VITE_NO_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-pink-400 text-white px-4 py-2 rounded hover:bg-pink-600 w-full">
              Pesan Sekarang
            </button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
