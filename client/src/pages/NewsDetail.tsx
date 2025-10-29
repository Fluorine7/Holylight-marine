import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NewsDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: news, isLoading, error } = trpc.news.getBySlug.useQuery({ slug });

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

  if (error || !news) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">新闻不存在</h2>
            <Link href="/news">
              <button className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mx-auto">
                <ArrowLeft size={20} />
                返回新闻列表
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 bg-gray-50">
        <div className="container max-w-4xl">
          {/* 返回按钮 */}
          <Link href="/news">
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors">
              <ArrowLeft size={20} />
              返回新闻列表
            </button>
          </Link>

          {/* 新闻标题 */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>

          {/* 新闻元信息 */}
          <div className="flex items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(news.publishDate).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            {news.category && (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {news.category}
              </div>
            )}
          </div>

          {/* 封面图片 */}
          {news.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={news.coverImage}
                alt={news.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* 新闻摘要 */}
          {news.summary && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded">
              <p className="text-lg text-gray-700 leading-relaxed">
                {news.summary}
              </p>
            </div>
          )}

          {/* 新闻正文 */}
          <div 
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: news.content || '' }}
          />

          {/* 分享按钮（可选） */}
          <div className="flex items-center justify-center gap-4 py-8 border-t">
            <span className="text-gray-600">分享到：</span>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
              微信
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
              微博
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

