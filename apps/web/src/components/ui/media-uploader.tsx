'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Image as LucideImage, X, UploadCloud, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function MediaUploader({
    onUpload,
    currentImage,
}: {
    onUpload: (url: string) => void;
    currentImage?: string;
}) {
    const [uploading, setUploading] = useState(false);
    const getSignature = trpc.media.getUploadSignature.useMutation();
    const saveMedia = trpc.media.save.useMutation();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // 1. Get signature
            const { signature, timestamp, apiKey, cloudName } = await getSignature.mutateAsync();

            // 2. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', apiKey!);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', 'blog-platform');

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await res.json();

            if (data.secure_url) {
                // 3. Save to DB
                await saveMedia.mutateAsync({
                    filename: file.name,
                    url: data.secure_url,
                    publicId: data.public_id,
                    width: data.width,
                    height: data.height,
                    format: data.format,
                    bytes: data.bytes,
                });

                onUpload(data.secure_url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={cn(
            "relative group flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-xl transition-all",
            currentImage ? "border-transparent" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50",
            uploading && "opacity-60 cursor-not-allowed"
        )}>
            {currentImage ? (
                <div className="relative w-full h-full">
                    <img
                        src={currentImage}
                        alt="Preview"
                        className="w-full max-h-[400px] object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full shadow-lg"
                            onClick={() => onUpload('')}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center gap-3 cursor-pointer w-full h-full p-8">
                    <div className="p-4 bg-primary/5 rounded-full text-primary group-hover:bg-primary/10 transition-colors">
                        {uploading ? (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        ) : (
                            <UploadCloud className="w-8 h-8" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold">
                            {uploading ? 'Finalizing upload...' : 'Click to upload cover image'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG or WEBP (Max 5MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    );
}
