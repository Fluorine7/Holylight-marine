import { useState, useEffect } from "react";
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
  coordinates: [number, number]; // [经度, 纬度]
}

// 办事处数据（包含真实坐标用于地图标记）
const offices: Office[] = [
  {
    id: "shenzhen",
    name: "深圳总部",
    address: "广东省深圳市南山区科技园南区",
    phone: "+86 755-8888-8888",
    email: "shenzhen@holylight-marine.com",
    coordinates: [113.9428, 22.5329], // 深圳南山区
  },
  {
    id: "zhuhai",
    name: "珠海办事处",
    address: "广东省珠海市香洲区吉大路",
    phone: "+86 756-8888-8888",
    email: "zhuhai@holylight-marine.com",
    coordinates: [113.5765, 22.2569], // 珠海香洲区
  },
  {
    id: "dalian",
    name: "大连办事处",
    address: "辽宁省大连市中山区人民路",
    phone: "+86 411-8888-8888",
    email: "dalian@holylight-marine.com",
    coordinates: [121.6147, 38.9140], // 大连中山区
  },
  {
    id: "qingdao",
    name: "青岛办事处",
    address: "山东省青岛市市南区香港中路",
    phone: "+86 532-8888-8888",
    email: "qingdao@holylight-marine.com",
    coordinates: [120.3826, 36.0671], // 青岛市南区
  },
  {
    id: "suzhou",
    name: "苏州办事处",
    address: "江苏省苏州市工业园区星湖街",
    phone: "+86 512-8888-8888",
    email: "suzhou@holylight-marine.com",
    coordinates: [120.7370, 31.3041], // 苏州工业园区
  },
  {
    id: "hunan",
    name: "湖南办事处",
    address: "湖南省长沙市岳麓区麓山南路",
    phone: "+86 731-8888-8888",
    email: "hunan@holylight-marine.com",
    coordinates: [112.9388, 28.2282], // 长沙岳麓区
  },
];

// 声明全局AMap类型
declare global {
  interface Window {
    AMap: any;
    _AMapSecurityConfig: any;
  }
}

