import { eq, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  banners, 
  Banner, 
  InsertBanner,
  productCategories,
  ProductCategory,
  InsertProductCategory,
  products,
  Product,
  InsertProduct,
  partners,
  Partner,
  InsertPartner,
  news,
  News,
  InsertNews,
  companyInfo,
  CompanyInfo,
  InsertCompanyInfo
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== 轮播图相关操作 ==========

export async function getAllBanners(): Promise<Banner[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(banners).orderBy(banners.order);
  return result;
}

export async function getActiveBanners(): Promise<Banner[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(banners)
    .where(eq(banners.isActive, true))
    .orderBy(banners.order);
  return result;
}

export async function createBanner(banner: InsertBanner): Promise<Banner> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(banners).values(banner);
  const id = Number(result[0].insertId);
  const created = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
  return created[0];
}

export async function updateBanner(id: number, data: Partial<InsertBanner>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(banners).set(data).where(eq(banners.id, id));
}

export async function deleteBanner(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(banners).where(eq(banners.id, id));
}

// ========== 产品类别相关操作 ==========

export async function getAllProductCategories(): Promise<ProductCategory[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(productCategories).orderBy(productCategories.order);
  return result;
}

export async function getActiveProductCategories(): Promise<ProductCategory[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(productCategories)
    .where(eq(productCategories.isActive, true))
    .orderBy(productCategories.order);
  return result;
}

export async function createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(productCategories).values(category);
  const id = Number(result[0].insertId);
  const created = await db.select().from(productCategories).where(eq(productCategories.id, id)).limit(1);
  return created[0];
}

export async function updateProductCategory(id: number, data: Partial<InsertProductCategory>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(productCategories).set(data).where(eq(productCategories.id, id));
}

export async function getProductCategoryById(id: number): Promise<ProductCategory | null> {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(productCategories).where(eq(productCategories.id, id)).limit(1);
  return result[0] || null;
}

export async function deleteProductCategory(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(productCategories).where(eq(productCategories.id, id));
}

// ========== 合作伙伴相关操作 ==========

export async function getAllPartners(): Promise<Partner[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(partners).orderBy(partners.order);
  return result;
}

export async function getActivePartners(): Promise<Partner[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(partners)
    .where(eq(partners.isActive, true))
    .orderBy(partners.order);
  return result;
}

export async function createPartner(partner: InsertPartner): Promise<Partner> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(partners).values(partner);
  const id = Number(result[0].insertId);
  const created = await db.select().from(partners).where(eq(partners.id, id)).limit(1);
  return created[0];
}

export async function updatePartner(id: number, data: Partial<InsertPartner>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(partners).set(data).where(eq(partners.id, id));
}

export async function deletePartner(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(partners).where(eq(partners.id, id));
}

// ========== 新闻资讯相关操作 ==========

export async function getAllNews(): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(news).orderBy(news.publishDate);
  return result;
}

export async function getActiveNews(): Promise<News[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(news)
    .where(eq(news.isPublished, true))
    .orderBy(news.publishDate);
  return result;
}

export async function createNews(newsItem: InsertNews): Promise<News> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(news).values(newsItem);
  const id = Number(result[0].insertId);
  const created = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return created[0];
}

export async function updateNews(id: number, data: Partial<InsertNews>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(news).set(data).where(eq(news.id, id));
}

export async function deleteNews(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(news).where(eq(news.id, id));
}

// ========== 公司信息相关操作 ==========

export async function getCompanyInfo(section: string): Promise<CompanyInfo | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(companyInfo).where(eq(companyInfo.section, section)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCompanyInfo(info: InsertCompanyInfo): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(companyInfo).values(info).onDuplicateKeyUpdate({
    set: {
      title: info.title,
      content: info.content,
      imageUrl: info.imageUrl,
    },
  });
}


// ========== 产品相关操作 ==========

export async function getAllProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(products).orderBy(products.order);
  return result;
}

export async function getPublishedProducts(): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(products)
    .where(eq(products.isPublished, true))
    .orderBy(products.order);
  return result;
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(products)
    .where(eq(products.categoryId, categoryId))
    .orderBy(products.order);
  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct): Promise<Product> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(products).values(product);
  const id = Number(result[0].insertId);
  const created = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return created[0];
}

export async function updateProduct(id: number, data: Partial<InsertProduct>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(products).where(eq(products.id, id));
}

// 获取分类及其子分类
export async function getCategoryWithChildren(parentId: number | null = null): Promise<ProductCategory[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (parentId === null) {
    // 获取顶级分类
    const result = await db.select().from(productCategories)
      .where(isNull(productCategories.parentId))
      .orderBy(productCategories.order);
    return result;
  } else {
    // 获取指定父分类的子分类
    const result = await db.select().from(productCategories)
      .where(eq(productCategories.parentId, parentId))
      .orderBy(productCategories.order);
    return result;
  }
}

// 获取分类的完整路径（面包屑导航用）
export async function getCategoryPath(categoryId: number): Promise<ProductCategory[]> {
  const db = await getDb();
  if (!db) return [];
  
  const path: ProductCategory[] = [];
  let currentId: number | null = categoryId;
  
  while (currentId !== null) {
    const category = await db.select().from(productCategories)
      .where(eq(productCategories.id, currentId))
      .limit(1);
    
    if (category.length === 0) break;
    
    path.unshift(category[0]);
    currentId = category[0].parentId;
  }
  
  return path;
}

