import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function PoojaFaqs({ poojaId }) {
    const [faqs, setFaqs] = useState([]);
    const [newFaq, setNewFaq] = useState({
        question: "",
        answer: "",
        sort_order: 0,
    });
    const [loading, setLoading] = useState(false);

    const loadFaqs = async () => {
        try {
            const res = await api.get(`/poojas/${poojaId}/faqs`);
            // Sort by sort_order
            const sorted = (res.data.data || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            setFaqs(sorted);
        } catch (err) {
            console.error("Failed to load FAQs", err);
        }
    };

    useEffect(() => {
        if (poojaId) loadFaqs();
    }, [poojaId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newFaq.question || !newFaq.answer) return;

        try {
            setLoading(true);
            await api.post("/poojas/faq", {
                pooja_id: poojaId,
                ...newFaq
            });
            setNewFaq({ question: "", answer: "", sort_order: 0 });
            loadFaqs();
        } catch (err) {
            console.error("Failed to add FAQ", err);
            alert("Failed to add FAQ: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (faqId) => {
        if (!confirm("Delete this FAQ?")) return;
        try {
            await api.delete(`/poojas/faq/${faqId}`);
            loadFaqs();
        } catch (err) {
            console.error("Failed to delete FAQ", err);
            alert("Failed to delete FAQ");
        }
    };

    return (
        <div className="mt-10 border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-600">quiz</span>
                FAQs Management
            </h2>

            {/* Add New FAQ Form */}
            <form onSubmit={handleAdd} className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Add New Question</h3>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8 space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Question</label>
                        <input
                            type="text"
                            placeholder="e.g. Can I perform this pooja remotely?"
                            value={newFaq.question}
                            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                            required
                        />
                    </div>

                    <div className="col-span-4 space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Sort Order</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={newFaq.sort_order}
                            onChange={(e) => setNewFaq({ ...newFaq, sort_order: parseInt(e.target.value) || 0 })}
                            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                        />
                    </div>

                    <div className="col-span-12 space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Answer</label>
                        <textarea
                            placeholder="Detailed answer for the devotee..."
                            value={newFaq.answer}
                            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                            rows="3"
                            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-y"
                            required
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? "Adding..." : "+ Add FAQ"}
                    </button>
                </div>
            </form>

            {/* List of FAQs */}
            <div className="space-y-4">
                {faqs.length === 0 ? (
                    <p className="text-center text-gray-500 py-4 italic">No FAQs added yet.</p>
                ) : (
                    faqs.map((faq) => (
                        <div key={faq.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 hover:shadow-md transition group">
                            <div className="bg-orange-50 text-orange-600 font-bold rounded-lg w-10 h-10 flex items-center justify-center shrink-0">
                                {faq.sort_order}
                            </div>

                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 mb-1">{faq.question}</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>

                            <button
                                onClick={() => handleDelete(faq.id)}
                                className="text-gray-400 hover:text-red-500 self-start p-2 rounded-full hover:bg-red-50 transition"
                                title="Delete FAQ"
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
