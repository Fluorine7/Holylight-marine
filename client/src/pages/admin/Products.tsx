import { useState } from "react";
import { Package, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import { useLocation } from "wouter";

export default function ProductsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <ProductsContent />
    </ProtectedRoute>
  );
}

function ProductsContent() {
  const [, setLocation] = useLocation();
  const { data: products, isLoading } = trpc.products.listAll.useQuery();
  const { data: categories } = trpc.productCategories.listAll.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      utils.products.listAll.invalidate();
    },
  });

  const togglePublishMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.listAll.invalidate();
    },
  });

  const handleDelete = async (id: number) => {
    if (confirm("确定要删除这个产品吗？")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const handleTogglePublish = async (product: any) => {
    await togglePublishMutation.mutateAsync({
      id: product.id,
      isPublished: !product.isPublished,
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((c) => c.id === categoryId);
    return category?.name || "未分类";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">产品管理</h1>
            <p className="text-gray-600 mt-2">管理所有产品信息</p>
          </div>
          <Button onClick={() => setLocation("/admin/products/new")}>
            <Plus className="w-4 h-4 mr-2" />
            添加新产品
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              还没有产品
            </h3>
            <p className="text-gray-500 mb-6">点击上方按钮添加第一个产品</p>
            <Button onClick={() => setLocation("/admin/products/new")}>
              <Plus className="w-4 h-4 mr-2" />
              添加新产品
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产品名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    型号
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分类
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images && (
                          <img
                            src={JSON.parse(product.images)[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCategoryName(product.categoryId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.isPublished ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(product)}
                        >
                          {product.isPublished ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setLocation(`/admin/products/edit/${product.id}`)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
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

