import { useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "../lib/trpc";
import { LogIn } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();

  // 如果已登录，跳转到管理后台
  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  const handleLogin = () => {
    // 触发OAuth登录流程
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="Holylight Logo"
              className="h-16"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            好利来管理后台
          </h1>
          <p className="text-gray-600">请登录以继续</p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <LogIn className="w-5 h-5" />
          <span>登录</span>
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>使用您的账号登录</p>
        </div>
      </div>
    </div>
  );
}

