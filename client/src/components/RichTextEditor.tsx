import { useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "请输入内容...",
}: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  // 图片上传处理
  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // 验证文件大小
      if (file.size > 10 * 1024 * 1024) {
        toast.error("图片大小不能超过10MB");
        return;
      }

      try {
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
        
        // 插入图片到编辑器
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          if (range) {
            quill.insertEmbed(range.index, "image", data.url);
            quill.setSelection(range.index + 1, 0);
          }
        }

        toast.success("图片上传成功！");
      } catch (error) {
        console.error("图片上传失败:", error);
        toast.error("图片上传失败，请重试");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["blockquote", "code-block"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "video",
    "blockquote",
    "code-block",
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: "400px", marginBottom: "50px" }}
      />
    </div>
  );
}

