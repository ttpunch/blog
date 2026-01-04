'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/navigation';
import {
    Sparkles,
    PenTool,
    Hash,
    Settings2,
    Rocket,
    CheckCircle,
    AlertTriangle,
    Loader2,
    Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

export default function AIWriterPage() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [tone, setTone] = useState('professional');
    const [length, setLength] = useState('medium');
    const [provider, setProvider] = useState<'openai' | 'ollama' | 'openrouter'>('openai');
    const [modelName, setModelName] = useState('gpt-4o');
    const [articleId, setArticleId] = useState<string | null>(null);
    const [currentStatus, setCurrentStatus] = useState<string | null>(null);

    const generateMutation = trpc.ai.generateOutline.useMutation();

    // Polling for status
    const { data: statusData } = trpc.ai.getArticleStatus.useQuery(
        { id: articleId || '' },
        {
            enabled: !!articleId && currentStatus !== 'REVIEW' && currentStatus !== 'AWAITING_APPROVAL' && currentStatus !== 'REJECTED',
            refetchInterval: 2000 // Poll every 2 seconds
        }
    );

    // Update status from polling
    useEffect(() => {
        if (statusData?.status) {
            setCurrentStatus(statusData.status);
            if (statusData.status === 'REVIEW') {
                setIsGenerating(false);
                router.push('/dashboard/review');
            } else if (statusData.status === 'AWAITING_APPROVAL') {
                setIsGenerating(false);
                router.push(`/dashboard/articles/${articleId}/edit`);
            }
        }
    }, [statusData, router, articleId]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsGenerating(true);
        setArticleId(null);
        setCurrentStatus('QUEUED');

        try {
            const res = await generateMutation.mutateAsync({
                topic,
                provider,
                modelName: modelName || undefined
            });

            setArticleId(res.id);
        } catch (error) {
            console.error('Generation failed:', error);
            setIsGenerating(false);
            setCurrentStatus('REJECTED');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    AI-Powered Writing
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight">AI Content Writer</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Start with an intelligent outline, then write.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PenTool className="w-5 h-5 text-primary" />
                            Article Brief
                        </CardTitle>
                        <CardDescription>
                            Define the scope and style of your article.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="ai-writer-form" onSubmit={handleGenerate} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="topic" className="text-base font-semibold">Topic or Target Keywords</Label>
                                <Input
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., The impact of remote work on urban planning..."
                                    className="text-lg py-6 bg-muted/30"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Be specific for better results. Try to include context or a specific angle.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-semibold">
                                        <Settings2 className="w-4 h-4" />
                                        AI Provider
                                    </Label>
                                    <Select value={provider} onValueChange={(val: any) => {
                                        setProvider(val);
                                        // Reset model defaults when provider changes
                                        if (val === 'openai') setModelName('gpt-4o');
                                        else if (val === 'openrouter') setModelName('mistralai/devstral-2512:free');
                                        else if (val === 'ollama') setModelName('gpt-oss:120b');
                                    }}>
                                        <SelectTrigger className="bg-muted/30">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI</SelectItem>
                                            <SelectItem value="openrouter">OpenRouter</SelectItem>
                                            <SelectItem value="ollama">Ollama (Cloud/Local)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-semibold">
                                        <Rocket className="w-4 h-4" />
                                        Model ID
                                    </Label>
                                    <Input
                                        value={modelName}
                                        onChange={(e) => setModelName(e.target.value)}
                                        placeholder={provider === 'openrouter' ? 'e.g. mistralai/mistral-7b' : 'Model name'}
                                        className="bg-muted/30"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-semibold">
                                        <Type className="w-4 h-4" />
                                        Tone of Voice
                                    </Label>
                                    <Select value={tone} onValueChange={setTone}>
                                        <SelectTrigger className="bg-muted/30">
                                            <SelectValue placeholder="Select tone" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="casual">Casual & Friendly</SelectItem>
                                            <SelectItem value="technical">Deeply Technical</SelectItem>
                                            <SelectItem value="persuasive">Persuasive / Sales</SelectItem>
                                            <SelectItem value="humorous">Humorous / Witty</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-semibold">
                                        <Hash className="w-4 h-4" />
                                        Expected Length
                                    </Label>
                                    <Select value={length} onValueChange={setLength}>
                                        <SelectTrigger className="bg-muted/30">
                                            <SelectValue placeholder="Select length" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="short">Short (300-500 words)</SelectItem>
                                            <SelectItem value="medium">Standard (800-1200 words)</SelectItem>
                                            <SelectItem value="long">Deep Dive (2000+ words)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <Separator />
                    <CardFooter className="py-6 px-6 bg-muted/10">
                        <Button
                            form="ai-writer-form"
                            type="submit"
                            size="lg"
                            className="w-full text-lg h-14 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
                            disabled={isGenerating || !topic.trim()}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating Plan...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-5 h-5" />
                                    Generate Outline
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6 text-sm">
                    <Card className="border-border/50 bg-card/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Settings2 className="w-4 h-4" />
                                Model Specs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center bg-muted/50 p-2 rounded border border-border/50">
                                <span className="text-muted-foreground font-medium">Provider</span>
                                <span className="font-bold flex items-center gap-1">
                                    {provider === 'openai' ? 'OpenAI' : provider === 'openrouter' ? 'OpenRouter' : 'Ollama'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center bg-muted/50 p-2 rounded border border-border/50">
                                <span className="text-muted-foreground font-medium">Model</span>
                                <span className="font-bold flex items-center gap-1 truncate max-w-[120px]">
                                    {modelName || 'Default'}
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                </span>
                            </div>
                            <div className="p-3 bg-primary/5 rounded border border-primary/10 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-tight text-primary">Pipeline flow</span>
                                <div className="space-y-1.5 font-mono text-[11px] text-muted-foreground">
                                    <div className={`flex items-center gap-2 transition-colors ${['QUEUED', 'PLANNING', 'AWAITING_APPROVAL'].includes(currentStatus || '') ? 'text-primary font-bold' : ''}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${['QUEUED', 'PLANNING', 'AWAITING_APPROVAL'].includes(currentStatus || '') ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                                        Planning & Outline
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors ${['AWAITING_APPROVAL'].includes(currentStatus || '') ? 'text-primary font-bold' : ''}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${['AWAITING_APPROVAL'].includes(currentStatus || '') ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                                        User Approval
                                    </div>
                                    <div className={`flex items-center gap-2 transition-colors ${['RESEARCHING', 'WRITING', 'OPTIMIZING', 'REVIEW'].includes(currentStatus || '') ? 'text-primary font-bold' : ''}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${['RESEARCHING', 'WRITING', 'OPTIMIZING', 'REVIEW'].includes(currentStatus || '') ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                                        Drafting & SEO
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="px-2 space-y-4">
                        <div className="flex gap-3">
                            <div className="mt-1 p-1 bg-amber-500/10 rounded-full h-fit">
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                You'll get to <strong>review the outline</strong> before the AI writes the full article.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
