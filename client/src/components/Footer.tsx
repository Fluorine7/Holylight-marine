import { Facebook, Linkedin, Youtube, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container">
        <div className="flex flex-col items-center gap-4">
          {/* 社交媒体图标 */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>

          {/* 版权信息 */}
          <div className="text-center text-sm text-gray-400">
            <p>© 2025 深圳市好利来贸易有限公司 All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

