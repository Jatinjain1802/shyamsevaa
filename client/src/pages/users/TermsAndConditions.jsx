import React from 'react';
import { FileText, ShieldCheck, CreditCard, Scale, UserCheck, AlertCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const TermsAndConditions = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-paper-bg pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sindoor/10 text-sindoor mb-6">
                        <Scale className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif text-heritage-dark mb-4 drop-shadow-sm">{t('terms.title')}</h1>

                    <p className="text-stone-500 font-medium italic">{t('terms.effective_date')}</p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-8 rounded-full"></div>
                </div>

                {/* Content Container */}
                <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-marigold/10 shadow-2xl bg-white/70 space-y-16 text-stone-700 leading-relaxed font-medium">

                    {/* section 1: Introduction */}
                    <section className="relative">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-sindoor/10 rounded-2xl text-sindoor">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-heritage-dark border-b-2 border-marigold/20 pb-2">{t('terms.agreement_title')}</h2>

                        </div>
                        <p className="text-lg">
                            {t('terms.agreement_p')}
                        </p>

                    </section>

                    {/* section 2: Service Bookings */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-heritage-dark border-b-2 border-marigold/20 pb-2">{t('terms.services_title')}</h2>

                        </div>
                        <div className="space-y-4">
                            <p>
                                {t('terms.services_p')}
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <li className="flex gap-3 items-start p-4 bg-white/50 rounded-2xl border border-marigold/10">
                                    <ShieldCheck className="w-5 h-5 text-marigold shrink-0 mt-1" />
                                    <span>{t('terms.services_li1')}</span>
                                </li>
                                <li className="flex gap-3 items-start p-4 bg-white/50 rounded-2xl border border-marigold/10">
                                    <ShieldCheck className="w-5 h-5 text-marigold shrink-0 mt-1" />
                                    <span>{t('terms.services_li2')}</span>
                                </li>
                            </ul>
                        </div>

                    </section>

                    {/* section 3: User Responsibilities */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-sindoor/10 rounded-2xl text-sindoor">
                                <UserCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-heritage-dark border-b-2 border-marigold/20 pb-2">{t('terms.user_resp_title')}</h2>

                        </div>
                        <ul className="space-y-4 list-disc pl-6">
                            <li>{t('terms.user_resp_li1')}</li>
                            <li>{t('terms.user_resp_li2')}</li>
                            <li>{t('terms.user_resp_li3')}</li>
                        </ul>

                    </section>

                    {/* section 4: Liability */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-heritage-dark border-b-2 border-marigold/20 pb-2">{t('terms.liability_title')}</h2>

                        </div>
                        <p>
                            {t('terms.liability_p')}
                        </p>

                    </section>

                    {/* section 5: IP */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-heritage-dark border-b-2 border-marigold/20 pb-2">{t('terms.ip_title')}</h2>

                        </div>
                        <p>
                            {t('terms.ip_p')}
                        </p>

                    </section>

                    {/* Footer within card */}
                    <div className="pt-12 border-t border-marigold/20 text-center space-y-4">
                        <p className="text-stone-400 text-sm font-serif italic">
                            {t('terms.consent_text')}

                        </p>
                        <div className="flex justify-center flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-sindoor/5 rounded-full flex items-center justify-center">
                                <img src="/logo.png" alt="Logo" className="w-8 h-8 opacity-40" />
                            </div>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em]">
                                {t('terms.footer_text')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
