import { MdSelfImprovement, MdTempleHindu, MdSecurity, MdHistory, MdGroups, MdVolunteerActivism } from "react-icons/md";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import StatsSection from "../../components/home/StatsSection";


export default function About() {
    const { t } = useTranslation();

    return (
        <div className="bg-paper-bg min-h-screen pt-8 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="py-4 text-sm text-stone-600 font-bold tracking-widest uppercase mb-8 flex items-center gap-2">
                    <Link to="/" className="hover:text-sindoor transition-colors">{t('nav.home')}</Link>
                    <span className="text-marigold">/</span>
                    <span className="text-sindoor">{t('about.title')}</span>
                </div>


                {/* Header Section */}
                <div className="text-center mb-16">
                    <MdSelfImprovement className="text-marigold text-6xl mb-4 mx-auto" />
                    <h1 className="text-4xl md:text-6xl text-heritage-dark mb-6 font-serif font-bold">
                        {t('about.title_part1')} <span className="text-sindoor">{t('about.title_part2')}</span>
                    </h1>

                    <p className="text-xl text-stone-600 max-w-3xl mx-auto font-sans leading-relaxed">
                        {t('about.tagline')}
                    </p>

                    <div className="w-24 h-1 bg-marigold mx-auto mt-8 rounded-full"></div>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="relative h-[400px] rounded-4xl overflow-hidden shadow-2xl border border-stone-200 group">
                        <img
                            src="/images/simple.jpg"
                            alt={t('about.mission_alt')}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                        />
                        <div className="absolute inset-0 bg-marigold-100/20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <MdTempleHindu className="text-sindoor text-8xl opacity-80 drop-shadow-lg" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <MdHistory className="text-marigold w-8 h-8" />
                            <h2 className="text-3xl font-serif font-bold text-heritage-dark">{t('about.mission_title')}</h2>
                        </div>
                        <p className="text-stone-600 text-lg leading-relaxed">
                            {t('about.mission_desc1')}
                        </p>
                        <p className="text-stone-600 text-lg leading-relaxed">
                            {t('about.mission_desc2')}
                        </p>

                        <div className="flex gap-4 pt-4">
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-marigold/20 w-32">
                                <MdSecurity className="text-sindoor text-3xl mb-2" />
                                <span className="text-sm font-bold text-heritage-dark uppercase tracking-wider">{t('about.trusted')}</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-marigold/20 w-32">
                                <MdGroups className="text-sindoor text-3xl mb-2" />
                                <span className="text-sm font-bold text-heritage-dark uppercase tracking-wider">{t('about.community')}</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border border-marigold/20 w-32">
                                <MdVolunteerActivism className="text-sindoor text-3xl mb-2" />
                                <span className="text-sm font-bold text-heritage-dark uppercase tracking-wider">{t('about.devotion')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section Integration */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-heritage-dark">{t('about.impact_title')}</h2>

                        <div className="w-16 h-1 bg-marigold mx-auto mt-4 rounded-full"></div>
                    </div>
                    <StatsSection />
                </div>

                {/* Values Section */}
                <div className="bg-white/60 backdrop-blur-md rounded-[3rem] p-8 md:p-12 shadow-xl border border-marigold/20 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-heritage-dark mb-12">{t('about.values_title')}</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="w-16 h-16 bg-sindoor/10 rounded-full flex items-center justify-center mx-auto mb-6 text-sindoor text-3xl border border-sindoor/20">
                                🕉️
                            </div>
                            <h3 className="text-xl font-bold text-heritage-dark mb-3">{t('about.authenticity')}</h3>
                            <p className="text-stone-600">
                                {t('about.authenticity_desc')}
                            </p>

                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-marigold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-marigold text-3xl border border-marigold/20">
                                🤝
                            </div>
                            <h3 className="text-xl font-bold text-heritage-dark mb-3">{t('about.transparency')}</h3>
                            <p className="text-stone-600">
                                {t('about.transparency_desc')}
                            </p>

                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 bg-heritage-dark/10 rounded-full flex items-center justify-center mx-auto mb-6 text-heritage-dark text-3xl border border-heritage-dark/20">
                                ❤️
                            </div>
                            <h3 className="text-xl font-bold text-heritage-dark mb-3">{t('about.devotion')}</h3>
                            <p className="text-stone-600">
                                {t('about.devotion_desc')}
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
