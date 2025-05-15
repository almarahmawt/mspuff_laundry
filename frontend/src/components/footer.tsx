
interface FooterData {
  alamat: string;
  media_sosial?: {
    icon: string;
    link: string;
  }[];
}

interface FooterProps {
  data: FooterData;
}

const Footer = ({data} : FooterProps) => {
    return(
        <footer className="bg-pink-400 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-md:items-center">
            {/* Logo dan Informasi Kontak */}
            <div className="flex flex-col">
              <div className="flex md:pl-3 text-center max-md:text-left mb-4">
                <img
                  src="/Logo.png"
                  alt="Logo Ms.Puff"
                  width={64}
                  className="mb-3 md:mb-0"
                />
                <h3 className="font-semibold text-2xl text-white mb-2 md:mb-0">
                  Ms. Puff
                </h3>
              </div>
              <p className="md:ml-4 text-sm text-white max-w-md">
                {data.alamat}
              </p>
            </div>

            {/* Media Sosial */}
            <div className="flex flex-col md:items-end">
              <div className="text-white text-2xl font-medium mb-2">
                Media Sosial
              </div>
              <div className="flex gap-4 items-center">
                <a href="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook-icon lucide-facebook text-white transition duration-300"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram-icon lucide-instagram text-white transition duration-300"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
}

export default Footer;