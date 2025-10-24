import { useState } from "react";
import { ArrowUp, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 办事处数据结构
interface Office {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

// 办事处数据（请根据实际情况修改地址、电话、邮箱）
const offices: Office[] = [
  {
    id: "shenzhen",
    name: "深圳总部",
    address: "广东省深圳市南山区XXX路XXX号XXX大厦XXX室",
    phone: "+86 755-XXXX-XXXX",
    email: "shenzhen@holylight-marine.com",
  },
  {
    id: "zhuhai",
    name: "珠海办事处",
    address: "广东省珠海市香洲区XXX路XXX号",
    phone: "+86 756-XXXX-XXXX",
    email: "zhuhai@holylight-marine.com",
  },
  {
    id: "dalian",
    name: "大连办事处",
    address: "辽宁省大连市中山区XXX路XXX号",
    phone: "+86 411-XXXX-XXXX",
    email: "dalian@holylight-marine.com",
  },
  {
    id: "qingdao",
    name: "青岛办事处",
    address: "山东省青岛市市南区XXX路XXX号",
    phone: "+86 532-XXXX-XXXX",
    email: "qingdao@holylight-marine.com",
  },
  {
    id: "suzhou",
    name: "苏州办事处",
    address: "江苏省苏州市工业园区XXX路XXX号",
    phone: "+86 512-XXXX-XXXX",
    email: "suzhou@holylight-marine.com",
  },
  {
    id: "hunan",
    name: "湖南办事处",
    address: "湖南省长沙市岳麓区XXX路XXX号",
    phone: "+86 731-XXXX-XXXX",
    email: "hunan@holylight-marine.com",
  },
];

export default function Contact() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 监听滚动显示返回顶部按钮
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* 页面标题横幅 */}
      <section className="relative h-[300px] md:h-[400px] mt-[120px] md:mt-[130px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=600&fit=crop"
            alt="联系我们"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              联系我们
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Contact Us
            </p>
          </div>
        </div>
      </section>

      {/* 营业时间横幅 */}
      <section className="py-6 bg-blue-50">
        <div className="container">
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-semibold">营业时间：</span>
            <span>周一至周五 上午 9:00-12:00，下午 14:00-18:00</span>
          </div>
        </div>
      </section>

      {/* 办事处信息 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              我们的办事处
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              在全国主要港口城市设有办事处，为您提供便捷的本地化服务
            </p>
          </div>

          {/* 办事处卡片网格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {offices.map((office) => (
              <div
                key={office.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* 办事处名称头部 */}
                <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4">
                  <h3 className="text-xl font-bold">{office.name}</h3>
                </div>
                
                {/* 办事处详细信息 */}
                <div className="p-6 space-y-4">
                  {/* 地址 */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-medium">地址</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{office.address}</p>
                    </div>
                  </div>

                  {/* 电话 */}
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-medium">电话</p>
                      <a
                        href={`tel:${office.phone}`}
                        className="text-sm text-gray-700 hover:text-primary transition-colors font-medium"
                      >
                        {office.phone}
                      </a>
                    </div>
                  </div>

                  {/* 邮箱 */}
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-1 font-medium">邮箱</p>
                      <a
                        href={`mailto:${office.email}`}
                        className="text-sm text-gray-700 hover:text-primary transition-colors break-all"
                      >
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 地图部分 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              办事处分布
            </h2>
            <p className="text-gray-600">我们的服务网络覆盖全国主要港口城市</p>
          </div>

          {/* 高德地图容器 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div
              id="amap-container"
              className="w-full h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center"
            >
              <div className="text-center text-gray-500 px-4">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-lg font-medium mb-2">地图加载中...</p>
                <p className="text-sm mb-4">
                  如需集成高德地图，请配置高德地图 API Key
                </p>
                <a
                  href="https://lbs.amap.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  获取高德地图 API Key
                </a>
              </div>
            </div>
          </div>

          {/* 地图集成说明 */}
          <div className="mt-6 p-4 md:p-6 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">地图集成说明：</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>
                访问{" "}
                <a
                  href="https://lbs.amap.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  高德开放平台
                </a>{" "}
                注册账号（个人开发者免费）
              </li>
              <li>创建应用并获取 Web 端（JS API）的 Key</li>
              <li>在网站代码中配置 API Key 即可显示地图</li>
              <li>地图将自动显示所有办事处位置标记</li>
            </ol>
            <p className="mt-3 text-xs text-gray-600">
              💡 提示：高德地图个人开发者账号每天有 30 万次免费调用额度，足够中小型网站使用
            </p>
          </div>
        </div>
      </section>

      {/* 在线留言表单 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* 左侧：表单 */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  在线留言
                </h2>
                <p className="text-gray-600 mb-8">
                  填写下方表单，我们将尽快与您联系
                </p>
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="请输入您的姓名" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      公司名称
                    </label>
                    <Input placeholder="请输入您的公司名称" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      联系电话 <span className="text-red-500">*</span>
                    </label>
                    <Input placeholder="请输入您的联系电话" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      电子邮箱 <span className="text-red-500">*</span>
                    </label>
                    <Input type="email" placeholder="请输入您的电子邮箱" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      留言内容 <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      placeholder="请输入您的留言内容..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    提交留言
                  </Button>
                </form>
              </div>

              {/* 右侧：联系信息 */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  联系方式
                </h2>
                <p className="text-gray-600 mb-8">
                  欢迎通过以下方式与我们取得联系
                </p>

                <div className="space-y-6">
                  {/* 总部信息卡片 */}
                  <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-lg text-white">
                    <h3 className="text-xl font-bold mb-4">深圳总部</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>广东省深圳市南山区XXX路XXX号XXX大厦XXX室</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <p>+86 755-XXXX-XXXX</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <p>info@holylight-marine.com</p>
                      </div>
                    </div>
                  </div>

                  {/* 营业时间卡片 */}
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      营业时间
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">周一至周五</span>
                        <span>9:00-12:00, 14:00-18:00</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span className="font-medium">周末及法定节假日</span>
                        <span>休息</span>
                      </div>
                    </div>
                  </div>

                  {/* 服务承诺 */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">
                      服务承诺
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>24小时内响应客户咨询</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>专业团队提供技术支持</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>全国办事处本地化服务</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* 返回顶部按钮 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-40"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

