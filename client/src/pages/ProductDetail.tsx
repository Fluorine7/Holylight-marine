import { useState } from "react";
import { useRoute } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "../lib/trpc";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "wouter";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id ? parseInt(params.id) : 0;

  const { data: product, isLoading } = trpc.products.getById.useQuery({ id: productId });
  const { data: category } = trpc.productCategories.getById.useQuery(
    { id: product?.categoryId || 0 },
    { enabled: !!product?.categoryId }
  );
  const { data: relatedProducts } = trpc.products.listAll.useQuery();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-20 text-center">
          <p className="text-gray-500">加载中...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-20 mt-20 text-center">
          <p className="text-gray-500">产品不存在</p>
          <Link href="/shop" className="text-primary hover:underline mt-4 inline-block">
            返回商店
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const specifications = product.specifications
    ? JSON.parse(product.specifications)
    : {};

  const related = relatedProducts
    ?.filter(
      (p) =>
        p.id !== product.id &&
        p.categoryId === product.categoryId &&
        p.isPublished
    )
    .slice(0, 4);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-20">
        {/* 面包屑导航 */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary">
            首页
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary">
            商店
          </Link>
          {category && (
            <>
              <span>/</span>
              <span className="text-gray-900">{category.name}</span>
            </>
          )}
        </nav>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 左侧：图片展示 */}
            <div>
              {images.length > 0 ? (
                <div>
                  {/* 主图 */}
                  <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* 缩略图 */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? "border-primary"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">暂无图片</span>
                </div>
              )}
            </div>

            {/* 右侧：产品信息 */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {product.model && (
                <div className="mb-4">
                  <span className="text-gray-600">型号：</span>
                  <span className="font-medium">{product.model}</span>
                </div>
              )}

              {category && (
                <div className="mb-4">
                  <span className="text-gray-600">分类：</span>
                  <Link
                    href="/shop"
                    className="text-primary hover:underline font-medium"
                  >
                    {category.name}
                  </Link>
                </div>
              )}

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">产品描述</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              )}

              {/* 产品规格表 */}
              {Object.keys(specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">产品规格</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        {Object.entries(specifications).map(([key, value], index) => (
                          <tr
                            key={key}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-3 font-medium text-gray-700 w-1/3">
                              {key}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 联系按钮 */}
              <div className="flex gap-4">
                <Link
                  href="/contact"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
                >
                  联系我们
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 相关产品 */}
        {related && related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">相关产品</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((relatedProduct) => {
                const relatedImages = relatedProduct.images
                  ? JSON.parse(relatedProduct.images)
                  : [];
                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.id}`}
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                      <div className="aspect-square bg-gray-100">
                        {relatedImages[0] && (
                          <img
                            src={relatedImages[0]}
                            alt={relatedProduct.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        {relatedProduct.model && (
                          <p className="text-sm text-gray-600 mt-1">
                            {relatedProduct.model}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

