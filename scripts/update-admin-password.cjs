#!/usr/bin/env node

/**
 * 更新管理员密码到数据库
 * 读取.admin-password文件，生成bcrypt哈希值，并更新数据库
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');
const passwordFile = path.join(projectRoot, '.admin-password');

// 读取密码
if (!fs.existsSync(passwordFile)) {
  console.error('❌ 错误：密码文件不存在');
  console.error('请先运行: ./scripts/manage-admin-password.sh generate');
  process.exit(1);
}

const password = fs.readFileSync(passwordFile, 'utf8').trim();

if (!password) {
  console.error('❌ 错误：密码文件为空');
  process.exit(1);
}

console.log('📝 读取到密码:', password);
console.log('');

// 动态导入bcryptjs
let bcrypt;
try {
  bcrypt = require('bcryptjs');
} catch (err) {
  console.error('❌ 错误：bcryptjs模块未安装');
  console.error('请先运行: pnpm install');
  process.exit(1);
}

// 生成哈希值
console.log('🔐 正在生成密码哈希值...');
const hash = bcrypt.hashSync(password, 10);
console.log('✅ 哈希值生成完成');
console.log('');

// 输出SQL语句
console.log('========================================');
console.log('  请在数据库中执行以下SQL语句');
console.log('========================================');
console.log('');
console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
console.log('');
console.log('========================================');
console.log('');

// 尝试自动更新数据库
console.log('🔄 尝试自动更新数据库...');
console.log('');

const { getDb } = require('../server/db');

(async () => {
  try {
    const db = await getDb();
    if (!db) {
      throw new Error('无法连接数据库');
    }

    // 更新密码
    await db.execute(
      'UPDATE users SET password = ? WHERE username = ?',
      [hash, 'admin']
    );

    console.log('✅ 数据库更新成功！');
    console.log('');
    console.log('⚠️  重要提示：');
    console.log('1. 新密码已更新到数据库');
    console.log('2. 请重启应用以使更改生效：');
    console.log('   pm2 restart holylight-marine');
    console.log('');
    console.log('3. 使用以下凭据登录：');
    console.log(`   用户名: admin`);
    console.log(`   密码: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 自动更新失败:', error.message);
    console.error('');
    console.error('请手动在数据库管理界面执行上面的SQL语句');
    process.exit(1);
  }
})();

