#!/bin/bash

# 管理员密码管理脚本
# 用途：生成、查看、重置管理员密码

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PASSWORD_FILE="$PROJECT_ROOT/.admin-password"

# 生成随机强密码（10位，包含大小写字母、数字和特殊字符）
generate_password() {
    # 使用openssl生成随机密码
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-10
}

# 显示密码
show_password() {
    if [ ! -f "$PASSWORD_FILE" ]; then
        echo "❌ 密码文件不存在"
        echo "请先运行: $0 generate"
        exit 1
    fi
    
    echo "========================================="
    echo "  好利来管理后台 - 管理员密码"
    echo "========================================="
    echo ""
    echo "用户名: admin"
    echo "密码:   $(cat "$PASSWORD_FILE")"
    echo ""
    echo "========================================="
    echo "⚠️  请妥善保管此密码，不要泄露给他人"
    echo "========================================="
}

# 生成新密码
generate_new_password() {
    NEW_PASSWORD=$(generate_password)
    
    # 保存到文件
    echo "$NEW_PASSWORD" > "$PASSWORD_FILE"
    chmod 600 "$PASSWORD_FILE"  # 只有所有者可读写
    
    echo "✅ 新密码已生成并保存到: $PASSWORD_FILE"
    echo ""
    show_password
    echo ""
    echo "⚠️  重要提示："
    echo "1. 新密码已保存，请使用此密码登录后台"
    echo "2. 需要重启应用以使新密码生效："
    echo "   cd $PROJECT_ROOT && pm2 restart holylight-marine"
}

# 重置密码（生成新密码并更新数据库）
reset_password() {
    echo "🔄 正在重置管理员密码..."
    generate_new_password
    
    echo ""
    echo "📝 接下来需要手动更新数据库中的密码哈希值"
    echo "请运行以下命令："
    echo ""
    echo "cd $PROJECT_ROOT"
    echo "node -e \"const bcrypt = require('bcryptjs'); const password = require('fs').readFileSync('.admin-password', 'utf8').trim(); const hash = bcrypt.hashSync(password, 10); console.log('UPDATE users SET password = \\'' + hash + '\\' WHERE username = \\'admin\\';');\""
}

# 主菜单
case "$1" in
    show)
        show_password
        ;;
    generate)
        generate_new_password
        ;;
    reset)
        reset_password
        ;;
    *)
        echo "好利来管理后台 - 管理员密码管理工具"
        echo ""
        echo "用法: $0 {show|generate|reset}"
        echo ""
        echo "命令说明："
        echo "  show      - 查看当前管理员密码"
        echo "  generate  - 生成新的随机密码（不更新数据库）"
        echo "  reset     - 重置密码（生成新密码并提供数据库更新命令）"
        echo ""
        echo "示例："
        echo "  $0 show      # 查看密码"
        echo "  $0 generate  # 生成新密码"
        exit 1
        ;;
esac

