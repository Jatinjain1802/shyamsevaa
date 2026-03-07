import React from 'react';
import { RefreshCw, Clock, AlertCircle, FileText, HelpCircle, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const RefundPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-paper-bg pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-marigold/10 text-marigold mb-6">
                        <RefreshCw className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif text-heritage-dark mb-4">{t('refund.title')}</h1>
                    <p className="text-stone-500 font-medium">{t('refund.last_updated')}: {t('refund.date')}</p>
                    <div className="w-24 h-1 bg-marigold mx-auto mt-8 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-marigold/10 shadow-xl bg-white/60 space-y-12 text-stone-700 leading-relaxed font-medium">
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <HelpCircle className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('refund.intro_title')}</h2>
                        </div>
                        <p>{t('refund.intro_p')}</p>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-sindoor/10 rounded-2xl text-sindoor">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('refund.cancellation_title')}</h2>
                        </div>
                        <p className="mb-4">{t('refund.cancellation_p')}</p>
                        <ul className="space-y-4">
                            <li className="flex gap-4 items-start p-4 bg-white/50 rounded-2xl border border-marigold/10 transition-all hover:shadow-md">
                                <AlertCircle className="w-5 h-5 text-marigold shrink-0 mt-1" />
                                <span>{t('refund.can_li1')}</span>
                            </li>
                            <li className="flex gap-4 items-start p-4 bg-white/50 rounded-2xl border border-marigold/10 transition-all hover:shadow-md">
                                <AlertCircle className="w-5 h-5 text-marigold shrink-0 mt-1" />
                                <span>{t('refund.can_li2')}</span>
                            </li>
                            <li className="flex gap-4 items-start p-4 bg-white/50 rounded-2xl border border-marigold/10 transition-all hover:shadow-md">
                                <AlertCircle className="w-5 h-5 text-marigold shrink-0 mt-1" />
                                <span>{t('refund.can_li3')}</span>
                            </li>
                        </ul>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('refund.refund_title')}</h2>
                        </div>
                        <p>{t('refund.refund_p')}</p>
                    </section>

                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-marigold/10 rounded-2xl text-marigold">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-serif text-sindoor">{t('refund.exceptions_title')}</h2>
                        </div>
                        <p>{t('refund.exceptions_p')}</p>
                    </section>

                    <div className="pt-10 border-t border-marigold/20">
                        <p className="text-center text-sm italic flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4 text-sindoor" />
                            {t('refund.contact_text')} <span className="text-sindoor font-bold">support@shyampuja.com</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
