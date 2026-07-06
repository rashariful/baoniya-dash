// import { useEffect, useRef } from "react";
// import Quill from "quill";
// import "quill/dist/quill.snow.css";
// import QuillTable from "quill-table-ui";

// interface Props {
//   value?: string;
//   onChange?: (content: string) => void;
// }

// const RichTextEditor: React.FC<Props> = ({ value = "", onChange }) => {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const quillRef = useRef<Quill | null>(null);

//   useEffect(() => {
//     if (editorRef.current) {

//       Quill.register(
//         {
//           "modules/tableUI": QuillTable
//         },
//         true
//       );

//       quillRef.current = new Quill(editorRef.current, {
//         theme: "snow",
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, 3, false] }],
//             ["bold", "italic", "underline", "strike"],

//             [{ color: [] }, { background: [] }], // font color + background

//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ align: [] }],

//             ["link", "image"],

//             ["table"], // table button

//             ["clean"]
//           ],

//           table: true,
//           tableUI: true
//         }
//       });

//       // initial content
//       quillRef.current.clipboard.dangerouslyPasteHTML(value);

//       quillRef.current.on("text-change", () => {
//         const html =
//           editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
//         onChange?.(html);
//       });
//     }

//     return () => {
//       quillRef.current = null;
//     };
//   }, []);

//   return <div ref={editorRef} style={{ minHeight: "300px" }} />;
// };

// export default RichTextEditor;

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
// import ImageResize from "quill-image-resize-module";

interface Props {
  value?: string;
  onChange?: (content: string) => void;
}

const RichTextEditor: React.FC<Props> = ({ value = "", onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"]
          ],
          
        }
      });

      // Set initial content
      quillRef.current.clipboard.dangerouslyPasteHTML(value);

      // onChange handler
      quillRef.current.on("text-change", () => {
        const html = editorRef.current?.querySelector(".ql-editor")?.innerHTML || "";
        onChange?.(html);
      });
    }

    return () => {
      quillRef.current = null;
    };
  }, []);

  return <div ref={editorRef} style={{ minHeight: "300px" }} />;
};

export default RichTextEditor;
