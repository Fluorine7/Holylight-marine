import { useState } from "react";
import { ArrowUp, Phone, Mail, MessageCircle, FileText, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Support() {
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

  // 支持服务类型
  const supportServices = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: "电话支持",
      description: "专业技术团队7×24小时电话支持",
      contact: "400-XXX-XXXX",
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: "邮件支持",
      description: "通过邮件获取技术支持和解决方案",
      contact: "support@holylight.com",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "在线咨询",
      description: "在线客服实时解答您的问题",
      contact: "在线客服",
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "现场服务",
      description: "专业工程师提供上门安装调试服务",
      contact: "预约服务",
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
            alt="技术支持"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        <div className="relative h-full flex items-center justify-center text-white">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              技术支持
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Technical Support
            </p>
          </div>
        </div>
      </section>

      {/* 支持服务 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              全方位的技术支持服务
            </h2>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              我们提供专业、及时、全面的技术支持服务，确保您的设备始终处于最佳运行状态。
              无论是产品咨询、技术问题还是售后服务，我们的专业团队都随时为您提供帮助。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportServices.map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto text-primary">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {service.description}
                </p>
                <div className="text-center">
                  <Button variant="outline" size="sm" className="text-primary">
                    {service.contact}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 技术资料下载 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            技术资料下载
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Technical Documentation
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {[
              { title: "产品手册", desc: "详细的产品规格和使用说明", size: "PDF, 5.2MB" },
              { title: "安装指南", desc: "专业的安装步骤和注意事项", size: "PDF, 3.8MB" },
              { title: "维护手册", desc: "日常维护和保养指导", size: "PDF, 2.5MB" },
              { title: "故障排除", desc: "常见故障诊断和解决方法", size: "PDF, 4.1MB" },
            ].map((doc, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex items-center gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded flex items-center justify-center text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 mb-1">{doc.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{doc.desc}</p>
                  <p className="text-xs text-gray-500">{doc.size}</p>
                </div>
                <Button variant="outline" size="sm">
                  下载
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 在线提交支持请求 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-center">
            提交支持请求
          </h2>
          <div className="text-lg md:text-xl text-gray-600 mb-12 text-center">
            Submit Support Request
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    姓名 *
                  </label>
                  <Input placeholder="请输入您的姓名" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    联系电话 *
                  </label>
                  <Input placeholder="请输入您的联系电话" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  电子邮箱 *
                </label>
                <Input type="email" placeholder="请输入您的电子邮箱" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  问题类型 *
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>产品咨询</option>
                  <option>技术支持</option>
                  <option>售后服务</option>
                  <option>其他问题</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  问题描述 *
                </label>
                <Textarea
                  placeholder="请详细描述您遇到的问题..."
                  rows={6}
                />
              </div>
              <div className="flex justify-center">
                <Button size="lg" className="px-12">
                  提交请求
                </Button>
              </div>
            </form>
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

