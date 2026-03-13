import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, HelpCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const Contact = () => {
    const { t } = useTranslation();
    const [openFaq, setOpenFaq] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const faqs = [
        { q: t('contact_page.q1'), a: t('contact_page.a1') },
        { q: t('contact_page.q2'), a: t('contact_page.a2') },
        { q: t('contact_page.q3'), a: t('contact_page.a3') }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/contact', formData);
            if (res.data.success) {
                toast.success(t('contact_page.form_success') || "Message sent skillfully! We'll get back to you soon.");
                setFormData({ name: '', email: '', subject: '', message: '' });
                e.target.reset();
            }
        } catch (error) {
            console.error("Contact Form error:", error);
            toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper-bg pt-24 pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Container */}
                <div className="text-center mb-16 relative">
                    <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 opacity-10 pointer-events-none">
                        <MessageCircle className="w-40 h-40 text-marigold" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-heritage-dark mb-6 relative z-10">{t('contact_page.title')}</h1>
                    <p className="text-stone-500 max-w-2xl mx-auto font-medium text-lg italic leading-relaxed">{t('contact_page.subtitle')}</p>
                    <div className="w-32 h-1 bg-linear-to-r from-marigold via-sindoor to-marigold mx-auto mt-10 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    {/* Contact Info - Col 4 */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="glass-card rounded-[3rem] p-10 border border-marigold/10 shadow-2xl bg-white/60 space-y-10">
                            <h2 className="text-3xl font-serif text-sindoor border-b border-marigold/20 pb-4">{t('contact_page.get_in_touch')}</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-sindoor/10 flex items-center justify-center text-sindoor shrink-0 group-hover:bg-sindoor group-hover:text-white transition-all duration-300 transform group-hover:-rotate-6">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('contact_page.address_title')}</p>
                                        <p className="text-stone-700 leading-relaxed font-semibold">{t('contact_page.address')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-marigold/10 flex items-center justify-center text-marigold shrink-0 group-hover:bg-marigold group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('footer.email_support')}</p>
                                        <p className="text-stone-700 font-bold text-lg">info@shyampuja.com</p>
                                    </div>
                                </div>

                                <a href="https://wa.me/919203683115" target="_blank" rel="noopener noreferrer" className="flex items-start gap-6 group cursor-pointer">
                                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 transform group-hover:-rotate-6 hover:shadow-lg">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('contact_page.whatsapp_title')}</p>
                                        <p className="text-green-600 font-bold text-lg">{t('contact_page.whatsapp')}</p>
                                    </div>
                                </a>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 rounded-2xl bg-marigold/10 flex items-center justify-center text-marigold shrink-0 group-hover:bg-marigold group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{t('footer.helpline')}</p>
                                        <p className="text-stone-700 font-bold text-lg">7770942072</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Box */}
                        <div className="glass-card rounded-[3rem] p-10 border border-marigold/10 shadow-xl bg-sindoor/5 space-y-6">
                            <h3 className="text-2xl font-serif text-heritage-dark flex items-center gap-3">
                                <HelpCircle className="text-marigold w-6 h-6" />
                                {t('contact_page.questions_title')}
                            </h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-marigold/10 pb-4">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                                            className="w-full flex items-center justify-between text-left font-bold text-stone-700 hover:text-sindoor transition-colors py-2"
                                        >
                                            <span className="text-sm pr-4">{faq.q}</span>
                                            {openFaq === index ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                                        </button>
                                        {openFaq === index && (
                                            <p className="text-sm text-stone-500 mt-2 font-medium italic leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                                {faq.a}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form - Col 7 */}
                    <div className="lg:col-span-7">
                        <div className="glass-card rounded-[3rem] p-8 md:p-14 border border-marigold/10 shadow-2xl bg-white/80 h-full relative overflow-hidden">
                            {/* Decorative Torch */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-marigold-100/30 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <h2 className="text-3xl font-serif text-heritage-dark mb-10 flex items-center gap-4">
                                <Send className="text-sindoor w-6 h-6" />
                                {t('contact_page.form_title')}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t('contact_page.form_name')}</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="w-full bg-paper-bg/50 border-2 border-stone-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-marigold/10 focus:border-marigold outline-none transition-all font-medium text-stone-700 hover:border-stone-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t('contact_page.form_email')}</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="w-full bg-paper-bg/50 border-2 border-stone-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-marigold/10 focus:border-marigold outline-none transition-all font-medium text-stone-700 hover:border-stone-200"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t('contact_page.form_subject')}</label>
                                    <input
                                        required
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Pooja Booking Query"
                                        className="w-full bg-paper-bg/50 border-2 border-stone-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-marigold/10 focus:border-marigold outline-none transition-all font-medium text-stone-700 hover:border-stone-200"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest ml-1">{t('contact_page.form_message')}</label>
                                    <textarea
                                        required
                                        rows="5"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Namaste, I would like to inquire about..."
                                        className="w-full bg-paper-bg/50 border-2 border-stone-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-marigold/10 focus:border-marigold outline-none transition-all font-medium text-stone-700 hover:border-stone-200 resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-sindoor text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-marigold hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Send className="w-6 h-6" />
                                    )}
                                    {loading ? 'Sending...' : t('contact_page.form_submit')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
