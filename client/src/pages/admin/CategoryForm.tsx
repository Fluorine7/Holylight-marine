import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export default function CategoryFormPage() {
  return (
    <ProtectedRoute requireAdmin>
      <CategoryFormContent />
    </ProtectedRoute>
  );
}

function CategoryFormContent() {
  const [, params] = useRoute("/admin/categories/:id");
  const [, setLocation] = useLocation();
  const categoryId = params?.id && params.id !== "new" ? parseInt(params.id) : null;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [parentId, setParentId] = useState<number | null>(null);

  const { data: category } = trpc.productCategories.getById.useQuery(
    { id: categoryId! },
    { enabled: !!categoryId }
  );

  const { data: allCategories } = trpc.productCategories.listAll.useQuery();
  
  // 获取所有一级分类（用于父分类选择）
  const topLevelCategories = allCategories?.filter(c => c.parentId === null && c.id !== categoryId) || [];

  const utils = trpc.useUtils();
  const createMutation = trpc.productCategories.create.useMutation({
    onSuccess: () => {
      utils.productCategories.listAll.invalidate();
      setLocation("/admin/categories");
    },
  });

  const updateMutation = trpc.productCategories.update.useMutation({
    onSuccess: () => {
      utils.productCategories.listAll.invalidate();
      setLocation("/admin/categories");
    },
  });

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
      setImageUrl(category.imageUrl || "");
      setOrder(category.order);
      setIsActive(category.isActive);
      setParentId(category.parentId);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description: description || undefined,
        imageUrl: imageUrl || undefined,
        parentId: parentId || undefined,
        order,
        isActive,
      };

      if (categoryId) {
        await updateMutation.mutateAsync({ id: categoryId, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('保存分类失败:', error);
      alert(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/admin/categories")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回分类列表
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryId ? "编辑分类" : "添加新分类"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <Label htmlFor="name">分类名称 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="例如：通风系统"
            />
          </div>

          <div>
            <Label htmlFor="slug">URL别名</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="留空自动生成，例如：ventilation-system"
            />
            <p className="text-sm text-gray-500 mt-1">
              用于URL中的分类标识，留空将自动根据分类名称生成
            </p>
          </div>

          <div>
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="分类的详细描述"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">分类图片URL</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="分类图片预览"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="parentId">父分类</Label>
            <select
              id="parentId"
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">无（一级分类）</option>
              {topLevelCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              选择父分类后，此分类将成为二级分类
            </p>
          </div>

          <div>
            <Label htmlFor="order">排序</Label>
            <Input
              id="order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              placeholder="0"
            />
            <p className="text-sm text-gray-500 mt-1">
              数字越小越靠前
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              启用此分类
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {categoryId ? "保存修改" : "创建分类"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/categories")}
            >
              取消
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

