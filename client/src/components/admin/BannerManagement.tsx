import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function BannerManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const utils = trpc.useUtils();
  const { data: banners, isLoading } = trpc.banners.listAll.useQuery();

  const createMutation = trpc.banners.create.useMutation({
    onSuccess: () => {
      utils.banners.listAll.invalidate();
      toast.success("轮播图创建成功");
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  const updateMutation = trpc.banners.update.useMutation({
    onSuccess: () => {
      utils.banners.listAll.invalidate();
      toast.success("轮播图更新成功");
      setIsDialogOpen(false);
      setEditingBanner(null);
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  const deleteMutation = trpc.banners.delete.useMutation({
    onSuccess: () => {
      utils.banners.listAll.invalidate();
      toast.success("轮播图删除成功");
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      subtitle: formData.get("subtitle") as string,
      imageUrl: formData.get("imageUrl") as string,
      link: formData.get("link") as string,
      order: parseInt(formData.get("order") as string) || 0,
    };

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("确定要删除这个轮播图吗？")) {
      deleteMutation.mutate({ id });
    }
  };

  const toggleActive = (id: number, isActive: boolean) => {
    updateMutation.mutate({ id, isActive: !isActive });
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">轮播图管理</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBanner(null)}>
              <Plus className="w-4 h-4 mr-2" />
              添加轮播图
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBanner ? "编辑轮播图" : "添加轮播图"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingBanner?.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="subtitle">副标题</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  defaultValue={editingBanner?.subtitle}
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">图片URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={editingBanner?.imageUrl}
                  required
                />
              </div>
              <div>
                <Label htmlFor="link">链接</Label>
                <Input
                  id="link"
                  name="link"
                  defaultValue={editingBanner?.link}
                />
              </div>
              <div>
                <Label htmlFor="order">排序</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  defaultValue={editingBanner?.order || 0}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingBanner ? "更新" : "创建"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>标题</TableHead>
              <TableHead>副标题</TableHead>
              <TableHead>排序</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners?.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>{banner.id}</TableCell>
                <TableCell>{banner.title}</TableCell>
                <TableCell>{banner.subtitle}</TableCell>
                <TableCell>{banner.order}</TableCell>
                <TableCell>
                  <Switch
                    checked={banner.isActive}
                    onCheckedChange={() => toggleActive(banner.id, banner.isActive)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(banner)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(banner.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

