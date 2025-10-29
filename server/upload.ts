import express from "express";
import multer from "multer";
import { storagePut } from "./storage";
import { sdk } from "./_core/sdk";

const router = express.Router();

// 配置multer使用内存存储
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// 文件上传端点
router.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // 验证管理员权限
    const user = await sdk.authenticateRequest(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: "权限不足" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "没有上传文件" });
    }

    const file = req.file;
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    const relKey = `uploads/${filename}`;

    // 上传到S3
    const result = await storagePut(relKey, file.buffer, file.mimetype);

    res.json({
      url: result.url,
      key: result.key,
      filename: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    });
  } catch (error) {
    console.error("文件上传失败:", error);
    res.status(500).json({ error: "文件上传失败" });
  }
});

export default router;

