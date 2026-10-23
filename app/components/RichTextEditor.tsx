"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { isRichHtmlEmpty, toRichHtml } from "../../lib/richText";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
};

function ToolbarButton({
  label,
  title,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={{
        minWidth: "32px",
        height: "30px",
        padding: "0 8px",
        border: "1px solid",
        borderColor: active ? "#b7844c" : "#d1d5db",
        backgroundColor: active ? "rgba(183,132,76,0.15)" : "#fff",
        color: disabled ? "#9ca3af" : active ? "#8a5f30" : "#374151",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      strike: current.isActive("strike"),
      h2: current.isActive("heading", { level: 2 }),
      h3: current.isActive("heading", { level: 3 }),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      blockquote: current.isActive("blockquote"),
      link: current.isActive("link"),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });

  function setLink() {
    const previous = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("Link URL (leave empty to remove the link)", previous || "https://");
    if (url === null) return;
    if (url.trim() === "" || url.trim() === "https://") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim(), target: "_blank" }).run();
  }

  const divider = <span style={{ width: "1px", alignSelf: "stretch", backgroundColor: "#e5e7eb", margin: "0 2px" }} />;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "8px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
      <ToolbarButton label="B" title="Bold" active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
      <ToolbarButton label="I" title="Italic" active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
      <ToolbarButton label="U" title="Underline" active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()} />
      <ToolbarButton label="S" title="Strikethrough" active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()} />
      {divider}
      <ToolbarButton label="H2" title="Heading" active={state.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
      <ToolbarButton label="H3" title="Subheading" active={state.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />
      {divider}
      <ToolbarButton label="• List" title="Bullet list" active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()} />
      <ToolbarButton label="1. List" title="Numbered list" active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
      <ToolbarButton label="❝ Quote" title="Quote" active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
      <ToolbarButton label="― Line" title="Divider line" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      <ToolbarButton label="Link" title="Add or edit link" active={state.link} onClick={setLink} />
      {divider}
      <ToolbarButton label="Clear" title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} />
      <ToolbarButton label="↶" title="Undo" disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()} />
      <ToolbarButton label="↷" title="Redo" disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()} />
    </div>
  );
}

export default function RichTextEditor({ value, onChange, minHeight = 180 }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
    ],
    content: toRichHtml(value),
    editorProps: {
      attributes: {
        class: "rich-content rich-editor-surface",
        style: `min-height: ${minHeight}px;`,
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.getHTML();
      onChange(isRichHtmlEmpty(html) ? "" : html);
    },
  });

  // Keep the editor in sync when the value is replaced from outside (e.g. after content loads).
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const next = toRichHtml(value);
    const current = editor.getHTML();
    if (next !== current && !(isRichHtmlEmpty(next) && isRichHtmlEmpty(current))) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: "8px", overflow: "hidden", backgroundColor: "#fff" }}>
      {editor ? <Toolbar editor={editor} /> : <div style={{ height: "47px", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }} />}
      <EditorContent editor={editor} />
    </div>
  );
}
