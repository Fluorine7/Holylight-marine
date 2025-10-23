import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";
import BannerManagement from "@/components/admin/BannerManagement";
import ProductCategoryManagement from "@/components/admin/ProductCategoryManagement";
import PartnerManagement from "@/components/admin/PartnerManagement";
import NewsManagement from "@/components/admin/NewsManagement";

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [loading, isAuthenticated]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">好利来后台管理系统</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">欢迎，{user.name || user.email}</span>
            <Button variant="outline" size="sm" onClick={() => setLocation("/")}>
              返回首页
            </Button>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              退出登录
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="banners" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="banners">轮播图管理</TabsTrigger>
            <TabsTrigger value="categories">产品类别管理</TabsTrigger>
            <TabsTrigger value="partners">合作伙伴管理</TabsTrigger>
            <TabsTrigger value="news">新闻资讯管理</TabsTrigger>
          </TabsList>

          <TabsContent value="banners">
            <BannerManagement />
          </TabsContent>

          <TabsContent value="categories">
            <ProductCategoryManagement />
          </TabsContent>

          <TabsContent value="partners">
            <PartnerManagement />
          </TabsContent>

          <TabsContent value="news">
            <NewsManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

