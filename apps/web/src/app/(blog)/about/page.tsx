'use client';

import { motion } from 'framer-motion';
import { FuturisticBackground } from '@/components/ui/futuristic-background';
import { Sparkles, Users, Target, Rocket, Mail, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="relative min-h-screen pt-24 pb-16 overflow-hidden">
            <FuturisticBackground />

            <div className="container mx-auto px-4 relative z-10">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest backdrop-blur-sm shadow-lg shadow-primary/5 mb-6"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Our Mission
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/50"
                    >
                        Democratizing <br />
                        <span className="text-primary">AI Knowledge</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground leading-relaxed"
                    >
                        We are a collective of researchers, engineers, and futurists dedicated to explaining the complex world of Artificial Intelligence to everyone.
                    </motion.p>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {[
                        { icon: Target, title: "Curated Insights", desc: "We cut through the noise to bring you high-signal, thoroughly researched content about the latest in AI." },
                        { icon: Users, title: "Community First", desc: "Building a platform where ideas flourish and discussions drive the understanding of technology forward." },
                        { icon: Rocket, title: "Future Focused", desc: "Not just reporting on today, but analyzing the trajectories that will define our tomorrow." }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="bg-card/20 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] hover:bg-card/30 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-primary">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Team / Contact Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-1 rounded-[2.5rem]"
                >
                    <div className="bg-black/80 backdrop-blur-xl rounded-[2.4rem] p-10 md:p-16 text-center border border-white/10">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Join the Conversation</h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                            Have a topic you want us to cover? Or just want to say hi? We are always listening to our community.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="mailto:hello@aiblog.com" className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-colors">
                                <Mail className="w-5 h-5" />
                                Get in Touch
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 transition-colors font-bold backdrop-blur-md">
                                <Globe className="w-5 h-5" />
                                Follow Updates
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
