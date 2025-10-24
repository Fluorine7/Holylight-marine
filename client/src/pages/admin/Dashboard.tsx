import { Package, FolderTree, Newspaper, TrendingUp } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { trpc } from "../../lib/trpc";

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { data: products } = trpc.products.listAll.useQuery();
  const { data: categories } = trpc.productCategories.listAll.useQuery();
  const { data: news } = trpc.news.listAll.useQuery();

  const stats = [
    {
      title: "产品总数",
      value: products?.length || 0,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "产品分类",
      value: categories?.length || 0,
      icon: FolderTree,
      color: "bg-green-500",
    },
    {
      title: "新闻文章",
      value: news?.length || 0,
      icon: Newspaper,
      color: "bg-purple-500",
    },
    {
      title: "已发布产品",
      value: products?.filter((p) => p.isPublished).length || 0,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
          <p className="text-gray-600 mt-2">欢迎使用好利来管理后台</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 快捷操作 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">快捷操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Package className="w-5 h-5 text-primary" />
              <span className="font-medium">添加新产品</span>
            </a>
            <a
              href="/admin/categories/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <FolderTree className="w-5 h-5 text-primary" />
              <span className="font-medium">添加产品分类</span>
            </a>
            <a
              href="/admin/news/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <Newspaper className="w-5 h-5 text-primary" />
              <span className="font-medium">发布新闻</span>
            </a>
          </div>
        </div>

        {/* 最近更新 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">最近添加的产品</h2>
            <div className="space-y-3">
              {products?.slice(0, 5).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.model}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      product.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {product.isPublished ? "已发布" : "草稿"}
                  </span>
                </div>
              ))}
              {(!products || products.length === 0) && (
                <p className="text-gray-500 text-center py-4">暂无产品</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">最近发布的新闻</h2>
            <div className="space-y-3">
              {news?.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(item.publishDate).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      item.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.isPublished ? "已发布" : "草稿"}
                  </span>
                </div>
              ))}
              {(!news || news.length === 0) && (
                <p className="text-gray-500 text-center py-4">暂无新闻</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


