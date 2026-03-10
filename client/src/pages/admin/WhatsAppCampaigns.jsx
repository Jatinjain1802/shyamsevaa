import { useState, useEffect, useMemo } from "react";
import api from "../../utils/axios";
import socket from "../../utils/socket";
import toast from "react-hot-toast";
import {
    FiPlus,
    FiRotateCw,
    FiSearch,
    FiFilter,
    FiExternalLink,
    FiCalendar,
    FiSend,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiMoreVertical,
    FiEye,
    FiFileText,
    FiUploadCloud,
    FiArrowRight,
    FiTrendingUp,
    FiActivity
} from "react-icons/fi";
import {
    Loader2,
    Megaphone,
    Users,
    BarChart3,
    Calendar as CalendarIcon,
    Smartphone,
    CheckCheck,
    LayoutGrid,
    LayoutList,
    FileSpreadsheet,
    AlertCircle
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import * as XLSX from "xlsx";

const STATUS_VARIANTS = {
    draft: "bg-stone-100 text-stone-500 border-stone-200",
    scheduled: "bg-blue-50 text-blue-600 border-blue-100",
    processing: "bg-yellow-50 text-yellow-600 border-yellow-100",
    completed: "bg-green-50 text-green-600 border-green-100",
    failed: "bg-red-50 text-red-600 border-red-100",
    paused: "bg-orange-50 text-orange-600 border-orange-100",
};

const getStatusInfo = (camp) => {
    if (camp.status === 'draft' && camp.scheduled_at) {
        return {
            label: 'Scheduled',
            class: STATUS_VARIANTS.scheduled
        };
    }
    return {
        label: camp.status,
        class: STATUS_VARIANTS[camp.status.toLowerCase()] || STATUS_VARIANTS.draft
    };
};

const HighlightText = ({ text, query }) => {
    if (!query || !text) return <span>{text || ""}</span>;
    const parts = String(text).split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase()
                    ? <mark key={i} className="bg-blue-500/10 text-blue-700 rounded-md px-1 py-0.5 border border-blue-500/20">{part}</mark>
                    : part
            )}
        </span>
    );
};

const extractVariables = (text) => {
    const matches = String(text || "").match(/{{(\d+)}}/g) || [];
    const nums = matches
        .map((token) => Number(token.replace(/[^\d]/g, "")))
        .filter((n) => Number.isFinite(n));
    return [...new Set(nums)].sort((a, b) => a - b);
};

const replaceVariablesForPreview = (text, variableNumbers, mapping, contacts) => {
    let preview = String(text || "");
    const firstContact = contacts && contacts.length > 0 ? contacts[0] : null;

    variableNumbers.forEach((num) => {
        const columnName = mapping?.[String(num)] || mapping?.[num];
        const value = firstContact && columnName ? firstContact[columnName] : null;
        const replacement = value !== null && value !== undefined ? String(value) : `{{${num}}}`;
        preview = preview.replace(new RegExp(`{{\\s*${num}\\s*}}`, "g"), replacement);
    });
    return preview;
};