export default function Contact() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 监听滚动显示返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 加载高德地图
  useEffect(() => {
    // 高德地图API Key（请替换为您自己的Key）
    const AMAP_KEY = "YOUR_AMAP_KEY_HERE";
    const AMAP_SECRET = "YOUR_AMAP_SECRET_HERE";

    // 如果没有配置Key，显示提示信息
    if (AMAP_KEY === "YOUR_AMAP_KEY_HERE") {
      console.log("请配置高德地图API Key");
      return;
    }

    // 设置安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: AMAP_SECRET,
    };

    // 动态加载高德地图JS API
    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
    script.async = true;
    script.onload = () => {
      initMap();
    };
    document.head.appendChild(script);

    return () => {
      // 清理脚本
      const existingScript = document.querySelector(
        `script[src^="https://webapi.amap.com/maps"]`
      );
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 初始化地图
  const initMap = () => {
    if (!window.AMap) return;

    // 创建地图实例
    const map = new window.AMap.Map("amap-container", {
      zoom: 5, // 初始缩放级别，显示全国范围
      center: [113.2644, 28.1925], // 地图中心点（中国中部）
      viewMode: "3D", // 3D视图
      pitch: 0, // 俯仰角度
    });

    // 添加标记点
    offices.forEach((office) => {
      // 创建标记
      const marker = new window.AMap.Marker({
        position: office.coordinates,
        title: office.name,
        label: {
          content: `<div style="background: white; padding: 4px 8px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 12px; font-weight: bold; color: #0096D6;">${office.name}</div>`,
          direction: "top",
        },
      });

      // 创建信息窗体内容
      const infoWindow = new window.AMap.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 250px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #0096D6;">${office.name}</h3>
            <div style="margin-bottom: 8px; display: flex; align-items: start; gap: 8px;">
              <svg style="width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; color: #0096D6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span style="font-size: 13px; line-height: 1.5;">${office.address}</span>
            </div>
            <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
              <svg style="width: 16px; height: 16px; flex-shrink: 0; color: #0096D6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <a href="tel:${office.phone}" style="font-size: 13px; color: #333; text-decoration: none;">${office.phone}</a>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <svg style="width: 16px; height: 16px; flex-shrink: 0; color: #0096D6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <a href="mailto:${office.email}" style="font-size: 13px; color: #333; text-decoration: none;">${office.email}</a>
            </div>
          </div>
        `,
        offset: new window.AMap.Pixel(0, -30),
      });

      // 点击标记显示信息窗体
      marker.on("click", () => {
        infoWindow.open(map, marker.getPosition());
      });

      // 添加标记到地图
      map.add(marker);
    });

    setMapLoaded(true);
  };

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

      {/* 公司简介和营业时间 */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* 公司简介 */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                深圳市好利来贸易有限公司
              </h2>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                专业从事船舶配套、游艇、商业船、房车等领域的贸易公司，致力于为客户提供高质量的产品和专业的服务。
                在全国主要港口城市设有办事处，为您提供便捷的本地化服务。
              </p>
            </div>

            {/* 营业时间 */}
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
              <div className="flex items-center justify-center gap-3 text-gray-800">
                <Clock className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="text-center md:text-left">
                  <span className="font-bold text-lg block md:inline">营业时间：</span>
                  <span className="text-base block md:inline md:ml-2">
                    周一至周五 上午 9:00-12:00，下午 14:00-18:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 办事处信息 */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                我们的办事处
              </h2>
              <div className="text-lg text-gray-600">Our Offices</div>
            </div>

            {/* 办事处卡片网格 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offices.map((office) => (
                <div
                  key={office.id}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* 办事处名称头部 */}
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-5">
                    <h3 className="text-xl font-bold">{office.name}</h3>
                  </div>
                  
                  {/* 办事处详细信息 */}
                  <div className="p-6 space-y-4">
                    {/* 地址 */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">地址</p>
                        <p className="text-sm text-gray-800 leading-relaxed">{office.address}</p>
                      </div>
                    </div>

                    {/* 电话 */}
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">电话</p>
                        <a
                          href={`tel:${office.phone}`}
                          className="text-sm text-gray-800 hover:text-primary transition-colors font-medium"
                        >
                          {office.phone}
                        </a>
                      </div>
                    </div>

                    {/* 邮箱 */}
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wide">邮箱</p>
                        <a
                          href={`mailto:${office.email}`}
                          className="text-sm text-gray-800 hover:text-primary transition-colors break-all"
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
        </div>
      </section>

      {/* 地图部分 */}
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                办事处分布
              </h2>
              <p className="text-gray-600 text-lg">我们的服务网络覆盖全国主要港口城市</p>
            </div>

            {/* 高德地图容器 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div
                id="amap-container"
                className="w-full h-[450px] md:h-[550px] bg-gray-100 flex items-center justify-center"
              >
                {!mapLoaded && (
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
                )}
              </div>
            </div>

            {/* 地图集成说明 */}
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                地图集成说明
              </h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 leading-relaxed">
                <li>
                  访问{" "}
                  <a
                    href="https://lbs.amap.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    高德开放平台
                  </a>{" "}
                  注册账号（个人开发者免费）
                </li>
                <li>创建应用并获取 <strong>Web 端（JS API 2.0）</strong>的 Key 和安全密钥</li>
                <li>在 <code className="bg-gray-200 px-2 py-1 rounded text-xs">Contact.tsx</code> 文件中替换 <code className="bg-gray-200 px-2 py-1 rounded text-xs">AMAP_KEY</code> 和 <code className="bg-gray-200 px-2 py-1 rounded text-xs">AMAP_SECRET</code></li>
                <li>刷新页面即可看到地图和所有办事处位置标记</li>
              </ol>
              <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                <p className="text-xs text-gray-600 flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>
                    <strong>提示：</strong>高德地图个人开发者账号每天有 <strong>30万次</strong> 免费调用额度，足够中小型网站使用。
                    点击地图标记可查看办事处详细信息。
                  </span>
                </p>
              </div>
            </div>
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
                  {/* 总部联系方式 */}
                  <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-lg p-6 border border-primary/20">
                    <h3 className="font-bold text-lg mb-4 text-primary">深圳总部</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-700">
                          广东省深圳市南山区科技园南区
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                        <a
                          href="tel:+8675588888888"
                          className="text-sm text-gray-700 hover:text-primary transition-colors"
                        >
                          +86 755-8888-8888
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                        <a
                          href="mailto:info@holylight-marine.com"
                          className="text-sm text-gray-700 hover:text-primary transition-colors"
                        >
                          info@holylight-marine.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 其他信息 */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-lg mb-4 text-gray-900">服务承诺</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>24小时内响应客户咨询</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>专业技术团队支持</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>全国办事处本地化服务</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>优质产品质量保证</span>
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
          aria-label="返回顶部"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

