import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; 

const today = new Date().toISOString().slice(0, 10);

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    registerDate: today,
    password: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL_API}/api/pelanggans`
      );
      const json = await res.json();

      const user = json.data.find(
        (item: any) =>
          item.email === loginData.email && item.password === loginData.password
      );

      if (user) {
        toast.success(`Login berhasil! Selamat datang, ${user.nama}`);
        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        toast.error(
          "User tidak ditemukan, silakan registrasi jika belum punya akun."
        );
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghubungi server.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL_API}/api/pelanggans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              nama: registerData.name,
              email: registerData.email,
              nomor_telepon: registerData.phone,
              alamat: registerData.address,
              tanggal_register: registerData.registerDate,
              password: registerData.password,
              status_member: false,
            }
          }),
        }
      );

      if (res.ok) {
        toast.success("Registrasi berhasil! Silakan login.");
        setTimeout(() => {
          setTab("login");
        }, 1200);
      } else {
        const error = await res.json();
        toast.error(
          error?.message ||
            "Registrasi gagal. Pastikan data sudah benar dan email belum terdaftar."
        );
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghubungi server.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50 px-2 py-4">
      <Card className="w-full max-w-md md:max-w-lg border-pink-400 shadow-lg p-6">
        <CardHeader>
          <div className="flex flex-col items-center gap-2 mb-2">
            <img
              src="/Logo.png"
              alt="Ms Puff Laundry Logo"
              className="h-16 w-16 object-contain rounded-full border-2 border-pink-400 bg-white"
            />
            <CardTitle className="text-center text-pink-400 text-2xl font-bold">
              Ms. Puff Laundry
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "login" | "register")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-pink-100 border border-pink-400">
              <TabsTrigger
                value="login"
                className={
                  tab === "login" ? "bg-pink-400 text-white" : "text-pink-400"
                }
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className={
                  tab === "register"
                    ? "bg-pink-400 text-white"
                    : "text-pink-400"
                }
              >
                Registrasi
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="py-2">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="focus:border-pink-400"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="py-2">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="focus:border-pink-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white"
                >
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="py-2">
                    Nama
                  </Label>
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    className="focus:border-pink-400"
                  />
                </div>
                <div>
                  <Label htmlFor="register-email" className="py-2">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="focus:border-pink-400"
                  />
                </div>
                <div>
                  <Label htmlFor="register-phone" className="py-2">
                    Nomor Telepon
                  </Label>
                  <Input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    required
                    className="focus:border-pink-400"
                  />
                </div>
                <div>
                  <Label htmlFor="register-address" className="py-2">
                    Alamat
                  </Label>
                  <textarea
                    id="register-address"
                    name="address"
                    value={registerData.address}
                    onChange={handleRegisterChange}
                    required
                    className="focus:border-pink-400 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="register-date" className="py-2">
                    Tanggal Register
                  </Label>
                  <Input
                    id="register-date"
                    name="registerDate"
                    type="date"
                    value={registerData.registerDate}
                    readOnly
                    className="focus:border-pink-400 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password" className="py-2">
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    className="focus:border-pink-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white"
                >
                  Registrasi
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationPage;