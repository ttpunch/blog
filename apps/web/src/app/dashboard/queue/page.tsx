'use client';

import { trpc } from '@/lib/trpc';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Trash2,
    ListTodo,
    TrendingUp,
    Sparkles,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

export default function QueuePage() {
    const { data: queueItems, refetch, isLoading } = trpc.queue.list.useQuery({});
    const addMutation = trpc.queue.add.useMutation();
    const deleteMutation = trpc.queue.delete.useMutation();

    const [newTopic, setNewTopic] = useState('');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTopic.trim()) return;

        await addMutation.mutateAsync({ topic: newTopic });
        setNewTopic('');
        refetch();
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this topic from queue?')) return;
        await deleteMutation.mutateAsync({ id });
        refetch();
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight">Content Queue</h1>
                <p className="text-muted-foreground text-lg">
                    Plan and organize upcoming blog topics for AI generation.
                </p>
            </div>

            {/* Add New Topic */}
            <Card className="border-border/50 shadow-sm bg-primary/5 border-primary/10">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                        <Plus className="w-5 h-5" />
                        Add New Topic
                    </CardTitle>
                    <CardDescription>
                        Enter a subject and the AI will research and draft an article for it.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="text"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            placeholder="e.g., The Future of Quantum Computing, Healthy Breakfast Ideas..."
                            className="flex-1 bg-background"
                        />
                        <Button
                            type="submit"
                            disabled={addMutation.isLoading || !newTopic.trim()}
                            className="gap-2"
                        >
                            {addMutation.isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            Add to Queue
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Queue List */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-muted-foreground" />
                        Upcoming Topics
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/30">
                                <TableHead className="pl-6 w-[60%]">Topic</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                        Loading queue...
                                    </TableCell>
                                </TableRow>
                            ) : queueItems?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <AlertCircle className="w-8 h-8 opacity-20" />
                                            <p>Queue is empty. Add a topic above to get started.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                queueItems?.map((item) => (
                                    <TableRow key={item.id} className="group transition-colors">
                                        <TableCell className="pl-6 py-4 font-medium italic">
                                            "{item.topic}"
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={item.status === 'COMPLETED' ? 'outline' : 'default'}
                                                className={cn(
                                                    "capitalize",
                                                    item.status === 'PENDING' && "bg-blue-500/10 text-blue-600 border-none px-2.5",
                                                    item.status === 'PROCESSING' && "bg-amber-500/10 text-amber-600 border-none px-2.5 animate-pulse"
                                                )}
                                            >
                                                {item.status.toLowerCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <TrendingUp className={cn(
                                                    "w-3.5 h-3.5",
                                                    item.priority > 3 ? "text-amber-500" : "text-muted-foreground"
                                                )} />
                                                <span className="text-sm font-semibold">{item.priority}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(item.id)}
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
