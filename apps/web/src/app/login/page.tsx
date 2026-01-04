'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid email or password');
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoogleSignIn = () => {
        setGoogleLoading(true);
        signIn('google', { callbackUrl: '/dashboard' });
    };

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Welcome Back
                        </h1>
                        <p className="text-balance text-muted-foreground text-sm">
                            Enter your email below to login to your account
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <Button variant="outline" className="w-full relative" onClick={handleGoogleSignIn} disabled={googleLoading || loading}>
                            {googleLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Chrome className="mr-2 h-4 w-4" />
                            )}
                            Sign in with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                    />
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-xs underline text-muted-foreground hover:text-primary"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-9"
                                    />
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                            {error && (
                                <div className="text-sm text-destructive font-medium text-center bg-destructive/10 p-2 rounded-md">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={loading || googleLoading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline text-primary hover:text-primary/80">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-background opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full text-white p-10 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center mb-8 shadow-2xl border border-white/20">
                        <div className="w-12 h-12 bg-white rounded-lg" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">AI-Powered Content</h2>
                    <p className="text-lg text-white/80 max-w-md leading-relaxed">
                        Manage your blog, analyze engagement, and scale your content creation with our advanced platform.
                    </p>
                </div>
            </div>
        </div>
    );
}
