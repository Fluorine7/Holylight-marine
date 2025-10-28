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
  // 分类数据
  const categoriesData = {
    "水泵": {
      "Rule": ["舱底泵", "淋浴排水系统"],
      "Jabsco": ["排污泵", "压力供水系统", "冲洗泵", "淡水泵"],
      "Flojet": ["压力供水系统"],
      "CEM": ["电动泵", "驳船电动泵", "发动机驱动泵", "液压马达泵", "水压系统", "电子水压系统", "电动泵配件", "数字流量计", "手动泵", "循环泵", "12-24V直流电动泵"]
    },
    "通风系统": {
      "Rule": ["轴流式风机"],
      "Jabsco": ["蜗牛式风机"],
      "CEM": ["轴流风机", "风机配件"],
      "RULE": ["轴流式风机"]
    },
    "锚机": {
      "Italwinch": ["立式锚机", "卧式锚机", "绞盘"]
    },
    "舵机": {
      "Multiflex": ["挂机"],
      "LS": ["船内机方向控制"],
      "Dometic": ["船外机方向控制"],
      "主机遥控": ["NHK MEC", "机械遥控", "电动遥控"]
    },
    "电池开关": {
      "Blusea": []
    },
    "雨刮器": {
      "摆臂式": [],
      "Roca": ["摆臂式"],
      "Speich": [],
      "Decca": [],
      "roca": ["Exalto"],
      "平移式": ["Decca"]
    },
    "喇叭": {
      "Marco": []
    },
    "液位计": {
      "KUS": ["仪表", "传感器"]
    },
    "尾轴密封": {
      "PYI": []
    },
    "碰球": {
      "Polyform 挪威": []
    },
    "锌块": {
      "Martyr": ["轴锌块", "压浪板锌块", "舵锌块", "船体锌块"]
    },
    "磁罗经": {
      "Ritchie": []
    },
    "马桶": {
      "Jabsco": ["电动马桶", "手动马桶"],
      "TECMA": [],
      "Planus": []
    },
    "灭火器": {
      "Fireboy": []
    },
    "岸电插头插座": {
      "Marinco": []
    },
    "污水处理装置": {
      "TECNICOMAR": [],
      "海水淡化装置": [],
      "Aquaprime": [],
      "油水分离器": [],
      "Griffin": []
    },
    "冰箱": {
      "Dometic": []
    },
    "充电器": {
      "Victron": []
    },
    "逆变器": {}
  };

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

