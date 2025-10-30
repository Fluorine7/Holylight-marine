/**
 * 品牌数据迁移脚本
 * 
 * 功能：
 * 1. 将分类中的品牌迁移到brands表
 * 2. 删除品牌相关的分类
 * 3. 确保"无品牌"记录存在
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// 需要迁移的品牌分类ID列表（从之前的查询结果中获取）
const brandCategoryIds = [
  1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37
];

async function migrateBrands() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  
  try {
    console.log('🚀 开始品牌数据迁移...\n');
    
    // 1. 确保"无品牌"记录存在
    console.log('1️⃣ 检查"无品牌"记录...');
    const [noBrandRows] = await pool.execute(
      'SELECT id FROM brands WHERE name = ?',
      ['无品牌']
    );
    
    if (noBrandRows.length === 0) {
      await pool.execute(
        'INSERT INTO brands (name, slug, `order`, isActive) VALUES (?, ?, ?, ?)',
        ['无品牌', 'no-brand', 999, true]
      );
      console.log('   ✅ 已创建"无品牌"记录\n');
    } else {
      console.log('   ✅ "无品牌"记录已存在\n');
    }
    
    // 2. 获取所有品牌分类
    console.log('2️⃣ 获取品牌分类...');
    const [categories] = await pool.execute(
      `SELECT id, name FROM productCategories WHERE id IN (${brandCategoryIds.join(',')})`
    );
    console.log(`   找到 ${categories.length} 个品牌分类\n`);
    
    // 3. 迁移品牌到brands表
    console.log('3️⃣ 迁移品牌到brands表...');
    let migratedCount = 0;
    
    for (const category of categories) {
      // 检查品牌是否已存在
      const [existingBrand] = await pool.execute(
        'SELECT id FROM brands WHERE name = ?',
        [category.name]
      );
      
      if (existingBrand.length === 0) {
        // 生成slug
        const slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        await pool.execute(
          'INSERT INTO brands (name, slug, `order`, isActive) VALUES (?, ?, ?, ?)',
          [category.name, slug, migratedCount, true]
        );
        
        console.log(`   ✅ 已迁移: ${category.name}`);
        migratedCount++;
      } else {
        console.log(`   ⏭️  已存在: ${category.name}`);
      }
    }
    console.log(`\n   共迁移 ${migratedCount} 个品牌\n`);
    
    // 4. 删除品牌分类
    console.log('4️⃣ 删除品牌分类...');
    const [deleteResult] = await pool.execute(
      `DELETE FROM productCategories WHERE id IN (${brandCategoryIds.join(',')})`
    );
    console.log(`   ✅ 已删除 ${deleteResult.affectedRows} 个品牌分类\n`);
    
    // 5. 显示最终统计
    console.log('5️⃣ 最终统计:');
    const [brandCount] = await pool.execute('SELECT COUNT(*) as count FROM brands');
    const [categoryCount] = await pool.execute('SELECT COUNT(*) as count FROM productCategories');
    console.log(`   - 品牌总数: ${brandCount[0].count}`);
    console.log(`   - 分类总数: ${categoryCount[0].count}`);
    
    console.log('\n✅ 品牌数据迁移完成！');
    
  } catch (error) {
    console.error('\n❌ 迁移失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 执行迁移
migrateBrands().catch(console.error);

