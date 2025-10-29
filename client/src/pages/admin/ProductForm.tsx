import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Plus, X } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import FileUpload from "../../components/FileUpload";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function ProductFormPage() {
  return (
    <ProtectedRoute requireAdmin>
      <ProductFormContent />
    </ProtectedRoute>
  );
}

function ProductFormContent() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const productId = params.id ? parseInt(params.id) : null;
  const isEdit = productId !== null;

  const [formData, setFormData] = useState({
    name: "",
    model: "",
    categoryId: "",
    brand: "",
    description: "",
    specifications: "",
    price: "",
    images: [] as string[],
    downloads: [] as { name: string; url: string }[],
    isPublished: true,
  });

  const [downloadName, setDownloadName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = trpc.productCategories.listAll.useQuery();
  const { data: product } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: isEdit }
  );

  const utils = trpc.useUtils();
  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      utils.products.listAll.invalidate();
      toast.success("产品创建成功！");
      setLocation("/admin/products");
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      utils.products.listAll.invalidate();
      toast.success("产品更新成功！");
      setLocation("/admin/products");
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        model: product.model || "",
        categoryId: product.categoryId?.toString() || "",
        brand: product.brand || "",
        description: product.description || "",
        specifications: product.specifications || "",
        price: product.price || "",
        images: product.images ? JSON.parse(product.images) : [],
        downloads: product.downloads ? JSON.parse(product.downloads) : [],
        isPublished: product.isPublished,
      });
    }
  }, [product]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) + '-' + Date.now();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      toast.error("请选择产品分类");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const slug = isEdit ? product!.slug : generateSlug(formData.name);
      
      const data = {
        name: formData.name,
        slug,
        categoryId: parseInt(formData.categoryId),
        model: formData.model || undefined,
        brand: formData.brand || undefined,
        description: formData.description || undefined,
        specifications: formData.specifications || undefined,
        price: formData.price || undefined,
        images: JSON.stringify(formData.images),
        downloads: JSON.stringify(formData.downloads),
        isPublished: formData.isPublished,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: productId, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddDownload = (urls: string[]) => {
    if (urls.length > 0 && downloadName.trim()) {
      const newDownloads = urls.map(url => ({
        name: downloadName.trim(),
        url,
      }));
      setFormData({
        ...formData,
        downloads: [...formData.downloads, ...newDownloads],
      });
      setDownloadName("");
    }
  };

  const handleRemoveDownload = (index: number) => {
    setFormData({
      ...formData,
      downloads: formData.downloads.filter((_, i) => i !== index),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setLocation("/admin/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "编辑产品" : "添加新产品"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? "修改产品信息" : "填写产品详细信息"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入产品名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                型号
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入产品型号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品分类 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">请选择分类</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入品牌名称"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                价格
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入价格"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发布状态
              </label>
              <select
                value={formData.isPublished ? "true" : "false"}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.value === "true" })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="true">已发布</option>
                <option value="false">草稿</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入产品描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品规格参数
            </label>
            <textarea
              value={formData.specifications}
              onChange={(e) =>
                setFormData({ ...formData, specifications: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入产品规格参数（每行一个参数）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品图片
            </label>
            <FileUpload
              accept="image/*"
              multiple
              maxSize={10}
              label="上传图片"
              existingFiles={formData.images}
              onUploadComplete={(urls) => setFormData({ ...formData, images: urls })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              资料下载
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={downloadName}
                  onChange={(e) => setDownloadName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="资料名称（如：产品说明书）"
                />
              </div>
              <FileUpload
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                multiple={false}
                maxSize={20}
                label="上传资料文件"
                existingFiles={[]}
                onUploadComplete={handleAddDownload}
              />

              {formData.downloads.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.downloads.map((download, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{download.name}</p>
                        <p className="text-sm text-gray-500 truncate">{download.url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDownload(index)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/products")}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : isEdit ? "保存修改" : "创建产品"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

