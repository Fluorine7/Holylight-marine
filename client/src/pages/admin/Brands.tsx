import { useState } from "react";
import { Tag, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import { useLocation } from "wouter";

export default function BrandsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <BrandsContent />
    </ProtectedRoute>
  );
}

function BrandsContent() {
  const [, setLocation] = useLocation();
  const { data: brands, isLoading } = trpc.brands.listAll.useQuery();
  const { data: products } = trpc.products.listAll.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.brands.delete.useMutation({
    onSuccess: () => {
      utils.brands.listAll.invalidate();
    },
  });

  const handleDelete = async (id: number) => {
    const productCount = products?.filter((p) => p.brandId === id).length || 0;
    if (productCount > 0) {
      alert(`无法删除：该品牌下还有 ${productCount} 个产品`);
      return;
    }
    if (confirm("确定要删除这个品牌吗？")) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  const getProductCount = (brandId: number) => {
    return products?.filter((p) => p.brandId === brandId).length || 0;
  };

  const [showNewBrandForm, setShowNewBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<number | null>(null);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">品牌管理</h1>
            <p className="text-gray-600 mt-2">管理产品品牌</p>
          </div>
          <Button onClick={() => setShowNewBrandForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            添加新品牌
          </Button>
        </div>

        {showNewBrandForm && (
          <BrandForm
            onClose={() => setShowNewBrandForm(false)}
            onSuccess={() => {
              setShowNewBrandForm(false);
              utils.brands.listAll.invalidate();
            }}
          />
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : !brands || brands.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              还没有品牌
            </h3>
            <p className="text-gray-500 mb-6">点击上方按钮添加第一个品牌</p>
            <Button onClick={() => setShowNewBrandForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              添加新品牌
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div key={brand.id}>
                {editingBrand === brand.id ? (
                  <BrandForm
                    brand={brand}
                    onClose={() => setEditingBrand(null)}
                    onSuccess={() => {
                      setEditingBrand(null);
                      utils.brands.listAll.invalidate();
                    }}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {brand.name}
                        </h3>
                        {brand.website && (
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            官网
                          </a>
                        )}
                      </div>
                      {brand.logoUrl && (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {getProductCount(brand.id)} 个产品
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingBrand(brand.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(brand.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>

                    {!brand.isActive && (
                      <div className="mt-2 text-xs text-gray-500">
                        (已禁用)
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function BrandForm({
  brand,
  onClose,
  onSuccess,
}: {
  brand?: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [logoUrl, setLogoUrl] = useState(brand?.logoUrl || "");
  const [website, setWebsite] = useState(brand?.website || "");
  const [order, setOrder] = useState(brand?.order || 0);
  const [isActive, setIsActive] = useState(brand?.isActive ?? true);

  const createMutation = trpc.brands.create.useMutation({
    onSuccess,
  });

  const updateMutation = trpc.brands.update.useMutation({
    onSuccess,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("请输入品牌名称");
      return;
    }

    const data = {
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
      logoUrl: logoUrl.trim() || undefined,
      website: website.trim() || undefined,
      order,
      isActive,
    };

    if (brand) {
      await updateMutation.mutateAsync({ id: brand.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {brand ? "编辑品牌" : "添加新品牌"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            品牌名称 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL标识 (slug)
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="自动生成"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo URL
          </label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            官网
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            排序
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            启用
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit">
            {brand ? "保存" : "创建"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
        </div>
      </form>
    </div>
  );
}

