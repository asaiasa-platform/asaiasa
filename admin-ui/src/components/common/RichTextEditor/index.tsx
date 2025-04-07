"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "./ToolBar";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ImageResize from "tiptap-extension-resize-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

export default function RichTextEditor({
  content,
  onChange,
}: Readonly<{
  content: string | undefined;
  onChange: (value: string) => void;
}>) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Added manually
        orderedList: false, // Added manually
        bulletList: false, // Added manually
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3",
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3",
        },
      }),
      ImageResize,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[156px] border rounded-md bg-white py-2 px-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
