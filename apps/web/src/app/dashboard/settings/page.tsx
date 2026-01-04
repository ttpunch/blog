'use client';

import { trpc } from '@/lib/trpc';
import { useState, useEffect } from 'react';
import {
    Settings,
    Sparkles,
    Zap,
    Globe,
    Save,
    Database,
    Bot,
    Shield,
    Bell,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const { data: settings } = trpc.settings.get.useQuery();
    const updateMutation = trpc.settings.update.useMutation();

    const [formData, setFormData] = useState({
        siteName: '',
        defaultProvider: 'openai',
        openaiModel: 'gpt-4o',
        ollamaModel: '',
        ollamaEndpoint: '',
        autoPublish: false,
        dailyLimit: 3,
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                siteName: settings.siteName || '',
                defaultProvider: settings.defaultProvider,
                openaiModel: settings.openaiModel,
                ollamaModel: settings.ollamaModel || '',
                ollamaEndpoint: settings.ollamaEndpoint || '',
                autoPublish: settings.autoPublish,
                dailyLimit: settings.dailyLimit,
            });
        }
    }, [settings]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateMutation.mutateAsync(formData as any);
        // We could show a toast here
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground">Configure your blog, AI models, and automation workflows.</p>
                </div>
                <Button
                    onClick={handleSubmit}
                    className="gap-2 shadow-lg shadow-primary/20"
                    disabled={updateMutation.isLoading}
                >
                    {updateMutation.isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Save Changes
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-3 bg-muted/50 p-1">
                    <TabsTrigger value="general" className="gap-2">
                        <Globe className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="gap-2">
                        <Sparkles className="w-4 h-4" />
                        AI Models
                    </TabsTrigger>
                    <TabsTrigger value="automation" className="gap-2">
                        <Zap className="w-4 h-4" />
                        Auto
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="general" className="space-y-6">
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-xl">Branding & Identity</CardTitle>
                                <CardDescription>Manage how your blog appears to the public.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="siteName">Site Name</Label>
                                    <Input
                                        id="siteName"
                                        value={formData.siteName}
                                        onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                                        placeholder="My Awesome Blog"
                                        className="bg-muted/30"
                                    />
                                    <p className="text-xs text-muted-foreground">This name is used in titles and metadata.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="ai" className="space-y-6">
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Bot className="w-5 h-5 text-primary" />
                                    AI Engine Configuration
                                </CardTitle>
                                <CardDescription>Set up providers for content generation and research.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-2">
                                    <Label>Default Generation Provider</Label>
                                    <Select
                                        value={formData.defaultProvider}
                                        onValueChange={(val) => setFormData({ ...formData, defaultProvider: val })}
                                    >
                                        <SelectTrigger className="bg-muted/30">
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="openai">OpenAI (Recommended)</SelectItem>
                                            <SelectItem value="openrouter">OpenRouter (Unified API)</SelectItem>
                                            <SelectItem value="ollama">Ollama (Local Host)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Separator />

                                {formData.defaultProvider === 'openai' && (
                                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                                        <Label htmlFor="openaiModel">OpenAI Model Name</Label>
                                        <Input
                                            id="openaiModel"
                                            value={formData.openaiModel}
                                            onChange={(e) => setFormData({ ...formData, openaiModel: e.target.value })}
                                            className="bg-muted/30 font-mono"
                                        />
                                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase tracking-tight pt-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Active Model: gpt-4o
                                        </div>
                                    </div>
                                )}

                                {formData.defaultProvider === 'ollama' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
                                        <div className="grid gap-2">
                                            <Label htmlFor="ollamaEndpoint">Ollama Endpoint</Label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="ollamaEndpoint"
                                                    placeholder="http://localhost:11434"
                                                    value={formData.ollamaEndpoint}
                                                    onChange={(e) => setFormData({ ...formData, ollamaEndpoint: e.target.value })}
                                                    className="pl-10 bg-muted/30"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ollamaModel">Local Model Name</Label>
                                            <div className="relative">
                                                <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input
                                                    id="ollamaModel"
                                                    placeholder="llama3"
                                                    value={formData.ollamaModel}
                                                    onChange={(e) => setFormData({ ...formData, ollamaModel: e.target.value })}
                                                    className="pl-10 bg-muted/30"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="automation" className="space-y-6">
                        <Card className="border-border/50">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-primary" />
                                    Policy & Safety
                                </CardTitle>
                                <CardDescription>Control how AI content is handled by the system.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex flex-col space-y-1">
                                        <Label htmlFor="autoPublish" className="text-base font-semibold">Auto-publish Strategy</Label>
                                        <p className="text-sm text-muted-foreground">Skip the Review Queue and publish articles immediately after generation.</p>
                                    </div>
                                    <Switch
                                        id="autoPublish"
                                        checked={formData.autoPublish}
                                        onCheckedChange={(checked) => setFormData({ ...formData, autoPublish: checked })}
                                    />
                                </div>

                                <Separator />

                                <div className="grid gap-2 w-full md:w-1/2">
                                    <Label htmlFor="dailyLimit">Daily Article Limit</Label>
                                    <div className="flex items-center gap-3">
                                        <Input
                                            id="dailyLimit"
                                            type="number"
                                            value={formData.dailyLimit}
                                            onChange={(e) => setFormData({ ...formData, dailyLimit: parseInt(e.target.value) })}
                                            className="bg-muted/30"
                                        />
                                        <Badge variant="outline" className="h-10 px-4">articles/day</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Limits the number of automatic generations to control costs.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>

            <div className="flex justify-end border-t pt-8">
                <p className="text-sm text-muted-foreground">
                    Last synced with backend: {new Date().toLocaleTimeString()}
                </p>
            </div>
        </div>
    );
}
