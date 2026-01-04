'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import MediaUploader from '@/components/ui/media-uploader';
import {
    Save,
    Link as LinkIcon,
    Type,
    FileText,
    Layout,
    Eye,
    Search,
    ChevronLeft,
    Loader2,
    Calendar,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import TiptapEditor from '../editor/tiptap-editor';

export default function ArticleEditor({
    initialData
}: {
    initialData?: any
}) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        categoryId: initialData?.categoryId || '',
        coverImage: initialData?.coverImage || '',
        status: initialData?.status || 'DRAFT',
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
    });

    const { data: categories } = trpc.category.list.useQuery();

    const createMutation = trpc.article.create.useMutation();
    const updateMutation = trpc.article.update.useMutation();

    const isEditing = !!initialData?.id;
    const isSaving = createMutation.isLoading || updateMutation.isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            categoryId: (formData.categoryId === '' || formData.categoryId === 'none') ? null : formData.categoryId,
        };

        try {
            if (isEditing) {
                await updateMutation.mutateAsync({
                    id: initialData.id,
                    ...payload,
                });
            } else {
                await createMutation.mutateAsync(payload as any);
            }
            toast.success(`Article ${isEditing ? 'updated' : 'created'} successfully!`);
            router.push('/dashboard/articles');
            router.refresh();
        } catch (error) {
            toast.error('Error saving article: ' + (error as Error).message);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        if (!isEditing && !formData.slug) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, title, slug }));
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href="/dashboard/articles">
                            <ChevronLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            {isEditing ? 'Edit Article' : 'New Article'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Refine your content and update settings.' : 'Start drafting your next masterpiece.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="gap-2 shadow-lg shadow-primary/20 min-w-[120px]"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isEditing ? 'Save Changes' : 'Create Article'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Content & Structure
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-base font-semibold">Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                    placeholder="Enter a compelling title..."
                                    className="text-xl h-14 font-bold bg-muted/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="flex items-center gap-2 font-semibold">
                                    <LinkIcon className="w-4 h-4" />
                                    URL Slug
                                </Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground font-mono hidden sm:inline">blog.com/</span>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                        className="font-mono text-sm bg-muted/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label htmlFor="content" className="flex items-center gap-2 font-semibold">
                                    <Type className="w-4 h-4" />
                                    Body Content (Rich Text)
                                </Label>
                                <TiptapEditor
                                    value={formData.content}
                                    onChange={(markdown) => setFormData({ ...formData, content: markdown })}
                                    placeholder="Start telling your story..."
                                    className="min-h-[600px] border-border/50 bg-muted/5"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-primary" />
                                Search Engine Optimization
                            </CardTitle>
                            <CardDescription>
                                Optimize how your article appears in search results and social media.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="excerpt" className="font-semibold">Search Meta Description (Excerpt)</Label>
                                <Textarea
                                    id="excerpt"
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    placeholder="A brief summary for search engines..."
                                    className="bg-muted/20 h-24"
                                />
                                <p className="text-[10px] text-muted-foreground text-right italic">
                                    {formData.excerpt.length} / 160 characters recommended
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary" />
                                Visibility
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label className="font-semibold">Publication Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val as any })}
                                >
                                    <SelectTrigger className="bg-muted/20">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="REVIEW">Ready for Review</SelectItem>
                                        <SelectItem value="PUBLISHED">Published Live</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold">Category</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                >
                                    <SelectTrigger className="bg-muted/20">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Uncategorized</SelectItem>
                                        {categories?.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 py-4 flex justify-between items-center text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {isEditing ? 'Updated today' : 'Not yet created'}
                            </div>
                            {isEditing && (
                                <Link href={`/article/${formData.slug}`} target="_blank" className="flex items-center gap-1 text-primary hover:underline">
                                    <Eye className="w-3 h-3" />
                                    View Live
                                </Link>
                            )}
                        </CardFooter>
                    </Card>

                    <Card className="border-border/50 shadow-sm overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Layout className="w-4 h-4 text-primary" />
                                Featured Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <MediaUploader
                                currentImage={formData.coverImage}
                                onUpload={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
