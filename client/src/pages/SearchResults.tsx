import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Search, Package, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'products' | 'news'>('products');

  // 页面加载时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 搜索产品
  const { data: allProducts = [] } = trpc.products.listAll.useQuery();
  const filteredProducts = allProducts.filter(product => 
    product.isPublished && (
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(query.toLowerCase())) ||
      (product.model && product.model.toLowerCase().includes(query.toLowerCase()))
    )
  );

  // 搜索新闻
  const { data: allNews = [] } = trpc.news.list.useQuery();
  const filteredNews = allNews.filter(news => 
    news.title.toLowerCase().includes(query.toLowerCase()) ||
    (news.summary && news.summary.toLowerCase().includes(query.toLowerCase())) ||
    (news.content && news.content.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-32">
        {/* 搜索信息 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            搜索结果
          </h1>
          <p className="text-gray-600">
            关键词: <span className="font-semibold text-primary">"{query}"</span>
          </p>
        </div>

        {/* 标签页切换 */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'products'
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              <span>产品 ({filteredProducts.length})</span>
            </div>
            {activeTab === 'products' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'news'
                ? 'text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>新闻 ({filteredNews.length})</span>
            </div>
            {activeTab === 'news' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        {/* 搜索结果内容 */}
        {activeTab === 'products' && (
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const images = product.images ? JSON.parse(product.images) : [];
                  const imageUrl = images[0] || "https://via.placeholder.com/300x300?text=No+Image";
                  
                  return (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          {product.model && (
                            <p className="text-sm text-gray-500 mb-2">
                              型号: {product.model}
                            </p>
                          )}
                          {product.price && (
                            <p className="text-primary font-bold">
                              ¥{product.price}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">未找到相关产品</p>
                <Link href="/product">
                  <Button variant="outline" className="mt-4">
                    浏览所有产品
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            {filteredNews.length > 0 ? (
              <div className="space-y-6">
                {filteredNews.map((news) => (
                  <Link key={news.id} href={`/news/${news.slug}`}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="flex flex-col md:flex-row">
                        {news.coverImage && (
                          <div className="md:w-64 h-48 md:h-auto bg-gray-100 flex-shrink-0">
                            <img
                              src={news.coverImage}
                              alt={news.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-primary transition-colors">
                            {news.title}
                          </h3>
                          {news.summary && (
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {news.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{new Date(news.publishDate).toLocaleDateString('zh-CN')}</span>
                            {news.category && (
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded">
                                {news.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">未找到相关新闻</p>
                <Link href="/news">
                  <Button variant="outline" className="mt-4">
                    浏览所有新闻
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

