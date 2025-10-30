/**
 * 修复品牌迁移错误
 * 1. 清空brands表（保留"无品牌"）
 * 2. 只迁移真正的品牌分类
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// 真正的品牌名称列表（从截图中识别出来的）
const realBrands = [
  'KUS', 'Rule', 'Jabsco', 'Flojet', 'CEM', 'RULE',
  'Italwinch', 'Multiflex', 'LS', 'Dometic',
  'Blusea', 'Roca', 'Speich', 'Decca', 'roca',
  'Marco', 'PYI', 'Polyform 挪威', 'Martyr',
  'Ritchie', 'TECMA', 'Planus', 'Fireboy',
  'Marinco', 'TECNICOMAR', 'Aquaprime', 'Griffin',
  'NHK MEC'
];

async function fixBrandMigration() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  
  try {
    console.log('🚀 开始修复品牌迁移错误...\n');
    
    // 1. 删除所有品牌（保留"无品牌"）
    console.log('1️⃣ 清空brands表（保留"无品牌"）...');
    await pool.execute('DELETE FROM brands WHERE name != ?', ['无品牌']);
    const [remaining] = await pool.execute('SELECT COUNT(*) as count FROM brands');
    console.log(`   ✅ 已清空，剩余 ${remaining[0].count} 个品牌（无品牌）\n`);
    
    // 2. 从productCategories表中查找真正的品牌
    console.log('2️⃣ 查找真正的品牌分类...');
    const placeholders = realBrands.map(() => '?').join(',');
    const [brandCategories] = await pool.execute(
      `SELECT id, name FROM productCategories WHERE name IN (${placeholders})`,
      realBrands
    );
    console.log(`   找到 ${brandCategories.length} 个品牌分类\n`);
    
    // 3. 迁移品牌到brands表
    console.log('3️⃣ 迁移品牌到brands表...');
    let migratedCount = 0;
    for (const category of brandCategories) {
      const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      try {
        await pool.execute(
          'INSERT INTO brands (name, slug, `order`, isActive) VALUES (?, ?, ?, TRUE)',
          [category.name, slug, migratedCount]
        );
        console.log(`   ✅ 已迁移: ${category.name}`);
        migratedCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  跳过重复: ${category.name}`);
        } else {
          throw error;
        }
      }
    }
    console.log(`   共迁移 ${migratedCount} 个品牌\n`);
    
    // 4. 删除品牌分类
    console.log('4️⃣ 删除品牌分类...');
    if (brandCategories.length > 0) {
      const brandIds = brandCategories.map(c => c.id);
      const [deleteResult] = await pool.execute(
        `DELETE FROM productCategories WHERE id IN (${brandIds.map(() => '?').join(',')})`,
        brandIds
      );
      console.log(`   ✅ 已删除 ${deleteResult.affectedRows} 个品牌分类\n`);
    }
    
    // 5. 显示最终统计
    console.log('5️⃣ 最终统计:');
    const [brandCount] = await pool.execute('SELECT COUNT(*) as count FROM brands');
    const [categoryCount] = await pool.execute('SELECT COUNT(*) as count FROM productCategories');
    console.log(`   - 品牌总数: ${brandCount[0].count}`);
    console.log(`   - 分类总数: ${categoryCount[0].count}`);
    
    console.log('\n✅ 品牌迁移修复完成！');
    
  } catch (error) {
    console.error('\n❌ 修复失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 执行修复
fixBrandMigration().catch(console.error);

