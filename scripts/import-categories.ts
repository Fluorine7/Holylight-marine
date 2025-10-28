import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { productCategories } from "../drizzle/schema";
import * as fs from "fs";
import * as path from "path";

// 生成slug(URL友好的标识符)
const slugCounter = new Map<string, number>();

function generateSlug(name: string, parentSlug?: string): string {
  // 移除特殊字符,转换为小写
  let slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
  
  if (parentSlug) {
    slug = `${parentSlug}-${slug}`;
  }
  
  // 如果 slug 已经存在,添加计数器
  if (slugCounter.has(slug)) {
    const count = slugCounter.get(slug)! + 1;
    slugCounter.set(slug, count);
    slug = `${slug}-${count}`;
  } else {
    slugCounter.set(slug, 0);
  }
  
  return slug;
}

async function main() {
  // 读取分类数据
  const categoriesData = JSON.parse(
    fs.readFileSync("/tmp/categories_structured.json", "utf-8")
  );

  // 连接数据库 - 使用DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL 环境变量未设置");
  }
  
  // 解析 DATABASE_URL: mysql://user:password@host:port/database?params
  const urlMatch = databaseUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!urlMatch) {
    throw new Error("DATABASE_URL 格式错误");
  }
  
  const [, user, password, host, port, database] = urlMatch;
  
  console.log(`正在连接数据库: ${host}:${port}/${database}`);
  
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  });

  const db = drizzle(connection);

  console.log("开始导入产品分类...\n");

  let level1Order = 0;

  // 遍历一级分类
  for (const [level1Name, level2Data] of Object.entries(categoriesData)) {
    level1Order++;
    
    console.log(`\n[一级分类] ${level1Name}`);

    // 插入一级分类
    const [level1Result] = await db.insert(productCategories).values({
      name: level1Name,
      slug: generateSlug(level1Name),
      parentId: null,
      order: level1Order,
      isActive: true,
    });

    const level1Id = Number(level1Result.insertId);
    console.log(`  ✓ 已创建 (ID: ${level1Id})`);

    let level2Order = 0;

    // 遍历二级分类
    for (const [level2Name, level3Array] of Object.entries(
      level2Data as Record<string, string[]>
    )) {
      level2Order++;
      
      console.log(`  [二级分类] ${level2Name}`);

      // 插入二级分类
      const [level2Result] = await db.insert(productCategories).values({
        name: level2Name,
        slug: generateSlug(level2Name, generateSlug(level1Name)),
        parentId: level1Id,
        order: level2Order,
        isActive: true,
      });

      const level2Id = Number(level2Result.insertId);
      console.log(`    ✓ 已创建 (ID: ${level2Id})`);

      // 遍历三级分类
      if (level3Array && level3Array.length > 0) {
        let level3Order = 0;
        
        for (const level3Name of level3Array) {
          level3Order++;
          
          console.log(`    [三级分类] ${level3Name}`);

          // 插入三级分类
          const [level3Result] = await db.insert(productCategories).values({
            name: level3Name,
            slug: generateSlug(
              level3Name,
              generateSlug(level2Name, generateSlug(level1Name))
            ),
            parentId: level2Id,
            order: level3Order,
            isActive: true,
          });

          const level3Id = Number(level3Result.insertId);
          console.log(`      ✓ 已创建 (ID: ${level3Id})`);
        }
      }
    }
  }

  await connection.end();
  
  console.log("\n✅ 所有分类导入完成!");
}

main().catch((error) => {
  console.error("导入失败:", error);
  process.exit(1);
});

