"use client";

import { Toggle } from "@/components/ui/toggle";
import {
  Heading1,
  Heading2,
  Heading3,
  Code,
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Highlighter,
  ListOrdered,
  List,
  Heading4,
  Heading5,
  Heading6,
  Undo,
  Redo,
  Type,
  ChevronDown,
  ALargeSmall,
  Image,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COLORS } from "./colorGrid";
import { ReactNode } from "react";

interface Option {
  icon: ReactNode;
  onClick: () => void;
  pressed: boolean;
}

const ColorPicker = ({
  onColorSelect,
}: {
  onColorSelect: (color: string) => void;
}) => {
  return (
    <div className="w-fit p-2">
      <button
        onClick={() => onColorSelect("transparent")}
        className="mb-2 h-8 w-full border rounded-md flex items-center justify-center"
      >
        <span className="text-xs">Reset</span>
      </button>
      {Object.entries(COLORS).map(([group, colors]) => (
        <div key={group} className="flex">
          {colors.map((color) => (
            <button
              key={color}
              className={`size-6 flex-shrink-0 border border-white`}
              style={{
                backgroundColor: color,
              }}
              onClick={() => onColorSelect(color)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default function ToolBar({
  editor,
}: Readonly<{ editor: Editor | null }>) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const headingOptions = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Heading4 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      pressed: editor.isActive("heading", { level: 4 }),
    },
    {
      icon: <Heading5 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      pressed: editor.isActive("heading", { level: 5 }),
    },
    {
      icon: <Heading6 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      pressed: editor.isActive("heading", { level: 6 }),
    },
  ];

  const alignmentOptions = [
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
  ];

  const formattingOptions = [
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
  ];

  const listAndAlignOptions = [
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
  ];

  const otherOptions = [
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("code"),
    },
    {
      icon: <Image className="size-4" aria-label="Add Image" />,
      onClick: () => addImage(),
      pressed: editor.isActive("image"),
    },
  ];

  const renderOptionGroup = (options: Option[], className = "") => (
    <div className={`flex space-x-1 ${className}`}>
      {options.map((option, i) => (
        <Toggle
          key={i}
          size="sm"
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );

  const getCurrentHeadingIcon = () => {
    const activeHeading = headingOptions.find((option) => option.pressed);
    return activeHeading ? activeHeading.icon : <Type className="size-4" />;
  };

  const getCurrentAlignmentIcon = () => {
    const activeAlignment = alignmentOptions.find((option) => option.pressed);
    return activeAlignment ? (
      activeAlignment.icon
    ) : (
      <AlignLeft className="size-4" />
    );
  };

  const getCurrentColor = () => {
    // Get the current text color or default to black
    return editor.getAttributes("textStyle").color || "#000000";
  };

  const getCurrentHighlightColor = () => {
    // Get the current highlight color or default to yellow
    return editor.getAttributes("highlight").color || "#ffff00";
  };

  return (
    <div className="border rounded-md p-1.5 my-1 bg-slate-50">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Heading Section on the Left */}
        <div className="flex space-x-1">
          <Popover>
            <PopoverTrigger asChild>
              <Toggle size="sm" className="gap-1">
                {getCurrentHeadingIcon()}
                <ChevronDown className="size-3" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1" align="start">
              <div className="flex space-x-1">
                {headingOptions.map((option, i) => (
                  <Toggle
                    key={i}
                    size="sm"
                    pressed={option.pressed}
                    onPressedChange={option.onClick}
                  >
                    {option.icon}
                  </Toggle>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-border" />

        {/* Text Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Toggle size="sm" className="gap-1">
              <div className="flex items-center">
                <div
                  className="size-4 rounded-sm border"
                  style={{ backgroundColor: getCurrentColor() }}
                />
                <ALargeSmall className="size-5 ml-1" />
              </div>
              <ChevronDown className="size-3 -ml-1" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <ColorPicker
              onColorSelect={(color) =>
                editor
                  .chain()
                  .focus()
                  .setColor(color === "transparent" ? "#000000" : color)
                  .run()
              }
            />
          </PopoverContent>
        </Popover>

        {/* Text Formatting Options */}
        {renderOptionGroup(formattingOptions)}

        {/* Separator */}
        <div className="h-8 w-px bg-border" />

        {/* Highlight with Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Toggle
              size="sm"
              className="gap-1 rounded-md"
              pressed={editor.isActive("highlight")}
            >
              <div className="flex items-center">
                <div
                  className="size-4 rounded-sm border"
                  style={{ backgroundColor: getCurrentHighlightColor() }}
                />
                <Highlighter className="size-4 ml-1" />
              </div>
              <ChevronDown className="size-3 -ml-1" />
            </Toggle>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <ColorPicker
              onColorSelect={(color) => {
                if (color === "transparent") {
                  editor.chain().focus().unsetHighlight().run();
                } else {
                  editor.chain().focus().toggleHighlight({ color }).run();
                }
              }}
            />
          </PopoverContent>
        </Popover>

        {/* List and Alignment Group */}
        <div className="flex space-x-1">
          {/* Alignment Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Toggle size="sm" className="gap-1">
                {getCurrentAlignmentIcon()}
                <ChevronDown className="size-3" />
              </Toggle>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1">
              <div className="flex space-x-1">
                {alignmentOptions.map((option, i) => (
                  <Toggle
                    key={i}
                    size="sm"
                    pressed={option.pressed}
                    onPressedChange={option.onClick}
                  >
                    {option.icon}
                  </Toggle>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          {renderOptionGroup(listAndAlignOptions)}
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-border" />

        {/* Other Options */}
        {renderOptionGroup(otherOptions)}

        {/* Separator */}
        <div className="h-8 w-px bg-border" />

        {/* Undo/Redo Buttons */}
        <div className="flex space-x-1">
          <Button
            className="h-8 w-8"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            variant="outline"
          >
            <Undo className="size-4" />
          </Button>
          <Button
            className="h-8 w-8"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            variant="outline"
          >
            <Redo className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