const WhatsAppBubble = ({ template, mapping = {}, contacts = [], customMediaUrl, customMediaFile }) => {
    if (!template) return null;

    let structure = [];
    if (template.structure_json) {
        structure = typeof template.structure_json === 'string' 
            ? JSON.parse(template.structure_json) 
            : template.structure_json;
    }

    const header = structure.find((c) => String(c.type).toUpperCase() === "HEADER");
    const body = structure.find((c) => String(c.type).toUpperCase() === "BODY");
    const footer = structure.find((c) => String(c.type).toUpperCase() === "FOOTER");
    const buttonComp = structure.find((c) => String(c.type).toUpperCase() === "BUTTONS");

    const variableNumbers = body ? extractVariables(body.text) : [];
    const renderedBody = replaceVariablesForPreview(body?.text || "", variableNumbers, mapping, contacts);

    const previewMediaUrl = customMediaFile ? URL.createObjectURL(customMediaFile) : (customMediaUrl || template.sample_media_url);

    return (
        <div className="relative w-full max-w-[280px] drop-shadow-sm select-none">
            <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-[0_1px_2px_rgba(11,20,26,0.1)] relative w-full border border-stone-100/30">
                <div className="absolute top-0 -left-[8px] w-[9px] h-3 overflow-hidden">
                    <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-sm rotate-45 transform origin-top-right"></div>
                </div>

                {header && (
                    <div className="mb-2">
                        {header.format === "TEXT" ? (
                            <p className="font-bold text-[#111b21] text-sm leading-tight">{header.text}</p>
                        ) : (
                            <div className="bg-stone-50 rounded-lg overflow-hidden border border-stone-100 flex flex-col items-center justify-center aspect-video mb-1">
                                {previewMediaUrl ? (
                                    <img src={previewMediaUrl} alt="Header" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1 opacity-20">
                                        <Smartphone className="w-6 h-6" />
                                        <span className="text-[8px] font-black uppercase">{header.format}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="text-[#111b21] text-[13px] leading-[1.4] whitespace-pre-wrap font-normal">
                    {renderedBody.split(/({{[^{}]+}})/).map((part, i) =>
                        /^{{[^{}]+}}$/.test(part) ? (
                            <span key={i} className="text-blue-600 font-bold bg-blue-50 px-1 rounded">
                                {part}
                            </span>
                        ) : part
                    )}
                </div>

                {footer && (
                    <p className="mt-1.5 text-[11px] text-[#667781] leading-snug">
                        {footer.text}
                    </p>
                )}

                <div className="flex items-center justify-end gap-1 mt-1 opacity-40">
                    <p className="text-[9px] font-medium">12:00 PM</p>
                    <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
                </div>
            </div>

            {buttonComp && buttonComp.buttons && (
                <div className="flex flex-col w-full space-y-[2px] mt-1">
                    {buttonComp.buttons.map((btn, idx) => (
                        <div key={idx} className="bg-white/95 rounded-xl py-2.5 shadow-sm border border-stone-100 flex items-center justify-center gap-2 text-[#00a884] text-[13px] font-bold">
                            <span className="truncate">{btn.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const WhatsAppSimulator = ({ template, mappings, contacts, customMediaUrl, customMediaFile }) => {
    return (
        <div className="w-[280px] bg-white rounded-[3rem] shadow-2xl border-8 border-[#1c1c1c] overflow-hidden relative isolate shrink-0 mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#1c1c1c] rounded-b-xl z-30"></div>

            <div className="bg-[#075e54] pt-7 pb-2 px-4 flex items-center gap-3 text-white relative z-20">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
                    <Smartphone className="w-4 h-4 text-white/50" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-[11px] font-black leading-none truncate uppercase tracking-tight">Shyam Sevaa</p>
                    <p className="text-[8px] text-white/60 font-medium mt-0.5">Automated Broadcast</p>
                </div>
            </div>

            <div className="h-[400px] bg-[#e5ddd5] p-3 overflow-y-auto custom-scrollbar relative">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                <div className="relative z-10 flex flex-col items-start pt-2">
                    <WhatsAppBubble 
                        template={template} 
                        mapping={mappings} 
                        contacts={contacts} 
                        customMediaUrl={customMediaUrl}
                        customMediaFile={customMediaFile}
                    />
                </div>
            </div>

            <div className="bg-white p-3 border-t border-stone-100 flex items-center gap-2">
                <div className="flex-1 h-7 bg-stone-100 rounded-full flex items-center px-4 text-stone-300 text-[10px] italic">
                    Type message...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                    <FiSend className="w-3 h-3" />
                </div>
            </div>
        </div>
    );
};

export default function WhatsAppCampaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // grid | list
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Creation State
    const [creating, setCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        templateName: "",
        scheduledAt: "",
        isScheduled: false,
        file: null,
        contacts: [],
        headers: [],
        mappings: {}, // { "1": "Column_Name", "phoneNumber": "Phone_Col" }
        customMediaUrl: "",
        customMediaFile: null,
    });

    // Analytics State
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [campaignLogs, setCampaignLogs] = useState([]);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [logSearch, setLogSearch] = useState("");

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const res = await api.get("/whatsapp/admin/campaigns/list");
            setCampaigns(res.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch campaigns");
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async () => {
        try {
            const res = await api.get("/whatsapp/admin/templates");
            const approved = (res.data.data || []).filter(t => t.meta_status === "APPROVED");
            setTemplates(approved);
        } catch (error) {
            console.error("Template fetch error", error);
        }
    };

    useEffect(() => {
        fetchCampaigns();
        fetchTemplates();

        // Listen for real-time updates
        socket.connect();
        socket.on("whatsapp_campaign_update", (data) => {
            fetchCampaigns(); // Refresh list on any change
        });

        return () => {
            socket.off("whatsapp_campaign_update");
            socket.disconnect();
        };
    }, []);

    const filteredCampaigns = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return campaigns;
        return campaigns.filter(c =>
            (c.name || "").toLowerCase().includes(query) ||
            (c.template_name || "").toLowerCase().includes(query)
        );
    }, [campaigns, searchQuery]);

    const filteredLogs = useMemo(() => {
        const query = logSearch.toLowerCase().trim();
        if (!query) return campaignLogs;
        return campaignLogs.filter(l =>
            (l.phone || "").toLowerCase().includes(query) ||
            (l.wamid || "").toLowerCase().includes(query)
        );
    }, [campaignLogs, logSearch]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            if (data.length > 0) {
                const keys = Object.keys(data[0]);
                setFormData(prev => ({
                    ...prev,
                    file,
                    contacts: data,
                    headers: keys,
                    mappings: {
                        ...prev.mappings,
                        phoneNumber: keys.find(k => /phone|mobile|contact|number/i.test(k)) || ""
                    }
                }));
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleCreateCampaign = async () => {
        if (!formData.name || !formData.templateName || !formData.mappings.phoneNumber) {
            return toast.error("Please fill all required fields");
        }

        try {
            setCreating(true);
            
            // 1. Create Campaign using FormData (to handle file upload)
            const submission = new FormData();
            submission.append("name", formData.name);
            submission.append("templateName", formData.templateName);
            submission.append("variableMapping", JSON.stringify(formData.mappings));
            submission.append("customMediaUrl", formData.customMediaUrl);
            submission.append("scheduledAt", formData.isScheduled ? formData.scheduledAt : null);
            if (formData.customMediaFile) {
                submission.append("campaignMedia", formData.customMediaFile);
            }

            const createRes = await api.post("/whatsapp/admin/campaigns/create", submission, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const campaignId = createRes.data.campaignId;

            // 2. Add Recipients
            const recipients = formData.contacts.map(row => ({
                phone: String(row[formData.mappings.phoneNumber]).replace(/[^0-9]/g, ""),
                context: row
            }));

            await api.post(`/whatsapp/admin/campaigns/${campaignId}/add-recipients`, { recipients });

            // 3. Start if not scheduled
            if (!formData.isScheduled) {
                await api.post(`/whatsapp/admin/campaigns/${campaignId}/start`);
            }

            toast.success("Campaign launched successfully");
            setIsModalOpen(false);
            resetForm();
            fetchCampaigns();
        } catch (error) {
            toast.error(error.response?.data?.message || "Launch failed");
        } finally {
            setCreating(false);
        }
    };

    const fetchCampaignLogs = async (campaignId) => {
        try {
            setLoadingLogs(true);
            const res = await api.get(`/whatsapp/admin/campaigns/${campaignId}/logs`);
            setCampaignLogs(res.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch logs");
        } finally {
            setLoadingLogs(false);
        }
    };

    const handleOpenAnalytics = (camp) => {
        setSelectedCampaign(camp);
        setLogSearch(""); // Reset log search
        fetchCampaignLogs(camp.id);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            templateName: "",
            scheduledAt: "",
            isScheduled: false,
            file: null,
            contacts: [],
            headers: [],
            mappings: {},
            customMediaUrl: "",
            customMediaFile: null,
        });
    };

    const selectedTemplateData = useMemo(() => {
        return templates.find(t => t.name === formData.templateName);
    }, [templates, formData.templateName]);

    const templateVariables = useMemo(() => {
        if (!selectedTemplateData) return [];
        return selectedTemplateData.variable_numbers || [];
    }, [selectedTemplateData]);

    const hasMediaHeader = useMemo(() => {
        if (!selectedTemplateData?.structure_json) return false;
        const structure = typeof selectedTemplateData.structure_json === 'string' 
            ? JSON.parse(selectedTemplateData.structure_json) 
            : selectedTemplateData.structure_json;
        return structure.some(c => 
            c.type === "HEADER" && (c.format === "IMAGE" || c.format === "VIDEO")
        );
    }, [selectedTemplateData]);

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row items-center justify-between gap-8 pt-4">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                            <Megaphone className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-5xl font-black text-heritage-dark font-serif tracking-tight leading-none uppercase italic">
                                Campaign <span className="text-blue-600">Command</span>
                            </h1>
                            <p className="text-stone-400 font-black text-[10px] uppercase tracking-[0.4em] mt-2">
                                Enterprise Bulk Intelligence Suite
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 p-2 rounded-3xl bg-white border border-stone-200/50 shadow-xl shadow-stone-200/20 backdrop-blur-md">
                    <button onClick={() => setIsModalOpen(true)} className="px-8 py-3.5 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-600/30 active:scale-95 transition-all text-[11px] uppercase tracking-widest flex items-center gap-3">
                        <FiPlus className="w-4 h-4" /> New Operation
                    </button>
                    <button onClick={fetchCampaigns} disabled={loading} className="p-3.5 bg-stone-50 text-heritage-dark rounded-2xl border border-stone-100 active:rotate-180 transition-all duration-500">
                        <FiRotateCw className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Stats Quick Glance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Target", value: campaigns.reduce((acc, c) => acc + (c.total_recipients || 0), 0), icon: Users, color: "stone" },
                    { label: "Total Sent", value: campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0), icon: FiSend, color: "blue" },
                    { label: "Total Delivered", value: campaigns.reduce((acc, c) => acc + (c.delivered_count || 0), 0), icon: CheckCheck, color: "green" },
                    {
                        label: "Average Success",
                        value: (() => {
                            const total = campaigns.reduce((acc, c) => acc + (c.total_recipients || 0), 0);
                            const sent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
                            return total > 0 ? `${((sent / total) * 100).toFixed(1)}%` : "0%";
                        })(),
                        icon: FiTrendingUp,
                        color: "purple"
                    }
                ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-6 rounded-4xl border border-stone-100 shadow-sm flex items-center gap-5 relative overflow-hidden group">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none mb-2">{stat.label}</p>
                            <p className="text-2xl font-black text-heritage-dark font-sans">{stat.value}</p>
                        </div>
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-bl-full`}></div>
                    </motion.div>
                ))}
            </div>

            {/* Controls & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-stone-100 shadow-sm">
                <div className="relative w-full sm:w-96 group">
                    <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by operation name..."
                        className="w-full pl-14 pr-12 py-4 rounded-2xl bg-stone-50 border border-transparent focus:bg-white focus:border-blue-500/20 text-sm font-bold outline-none transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600 transition-all"
                        >
                            <FiXCircle className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-heritage-dark text-white' : 'bg-stone-50 text-stone-400'}`}>
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-heritage-dark text-white' : 'bg-stone-50 text-stone-400'}`}>
                        <LayoutList className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Dynamic Grid / Table */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredCampaigns.map((camp, idx) => (
                            <motion.div key={camp.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-[2.5rem] border border-stone-200/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group">
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusInfo(camp).class}`}>
                                                {getStatusInfo(camp).label}
                                            </span>
                                            <h3 className="text-xl font-black text-heritage-dark font-sans mt-4 group-hover:text-blue-600 transition-colors truncate max-w-[200px]">
                                                <HighlightText text={camp.name} query={searchQuery} />
                                            </h3>
                                        </div>
                                        <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-5 gap-1 py-6 border-y border-stone-50">
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-stone-300 uppercase leading-none mb-2">Target</p>
                                            <p className="text-[11px] font-black text-heritage-dark">{camp.total_recipients || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-stone-300 uppercase leading-none mb-2">Sent</p>
                                            <p className="text-[11px] font-black text-blue-600">{camp.sent_count || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-stone-300 uppercase leading-none mb-2">Dlvrd</p>
                                            <p className="text-[11px] font-black text-green-600">{camp.delivered_count || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-stone-300 uppercase leading-none mb-2">Seen</p>
                                            <p className="text-[11px] font-black text-indigo-600">{camp.read_count || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-stone-300 uppercase leading-none mb-2">Fail</p>
                                            <p className="text-[11px] font-black text-red-500">{camp.failed_count || 0}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-stone-400">
                                            <FiCalendar className="w-3 h-3" />
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-stone-300 uppercase leading-none mb-1">
                                                    {(camp.status === 'draft' || camp.status === 'scheduled') && camp.scheduled_at ? 'Scheduled' : 'Created'}
                                                </span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-heritage-dark">
                                                    {new Date((camp.status === 'draft' || camp.status === 'scheduled') && camp.scheduled_at ? camp.scheduled_at : camp.created_at).toLocaleString('en-IN', { 
                                                        day: '2-digit', 
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleOpenAnalytics(camp)}
                                            className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform"
                                        >
                                            Analytics <FiArrowRight />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] border border-stone-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 text-[10px] font-black uppercase text-stone-400 tracking-[0.2em]">
                                <th className="px-10 py-6">Operation</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6">Metrics</th>
                                <th className="px-10 py-6">Launch Date</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {filteredCampaigns.map(camp => (
                                <tr key={camp.id} className="hover:bg-stone-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <p className="text-xs font-black text-heritage-dark uppercase">
                                            <HighlightText text={camp.name} query={searchQuery} />
                                        </p>
                                        <p className="text-[9px] font-bold text-stone-400 tracking-widest mt-1 uppercase">
                                            TEMPLATE: <HighlightText text={camp.template_name} query={searchQuery} />
                                        </p>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusInfo(camp).class}`}>
                                            {getStatusInfo(camp).label}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex gap-4">
                                            <div title="Target" className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-stone-300"></div><span className="text-[10px] font-black">{camp.total_recipients || 0}</span></div>
                                            <div title="Sent" className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div><span className="text-[10px] font-black">{camp.sent_count || 0}</span></div>
                                            <div title="Delivered" className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div><span className="text-[10px] font-black">{camp.delivered_count || 0}</span></div>
                                            <div title="Seen" className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div><span className="text-[10px] font-black">{camp.read_count || 0}</span></div>
                                            <div title="Failed" className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div><span className="text-[10px] font-black">{camp.failed_count || 0}</span></div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-[11px] font-black text-stone-400 uppercase">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] opacity-40">
                                                {(camp.status === 'draft' || camp.status === 'scheduled') && camp.scheduled_at ? 'SCHED' : 'LAUNCH'}
                                            </span>
                                            <span>
                                                {new Date((camp.status === 'draft' || camp.status === 'scheduled') && camp.scheduled_at ? camp.scheduled_at : camp.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button
                                            onClick={() => handleOpenAnalytics(camp)}
                                            className="p-3 bg-stone-50 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-all active:scale-90"
                                        >
                                            <FiEye />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Empty State */}
            {filteredCampaigns.length === 0 && !loading && (
                <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-stone-100 italic font-medium text-stone-300">
                    <Smartphone className="w-16 h-16 mb-4 opacity-10" />
                    <p className="text-sm font-black uppercase tracking-widest">No Active Communication Records Found</p>
                </div>
            )}

            {/* Creation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-heritage-dark/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200/50">
                            <div className="px-10 py-8 border-b border-stone-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-heritage-dark font-sans italic tracking-tight uppercase leading-none">New Broadcast <span className="text-blue-600">Protocol</span></h3>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <FiActivity className="text-blue-500" /> Operational Blueprint Configuration
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl bg-stone-50 hover:bg-red-50 hover:text-red-500 transition-colors active:scale-90"><FiXCircle className="w-6 h-6" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-10 py-10 custom-scrollbar bg-[#fafaf9]">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        {/* Phase 1: Identity */}
                                        <section className="space-y-6">
                                            <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] flex items-center gap-4">
                                                <span className="w-8 h-px bg-stone-200"></span> 01 Identity
                                            </h4>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-stone-400 uppercase block">Operation Name</label>
                                                <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="DIWALI_FEST_2026_V1" className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-200 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-stone-400 uppercase block">Target Blueprint</label>
                                                <select value={formData.templateName} onChange={e => setFormData(p => ({ ...p, templateName: e.target.value }))} className="w-full px-6 py-4 rounded-2xl bg-white border border-stone-200 text-sm font-bold outline-none appearance-none cursor-pointer">
                                                    <option value="">Select an approved resource...</option>
                                                    {templates.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                                                </select>
                                            </div>

                                            {hasMediaHeader && (
                                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-stone-400 uppercase">Override Media Asset</label>
                                                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest italic bg-blue-50 px-2 py-0.5 rounded-md">Direct Injection Mode</span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Option A: Link */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-[9px] font-black text-stone-300 uppercase tracking-widest px-2">
                                                                <FiExternalLink /> Remote URL
                                                            </div>
                                                            <input 
                                                                value={formData.customMediaUrl} 
                                                                onChange={e => setFormData(p => ({ ...p, customMediaUrl: e.target.value, customMediaFile: null }))} 
                                                                placeholder="https://image-link.jpg" 
                                                                className="w-full px-5 py-3.5 rounded-2xl bg-white border border-stone-200 text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all shadow-sm" 
                                                            />
                                                        </div>

                                                        {/* Option B: Upload */}
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-[9px] font-black text-stone-300 uppercase tracking-widest px-2">
                                                                <FiUploadCloud /> Local Upload
                                                            </div>
                                                            <div className="relative group">
                                                                <input 
                                                                    type="file" 
                                                                    accept="image/*,video/*" 
                                                                    onChange={e => setFormData(p => ({ ...p, customMediaFile: e.target.files[0], customMediaUrl: "" }))} 
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                                                />
                                                                <div className={`w-full px-5 py-3.5 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 ${formData.customMediaFile ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-400 hover:border-blue-300'}`}>
                                                                    {formData.customMediaFile ? (
                                                                        <>
                                                                            <FiCheckCircle className="text-green-400" />
                                                                            <span className="text-[10px] font-black truncate max-w-[120px]">{formData.customMediaFile.name}</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FiPlus className="w-3 h-3" />
                                                                            <span className="text-[10px] font-black">Choose File</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {(formData.customMediaUrl || formData.customMediaFile) && (
                                                        <div className="p-5 rounded-4xl bg-stone-50 border border-stone-100 flex items-center gap-5 shadow-inner">
                                                            <div className="w-16 h-16 rounded-2xl bg-white border border-stone-100 overflow-hidden shrink-0 shadow-sm">
                                                                {formData.customMediaFile ? (
                                                                    <img src={URL.createObjectURL(formData.customMediaFile)} alt="Preview" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <img src={formData.customMediaUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = "https://placehold.co/100x100?text=Error"} />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black text-heritage-dark uppercase tracking-tight">Deployment Ready</p>
                                                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">This asset will be broadcasted</p>
                                                            </div>
                                                            <button 
                                                                onClick={() => setFormData(p => ({ ...p, customMediaFile: null, customMediaUrl: "" }))}
                                                                className="ml-auto p-2 text-stone-300 hover:text-red-500 transition-colors"
                                                            >
                                                                <FiRotateCw className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </section>

                                        {/* Phase 2: Audience */}
                                        <section className="space-y-6">
                                            <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] flex items-center gap-4">
                                                <span className="w-8 h-px bg-stone-200"></span> 02 Intelligence Source
                                            </h4>
                                            {!formData.file ? (
                                                <div className="relative group p-12 rounded-4xl border-2 border-dashed border-stone-200 bg-white hover:border-blue-500/30 hover:bg-blue-50/5 transition-all text-center">
                                                    <input type="file" accept=".xlsx, .csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                    <FiUploadCloud className="w-12 h-12 text-stone-300 mx-auto mb-4 group-hover:scale-110 group-hover:text-blue-500 transition-all" />
                                                    <p className="text-[11px] font-black text-heritage-dark uppercase tracking-widest leading-none mb-2">Inject Audience Matrix</p>
                                                    <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Supports XLXS & CSV Registry Files</p>
                                                </div>
                                            ) : (
                                                <div className="p-6 rounded-4xl bg-stone-900 text-white flex items-center justify-between border border-stone-800 shadow-2xl">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><FileSpreadsheet className="w-6 h-6 text-marigold" /></div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase text-marigold leading-none mb-1.5">{formData.file.name}</p>
                                                            <p className="text-[10px] font-bold opacity-40">{formData.contacts.length} Entities Parsed Successfully</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setFormData(p => ({ ...p, file: null, contacts: [], headers: [], mappings: {} }))} className="p-2 hover:text-red-500 transition-colors"><FiXCircle className="w-5 h-5" /></button>
                                                </div>
                                            )}

                                            {formData.headers.length > 0 && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-8 rounded-4xl bg-white border border-stone-200/50 space-y-6 overflow-hidden shadow-sm">
                                                    <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Signal Mapping Matrix</h5>
                                                    <div className="space-y-6">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-[10px] font-black text-stone-400 uppercase">Primary Link (Phone)</label>
                                                            <select value={formData.mappings.phoneNumber} onChange={e => setFormData(p => ({ ...p, mappings: { ...p.mappings, phoneNumber: e.target.value } }))} className="w-full px-4 py-2 bg-stone-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-200">
                                                                <option value="">Map source field...</option>
                                                                {formData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                                            </select>
                                                        </div>
                                                        {templateVariables.map(num => (
                                                            <div key={num} className="flex flex-col gap-2">
                                                                <label className="text-[10px] font-black text-stone-300 uppercase italic">Variable Data Injection {"{{"}{num}{"}}"}</label>
                                                                <select value={formData.mappings[num] || ""} onChange={e => setFormData(p => ({ ...p, mappings: { ...p.mappings, [num]: e.target.value } }))} className="w-full px-4 py-2 bg-stone-50 rounded-xl text-[11px] font-bold outline-none border border-transparent focus:border-blue-200">
                                                                    <option value="">Connect field...</option>
                                                                    {formData.headers.map(h => <option key={h} value={h}>{h}</option>)}
                                                                </select>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </section>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Simulation Preview */}
                                        <section className="space-y-6">
                                            <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] flex items-center gap-4">
                                                <span className="w-8 h-px bg-stone-200"></span> 04 Visual Simulation
                                            </h4>
                                            
                                            <div className="p-8 rounded-[2.5rem] bg-stone-100/50 border border-stone-200/50 relative overflow-hidden flex items-center justify-center min-h-[500px]">
                                                <div className="absolute inset-0 pattern-dots opacity-[0.03]"></div>
                                                {formData.templateName ? (
                                                    <div className="scale-100 transform-gpu animate-in zoom-in-95 duration-500">
                                                        <WhatsAppSimulator 
                                                            template={selectedTemplateData}
                                                            mappings={formData.mappings}
                                                            contacts={formData.contacts}
                                                            customMediaUrl={formData.customMediaUrl}
                                                            customMediaFile={formData.customMediaFile}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-center space-y-4 opacity-30">
                                                        <Smartphone className="w-16 h-16 mx-auto text-stone-400" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest">Select blueprint to initialize simulation</p>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* Phase 3: Timing */}
                                        <section className="space-y-6">
                                            <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] flex items-center gap-4">
                                                <span className="w-8 h-px bg-stone-200"></span> 03 Execution Sync
                                            </h4>
                                            <div className="p-8 rounded-[2.5rem] bg-white border border-stone-200/50 space-y-8 shadow-sm">
                                                <label className="flex items-center gap-4 cursor-pointer p-4 rounded-2xl hover:bg-stone-50 transition-colors group">
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.isScheduled ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30' : 'border-stone-200 group-hover:border-blue-500'}`}>
                                                        {formData.isScheduled && <FiCheckCircle className="text-white w-4 h-4" />}
                                                    </div>
                                                    <input type="checkbox" checked={formData.isScheduled} onChange={e => setFormData(p => ({ ...p, isScheduled: e.target.checked }))} className="hidden" />
                                                    <span className="text-xs font-black text-heritage-dark uppercase tracking-widest">Schedule Delayed Trigger</span>
                                                </label>

                                                {formData.isScheduled && (
                                                    <div className="space-y-4 animate-in slide-in-from-top-4">
                                                        <label className="text-[10px] font-black text-stone-400 uppercase block">Launch Coordinates (Date & Time)</label>
                                                        <input type="datetime-local" value={formData.scheduledAt} onChange={e => setFormData(p => ({ ...p, scheduledAt: e.target.value }))} className="w-full px-6 py-4 rounded-2xl bg-stone-50 border border-transparent text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        {/* Phase 4: Rules & Guidelines */}
                                        <div className="p-8 rounded-[2.5rem] bg-marigold/5 border border-marigold/10 space-y-4">
                                            <div className="flex items-start gap-4">
                                                <AlertCircle className="w-6 h-6 text-marigold mt-1 shrink-0" />
                                                <div>
                                                    <h5 className="text-[11px] font-black text-heritage-dark uppercase tracking-widest mb-2 font-serif">Mission Review Protocol</h5>
                                                    <ul className="text-[10px] text-stone-500 font-bold space-y-2 list-disc list-inside">
                                                        <li>Phone numbers must include country code (e.g., 91).</li>
                                                        <li>Variables cannot contain PII (Meta Policy).</li>
                                                        <li>Daily quota reset: 1:30 PM IST.</li>
                                                        <li>Aborted campaigns are non-refundable.</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Execute Action */}
                                        <div className="pt-10">
                                            <button onClick={handleCreateCampaign} disabled={creating} className="w-full py-6 bg-stone-900 text-white rounded-4xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-6 overflow-hidden group relative">
                                                <div className="absolute inset-0 bg-blue-600 translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                                                <span className="relative z-10 flex items-center gap-4">
                                                    {creating ? <Loader2 className="animate-spin w-5 h-5" /> : (formData.isScheduled ? <FiCalendar className="w-5 h-5" /> : <FiSend className="w-5 h-5" />)}
                                                    {creating ? 'In Processing...' : (formData.isScheduled ? 'Commit Schedule' : 'Initialize Launch')}
                                                </span>
                                            </button>
                                            <p className="text-center text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-6 italic">Secure Cloud Protocol Active - 256bit Encrypted</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Analytics Modal */}
            <AnimatePresence>
                {selectedCampaign && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-heritage-dark/90 backdrop-blur-xl">
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200">
                            <div className="px-10 py-8 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATUS_VARIANTS[selectedCampaign.status.toLowerCase()] || STATUS_VARIANTS.draft}`}>
                                            {selectedCampaign.status}
                                        </span>
                                        <h3 className="text-xl font-black text-heritage-dark font-sans uppercase italic">{selectedCampaign.name}</h3>
                                    </div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Forensic Deployment Log & Strategy Analysis</p>
                                </div>
                                <button onClick={() => setSelectedCampaign(null)} className="p-3 rounded-2xl bg-white border border-stone-100 hover:bg-red-50 hover:text-red-500 transition-colors"><FiXCircle className="w-6 h-6" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                                {/* Metric Overlay */}
                                {(() => {
                                    const latestCamp = campaigns.find(c => c.id === selectedCampaign.id) || selectedCampaign;
                                    return (
                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
                                            {[
                                                { label: "Target", val: latestCamp.total_recipients, sub: "Entities", color: "stone" },
                                                { label: "Sent", val: latestCamp.sent_count, sub: "Dispatched", color: "blue" },
                                                { label: "Delivered", val: latestCamp.delivered_count, sub: "Confirmed", color: "green" },
                                                { label: "Seen", val: latestCamp.read_count, sub: "Engagement", color: "indigo" },
                                                { label: "Failed", val: latestCamp.failed_count, sub: "Obstruction", color: "red" }
                                            ].map((m, i) => (
                                                <div key={i} className={`p-6 rounded-4xl bg-${m.color}-50/50 border border-${m.color}-100`}>
                                                    <p className={`text-[9px] font-black text-${m.color === 'indigo' ? 'indigo-600' : m.color + '-600'} uppercase tracking-[0.2em] mb-3`}>{m.label}</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-3xl font-black text-heritage-dark leading-none">{m.val || 0}</span>
                                                        <span className="text-[10px] font-bold text-stone-400 italic">/ {m.sub}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* Logs Header & Search */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none">Recipient Registry</h4>
                                        <div className="px-3 py-1 bg-stone-100 text-stone-500 rounded-lg text-[9px] font-black">{filteredLogs.length} Records</div>
                                    </div>
                                    <div className="relative group">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-blue-500 transition-colors" />
                                        <input
                                            value={logSearch}
                                            onChange={e => setLogSearch(e.target.value)}
                                            placeholder="Search number or WAMID..."
                                            className="pl-10 pr-6 py-2.5 rounded-xl bg-stone-50 border border-stone-100 focus:bg-white focus:border-blue-500/20 text-[11px] font-bold outline-none transition-all w-64"
                                        />
                                    </div>
                                </div>

                                {/* Logs Table */}
                                <div className="rounded-3xl border border-stone-100 overflow-hidden shadow-sm bg-white">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-stone-50 text-[9px] font-black uppercase text-stone-400 tracking-widest">
                                                <th className="px-8 py-5">Recipient</th>
                                                <th className="px-8 py-5">Status</th>
                                                <th className="px-8 py-5">Timeline</th>
                                                <th className="px-8 py-5 text-right">Reference (WAMID)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                            {loadingLogs ? (
                                                <tr>
                                                    <td colSpan="4" className="py-20 text-center">
                                                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto opacity-20" />
                                                        <p className="mt-4 text-[10px] font-black text-stone-300 uppercase tracking-widest">Analyzing Logs...</p>
                                                    </td>
                                                </tr>
                                            ) : filteredLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center"><Smartphone className="w-3.5 h-3.5 text-stone-400" /></div>
                                                            <span className="text-[11px] font-black text-heritage-dark">
                                                                +<HighlightText text={log.phone} query={logSearch} />
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-2">
                                                            {/* Flow Visualization */}
                                                            <div className="flex items-center gap-1.5">
                                                                {/* Stage 1: Dispatched */}
                                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase border transition-all ${['sent', 'delivered', 'read'].includes(log.status)
                                                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                                    : 'bg-stone-50 text-stone-200 border-stone-100'
                                                                    }`}>
                                                                    <FiSend className="w-2 h-2" /> Sent
                                                                </div>

                                                                <div className={`w-3 h-px ${['delivered', 'read'].includes(log.status) ? 'bg-green-200' : 'bg-stone-100'}`}></div>

                                                                {/* Stage 2: Arrived */}
                                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase border transition-all ${['delivered', 'read'].includes(log.status)
                                                                    ? 'bg-green-50 text-green-600 border-green-200'
                                                                    : 'bg-stone-50 text-stone-200 border-stone-100'
                                                                    }`}>
                                                                    <CheckCheck className="w-2 h-2" /> Dlvrd
                                                                </div>

                                                                <div className={`w-3 h-px ${log.status === 'read' ? 'bg-blue-300' : 'bg-stone-100'}`}></div>

                                                                {/* Stage 3: Acknowledged */}
                                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase border transition-all ${log.status === 'read'
                                                                    ? 'bg-blue-600 text-white border-blue-700 shadow-sm shadow-blue-200'
                                                                    : 'bg-stone-50 text-stone-200 border-stone-100'
                                                                    }`}>
                                                                    {log.status === 'read' && <CheckCheck className="w-2 h-2" />} Seen
                                                                </div>

                                                                {log.status === 'failed' && (
                                                                    <div className="ml-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase bg-red-50 text-red-600 border border-red-100">
                                                                        <FiXCircle className="w-2 h-2" /> Failed
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {log.error_message && <p className="text-[8px] text-red-500 font-bold mt-2 ml-1 flex items-center gap-1"><AlertCircle className="w-2 h-2" /> {log.error_message}</p>}
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black text-heritage-dark uppercase">{log.read_at ? new Date(log.read_at).toLocaleTimeString() : log.delivered_at ? new Date(log.delivered_at).toLocaleTimeString() : "Pending"}</span>
                                                            <span className="text-[8px] font-bold text-stone-300 uppercase">{log.read_at || log.delivered_at ? new Date(log.read_at || log.delivered_at).toLocaleDateString() : ""}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right font-mono text-[9px] text-stone-400">
                                                        <HighlightText text={log.wamid || "Generating..."} query={logSearch} />
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredLogs.length === 0 && !loadingLogs && (
                                                <tr>
                                                    <td colSpan="4" className="py-20 text-center">
                                                        <Smartphone className="w-10 h-10 mx-auto text-stone-200 mb-4 opacity-20" />
                                                        <p className="text-[10px] font-black text-stone-300 uppercase italic tracking-widest">
                                                            {logSearch ? `No matching transmission records found for "${logSearch}"` : "No transmission data found"}
                                                        </p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="px-10 py-6 bg-stone-50/50 border-t border-stone-100 flex justify-between items-center text-[9px] font-black text-stone-400 uppercase tracking-widest">
                                <span>End-to-End Encryption Registry</span>
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Local Monitoring Active</div>
                                    <div className="flex items-center gap-2 text-green-600">Meta Sync Verified</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
