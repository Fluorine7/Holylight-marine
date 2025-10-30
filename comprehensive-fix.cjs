/**
 * 综合修复脚本
 * 1. 清理品牌数据（只保留真正的品牌）
 * 2. 修正分类结构
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// 真正的品牌名称列表
const realBrands = [
  'KUS', 'Rule', 'Jabsco', 'Flojet', 'CEM',
  'Italwinch', 'Multiflex', 'LS', 'Dometic',
  'Blusea', 'Roca', 'Speich', 'Decca',
  'Marco', 'PYI', 'Polyform 挪威', 'Martyr',
  'Ritchie', 'TECMA', 'Planus', 'Fireboy',
  'Marinco', 'TECNICOMAR', 'Aquaprime', 'Griffin',
  'NHK MEC', 'Victron'
];

async function comprehensiveFix() {
  const pool = mysql.createPool(process.env.DATABASE_URL);
  
  try {
    console.log('🚀 开始综合修复...\n');
    
    // ========== 第一部分：清理品牌数据 ==========
    console.log('📦 第一部分：清理品牌数据\n');
    
    // 1. 删除所有品牌（保留"无品牌"）
    console.log('1️⃣ 清空brands表（保留"无品牌"）...');
    await pool.execute('DELETE FROM brands WHERE name != ?', ['无品牌']);
    console.log('   ✅ 已清空\n');
    
    // 2. 从productCategories表中查找真正的品牌并迁移
    console.log('2️⃣ 迁移真正的品牌...');
    const placeholders = realBrands.map(() => '?').join(',');
    const [brandCategories] = await pool.execute(
      `SELECT id, name FROM productCategories WHERE name IN (${placeholders})`,
      realBrands
    );
    
    let migratedCount = 0;
    const brandIdsToDelete = [];
    for (const category of brandCategories) {
      const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      try {
        await pool.execute(
          'INSERT INTO brands (name, slug, `order`, isActive) VALUES (?, ?, ?, TRUE)',
          [category.name, slug, migratedCount]
        );
        brandIdsToDelete.push(category.id);
        console.log(`   ✅ 已迁移: ${category.name}`);
        migratedCount++;
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  跳过重复: ${category.name}`);
          brandIdsToDelete.push(category.id);
        } else {
          throw error;
        }
      }
    }
    console.log(`   共迁移 ${migratedCount} 个品牌\n`);
    
    // 3. 删除品牌分类
    if (brandIdsToDelete.length > 0) {
      console.log('3️⃣ 删除品牌分类...');
      await pool.execute(
        `DELETE FROM productCategories WHERE id IN (${brandIdsToDelete.map(() => '?').join(',')})`,
        brandIdsToDelete
      );
      console.log(`   ✅ 已删除 ${brandIdsToDelete.length} 个品牌分类\n`);
    }
    
    // ========== 第二部分：修正分类结构 ==========
    console.log('\n📂 第二部分：修正分类结构\n');
    
    // 4. 将"海水淡化装置"改为一级分类
    console.log('4️⃣ 将"海水淡化装置"改为一级分类...');
    const [seawater] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['海水淡化装置']
    );
    if (seawater.length > 0) {
      await pool.execute(
        'UPDATE productCategories SET parentId = NULL WHERE id = ?',
        [seawater[0].id]
      );
      console.log('   ✅ 已修改\n');
    } else {
      console.log('   ⚠️  未找到"海水淡化装置"分类\n');
    }
    
    // 5. 将"油水分离器"改为一级分类
    console.log('5️⃣ 将"油水分离器"改为一级分类...');
    const [oilwater] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['油水分离器']
    );
    if (oilwater.length > 0) {
      await pool.execute(
        'UPDATE productCategories SET parentId = NULL WHERE id = ?',
        [oilwater[0].id]
      );
      console.log('   ✅ 已修改\n');
    } else {
      console.log('   ⚠️  未找到"油水分离器"分类\n');
    }
    
    // 6. 合并"充电器"和"逆变器"
    console.log('6️⃣ 合并"充电器"和"逆变器"为"充电器逆变器"...');
    
    // 检查是否已存在"充电器逆变器"
    const [existing] = await pool.execute(
      'SELECT id FROM productCategories WHERE name = ?',
      ['充电器逆变器']
    );
    
    let chargerInverterId;
    if (existing.length === 0) {
      // 创建新的一级分类
      const [result] = await pool.execute(
        'INSERT INTO productCategories (name, slug, parentId, `order`, isActive) VALUES (?, ?, NULL, 0, TRUE)',
        ['充电器逆变器', 'charger-inverter']
      );
      chargerInverterId = result.insertId;
      console.log(`   ✅ 已创建"充电器逆变器"一级分类 (ID: ${chargerInverterId})`);
    } else {
      chargerInverterId = existing[0].id;
      console.log(`   ✅ "充电器逆变器"分类已存在 (ID: ${chargerInverterId})`);
    }
    
    // 将"充电器"和"逆变器"改为二级分类
    await pool.execute(
      'UPDATE productCategories SET parentId = ? WHERE name IN (?, ?)',
      [chargerInverterId, '充电器', '逆变器']
    );
    console.log('   ✅ 已将"充电器"和"逆变器"改为二级分类\n');
    
    // 7. 显示最终统计
    console.log('\n📊 最终统计:');
    const [brandCount] = await pool.execute('SELECT COUNT(*) as count FROM brands');
    const [level1Count] = await pool.execute('SELECT COUNT(*) as count FROM productCategories WHERE parentId IS NULL');
    const [level2Count] = await pool.execute('SELECT COUNT(*) as count FROM productCategories WHERE parentId IS NOT NULL');
    console.log(`   - 品牌总数: ${brandCount[0].count}`);
    console.log(`   - 一级分类: ${level1Count[0].count}`);
    console.log(`   - 二级分类: ${level2Count[0].count}`);
    
    console.log('\n✅ 综合修复完成！');
    
  } catch (error) {
    console.error('\n❌ 修复失败:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// 执行修复
comprehensiveFix().catch(console.error);

