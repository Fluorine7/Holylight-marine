/**
 * 恢复丢失的分类
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function restoreCategories() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  
  try {
    console.log('🚀 开始恢复丢失的分类...\n');
    
    // 1. 重新创建"水泵"一级分类
    console.log('1️⃣ 恢复"水泵"一级分类...');
    const [pump] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['水泵']
    );
    
    let pumpId;
    if (pump.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO productCategories (name, slug, parentId, `order`, isActive) VALUES (?, ?, NULL, 0, TRUE)',
        ['水泵', 'pump']
      );
      pumpId = result.insertId;
      console.log(`   ✅ 已创建"水泵"分类 (ID: ${pumpId})`);
    } else {
      pumpId = pump[0].id;
      console.log(`   ✅ "水泵"分类已存在 (ID: ${pumpId})`);
    }
    
    // 修正"舱底泵"的parentId
    await pool.execute(
      'UPDATE productCategories SET parentId = ? WHERE id = 3',
      [pumpId]
    );
    console.log('   ✅ 已修正"舱底泵"的父分类\n');
    
    // 2. 重新创建"锚机"一级分类
    console.log('2️⃣ 恢复"锚机"一级分类...');
    const [anchor] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['锚机']
    );
    
    let anchorId;
    if (anchor.length === 0) {
      const [result] = await pool.execute(
        'INSERT INTO productCategories (name, slug, parentId, `order`, isActive) VALUES (?, ?, NULL, 0, TRUE)',
        ['锚机', 'anchor']
      );
      anchorId = result.insertId;
      console.log(`   ✅ 已创建"锚机"分类 (ID: ${anchorId})`);
    } else {
      anchorId = anchor[0].id;
      console.log(`   ✅ "锚机"分类已存在 (ID: ${anchorId})`);
    }
    
    // 修正"绞盘"的parentId
    await pool.execute(
      'UPDATE productCategories SET parentId = ? WHERE id = 38',
      [anchorId]
    );
    console.log('   ✅ 已修正"绞盘"的父分类\n');
    
    // 3. 修正舵机相关的二级分类
    console.log('3️⃣ 修正舵机相关的二级分类...');
    const [rudder] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['舵机']
    );
    
    if (rudder.length > 0) {
      const rudderId = rudder[0].id;
      await pool.execute(
        'UPDATE productCategories SET parentId = ? WHERE id IN (41, 43, 45, 48, 49)',
        [rudderId]
      );
      console.log(`   ✅ 已修正舵机相关的二级分类\n`);
    }
    
    // 4. 修正液位计相关的二级分类
    console.log('4️⃣ 修正液位计相关的二级分类...');
    const [level] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['液位计']
    );
    
    if (level.length > 0) {
      const levelId = level[0].id;
      await pool.execute(
        'UPDATE productCategories SET parentId = ? WHERE id IN (66, 67)',
        [levelId]
      );
      console.log(`   ✅ 已修正液位计相关的二级分类\n`);
    }
    
    // 5. 修正锌块相关的二级分类
    console.log('5️⃣ 修正锌块相关的二级分类...');
    const [zinc] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['锌块']
    );
    
    if (zinc.length > 0) {
      const zincId = zinc[0].id;
      await pool.execute(
        'UPDATE productCategories SET parentId = ? WHERE id IN (74, 75, 76, 77)',
        [zincId]
      );
      console.log(`   ✅ 已修正锌块相关的二级分类\n`);
    }
    
    // 6. 修正马桶相关的二级分类
    console.log('6️⃣ 修正马桶相关的二级分类...');
    const [toilet] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['马桶']
    );
    
    if (toilet.length > 0) {
      const toiletId = toilet[0].id;
      await pool.execute(
        'UPDATE productCategories SET parentId = ? WHERE id IN (82, 83)',
        [toiletId]
      );
      console.log(`   ✅ 已修正马桶相关的二级分类\n`);
    }
    
    // 7. 删除重复的"摆臂式"和"Exalto"
    console.log('7️⃣ 删除重复/无效的分类...');
    await pool.execute('DELETE FROM productCategories WHERE id IN (55, 59)');
    console.log('   ✅ 已删除重复分类\n');
    
    // 8. 重新创建"通风系统"一级分类
    console.log('8️⃣ 恢复"通风系统"一级分类...');
    const [ventilation] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['通风系统']
    );
    
    if (ventilation.length === 0) {
      await pool.execute(
        'INSERT INTO productCategories (name, slug, parentId, `order`, isActive) VALUES (?, ?, NULL, 0, TRUE)',
        ['通风系统', 'ventilation']
      );
      console.log('   ✅ 已创建"通风系统"分类\n');
    } else {
      console.log('   ✅ "通风系统"分类已存在\n');
    }
    
    // 9. 显示最终统计
    console.log('📊 最终统计:');
    const [level1Count] = await pool.execute('SELECT COUNT(*) as count FROM productCategories WHERE parentId IS NULL');
    const [level2Count] = await pool.execute('SELECT COUNT(*) as count FROM productCategories WHERE parentId IS NOT NULL');
    console.log(`   - 一级分类: ${level1Count[0].count}`);
    console.log(`   - 二级分类: ${level2Count[0].count}`);
    
    console.log('\n✅ 分类恢复完成！');
    console.log('\n请运行: node check-categories-status.cjs 查看恢复结果');
    
  } catch (error) {
    console.error('\n❌ 恢复失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 执行恢复
restoreCategories().catch(console.error);

