'use client';

import { motion } from 'framer-motion';
import { FuturisticBackground } from '@/components/ui/futuristic-background';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
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
                            <Shield className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none bg-card/30 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
                        <div className="text-sm text-muted-foreground mb-8 font-mono">
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>

                        <p className="lead text-xl text-muted-foreground/80 leading-relaxed mb-8">
                            Your privacy is critically important to us. At AI Blog Platform, we have a few fundamental principles:
                        </p>

                        <section className="mb-10">
                            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                                <Eye className="w-5 h-5 text-primary" />
                                1. Information We Collect
                            </h2>
                            <p className="text-muted-foreground">
                                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                                <li><strong>Log Data:</strong> When you visit our website, our servers may automatically log the standard data provided by your web browser.</li>
                                <li><strong>Device Data:</strong> We may also collect data about the device you use to access our website.</li>
                                <li><strong>Personal Information:</strong> We may ask for personal information, such as your name and email address, when you register for an account or subscribe to our newsletter.</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                                <Lock className="w-5 h-5 text-primary" />
                                2. How We Use Information
                            </h2>
                            <p className="text-muted-foreground">
                                We use the information we collect in various ways, including to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                                <li>Provide, operate, and maintain our website</li>
                                <li>Improve, personalize, and expand our website</li>
                                <li>Understand and analyze how you use our website</li>
                                <li>Develop new products, services, features, and functionality</li>
                                <li>Communicate with you, either directly or through one of our partners</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
                                <FileText className="w-5 h-5 text-primary" />
                                3. Cookies and Web Beacons
                            </h2>
                            <p className="text-muted-foreground">
                                Like any other website, AI Blog Platform uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-white mb-4">4. Third Party Privacy Policies</h2>
                            <p className="text-muted-foreground">
                                AI Blog Platform's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-xl font-bold text-white mb-4">5. GDPR Data Protection Rights</h2>
                            <p className="text-muted-foreground">
                                We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
                                <li>The right to access – You have the right to request copies of your personal data.</li>
                                <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
                                <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
                            </ul>
                        </section>

                        <div className="pt-8 mt-8 border-t border-white/10">
                            <p className="text-muted-foreground text-sm">
                                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
