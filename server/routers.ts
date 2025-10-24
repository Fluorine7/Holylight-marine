import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// 管理员权限检查中间件
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 轮播图管理
  banners: router({
    list: publicProcedure.query(() => db.getActiveBanners()),
    listAll: adminProcedure.query(() => db.getAllBanners()),
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        imageUrl: z.string(),
        link: z.string().optional(),
        order: z.number().default(0),
      }))
      .mutation(({ input }) => db.createBanner(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        imageUrl: z.string().optional(),
        link: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateBanner(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteBanner(input.id)),
  }),

  // 产品类别管理
  productCategories: router({
    list: publicProcedure.query(() => db.getActiveProductCategories()),
    listAll: adminProcedure.query(() => db.getAllProductCategories()),
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        parentId: z.number().optional(),
        order: z.number().default(0),
      }))
      .mutation(({ input }) => db.createProductCategory(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateProductCategory(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteProductCategory(input.id)),
  }),

  // 合作伙伴管理
  partners: router({
    list: publicProcedure.query(() => db.getActivePartners()),
    listAll: adminProcedure.query(() => db.getAllPartners()),
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        logoUrl: z.string(),
        website: z.string().optional(),
        order: z.number().default(0),
      }))
      .mutation(({ input }) => db.createPartner(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        logoUrl: z.string().optional(),
        website: z.string().optional(),
        order: z.number().optional(),
        isActive: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updatePartner(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deletePartner(input.id)),
  }),

  // 新闻资讯管理
  news: router({
    list: publicProcedure.query(() => db.getActiveNews()),
    listAll: adminProcedure.query(() => db.getAllNews()),
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        summary: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        category: z.string().optional(),
        publishDate: z.date().optional(),
      }))
      .mutation(({ input }) => db.createNews(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        summary: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        category: z.string().optional(),
        publishDate: z.date().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateNews(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteNews(input.id)),
  }),

  // 产品管理
  products: router({
    list: publicProcedure.query(() => db.getPublishedProducts()),
    listAll: adminProcedure.query(() => db.getAllProducts()),
    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number() }))
      .query(({ input }) => db.getProductsByCategory(input.categoryId)),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => db.getProductBySlug(input.slug)),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getProductById(input.id)),
    create: adminProcedure
      .input(z.object({
        categoryId: z.number(),
        name: z.string(),
        model: z.string().optional(),
        slug: z.string(),
        description: z.string().optional(),
        specifications: z.string().optional(),
        images: z.string().optional(),
        order: z.number().default(0),
      }))
      .mutation(({ input }) => db.createProduct(input)),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        name: z.string().optional(),
        model: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        specifications: z.string().optional(),
        images: z.string().optional(),
        order: z.number().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteProduct(input.id)),
  }),

  // 公司信息管理
  companyInfo: router({
    get: publicProcedure
      .input(z.object({ section: z.string() }))
      .query(({ input }) => db.getCompanyInfo(input.section)),
    upsert: adminProcedure
      .input(z.object({
        section: z.string(),
        title: z.string().optional(),
        content: z.string(),
        imageUrl: z.string().optional(),
      }))
      .mutation(({ input }) => db.upsertCompanyInfo(input)),
  }),
});

export type AppRouter = typeof appRouter;

