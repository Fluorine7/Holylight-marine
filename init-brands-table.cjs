/**
 * 初始化brands表和products.brandId字段
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function initBrandsTable() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  
  try {
    console.log('🚀 开始初始化brands表...\n');
    
    // 1. 创建brands表
    console.log('1️⃣ 创建brands表...');
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS brands (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) NOT NULL UNIQUE,
        logoUrl TEXT,
        website VARCHAR(500),
        \`order\` INT DEFAULT 0,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_order (\`order\`),
        INDEX idx_isActive (isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('   ✅ brands表创建成功\n');
    
    // 2. 检查products表是否已有brandId字段
    console.log('2️⃣ 检查products表的brandId字段...');
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'products' 
        AND COLUMN_NAME = 'brandId'
    `);
    
    if (columns.length === 0) {
      console.log('   添加brandId字段到products表...');
      await pool.execute(`
        ALTER TABLE products 
        ADD COLUMN brandId INT DEFAULT NULL AFTER categoryId,
        ADD INDEX idx_brandId (brandId)
      `);
      console.log('   ✅ brandId字段添加成功\n');
    } else {
      console.log('   ✅ brandId字段已存在\n');
    }
    
    // 3. 添加"不便分类的产品"一级分类
    console.log('3️⃣ 添加"不便分类的产品"一级分类...');
    const [uncategorized] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['不便分类的产品']
    );
    
    if (uncategorized.length === 0) {
      await pool.execute(`
        INSERT INTO productCategories (name, slug, parentId, \`order\`, isActive)
        VALUES (?, ?, NULL, 999, TRUE)
      `, ['不便分类的产品', 'uncategorized']);
      console.log('   ✅ 已添加"不便分类的产品"分类\n');
    } else {
      console.log('   ✅ "不便分类的产品"分类已存在\n');
    }
    
    console.log('✅ 数据库初始化完成！');
    console.log('\n现在可以运行: node migrate-brands.cjs');
    
  } catch (error) {
    console.error('\n❌ 初始化失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 执行初始化
initBrandsTable().catch(console.error);

