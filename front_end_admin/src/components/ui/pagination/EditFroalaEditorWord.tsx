import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/themes/gray.min.css";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/line_height.min.js"; // Thêm plugin line_height
import { useEffect, useState } from "react";

export default function EditFroalaEditorWord({ setDetail, detail }: { setDetail: (value: string) => void; detail: string }) {
  const [editorReady, setEditorReady] = useState(false);

  useEffect(() => {
    // Đợi Froala khởi tạo hoàn tất
    const timeout = setTimeout(() => setEditorReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (!editorReady) return <p>Loading editor...</p>;

  return <div className="border rounded-lg">{detail !== null && <FroalaEditor tag="textarea" model={detail} onModelChange={(content: any) => setDetail(content)} />}</div>;
}
