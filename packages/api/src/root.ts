import { router } from './trpc';
import { articleRouter } from './routers/article';
import { categoryRouter, tagRouter } from './routers/category';
import { settingsRouter } from './routers/settings';
import { queueRouter } from './routers/queue';
import { mediaRouter } from './routers/media';
import { aiRouter } from './routers/ai';
import { likeRouter } from './routers/like';
import { commentRouter } from './routers/comment';
import { clapRouter } from './routers/clap';

export const appRouter = router({
    article: articleRouter,
    category: categoryRouter,
    tag: tagRouter,
    settings: settingsRouter,
    queue: queueRouter,
    media: mediaRouter,
    ai: aiRouter,
    like: likeRouter,
    comment: commentRouter,
    clap: clapRouter,
});

export type AppRouter = typeof appRouter;
