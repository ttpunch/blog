'use client';

import { motion } from 'framer-motion';
import { FuturisticBackground } from '@/components/ui/futuristic-background';
import { Gavel, AlertCircle, CheckCircle, Scale } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            <FuturisticBackground />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <Scale className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Terms of Service</h1>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none bg-card/30 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <div className="text-sm text-muted-foreground mb-8 font-mono">
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>

                        <p className="lead text-xl text-muted-foreground/80 leading-relaxed mb-8">
                            Welcome to AI Blog Platform! These terms and conditions outline the rules and regulations for the use of our website.
                        </p>

                        <section className="mb-10">
                            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                1. Acceptance of Terms
                            </h2>
                            <p className="text-muted-foreground">
                                By accessing this website we assume you accept these terms and conditions. Do not continue to use AI Blog Platform if you do not agree to take all of the terms and conditions stated on this page.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                                <Gavel className="w-5 h-5 text-primary" />
                                2. Intellectual Property Rights
                            </h2>
                            <p className="text-muted-foreground">
                                Other than the content you own, under these Terms, AI Blog Platform and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted limited license only for purposes of viewing the material contained on this Website.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                                <AlertCircle className="w-5 h-5 text-primary" />
                                3. Restrictions
                            </h2>
                            <p className="text-muted-foreground mb-4">
                                You are specifically restricted from all of the following:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>Publishing any Website material in any other media;</li>
                                <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                                <li>Publicly performing and/or showing any Website material;</li>
                                <li>Using this Website in any way that is or may be damaging to this Website;</li>
                                <li>Using this Website in any way that impacts user access to this Website;</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-white mb-4">4. Your Content</h2>
                            <p className="text-muted-foreground">
                                In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant AI Blog Platform a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-white mb-4">5. No Warranties</h2>
                            <p className="text-muted-foreground">
                                This Website is provided "as is," with all faults, and AI Blog Platform express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                            <p className="text-muted-foreground">
                                In no event shall AI Blog Platform, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.  AI Blog Platform, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
                            </p>
                        </section>

                        <div className="pt-8 mt-8 border-t border-white/10">
                            <p className="text-muted-foreground text-sm">
                                These terms are effective as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
