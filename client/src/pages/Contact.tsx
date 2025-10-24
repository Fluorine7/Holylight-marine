import { useState } from "react";
import { ArrowUp, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  // 联系方式
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "公司地址",
      content: "广东省深圳市南山区",
      detail: "（具体地址请联系我们获取）",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "联系电话",
      content: "400-XXX-XXXX",
      detail: "手机：138-XXXX-XXXX",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "电子邮箱",
      content: "info@holylight.com",
      detail: "sales@holylight.com",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "工作时间",
      content: "周一至周五 9:00-18:00",
      detail: "周六 9:00-12:00",
    },
  ];

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

      {/* 联系信息 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              我们期待与您交流
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              无论您有任何问题、建议或合作意向，欢迎随时与我们联系。
              我们的专业团队将竭诚为您服务，为您提供最优质的产品和解决方案。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto text-primary">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-800">
                  {info.title}
                </h3>
                <p className="text-gray-700 font-medium mb-1">
                  {info.content}
                </p>
                <p className="text-sm text-gray-500">
                  {info.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 在线留言表单 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
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
                      姓名 *
                    </label>
                    <Input placeholder="请输入您的姓名" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      公司名称
                    </label>
                    <Input placeholder="请输入您的公司名称" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      联系电话 *
                    </label>
                    <Input placeholder="请输入您的联系电话" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      电子邮箱 *
                    </label>
                    <Input type="email" placeholder="请输入您的电子邮箱" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      留言内容 *
                    </label>
                    <Textarea
                      placeholder="请输入您的留言内容..."
                      rows={6}
                    />
                  </div>
                  <Button size="lg" className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    提交留言
                  </Button>
                </form>
              </div>

              {/* 右侧：地图和其他信息 */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  公司位置
                </h2>
                <p className="text-gray-600 mb-8">
                  欢迎莅临我们的办公室参观交流
                </p>
                
                {/* 地图占位 */}
                <div className="bg-gray-200 rounded-lg h-[300px] mb-8 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>地图位置</p>
                    <p className="text-sm">（可接入百度地图或高德地图）</p>
                  </div>
                </div>

                {/* 交通指引 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    交通指引
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">地铁：</p>
                      <p>地铁X号线XX站，X出口步行约X分钟</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">公交：</p>
                      <p>乘坐XXX路公交车至XX站下车</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">自驾：</p>
                      <p>导航搜索"深圳市好利来贸易有限公司"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 合作咨询 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
              合作咨询
            </h2>
            <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
              Business Cooperation
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-lg text-white text-center">
                <h3 className="text-xl font-bold mb-3">产品代理</h3>
                <p className="text-sm opacity-90 mb-4">
                  寻求优质的产品代理合作伙伴
                </p>
                <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-white">
                  了解详情
                </Button>
              </div>
              <div className="bg-gradient-to-br from-accent to-accent/80 p-8 rounded-lg text-white text-center">
                <h3 className="text-xl font-bold mb-3">技术合作</h3>
                <p className="text-sm opacity-90 mb-4">
                  开展技术研发和产品创新合作
                </p>
                <Button variant="outline" className="bg-white text-accent hover:bg-gray-100 border-white">
                  了解详情
                </Button>
              </div>
              <div className="bg-gradient-to-br from-gray-700 to-gray-600 p-8 rounded-lg text-white text-center">
                <h3 className="text-xl font-bold mb-3">项目合作</h3>
                <p className="text-sm opacity-90 mb-4">
                  共同开拓市场，实现互利共赢
                </p>
                <Button variant="outline" className="bg-white text-gray-700 hover:bg-gray-100 border-white">
                  了解详情
                </Button>
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

