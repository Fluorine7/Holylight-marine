import { useState } from "react";
import { Newspaper, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import { useLocation } from "wouter";

export default function NewsManagementPage() {
  return (
    <ProtectedRoute requireAdmin>
      <NewsManagementContent />
    </ProtectedRoute>
  );
}

function NewsManagementContent() {
  const [, setLocation] = useLocation();
  const { data: news, isLoading } = trpc.news.listAll.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.news.delete.useMutation({
    onSuccess: () => {
      utils.news.listAll.invalidate();
    },
  });

  const togglePublishMutation = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.listAll.invalidate();
    },
  });

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这篇新闻吗？")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleTogglePublish = async (newsItem: any) => {
    await togglePublishMutation.mutateAsync({
      id: newsItem.id,
      isPublished: !newsItem.isPublished,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">新闻管理</h1>
            <p className="text-gray-600 mt-2">管理所有新闻文章</p>
          </div>
          <Button onClick={() => setLocation("/admin/news/new")}>
            <Plus className="w-4 h-4 mr-2" />
            发布新闻
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : !news || news.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              还没有新闻
            </h3>
            <p className="text-gray-500 mb-6">点击上方按钮发布第一篇新闻</p>
            <Button onClick={() => setLocation("/admin/news/new")}>
              <Plus className="w-4 h-4 mr-2" />
              发布新闻
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    发布日期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {item.coverImage && (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-16 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                          {item.summary && (
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {item.summary}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.publishDate).toLocaleDateString("zh-CN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.isPublished ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(item)}
                        >
                          {item.isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation(`/admin/news/${item.id}`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

