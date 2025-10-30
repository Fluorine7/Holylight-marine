/**
 * 检查分类状态
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCategories() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  
  try {
    console.log('📊 当前分类状态\n');
    
    // 查询所有一级分类
    const [level1] = await pool.execute(
      'SELECT id, name FROM productCategories WHERE parentId IS NULL ORDER BY name'
    );
    
    console.log(`一级分类（共${level1.length}个）：`);
    level1.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat.name} (ID: ${cat.id})`);
    });
    
    console.log('\n');
    
    // 查询所有二级分类
    const [level2] = await pool.execute(
      'SELECT id, name, parentId FROM productCategories WHERE parentId IS NOT NULL ORDER BY parentId, name'
    );
    
    console.log(`二级分类（共${level2.length}个）：`);
    
    // 按父分类分组显示
    const grouped = {};
    level2.forEach(cat => {
      if (!grouped[cat.parentId]) {
        grouped[cat.parentId] = [];
      }
      grouped[cat.parentId].push(cat);
    });
    
    for (const parentId in grouped) {
      const parent = level1.find(c => c.id === parseInt(parentId));
      const parentName = parent ? parent.name : `Unknown (${parentId})`;
      console.log(`\n  ${parentName}:`);
      grouped[parentId].forEach(cat => {
        console.log(`    - ${cat.name} (ID: ${cat.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ 查询失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 执行查询
checkCategories().catch(console.error);

