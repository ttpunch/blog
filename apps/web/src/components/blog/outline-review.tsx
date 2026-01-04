'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Rocket, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

interface OutlineReviewProps {
    articleId: string;
    initialOutline: any;
}

export default function OutlineReview({ articleId, initialOutline }: OutlineReviewProps) {
    const [outline, setOutline] = useState(initialOutline);
    const [isApproving, setIsApproving] = useState(false);
    const router = useRouter();
    const approveMutation = trpc.ai.approveOutline.useMutation();

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            await approveMutation.mutateAsync({
                articleId,
                editedOutline: outline
            });
            // After approval, the status changes to WRITING.
            // Ideally we stay here and show a "Writing..." state or redirect to a wait page.
            // Using window.location.reload() to pick up the new status in the parent component is easiest
            // or we could let the parent polling handle it if we didn't block it.
            // But since this is a sub-component, let's just show loading until parent updates.
            window.location.reload();
        } catch (error) {
            console.error(error);
            setIsApproving(false);
        }
    };

    const updateSection = (index: number, field: string, value: any) => {
        const newSections = [...outline.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        setOutline({ ...outline, sections: newSections });
    };

    const addSection = () => {
        setOutline({
            ...outline,
            sections: [...outline.sections, { title: "New Section", keyPoints: [], estimatedWordCount: 200 }]
        });
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-2 text-center mb-8">
                <h1 className="text-3xl font-bold">Review Outline</h1>
                <p className="text-muted-foreground">The AI has planned your article. Review and edit the outline before writing starts.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Article Meta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={outline.title}
                            onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={outline.description}
                            onChange={(e) => setOutline({ ...outline, description: e.target.value })}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Sections</h2>
                    <Button variant="outline" size="sm" onClick={addSection}>
                        <Plus className="w-4 h-4 mr-2" /> Add Section
                    </Button>
                </div>

                {outline.sections.map((section: any, idx: number) => (
                    <Card key={idx} className="border-l-4 border-l-primary/30">
                        <CardHeader className="py-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm font-semibold">Section {idx + 1}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/50 hover:text-destructive" onClick={() => {
                                    const newSections = outline.sections.filter((_: any, i: number) => i !== idx);
                                    setOutline({ ...outline, sections: newSections });
                                }}>
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Heading</Label>
                                <Input
                                    value={section.title}
                                    onChange={(e) => updateSection(idx, 'title', e.target.value)}
                                    className="text-lg font-bold"
                                    placeholder="Enter section heading..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Key Points</Label>
                                <Textarea
                                    value={section.keyPoints?.join('\n')}
                                    onChange={(e) => updateSection(idx, 'keyPoints', e.target.value.split('\n'))}
                                    className="min-h-[80px]"
                                    placeholder="One point per line"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-end pt-6">
                <Button
                    size="lg"
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full md:w-auto text-lg px-8 gap-2 shadow-lg"
                >
                    {isApproving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Starting Generation...
                        </>
                    ) : (
                        <>
                            <Rocket className="w-5 h-5" />
                            Approve & Write Article
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
