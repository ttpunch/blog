import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const mediaRouter = router({
    // Generate upload signature
    getUploadSignature: protectedProcedure.mutation(() => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: 'blog-platform',
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return {
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        };
    }),

    // Save media to DB (optional, if we want to track library)
    save: protectedProcedure
        .input(
            z.object({
                filename: z.string(),
                url: z.string(),
                publicId: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
                format: z.string().optional(),
                bytes: z.number().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.media.create({ data: input });
        }),
});
