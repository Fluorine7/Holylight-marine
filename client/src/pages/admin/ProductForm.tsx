import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, X } from "lucide-react";
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

  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<{ name: string; url: string }[]>([]);
  const [downloadName, setDownloadName] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = trpc.productCategories.listAll.useQuery();
  const { data: product } = trpc.products.getById.useQuery(
    { id: productId! },
    { enabled: isEdit }
  );

  const utils = trpc.useUtils();
  
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setModel(product.model || "");
      setCategoryId(product.categoryId?.toString() || "");
      setBrand(product.brand || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setSpecifications(product.specifications || "");
      setImages(product.images ? JSON.parse(product.images) : []);
      setDownloads(product.downloads ? JSON.parse(product.downloads) : []);
      setIsPublished(product.isPublished);
    }
  }, [product]);

  const handleSubmit = async () => {
    console.log("handleSubmit called");
    
    if (!name.trim()) {
      toast.error("请输入产品名称");
      return;
    }
    
    if (!categoryId) {
      toast.error("请选择产品分类");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const slug = isEdit 
        ? product!.slug 
        : name.toLowerCase()
            .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .substring(0, 100) + '-' + Date.now();
      
      const data = {
        name: name.trim(),
        slug,
        categoryId: parseInt(categoryId),
        model: model.trim() || undefined,
        brand: brand.trim() || undefined,
        description: description.trim() || undefined,
        specifications: specifications.trim() || undefined,
        price: price.trim() || undefined,
        images: JSON.stringify(images),
        downloads: JSON.stringify(downloads),
        isPublished,
      };
      
      console.log('[ProductForm] Submitting data:', JSON.stringify(data, null, 2));
      console.log('[ProductForm] images array:', images);
      console.log('[ProductForm] downloads array:', downloads);

      if (isEdit) {
        await updateMutation.mutateAsync({ id: productId, ...data });
        toast.success("产品更新成功！");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("产品创建成功！");
      }
      
      utils.products.listAll.invalidate();
      setLocation("/admin/products");
    } catch (error: any) {
      console.error("提交失败:", error);
      toast.error(`${isEdit ? "更新" : "创建"}失败: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
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

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入产品型号"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品分类 <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
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
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入价格"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发布状态
              </label>
              <select
                value={isPublished ? "published" : "draft"}
                onChange={(e) => setIsPublished(e.target.value === "published")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              产品描述
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              rows={4}
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
              multiple={true}
              maxSize={10}
              label="上传图片"
              existingFiles={images}
              onUploadComplete={(urls) => setImages([...images, ...urls])}
            />
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`产品图片 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              资料下载
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={downloadName}
                onChange={(e) => setDownloadName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="资料名称（如：产品说明书）"
              />
              <FileUpload
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                multiple={false}
                maxSize={20}
                label="上传资料文件"
                existingFiles={[]}
                onUploadComplete={(urls) => {
                  if (urls.length > 0 && downloadName.trim()) {
                    setDownloads([...downloads, { name: downloadName.trim(), url: urls[0] }]);
                    setDownloadName("");
                  } else if (!downloadName.trim()) {
                    toast.error("请先输入资料名称");
                  }
                }}
              />

              {downloads.length > 0 && (
                <div className="mt-4 space-y-2">
                  {downloads.map((download, index) => (
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
                        onClick={() => setDownloads(downloads.filter((_, i) => i !== index))}
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
            <button
              type="button"
              onClick={() => setLocation("/admin/products")}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button 
              type="button" 
              disabled={isSubmitting}
              onClick={() => {
                console.log('Native button clicked!');
                handleSubmit();
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "保存中..." : isEdit ? "保存修改" : "创建产品"}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

