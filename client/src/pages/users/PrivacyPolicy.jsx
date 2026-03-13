import React from 'react';
import { Shield, Lock, Eye, FileText, Bell, Users, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-paper-bg pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sindoor/10 text-sindoor mb-6">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif text-heritage-dark mb-4">{t('privacy.title')}</h1>

                    <p className="text-stone-500 font-medium">{t('privacy.last_updated')}: {t('privacy.date')}</p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-8 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-marigold/10 shadow-xl bg-white/60 space-y-12 text-stone-700 leading-relaxed font-medium">
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('privacy.intro_title')}</h2>

                        </div>
                        <p className="mb-4">
                            {t('privacy.intro_p1')}
                        </p>
                        <p>
                            {t('privacy.intro_p2')}
                        </p>

                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('privacy.collect_title')}</h2>

                        </div>
                        <p className="mb-4">{t('privacy.collect_p1')}</p>
                        <ul className="list-disc pl-6 space-y-3">
                            <li>{t('privacy.collect_li1')}</li>
                            <li>{t('privacy.collect_li2')}</li>
                            <li>{t('privacy.collect_li3')}</li>
                        </ul>

                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('privacy.security_title')}</h2>

                        </div>
                        <p>
                            {t('privacy.security_p')}
                        </p>

                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('privacy.gateway_title')}</h2>

                        </div>
                        <p>
                            {t('privacy.gateway_p')}
                        </p>

                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('privacy.third_party_title')}</h2>

                        </div>
                        <p>
                            {t('privacy.third_party_p')}
                        </p>

                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('privacy.changes_title')}</h2>

                        </div>
                        <p>
                            {t('privacy.changes_p')}
                        </p>

                    </section>

                    <div className="pt-10 border-t border-marigold/20">
                        <p className="text-center text-sm italic">
                            {t('privacy.contact_text')} <span className="text-sindoor font-bold">info@shyampuja.com</span>

                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
