import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/themes/gray.min.css";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/line_height.min.js"; // Thêm plugin line_height

export default function FroalaEditorWord({ setDetail }: { setDetail: (value: string) => void }) {
  const handleModelChange = (content: string) => {
    setDetail(content);
  };

  return (
    <div className="border rounded-lg">
      <FroalaEditor tag="textarea" onModelChange={handleModelChange} />
    </div>
  );
}
