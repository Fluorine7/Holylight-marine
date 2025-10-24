-- 添加产品表和更新现有表结构

-- 1. 更新产品分类表，添加新字段
ALTER TABLE productCategories 
ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS parentId INT NULL,
MODIFY COLUMN imageUrl TEXT NULL;

-- 为现有记录生成slug（如果有数据的话）
UPDATE productCategories SET slug = CONCAT('category-', id) WHERE slug = '';

-- 添加唯一索引
ALTER TABLE productCategories ADD UNIQUE INDEX IF NOT EXISTS idx_slug (slug);

-- 2. 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryId INT NOT NULL,
  name VARCHAR(500) NOT NULL,
  model VARCHAR(200),
  slug VARCHAR(500) NOT NULL UNIQUE,
  description TEXT,
  specifications TEXT,
  images TEXT,
  `order` INT NOT NULL DEFAULT 0,
  isPublished BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categoryId (categoryId),
  INDEX idx_slug (slug),
  INDEX idx_order (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 更新新闻表，添加新字段
ALTER TABLE news 
ADD COLUMN IF NOT EXISTS slug VARCHAR(500) NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS summary TEXT NULL,
ADD COLUMN IF NOT EXISTS coverImage TEXT NULL,
ADD COLUMN IF NOT EXISTS category VARCHAR(100) NULL,
CHANGE COLUMN IF EXISTS imageUrl coverImage TEXT NULL,
CHANGE COLUMN IF EXISTS isActive isPublished BOOLEAN NOT NULL DEFAULT TRUE;

-- 为现有新闻记录生成slug（如果有数据的话）
UPDATE news SET slug = CONCAT('news-', id) WHERE slug = '';

-- 添加唯一索引
ALTER TABLE news ADD UNIQUE INDEX IF NOT EXISTS idx_news_slug (slug);

-- 4. 添加外键约束（可选，根据需要）
-- ALTER TABLE products ADD CONSTRAINT fk_products_category 
--   FOREIGN KEY (categoryId) REFERENCES productCategories(id) ON DELETE RESTRICT;

