import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/AdminLayout";
import ProtectedRoute from "../../components/ProtectedRoute";
import FileUpload from "../../components/FileUpload";
import RichTextEditor from "../../components/RichTextEditor";
import { trpc } from "../../lib/trpc";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

export default function NewsFormPage() {
  return (
    <ProtectedRoute requireAdmin>
      <NewsFormContent />
    </ProtectedRoute>
  );
}

function NewsFormContent() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const newsId = params.id ? parseInt(params.id) : null;
  const isEdit = newsId !== null;

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    coverImage: "",
    category: "",
    publishDate: new Date().toISOString().slice(0, 16),
    isPublished: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: newsItem } = trpc.news.getById.useQuery(
    { id: newsId! },
    { enabled: isEdit }
  );

  const utils = trpc.useUtils();
  const createMutation = trpc.news.create.useMutation({
    onSuccess: () => {
      utils.news.listAll.invalidate();
      toast.success("新闻创建成功！");
      setLocation("/admin/news");
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  const updateMutation = trpc.news.update.useMutation({
    onSuccess: () => {
      utils.news.listAll.invalidate();
      toast.success("新闻更新成功！");
      setLocation("/admin/news");
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title: newsItem.title,
        summary: newsItem.summary || "",
        content: newsItem.content || "",
        coverImage: newsItem.coverImage || "",
        category: newsItem.category || "",
        publishDate: new Date(newsItem.publishDate).toISOString().slice(0, 16),
        isPublished: newsItem.isPublished,
      });
    }
  }, [newsItem]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) + '-' + Date.now();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const slug = isEdit ? newsItem!.slug : generateSlug(formData.title);
      
      const data = {
        title: formData.title,
        slug,
        summary: formData.summary || undefined,
        content: formData.content || undefined,
        coverImage: formData.coverImage || undefined,
        category: formData.category || undefined,
        publishDate: new Date(formData.publishDate),
        isPublished: formData.isPublished,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({ id: newsId, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoverImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData({ ...formData, coverImage: urls[0] });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setLocation("/admin/news")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? "编辑新闻" : "发布新闻"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? "修改新闻内容" : "填写新闻详细信息"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                新闻标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="请输入新闻标题"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                分类
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">请选择分类</option>
                <option value="公司新闻">公司新闻</option>
                <option value="行业资讯">行业资讯</option>
                <option value="展会活动">展会活动</option>
                <option value="产品发布">产品发布</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                发布时间
              </label>
              <input
                type="datetime-local"
                value={formData.publishDate}
                onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                封面图片
              </label>
              <FileUpload
                accept="image/*"
                multiple={false}
                maxSize={10}
                label="上传封面图片"
                existingFiles={formData.coverImage ? [formData.coverImage] : []}
                onUploadComplete={handleCoverImageUpload}
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
              新闻摘要
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入新闻摘要（可选）"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新闻正文
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="请输入新闻正文内容..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin/news")}
            >
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : isEdit ? "保存修改" : "发布新闻"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

