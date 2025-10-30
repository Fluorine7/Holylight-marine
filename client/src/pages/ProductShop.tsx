import { useState, useEffect, useMemo } from "react";
import { Search, Grid, List, ChevronDown, ChevronRight } from "lucide-react";
import { trpc } from "../lib/trpc";
import { Link } from "wouter";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Category {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
  order: number;
  isActive: boolean;
  children?: Category[];
}

export default function ProductShop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const { data: categories } = trpc.productCategories.listAll.useQuery();
  const { data: allProducts } = trpc.products.listAll.useQuery();

  // 构建分类树
  const categoryTree = useMemo(() => {
    if (!categories) return [];
    
    const tree: Category[] = [];
    const categoryMap = new Map<number, Category>();
    
    // 先创建所有分类的映射
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    
    // 构建树形结构
    categories.forEach((cat) => {
      const category = categoryMap.get(cat.id)!;
      if (cat.parentId === null) {
        tree.push(category);
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children!.push(category);
        }
      }
    });
    
    return tree;
  }, [categories]);

  // 过滤产品
  const filteredProducts = allProducts?.filter((product) => {
    if (!product.isPublished) return false;
    if (selectedCategory && product.categoryId !== selectedCategory) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 排序产品
  const sortedProducts = filteredProducts?.sort((a, b) => {
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 渲染分类树
  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map((category) => {
      const hasChildren = category.children && category.children.length > 0;
      const isExpanded = expandedCategories.includes(category.id);
      const isSelected = selectedCategory === category.id;
      
      return (
        <div key={category.id}>
          <button
            onClick={() => {
              setSelectedCategory(category.id);
              if (hasChildren) {
                toggleCategory(category.id);
              }
            }}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
              isSelected
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
            style={{ paddingLeft: `${(level + 1) * 1}rem` }}
          >
            <span className="text-sm">{category.name}</span>
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )
            )}
          </button>
          
          {hasChildren && isExpanded && (
            <div className="mt-1">
              {renderCategoryTree(category.children!, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-32">
        <div className="flex gap-6">
          {/* 左侧分类导航 */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">商品分类</h3>
              
              {/* 搜索框 */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* 分类列表 */}
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  全部分类
                </button>
                
                {renderCategoryTree(categoryTree)}
              </div>
            </div>
          </aside>

          {/* 右侧产品展示区 */}
          <main className="flex-1">
            {/* 工具栏 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
              <div className="text-gray-600">
                显示第 1-{sortedProducts?.length || 0} 项结果,共 {sortedProducts?.length || 0} 项
              </div>
              
              <div className="flex items-center gap-4">
                {/* 视图切换 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid" ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${
                      viewMode === "list" ? "bg-primary text-white" : "bg-gray-100"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                {/* 排序 */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="default">默认排序</option>
                  <option value="name-asc">名称 A-Z</option>
                  <option value="name-desc">名称 Z-A</option>
                </select>
              </div>
            </div>

            {/* 产品网格 */}
            {sortedProducts && sortedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">暂无产品</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// 产品卡片组件
function ProductCard({
  product,
  viewMode,
}: {
  product: any;
  viewMode: "grid" | "list";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const images = product.images ? JSON.parse(product.images) : [];
  const primaryImage = images[0] || "/placeholder.png";
  const hoverImage = images[1] || primaryImage;

  if (viewMode === "list") {
    return (
      <Link href={`/product/${product.id}`}>
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex gap-4">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-32 h-32 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            {product.model && (
              <p className="text-sm text-gray-600 mb-2">型号: {product.model}</p>
            )}
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden aspect-square">
          <img
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {images.length} 张图片
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.model && (
            <p className="text-sm text-gray-600">型号: {product.model}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

