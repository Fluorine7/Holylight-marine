import { useState } from "react";
import { FolderTree, Plus, Edit, Trash2, ChevronRight, ChevronDown } from "lucide-react";
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

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: number | null;
  order: number;
  isActive: boolean;
  children?: Category[];
}

function CategoriesContent() {
  const [, setLocation] = useLocation();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const { data: categories, isLoading } = trpc.productCategories.listAll.useQuery();
  const { data: products } = trpc.products.listAll.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.productCategories.delete.useMutation({
    onSuccess: () => {
      utils.productCategories.listAll.invalidate();
    },
  });

  const handleDelete = async (id: number, hasChildren: boolean) => {
    if (hasChildren) {
      alert("无法删除：该分类下还有子分类，请先删除子分类");
      return;
    }
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

  const toggleExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // 构建分类树
  const buildCategoryTree = (): Category[] => {
    if (!categories) return [];
    
    const categoryMap = new Map<number, Category>();
    const tree: Category[] = [];

    // 创建分类映射
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // 构建树形结构
    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parentId === null) {
        tree.push(category);
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children!.push(category);
        }
      }
    });

    // 按order排序
    const sortByOrder = (cats: Category[]) => {
      cats.sort((a, b) => a.order - b.order);
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortByOrder(cat.children);
        }
      });
    };
    sortByOrder(tree);

    return tree;
  };

  const categoryTree = buildCategoryTree();

  const renderCategory = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const productCount = getProductCount(category.id);

    return (
      <div key={category.id} className="mb-2">
        <div
          className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${
            level > 0 ? 'ml-8' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* 展开/收起按钮 */}
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              ) : (
                <div className="w-7" /> // 占位符，保持对齐
              )}

              {/* 分类信息 */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-gray-900 ${level === 0 ? 'text-lg' : 'text-base'}`}>
                    {category.name}
                  </h3>
                  {level > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      子分类
                    </span>
                  )}
                  {!category.isActive && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      已禁用
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {category.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{productCount} 个产品</span>
                  {hasChildren && (
                    <span>{category.children!.length} 个子分类</span>
                  )}
                  <span>排序: {category.order}</span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
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
                onClick={() => handleDelete(category.id, hasChildren || false)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* 渲染子分类 */}
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">产品分类管理</h1>
            <p className="text-gray-600 mt-2">管理产品分类（树状结构）</p>
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
          <div className="space-y-2">
            {categoryTree.map((category) => renderCategory(category, 0))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

