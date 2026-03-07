import {
    Clock,
    CirclePlay,
    Radio
} from "lucide-react";
import UnifiedCard from "../common/UnifiedCard";
import { useTranslation } from 'react-i18next';

export default function LiveDarshanSection() {
    const { t } = useTranslation();

    const liveEvents = [
        {
            id: 1,
            title: "Morning Aarti - Kashi Vishwanath",
            image: "https://images.unsplash.com/photo-1561361513-35e6e9033242?auto=format&fit=crop&q=80",
            status: "Live Now",
            viewers: "12.5k",
            startTime: "Started 10 mins ago"
        },
        {
            id: 2,
            title: "Evening Aarti - Prem Mandir",
            image: "https://vridam.com/wp-content/uploads/2022/07/prem-mandir-vrindavan-1.jpg",
            status: "Scheduled",
            viewers: "Waiting",
            startTime: "Starts at 6:30 PM"
        },
        {
            id: 3,
            title: "Special Puja - Somnath Temple",
            image: "https://cdn.zeebiz.com/sites/default/files/styles/zeebiz_850x478/public/2022/12/12/215777-somnath-temple.jpg",
            status: "Live Now",
            viewers: "8.2k",
            startTime: "Started 25 mins ago"
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden bg-orange-50/50">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-marigold/50 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-red-500 font-bold tracking-widest uppercase text-sm">{t('home.darshan_tagline')}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-sindoor mb-6">
                    {t('home.darshan_title')}
                </h2>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto font-sans italic">
                    {t('home.darshan_subtitle')}
                </p>

                <div className="w-24 h-1 bg-marigold mx-auto mt-8 rounded-full"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                    {liveEvents.map((event) => (
                        <div key={event.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-marigold/10">
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

                                {/* Status Badge */}
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md ${event.status === 'Live Now'
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : 'bg-stone-900/50 text-white'
                                    }`}>
                                    {event.status === 'Live Now' && (
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                                    )}
                                    <Radio className="w-3 h-3" />
                                    {event.status}
                                </div>

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/30 transition-all transform hover:scale-110">
                                        <CirclePlay className="w-8 h-8 fill-current" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-sindoor mb-2 font-serif group-hover:text-marigold transition-colors">
                                    {event.title}
                                </h3>

                                <div className="space-y-2">
                                    <div className="flex items-center text-stone-500 text-sm">
                                        <Clock className="w-4 h-4 mr-2 text-marigold" />
                                        {event.startTime}
                                    </div>
                                    <div className="flex items-center text-stone-500 text-sm">
                                        <div className="w-4 flex justify-center mr-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${event.status === 'Live Now' ? 'bg-red-500' : 'bg-stone-300'}`}></div>
                                        </div>
                                        {event.viewers} watching
                                    </div>
                                </div>

                                <button className="w-full mt-6 py-3 rounded-xl border-2 border-marigold text-marigold font-bold hover:bg-marigold hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                                    Watch Now
                                    <CirclePlay className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
