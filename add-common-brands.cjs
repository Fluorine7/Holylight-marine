/**
 * 添加常用品牌
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// 常用品牌列表（从您的原始需求中整理）
const commonBrands = [
  'KUS',
  'Rule',
  'Jabsco',
  'Flojet',
  'CEM',
  'Italwinch',
  'Multiflex',
  'LS',
  'Dometic',
  'Blusea',
  'Roca',
  'Speich',
  'Decca',
  'Marco',
  'PYI',
  'Polyform',
  'Martyr',
  'Ritchie',
  'TECMA',
  'Planus',
  'Fireboy',
  'Marinco',
  'TECNICOMAR',
  'Aquaprime',
  'Griffin',
  'NHK MEC',
  'Victron'
];

async function addCommonBrands() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  
  try {
    console.log('🚀 开始添加常用品牌...\n');
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < commonBrands.length; i++) {
      const brandName = commonBrands[i];
      const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      try {
        await pool.execute(
          'INSERT INTO brands (name, slug, `order`, isActive) VALUES (?, ?, ?, TRUE)',
          [brandName, slug, i]
        );
        console.log(`✅ 已添加: ${brandName}`);
        addedCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  已存在: ${brandName}`);
          skippedCount++;
        } else {
          throw error;
        }
      }
    }
    
    console.log(`\n📊 统计:`);
    console.log(`   - 新增品牌: ${addedCount}`);
    console.log(`   - 已存在: ${skippedCount}`);
    console.log(`   - 总计: ${addedCount + skippedCount}`);
    
    const [brandCount] = await pool.execute('SELECT COUNT(*) as count FROM brands');
    console.log(`   - 品牌总数: ${brandCount[0].count}`);
    
    console.log('\n✅ 品牌添加完成！');
    
  } catch (error) {
    console.error('\n❌ 添加失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 执行添加
addCommonBrands().catch(console.error);

