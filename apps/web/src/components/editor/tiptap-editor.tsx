'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Markdown } from 'tiptap-markdown';
import { useCallback } from 'react';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Quote,
    Image as ImageIcon,
    Minus,
    Link as LinkIcon,
    Code,
    Underline as UnderlineIcon,
    Undo,
    Redo,
    Eraser,
    Type,
    ChevronDown,
    Unlink,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    Subscript as SubscriptIcon,
    Superscript as SuperscriptIcon,
    CheckSquare,
    ListTodo,
    Code2,
    Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to handle image uploads
const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'blog_platform');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.secure_url;
};

// Toolbar Button Component
function ToolbarButton({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "p-2 rounded-md transition-all duration-200 ease-in-out",
                "hover:bg-muted hover:text-foreground",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                isActive ? "bg-primary text-primary-foreground shadow-sm scale-105" : "text-muted-foreground"
            )}
        >
            {children}
        </button>
    );
}

// Separator Component
function ToolbarSeparator() {
    return <div className="w-px h-6 bg-border mx-1" />;
}

interface TiptapEditorProps {
    value: string;
    onChange: (markdown: string) => void;
    className?: string;
    placeholder?: string;
}

export default function TiptapEditor({ value, onChange, className, placeholder }: TiptapEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Tell your story...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none before:h-0',
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-xl shadow-lg my-8 w-full border border-border/50',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline decoration-primary/30 hover:decoration-primary transition-all cursor-pointer',
                },
            }),
            Underline,
            Typography,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Markdown.configure({
                html: true,
                transformPastedText: true,
                transformCopiedText: true,
                linkify: true,
                breaks: true,
            }),
        ],
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] selection:bg-primary/30",
                    "prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
                    "prose-p:text-foreground/90 prose-p:leading-relaxed",
                    // Custom formatting styles
                    "[&_u]:underline [&_u]:decoration-primary/30",
                    "[&_mark]:bg-yellow-200 dark:[&_mark]:bg-yellow-500/30 [&_mark]:text-black dark:[&_mark]:text-white [&_mark]:px-0.5 [&_mark]:rounded-sm",
                    "[&_del]:line-through",
                    // List styles
                    "prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-1 prose-ul:marker:text-primary",
                    "prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-1 prose-ol:marker:text-primary",
                    "[&_ul[data-type='taskList']]:list-none [&_ul[data-type='taskList']]:p-0 [&_ul[data-type='taskList']]:ml-0",
                    "[&_li[data-type='taskItem']]:flex [&_li[data-type='taskItem']]:gap-3 [&_li[data-type='taskItem']]:items-start [&_li[data-type='taskItem']]:mt-2",
                    "[&_li[data-type='taskItem']_input]:mt-1.5 [&_li[data-type='taskItem']_input]:w-4 [&_li[data-type='taskItem']_input]:h-4 [&_li[data-type='taskItem']_input]:accent-primary [&_li[data-type='taskItem']_input]:cursor-pointer",
                    // Blockquote styles
                    "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:my-6",
                    // Alignment styles
                    "[&_.align-left]:text-left [&_.align-center]:text-center [&_.align-right]:text-right [&_.align-justify]:text-justify",
                    // Heading sizes & margins
                    "[&_h1]:text-4xl [&_h1]:font-black [&_h1]:mt-12 [&_h1]:mb-6",
                    "[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-5 [&_h2]:border-b [&_h2]:border-border/50 [&_h2]:pb-2",
                    "[&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4",
                    "[&_h4]:text-xl [&_h4]:font-semibold [&_h4]:mt-6 [&_h4]:mb-3",
                    "[&_h5]:text-lg [&_h5]:font-semibold [&_h5]:mt-4 [&_h5]:mb-2",
                    "[&_h6]:text-base [&_h6]:font-semibold [&_h6]:mt-2 [&_h6]:mb-1"
                ),
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0];
                    if (file.type.startsWith('image/')) {
                        uploadImage(file).then(url => {
                            const { schema } = view.state;
                            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                            if (coordinates) {
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.insert(coordinates.pos, node);
                                view.dispatch(transaction);
                            }
                        }).catch(err => console.error("Upload failed", err));
                        return true;
                    }
                }
                return false;
            }
        },
        content: value,
        onUpdate: ({ editor }) => {
            const markdown = (editor.storage as any).markdown.getMarkdown();
            onChange(markdown);
        },
    });

    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addLink = useCallback(() => {
        const url = window.prompt('Enter link URL:');
        if (url && editor) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    const removeLink = useCallback(() => {
        if (editor) {
            editor.chain().focus().unsetLink().run();
        }
    }, [editor]);

    if (!editor) {
        return (
            <div className={cn("relative w-full border rounded-lg bg-background animate-pulse", className)}>
                <div className="h-12 bg-muted/50 border-b"></div>
                <div className="p-8 min-h-[600px]"></div>
            </div>
        );
    }

    return (
        <div className={cn("relative w-full border rounded-lg bg-background", className)}>
            {/* Fixed Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30 sticky top-0 z-10 backdrop-blur-md">
                {/* History Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-0.5 border border-border/50">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                {/* Typography Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-0.5 border border-border/50">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        isActive={editor.isActive('paragraph')}
                        title="Paragraph"
                    >
                        <Type className="w-4 h-4" />
                    </ToolbarButton>
                    <div className="w-px h-4 bg-border/50 mx-0.5" />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="H1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="H2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="H3"
                    >
                        <Heading3 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                        isActive={editor.isActive('heading', { level: 4 })}
                        title="H4"
                    >
                        <Heading4 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                        isActive={editor.isActive('heading', { level: 5 })}
                        title="H5"
                    >
                        <Heading5 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                        isActive={editor.isActive('heading', { level: 6 })}
                        title="H6"
                    >
                        <Heading6 className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                {/* Formatting Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-0.5 border border-border/50">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strike"
                    >
                        <Strikethrough className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                {/* Alignment Group */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-0.5 border border-border/50">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                {/* Enhanced Formatting */}
                <div className="flex items-center gap-0.5 bg-background/50 rounded-lg p-0.5 border border-border/50">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        isActive={editor.isActive('highlight')}
                        title="Highlight"
                    >
                        <Highlighter className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Inline Code"
                    >
                        <Code className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    >
                        <Code2 className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().unsetAllMarks().run()}
                        title="Clear Style"
                    >
                        <Eraser className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Sub Toolbar for Lists and Media */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/10">
                {/* Lists Group */}
                <div className="flex items-center gap-0.5 bg-background/30 rounded-lg p-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullets"
                    >
                        <List className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        isActive={editor.isActive('taskList')}
                        title="Tasks"
                    >
                        <ListTodo className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="w-px h-5 bg-border/50 mx-1" />

                {/* Structure Group */}
                <div className="flex items-center gap-0.5 bg-background/30 rounded-lg p-0.5">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Divider"
                    >
                        <Minus className="w-4 h-4" />
                    </ToolbarButton>
                </div>

                <div className="w-px h-5 bg-border/50 mx-1" />

                {/* Media Group */}
                <div className="flex items-center gap-0.5 bg-background/30 rounded-lg p-0.5">
                    <ToolbarButton
                        onClick={addImage}
                        title="Image"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={addLink}
                        isActive={editor.isActive('link')}
                        title="Link"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={removeLink}
                        disabled={!editor.isActive('link')}
                        title="Unlink"
                    >
                        <Unlink className="w-4 h-4" />
                    </ToolbarButton>
                </div>
            </div>

            {/* Bubble Menu - Text Selection */}
            {editor && (
                <BubbleMenu
                    className="flex items-center gap-1 p-1 bg-background border border-border rounded-lg shadow-xl"
                    editor={editor}
                >
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn("p-1.5 rounded-md hover:bg-muted transition-colors", editor.isActive('bold') ? 'bg-muted text-primary' : 'text-muted-foreground')}
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn("p-1.5 rounded-md hover:bg-muted transition-colors", editor.isActive('italic') ? 'bg-muted text-primary' : 'text-muted-foreground')}
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={cn("p-1.5 rounded-md hover:bg-muted transition-colors", editor.isActive('underline') ? 'bg-muted text-primary' : 'text-muted-foreground')}
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={cn("p-1.5 rounded-md hover:bg-muted transition-colors", editor.isActive('strike') ? 'bg-muted text-primary' : 'text-muted-foreground')}
                    >
                        <Strikethrough className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={cn("p-1.5 rounded-md hover:bg-muted transition-colors", editor.isActive('heading', { level: 2 }) ? 'bg-muted text-primary' : 'text-muted-foreground')}
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={addLink}
                        className={cn("p-1.5 rounded-md hover:bg-muted transition-colors", editor.isActive('link') ? 'bg-muted text-primary' : 'text-muted-foreground')}
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>
                </BubbleMenu>
            )}

            {/* Floating Menu - New Line */}
            {editor && (
                <FloatingMenu
                    className="flex items-center gap-2 -ml-20 opacity-0 group-hover/editor:opacity-100 data-[state=visible]:opacity-100 transition-all duration-200"
                    editor={editor}
                >
                    <div className="flex items-center gap-1 bg-background border border-border rounded-full p-1 shadow-md hover:scale-105 transition-transform">
                        <div className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            <Plus className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1 border-l border-border ml-1 pl-1">
                            <button
                                onClick={addImage}
                                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                                title="Add Image"
                            >
                                <ImageIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                                title="Main Heading"
                            >
                                <Heading1 className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-primary transition-all"
                                title="Bullet List"
                            >
                                <List className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </FloatingMenu>
            )}

            <div className="group/editor relative">
                <EditorContent editor={editor} className="p-4 md:p-8 md:pl-20 min-h-[400px] h-full" />
            </div>
        </div>
    );
}
