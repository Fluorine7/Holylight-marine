import { useState } from "react";
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import { useLocation } from "wouter";

export default function CategoriesPage() {
  return (
    <ProtectedRoute requireAdmin>
      <CategoriesContent />
    </ProtectedRoute>
  );
}

function CategoriesContent() {
  const [, setLocation] = useLocation();
  const { data: categories, isLoading } = trpc.productCategories.listAll.useQuery();
  const { data: products } = trpc.products.listAll.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.productCategories.delete.useMutation({
    onSuccess: () => {
      utils.productCategories.listAll.invalidate();
    },
  });

  const handleDelete = async (id: number) => {
    const productCount = products?.filter((p) => p.categoryId === id).length || 0;
    if (productCount > 0) {
      alert(`无法删除：该分类下还有 ${productCount} 个产品`);
      return;
    }
    if (confirm("确定要删除这个分类吗？")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const getProductCount = (categoryId: number) => {
    return products?.filter((p) => p.categoryId === categoryId).length || 0;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">产品分类管理</h1>
            <p className="text-gray-600 mt-2">管理产品分类</p>
          </div>
          <Button onClick={() => setLocation("/admin/categories/new")}>
            <Plus className="w-4 h-4 mr-2" />
            添加新分类
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              还没有分类
            </h3>
            <p className="text-gray-500 mb-6">点击上方按钮添加第一个分类</p>
            <Button onClick={() => setLocation("/admin/categories/new")}>
              <Plus className="w-4 h-4 mr-2" />
              添加新分类
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">
                    {getProductCount(category.id)} 个产品
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation(`/admin/categories/${category.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

