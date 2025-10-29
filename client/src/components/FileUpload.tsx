import { useState } from "react";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  onUploadComplete: (urls: string[]) => void;
  label?: string;
  existingFiles?: string[];
}

export default function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSize = 10,
  onUploadComplete,
  label = "上传文件",
  existingFiles = [],
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<string[]>(existingFiles);
  const inputId = `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;

    // 验证文件大小
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxSize * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("上传失败");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      const newFiles = multiple ? [...files, ...uploadedUrls] : uploadedUrls;
      setFiles(newFiles);
      onUploadComplete(newFiles);
      toast.success("上传成功！");
    } catch (error) {
      console.error("上传失败:", error);
      toast.error("上传失败，请重试");
    } finally {
      setUploading(false);
      e.target.value = ""; // 重置input
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUploadComplete(newFiles);
  };

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id={inputId}
          disabled={uploading}
        />
        <Button
          type="button"
          disabled={uploading}
          onClick={() => document.getElementById(inputId)?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              上传中...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {label}
            </>
          )}
        </Button>
        <span className="text-sm text-gray-500">
          {accept === "image/*" ? "支持图片格式" : "支持文档格式"}，最大 {maxSize}MB
        </span>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {isImage(file) ? (
                <img
                  src={file}
                  alt={`上传文件 ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-100 rounded-lg border">
                  <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600 text-center px-2 break-all">
                    {file.split("/").pop()}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

