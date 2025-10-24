import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import BannerManagement from "@/components/admin/BannerManagement";
import ProductCategoryManagement from "@/components/admin/ProductCategoryManagement";
import PartnerManagement from "@/components/admin/PartnerManagement";
import NewsManagement from "@/components/admin/NewsManagement";

export default function Admin() {
  const { user, loading, isAuthenticated, logout, refresh } = useAuth();
  const [, setLocation] = useLocation();
  const [retryCount, setRetryCount] = useState(0);

  // 延迟检查认证状态，给cookie更多时间生效
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated && retryCount < 3) {
      // 尝试重新获取用户信息
      const timer = setTimeout(() => {
        refresh();
        setRetryCount(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    if (!isAuthenticated && retryCount >= 3) {
      // 多次重试后仍未认证，跳转到登录页
      window.location.replace(getLoginUrl());
    }
  }, [loading, isAuthenticated, retryCount, refresh]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      setLocation("/");
    }
  }, [user, setLocation]);

  if (loading || (!isAuthenticated && retryCount < 3)) {
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

