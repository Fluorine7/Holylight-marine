import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "首页", path: "/" },
    { name: "舷外机船配套", path: "/outboard" },
    { name: "游艇", path: "/yacht" },
    { name: "商业船", path: "/commercial" },
    { name: "房车", path: "/rv" },
    { name: "技术支持", path: "/support" },
    { name: "新闻动态", path: "/news" },
    { name: "联系我们", path: "/contact" },
  ];

  // 搜索功能
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 跳转到新闻页面并传递搜索参数
      navigate(`/news?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  // 处理Enter键搜索
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        {/* 顶部栏 - 语言切换 */}
        <div className="bg-gray-800 text-white text-sm">
          <div className="container flex justify-between items-center py-2">
            <div className="text-xs text-gray-400">欢迎访问好利来贸易官网！</div>
            <div className="flex items-center">
              <button className="flex items-center gap-1 hover:text-primary transition-colors px-3 py-1">
                <Globe className="w-4 h-4" />
                <span>中文简体</span>
              </button>
              <span className="text-gray-500">|</span>
              <Link href="/en">
                <button className="hover:text-primary transition-colors px-3 py-1">
                  English
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* 主导航栏 */}
        <div
          className={`container transition-all duration-300 ${
            isScrolled ? "py-2" : "py-4"
          }`}
        >
          <div className="flex items-center justify-between gap-8">
            {/* Logo区域 */}
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Holylight Logo"
                  className={`transition-all duration-300 ${
                    isScrolled ? "h-10" : "h-12"
                  }`}
                />
                <div className={`transition-all duration-300 ${isScrolled ? "text-xs" : "text-sm"}`}>
                  <div className="font-semibold text-gray-800 whitespace-nowrap">
                    深圳市好利来贸易有限公司
                  </div>
                  <div className="text-[10px] text-gray-600 whitespace-nowrap">
                    HoLylight (Shenzhen) Trading Co.,Ltd
                  </div>
                </div>
              </div>
            </Link>

            {/* 桌面端导航菜单 */}
            <div className="hidden lg:flex items-center gap-4 flex-1 justify-end">
              <nav
                className={`flex items-center gap-1 transition-all duration-300 ${
                  isScrolled ? "text-sm" : "text-base"
                }`}
              >
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <button
                      className={`px-3 py-2 rounded transition-all duration-200 whitespace-nowrap ${
                        location === item.path
                          ? "bg-primary text-white"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </button>
                  </Link>
                ))}
              </nav>

              {/* 搜索框 */}
              <div className="relative flex-shrink-0">
                <Input
                  type="text"
                  placeholder="搜索"
                  className="w-40 pr-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full hover:bg-primary hover:text-white"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 移动端菜单 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-[120px] left-0 right-0 bg-white shadow-lg">
            <nav className="container py-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`w-full text-left px-4 py-3 rounded transition-all ${
                        location === item.path
                          ? "bg-primary text-white"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {item.name}
                    </button>
                  </Link>
                ))}
              </div>
              <div className="mt-4 px-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="搜索"
                    className="w-full pr-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full hover:bg-primary hover:text-white"
                    onClick={handleSearch}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

