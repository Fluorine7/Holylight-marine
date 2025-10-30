# 管理员密码管理

## 概述

为了提高安全性，管理员密码采用服务器随机生成的强密码，只能通过SSH登录服务器后查看。

## 密码管理命令

### 1. 查看当前密码

```bash
cd /www/wwwroot/holylight-marine
./scripts/manage-admin-password.sh show
```

### 2. 生成新密码

```bash
cd /www/wwwroot/holylight-marine
./scripts/manage-admin-password.sh generate
```

生成新密码后，需要手动更新数据库中的密码哈希值。

### 3. 完整重置密码流程

如果需要重置密码，请按以下步骤操作：

#### 步骤1：生成新密码

```bash
cd /www/wwwroot/holylight-marine
./scripts/manage-admin-password.sh generate
```

记录生成的新密码。

#### 步骤2：生成密码哈希值

```bash
node -e "const bcrypt = require('bcryptjs'); const password = require('fs').readFileSync('.admin-password', 'utf8').trim(); const hash = bcrypt.hashSync(password, 10); console.log(hash);"
```

复制输出的哈希值。

#### 步骤3：更新数据库

使用MySQL客户端或通过应用的数据库管理界面执行：

```sql
UPDATE users SET password = '刚才复制的哈希值' WHERE username = 'admin';
```

或者使用命令行：

```bash
# 方法1：使用环境变量中的数据库连接信息
mysql -h <数据库主机> -u <用户名> -p<密码> <数据库名> -e "UPDATE users SET password = '哈希值' WHERE username = 'admin';"

# 方法2：通过Node.js脚本更新（推荐）
node -e "
const bcrypt = require('bcryptjs');
const fs = require('fs');
const password = fs.readFileSync('.admin-password', 'utf8').trim();
const hash = bcrypt.hashSync(password, 10);
console.log('密码哈希值:', hash);
console.log('');
console.log('请在数据库中执行以下SQL:');
console.log('UPDATE users SET password = \\'' + hash + '\\' WHERE username = \\'admin\\';');
"
```

#### 步骤4：重启应用

```bash
pm2 restart holylight-marine
```

## 安全建议

1. **定期更换密码**：建议每3-6个月更换一次管理员密码
2. **保护密码文件**：`.admin-password`文件权限已设置为600（仅所有者可读写）
3. **SSH密钥认证**：建议使用SSH密钥而不是密码登录服务器
4. **防火墙规则**：确保只有可信IP可以访问后台登录页面

## 首次部署设置

首次部署时，需要：

1. 生成初始密码：
   ```bash
   cd /www/wwwroot/holylight-marine
   ./scripts/manage-admin-password.sh generate
   ```

2. 更新数据库中admin用户的密码（按照上述步骤2-3）

3. 重启应用：
   ```bash
   pm2 restart holylight-marine
   ```

4. 使用生成的密码登录后台

## 故障排除

### 忘记密码

如果忘记密码，可以通过SSH登录服务器查看：

```bash
cd /www/wwwroot/holylight-marine
./scripts/manage-admin-password.sh show
```

### 密码文件丢失

如果`.admin-password`文件丢失，需要重新生成并更新数据库：

```bash
cd /www/wwwroot/holylight-marine
./scripts/manage-admin-password.sh generate
# 然后按照上述步骤2-4更新数据库
```

## 技术细节

- **密码长度**：20位
- **字符集**：大小写字母、数字、特殊字符
- **哈希算法**：bcrypt (cost factor: 10)
- **存储位置**：`/www/wwwroot/holylight-marine/.admin-password`
- **文件权限**：600 (仅所有者可读写)

