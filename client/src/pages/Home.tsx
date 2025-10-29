import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 从数据库加载数据
  const { data: banners = [] } = trpc.banners.list.useQuery();
  const { data: productCategories = [] } = trpc.productCategories.listTopLevel.useQuery({ limit: 8 });
  const { data: partners = [] } = trpc.partners.list.useQuery();
  const { data: newsItems = [] } = trpc.news.list.useQuery();

  // 使用静态数据作为后备（如果数据库为空）
  const slides = banners.length > 0 ? banners.map(b => ({
    image: b.imageUrl,
    title: b.title,
    subtitle: b.subtitle || "",
  })) : [
    {
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&h=800&fit=crop",
      title: "专业船舶配件系统供应商",
      subtitle: "Professional Marine Equipment System Supplier",
    },
    {
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=1920&h=800&fit=crop",
      title: "游艇配套解决方案",
      subtitle: "Yacht Equipment Solutions",
    },
    {
      image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=1920&h=800&fit=crop",
      title: "房车配套系统",
      subtitle: "RV System Solutions",
    },
  ];

  const categories = productCategories.length > 0 ? productCategories.map(c => ({
    id: c.id,
    name: c.name,
    imageUrl: c.imageUrl,
    description: c.description || "",
    path: "/shop",
  })) : [
    {
      id: 1,
      name: "舷外机船配套",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      description: "专业的舷外机配套产品和解决方案",
      path: "/shop",
    },
    {
      id: 2,
      name: "游艇",
      imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=400&h=300&fit=crop",
      description: "高端游艇配套设备和系统",
      path: "/shop",
    },
    {
      id: 3,
      name: "商业船",
      imageUrl: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop",
      description: "商业船舶配套产品和服务",
      path: "/shop",
    },
    {
      id: 4,
      name: "房车",
      imageUrl: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=400&h=300&fit=crop",
      description: "房车配套系统和解决方案",
      path: "/shop",
    },
  ];

  const partnerList = partners.length > 0 ? partners : [
    { id: 1, name: "CEM", logoUrl: "https://via.placeholder.com/150x80?text=CEM" },
    { id: 2, name: "Dometic", logoUrl: "https://via.placeholder.com/150x80?text=Dometic" },
    { id: 3, name: "Marco", logoUrl: "https://via.placeholder.com/150x80?text=Marco" },
    { id: 4, name: "NHK MEC", logoUrl: "https://via.placeholder.com/150x80?text=NHK+MEC" },
    { id: 5, name: "Sleipner", logoUrl: "https://via.placeholder.com/150x80?text=Sleipner" },
    { id: 6, name: "Seastar", logoUrl: "https://via.placeholder.com/150x80?text=Seastar" },
    { id: 7, name: "PYI", logoUrl: "https://via.placeholder.com/150x80?text=PYI" },
    { id: 8, name: "Polyform", logoUrl: "https://via.placeholder.com/150x80?text=Polyform" },
    { id: 9, name: "GUIDI", logoUrl: "https://via.placeholder.com/150x80?text=GUIDI" },
    { id: 10, name: "Honda", logoUrl: "https://via.placeholder.com/150x80?text=Honda" },
  ];

  const news = newsItems.length > 0 ? newsItems.map(n => ({
    title: n.title,
    date: new Date(n.publishDate).toLocaleDateString('zh-CN'),
    image: n.coverImage || '',
    slug: n.slug,
  })) : [
    {
      title: "好利来与GUIDI达成战略合作",
      date: "2025-01-15",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
      slug: "guidi-partnership",
    },
    {
      title: "2025 中国（上海）第二十八届国际船艇及其技术设备展览会",
      date: "2025-03-20",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
      slug: "shanghai-boat-show-2025",
    },
    {
      title: "2025年第26届北京国际房车露营展览会",
      date: "2025-04-10",
      image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&h=300&fit=crop",
      slug: "beijing-rv-expo-2025",
    },
  ];

  // 轮播图自动播放
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 轮播图区域 */}
      {slides.length > 0 && (
        <section className="relative h-[500px] md:h-[600px] lg:h-[700px] mt-[120px] md:mt-[130px]">
          <div className="relative w-full h-full overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white px-4">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl">{slide.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 轮播控制按钮 */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all shadow-lg"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* 轮播指示器 */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 md:h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-primary w-6 md:w-8" : "bg-white/50 w-2 md:w-3"
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* 公司简介 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden shadow-lg order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
                alt="公司厂房"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center md:text-left">
                公司简介
              </h2>
              <div className="text-lg md:text-xl text-gray-600 mb-6 text-center md:text-left">
                Company Profile
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                <p>
                  深圳市好利来贸易有限公司是一家专业从事船舶配套、游艇、商业船、房车等领域的贸易公司。公司致力于为客户提供高质量的产品和专业的服务，与多家国际知名品牌建立了长期稳定的合作关系。
                </p>
                <p>
                  公司主要经营船用配件、游艇配套设备、房车系统等产品，涵盖了从设计、研发、生产到销售、服务的完整产业链。我们秉承"友好合作、互惠互利"的经营理念，为客户提供一站式解决方案。
                </p>
                <p>
                  好利来立足深圳，布局全球，与多家国际知名品牌建立了战略合作关系，为全球客户提供优质的产品和专业的服务，持续深化公司的国际化战略。
                </p>
              </div>
              <Link href="/contact">
                <Button className="mt-6" size="lg">
                  查看更多
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 合作伙伴 */}
      {partnerList.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
              合作伙伴
            </h2>
            <div className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 text-center">
              Our Partners
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {partnerList.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-w-full h-12 md:h-16 object-contain grayscale hover:grayscale-0 transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  更多
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 产品类别推荐 */}
      {categories.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
              产品类别
            </h2>
            <div className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 text-center">
              Product Categories
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {categories.map((category) => (
                <Link key={category.id} href={category.path}>
                  <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.imageUrl || ''}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm">{category.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/shop">
                <Button variant="outline" size="lg">
                  更多
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 新闻资讯 */}
      {news.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
              新闻资讯
            </h2>
            <div className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 text-center">
              News Information
            </div>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* 大图新闻 */}
              {news[0] && (
                <Link href={`/news/${news[0].slug}`}>
                  <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer shadow-lg">
                    <img
                      src={news[0].image}
                      alt={news[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                      <h3 className="text-xl md:text-2xl font-bold mb-2 drop-shadow-lg">
                        {news[0].title}
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">{news[0].date}</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* 小图新闻 */}
              <div className="flex flex-col gap-4 md:gap-6">
                {news.slice(1).map((item, index) => (
                  <Link key={index} href={`/news/${item.slug}`}>
                    <div className="relative h-[195px] md:h-[242px] rounded-lg overflow-hidden group cursor-pointer shadow-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white">
                        <h3 className="text-base md:text-lg font-bold mb-1 drop-shadow-lg">
                          {item.title}
                        </h3>
                        <p className="text-xs opacity-90">{item.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="text-center mt-8">
              <Link href="/news">
                <Button variant="outline" size="lg">
                  更多
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* 返回顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-40"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

