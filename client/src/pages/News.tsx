import { useState, useEffect } from "react";
import { ArrowUp, Calendar, Tag } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";

export default function News() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // 从数据库加载新闻
  const { data: newsData = [], isLoading } = trpc.news.list.useQuery();

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

  // 转换数据库数据为页面所需格式
  const newsItems = newsData.map(n => ({
    id: n.id,
    title: n.title,
    category: n.category || "公司新闻",
    date: new Date(n.publishDate).toLocaleDateString('zh-CN'),
    image: n.coverImage || "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop",
    summary: n.summary || "",
    slug: n.slug,
    featured: true, // 前3条设为特色
  }));

  // 新闻分类
  const categories = ["全部", "公司新闻", "行业资讯", "展会活动", "产品发布"];

  // 根据分类筛选新闻
  const filteredNews = selectedCategory === "全部" 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  // 特色新闻（前3条）
  const featuredNews = filteredNews.slice(0, 3);
  // 普通新闻（从第4条开始）
  const regularNews = filteredNews.slice(3);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面标题横幅 */}
      <section className="relative h-[300px] md:h-[400px] mt-[120px] md:mt-[130px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&h=600&fit=crop"
            alt="新闻动态"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              新闻动态
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              News & Updates
            </p>
          </div>
        </div>
      </section>

      {/* 新闻分类 */}
      <section className="py-8 bg-white border-b sticky top-[120px] md:top-[130px] z-30">
        <div className="container">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* 特色新闻 */}
      {selectedCategory === "全部" && featuredNews.length > 0 && (
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">热点新闻</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* 大图新闻 */}
              {featuredNews[0] && (
                <Link href={`/news/${featuredNews[0].slug}`}>
                  <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden group cursor-pointer shadow-lg">
                    <img
                      src={featuredNews[0].image}
                      alt={featuredNews[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {featuredNews[0].date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {featuredNews[0].category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                        {featuredNews[0].title}
                      </h3>
                      <p className="text-sm opacity-90">{featuredNews[0].summary}</p>
                    </div>
                  </div>
                </Link>
              )}

              {/* 小图新闻 */}
              <div className="flex flex-col gap-6">
                {featuredNews.slice(1).map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <div className="relative h-[242px] rounded-lg overflow-hidden group cursor-pointer shadow-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <div className="flex items-center gap-3 mb-2 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {item.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 drop-shadow-lg">
                          {item.title}
                        </h3>
                        <p className="text-xs opacity-90 line-clamp-2">{item.summary}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 新闻列表 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            {selectedCategory === "全部" ? (regularNews.length > 0 ? "更多新闻" : "所有新闻") : selectedCategory}
          </h2>
          
          {filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">暂无新闻</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === "全部" ? regularNews : filteredNews).map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Tag className="w-3 h-3" />
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {item.summary}
                      </p>
                      <Button variant="link" className="p-0 h-auto text-primary">
                        阅读更多 →
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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

