import { useEffect, useMemo, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiClock,
  FiLink,
  FiRefreshCw,
  FiSave,
  FiShield,
  FiTool,
  FiXCircle,
  FiEye,
  FiExternalLink
} from "react-icons/fi";
import { Loader2, Smartphone, Send, ExternalLink, Phone } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const CATEGORY_OPTIONS = ["UTILITY", "MARKETING"];
const HEADER_TYPE_OPTIONS = [
  { value: "none", label: "No Header" },
  { value: "text", label: "Text Header" },
  { value: "media", label: "Media Header" },
];

const statusStyle = (status) => {
  const key = String(status || "").toUpperCase();
  if (key === "APPROVED") return "bg-green-50 border-green-100 text-green-700";
  if (key === "PENDING" || key === "SUBMITTED") return "bg-yellow-50 border-yellow-100 text-yellow-700";
  if (key === "REJECTED" || key === "FAILED_META") return "bg-red-50 border-red-100 text-red-700";
  return "bg-stone-50 border-stone-100 text-stone-700";
};

const StatusIcon = ({ status }) => {
  const key = String(status || "").toUpperCase();
  if (key === "APPROVED") return <FiCheckCircle className="w-3.5 h-3.5" />;
  if (key === "PENDING" || key === "SUBMITTED") return <FiClock className="w-3.5 h-3.5" />;
  if (key === "REJECTED" || key === "FAILED_META") return <FiXCircle className="w-3.5 h-3.5" />;
  return <FiShield className="w-3.5 h-3.5" />;
};

const extractVariables = (text) => {
  const matches = String(text || "").match(/{{(\d+)}}/g) || [];
  const nums = matches
    .map((token) => Number(token.replace(/[^\d]/g, "")))
    .filter((n) => Number.isFinite(n));
  return [...new Set(nums)].sort((a, b) => a - b);
};

const replaceVariablesForPreview = (text, variableNumbers, mapping, sampleValues) => {
  let preview = String(text || "");
  variableNumbers.forEach((num) => {
    const key = mapping?.[String(num)] || mapping?.[num];
    const sample = key ? sampleValues?.[key] : null;
    const replacement = sample || `{${key || `var_${num}`}}`;
    preview = preview.replace(new RegExp(`{{\\s*${num}\\s*}}`, "g"), replacement);
  });
  return preview;
};

const MetaApprovalRules = () => (
  <div className="rounded-[2rem] p-8 border border-stone-200 bg-stone-50/50 relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
    <h3 className="font-black text-heritage-dark flex items-center gap-3 mb-6 text-sm uppercase tracking-widest">
      <FiCheckCircle className="w-5 h-5 text-blue-500" />
      Meta Compliance Protocol
    </h3>
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-[11px] sm:text-xs text-stone-600 font-bold leading-relaxed">
      <li className="flex gap-3 items-start">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
        <span><b className="text-heritage-dark">Variable Sequence:</b> Must follow strictly incremental order (e.g., {"{{1}}"}, {"{{2}}"}).</span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
        <span><b className="text-heritage-dark">Grammar & Syntax:</b> Avoid vague placeholders; maintain correct grammar and professional tone.</span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
        <span><b className="text-heritage-dark">Call-to-Action:</b> URLs must include protocol (https://) and phone numbers need country codes.</span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
        <span><b className="text-heritage-dark">Safety First:</b> Strict zero-tolerance for abusive, threatening, or deceptive marketing tactics.</span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
        <span><b className="text-heritage-dark">Structural Integrity:</b> Variables cannot be used in the final position of a message.</span>
      </li>
      <li className="flex gap-3 items-start">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
        <span><b className="text-heritage-dark">Header Consistency:</b> Media samples must match the intended format (Image/Video/PDF).</span>
      </li>
    </ul>
    <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
      <a
        href="https://developers.facebook.com/docs/whatsapp/message-templates/guidelines"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] font-black text-blue-500 hover:text-blue-700 uppercase tracking-widest flex items-center gap-2 transition-all hover:translate-x-1"
      >
        Official Developer Guidelines <FiExternalLink className="w-3 h-3" />
      </a>
      <span className="text-[9px] font-bold text-stone-300 uppercase tracking-[0.2em]">Bulk-Web Standard v4.2</span>
    </div>
  </div>
);

const WhatsAppBubble = ({ template, sampleValues = {} }) => {
  if (!template) return null;

  const components = Array.isArray(template.structure_json) ? template.structure_json : [];
  const header = components.find((c) => String(c.type).toUpperCase() === "HEADER");
  const body = components.find((c) => String(c.type).toUpperCase() === "BODY");
  const footer = components.find((c) => String(c.type).toUpperCase() === "FOOTER");
  const buttonComp = components.find((c) => String(c.type).toUpperCase() === "BUTTONS");

  const variableNumbers = body ? extractVariables(body.text) : [];
  const renderedBody = replaceVariablesForPreview(body?.text || "", variableNumbers, null, sampleValues);

  return (
    <div className="relative w-full max-w-[280px] drop-shadow-sm select-none">
      <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-[0_1px_2px_rgba(11,20,26,0.1)] relative w-full border border-stone-100/30">
        {/* Bubble Tail */}
        <div className="absolute top-0 -left-[8px] w-[9px] h-3 overflow-hidden">
          <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-sm rotate-45 transform origin-top-right"></div>
        </div>

        {/* Header */}
        {header && (
          <div className="mb-2">
            {header.format === "TEXT" ? (
              <p className="font-bold text-[#111b21] text-sm leading-tight">{header.text}</p>
            ) : (
              <div className="bg-stone-50 rounded-lg overflow-hidden border border-stone-100 flex flex-col items-center justify-center aspect-video mb-1">
                {template.sample_media_url ? (
                  <img src={template.sample_media_url} alt="Header" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 opacity-20">
                    <Smartphone className="w-6 h-6" />
                    <span className="text-[8px] font-black">{header.format}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="text-[#111b21] text-[13px] leading-[1.4] whitespace-pre-wrap font-normal">
          {renderedBody.split(/({[^{}]+})/).map((part, i) =>
            /^{[^{}]+}$/.test(part) ? (
              <span key={i} className="text-blue-600 font-bold bg-blue-50 px-0.5 rounded">
                {part}
              </span>
            ) : part
          )}
        </div>

        {/* Footer */}
        {footer && (
          <p className="mt-1.5 text-[11px] text-[#667781] leading-snug">
            {footer.text}
          </p>
        )}

        {/* Time & Checks */}
        <div className="flex items-center justify-end gap-1 mt-1 opacity-40">
          <p className="text-[9px] font-medium">12:00 PM</p>
          <svg viewBox="0 0 16 11" width="12" height="12" fill="#53bdeb">
            <path d="M15.01 3.316l-.426-.426a.5.5 0 0 0-.706 0L6.627 10.14l-3.23-3.23a.5.5 0 0 0-.707 0l-.426.426a.5.5 0 0 0 0 .707l4.01 4.01a.5.5 0 0 0 .707 0l8.03-8.03a.5.5 0 0 0 0-.707zM10.132 3.316l-.426-.426a.5.5 0 0 0-.706 0L3.892 10.14l-.426-.426a.5.5 0 0 0-.707 0l-.426.426a.5.5 0 0 0 0 .707l1.132 1.132a.5.5 0 0 0 .707 0l6.386-6.386a.5.5 0 0 0 0-.707z"></path>
          </svg>
        </div>
      </div>

      {/* Buttons */}
      {buttonComp && buttonComp.buttons && (
        <div className="flex flex-col w-full space-y-[2px] mt-1">
          {buttonComp.buttons.map((btn, idx) => (
            <div key={idx} className="bg-white/95 rounded-xl py-2 shadow-sm border border-stone-100 flex items-center justify-center gap-2 text-[#00a884] text-[13px] font-bold">
              {(btn.type === "QUICK_REPLY" || btn.type === "quick_reply") && <Send className="w-3 h-3" />}
              {(btn.type === "URL" || btn.type === "url") && <ExternalLink className="w-3 h-3" />}
              {(btn.type === "PHONE_NUMBER" || btn.type === "phone") && <Phone className="w-3 h-3" />}
              <span className="truncate">{btn.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WhatsAppSimulator = ({ template, children, sampleValues = {} }) => {
  return (
    <div className="w-[300px] sm:w-[320px] bg-white rounded-[3rem] shadow-2xl border-[10px] border-[#1c1c1c] overflow-hidden relative isolate shrink-0">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#1c1c1c] rounded-b-xl z-30"></div>

      <div className="bg-[#075e54] pt-8 pb-3 px-4 flex items-center gap-3 text-white relative z-20">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/10">
          <Smartphone className="w-4 h-4 text-white/50" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-[13px] font-bold leading-none truncate font-sans">Shyam Sevaa Official</p>
          <p className="text-[9px] text-white/60 font-medium mt-0.5">Automated Intelligence</p>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <FiRefreshCw className="w-3 h-3" />
          <FiShield className="w-3 h-3" />
        </div>
      </div>

      <div className="h-[460px] bg-[#e5ddd5] p-3 overflow-y-auto custom-scrollbar relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="relative z-10 flex flex-col items-start pt-2">
          {template ? <WhatsAppBubble template={template} sampleValues={sampleValues} /> : children}
        </div>
      </div>

      <div className="bg-white p-3 border-t border-stone-100 flex items-center gap-2">
        <div className="flex-1 h-8 bg-stone-100 rounded-full flex items-center px-4 text-stone-400 text-[10px] italic">
          Type message...
        </div>
        <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white shadow-sm">
          <Send className="w-3 h-3" />
        </div>
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-stone-200 rounded-full z-20"></div>
    </div>
  );
};

const TemplatePreviewModal = ({ template, onClose }) => {
  if (!template) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const components = Array.isArray(template.structure_json) ? template.structure_json : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-dark/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="bg-white rounded-4xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h3 className="text-xl font-black text-heritage-dark font-sans tracking-tight">Template Analyst</h3>
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Resource: {template.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-50 transition-colors">
            <FiXCircle className="w-8 h-8 text-stone-200 hover:text-sindoor" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row bg-[#fafaf9]">
          <div className="w-full lg:w-96 p-8 border-r border-stone-100 overflow-y-auto custom-scrollbar shrink-0">
            <div className="space-y-8">
              <section className="space-y-3">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Global Identity</h4>
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                  <label className="text-[8px] font-bold text-stone-400 uppercase block mb-1">Meta ID</label>
                  <p className="text-xs font-mono font-bold text-heritage-dark break-all">{template.meta_template_id || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <label className="text-[8px] font-bold text-stone-400 uppercase block mb-1">Status</label>
                    <span className={`text-[10px] font-black uppercase ${statusStyle(template.meta_status)}`}>{template.meta_status}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                    <label className="text-[8px] font-bold text-stone-400 uppercase block mb-1">Locale</label>
                    <span className="text-[10px] font-black uppercase text-heritage-dark">{template.language}</span>
                  </div>
                </div>

                {template.rejection_reason && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                    <label className="text-[8px] font-bold text-red-400 uppercase mb-2 flex items-center gap-1.5">
                      <FiXCircle className="w-2.5 h-2.5" /> Rejection Protocol Output
                    </label>
                    <p className="text-[11px] font-bold text-red-700 leading-relaxed font-sans">{template.rejection_reason}</p>
                  </div>
                )}
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Component Tree</h4>
                <div className="space-y-3 border-l-2 border-stone-100 ml-1 pl-4">
                  {components.map((comp, i) => (
                    <div key={i}>
                      <p className="text-[9px] font-black text-blue-500 uppercase">{comp.type}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{comp.text || (comp.buttons ? `${comp.buttons.length} Buttons` : comp.format)}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Time Logs</h4>
                <div className="p-4 rounded-xl bg-stone-900 text-white space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="opacity-40">Created:</span>
                    <span className="opacity-90">{formatDate(template.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="opacity-40">Synced:</span>
                    <span className="opacity-90">{formatDate(template.last_synced_at)}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex-1 p-12 bg-stone-50 flex flex-col items-center justify-center relative min-h-[550px]">
            <div className="absolute inset-0 opacity-[0.03] pattern-diagonal"></div>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] mb-10 relative z-10">Real-time Simulation</p>
            <div className="scale-100 sm:scale-[1.15] lg:scale-[1.25] transform-gpu">
              <WhatsAppSimulator template={template} />
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-stone-100 flex items-center justify-end bg-white shrink-0">
          <button onClick={onClose} className="px-10 py-3.5 rounded-xl border border-stone-200 text-xs font-black uppercase tracking-widest text-stone-500 hover:bg-stone-50 transition-all">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function WhatsAppTemplates() {
  const [templates, setTemplates] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [savingUseCase, setSavingUseCase] = useState("");
  const [createError, setCreateError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "MARKETING",
    language: "en_US",
    headerType: "none",
    headerText: "",
    headerMediaFile: null,
    bodyContent: "",
    footerText: "",
    buttonType: "none",
    buttons: [],
    variableExamples: {},
  });

  const [drafts, setDrafts] = useState({});

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await api.get("/whatsapp/admin/templates");
      setTemplates(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  const fetchUseCases = async () => {
    try {
      const res = await api.get("/whatsapp/admin/template-usecases");
      const { use_cases, mappings } = res.data;
      setUseCases(use_cases || []);

      const initialDrafts = {};
      (use_cases || []).forEach((uc) => {
        const mapping = (mappings || []).find(m => m.use_case === uc.key);
        initialDrafts[uc.key] = {
          templateId: mapping?.template_id ? String(mapping.template_id) : "",
          variableMapping: mapping?.variable_mapping || {},
        };
      });
      setDrafts(initialDrafts);
    } catch (error) {
      toast.error("Failed to fetch use-cases");
    }
  };

  const syncTemplates = async () => {
    try {
      setSyncing(true);
      const res = await api.post("/whatsapp/admin/templates/sync");
      toast.success(res.data.message || "Meta sync successful");
      fetchTemplates();
    } catch (error) {
      toast.error(error.response?.data?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const createTemplate = async () => {
    if (!form.name || !form.bodyContent) {
      toast.error("Name and Body Content are required");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("language", form.language);
      formData.append("headerType", form.headerType);
      formData.append("bodyContent", form.bodyContent);
      formData.append("footerText", form.footerText);
      formData.append("buttonType", form.buttonType);

      if (form.headerType === "text") formData.append("headerText", form.headerText);
      if (form.headerType === "media" && form.headerMediaFile) formData.append("headerMedia", form.headerMediaFile);

      formData.append("buttons", JSON.stringify(form.buttons));
      formData.append("variableExamples", JSON.stringify(form.variableExamples));

      await api.post("/whatsapp/admin/templates", formData);
      toast.success("Template submitted for approval");
      setForm({
        name: "", category: "MARKETING", language: "en_US",
        headerType: "none", headerText: "", headerMediaFile: null,
        bodyContent: "", footerText: "", buttonType: "none",
        buttons: [], variableExamples: {},
      });
      fetchTemplates();
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Creation failed";
      setCreateError(msg);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  };

  const toggleTemplateActive = async (template) => {
    try {
      const nextStatus = Number(template.is_active) === 1 ? 0 : 1;
      await api.patch(`/whatsapp/admin/templates/${template.id}/toggle-active`, {
        is_active: nextStatus,
      });
      toast.success(`Template ${nextStatus === 1 ? "activated" : "deactivated"}`);
      fetchTemplates();
    } catch (error) {
      toast.error("Failed to toggle status");
    }
  };

  const formVariables = useMemo(() => extractVariables(form.bodyContent), [form.bodyContent]);

  const handleContentChange = (val) => {
    const vars = extractVariables(val);
    setForm(prev => {
      const nextExamples = { ...prev.variableExamples };
      vars.forEach(v => {
        if (!nextExamples[v]) nextExamples[v] = "";
      });
      return { ...prev, bodyContent: val, variableExamples: nextExamples };
    });
  };

  const addVariableToken = () => {
    const nextNum = formVariables.length > 0 ? Math.max(...formVariables) + 1 : 1;
    setForm(prev => ({ ...prev, bodyContent: prev.bodyContent + ` {{${nextNum}}}` }));
  };

  const addButton = () => {
    if (form.buttonType === "quick_reply") {
      if (form.buttons.length >= 3) return toast.error("Max 3 quick replies");
      setForm(prev => ({ ...prev, buttons: [...prev.buttons, { id: Date.now(), text: "" }] }));
    } else if (form.buttonType === "call_to_action") {
      if (form.buttons.length >= 2) return toast.error("Max 2 CTAs");
      const hasUrl = form.buttons.some(b => b.type === "url");
      setForm(prev => ({ ...prev, buttons: [...prev.buttons, { id: Date.now(), text: "", type: hasUrl ? "phone" : "url", value: "" }] }));
    }
  };

  const updateButton = (id, field, value) => {
    setForm(prev => ({
      ...prev,
      buttons: prev.buttons.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const removeButton = (id) => {
    setForm(prev => ({ ...prev, buttons: prev.buttons.filter(b => b.id !== id) }));
  };

  const getTemplateById = (id) => templates.find(t => String(t.id) === String(id));
  const approvedActiveTemplates = useMemo(() => templates.filter(t => t.meta_status === 'APPROVED'), [templates]);

  const updateUseCaseTemplate = (useCaseKey, templateIdValue) => {
    setDrafts((prev) => {
      const existing = prev[useCaseKey] || { templateId: "", variableMapping: {} };
      const template = getTemplateById(templateIdValue);
      const variableNumbers = Array.isArray(template?.variable_numbers) ? template.variable_numbers : [];
      const useCase = useCases.find((u) => u.key === useCaseKey);
      const allowed = Array.isArray(useCase?.allowedVariables) ? useCase.allowedVariables : [];
      const fallbackKey = allowed[0]?.key || "customer_name";

      const nextMapping = {};
      variableNumbers.forEach((num) => {
        nextMapping[String(num)] = existing.variableMapping?.[String(num)] || fallbackKey;
      });

      return { ...prev, [useCaseKey]: { templateId: templateIdValue, variableMapping: nextMapping } };
    });
  };

  const updateUseCaseVariable = (useCaseKey, variableNumber, runtimeKey) => {
    setDrafts((prev) => {
      const existing = prev[useCaseKey] || { templateId: "", variableMapping: {} };
      return {
        ...prev,
        [useCaseKey]: {
          ...existing,
          variableMapping: { ...existing.variableMapping, [String(variableNumber)]: runtimeKey }
        }
      };
    });
  };

  const saveUseCaseMapping = async (useCaseKey) => {
    const draft = drafts[useCaseKey];
    if (!draft?.templateId) return toast.error("Select a template");

    try {
      setSavingUseCase(useCaseKey);
      await api.put(`/whatsapp/admin/template-usecases/${useCaseKey}`, {
        templateId: Number(draft.templateId),
        variableMapping: draft.variableMapping
      });
      toast.success("Mapping saved");
      fetchUseCases();
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setSavingUseCase("");
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchUseCases();
  }, []);

  return (
    <div className="p-4 sm:p-10 space-y-10">
      <MetaApprovalRules />

      <div className="flex flex-col xl:flex-row items-center justify-between gap-8 pt-4">
        <div className="flex-1">
          <h1 className="text-3xl sm:text-5xl font-black text-heritage-dark font-serif tracking-tight leading-none">
            Intelligence <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-stone-400 font-black text-[10px] uppercase tracking-[0.4em] mt-4 flex items-center gap-4">
            <span className="w-12 h-px bg-blue-500"></span> WhatsApp Cloud Registry
          </p>
        </div>

        <div className="flex gap-4 p-1.5 rounded-2xl bg-stone-100/50 border border-stone-200">
          <button onClick={fetchTemplates} disabled={loading} className="px-6 py-2.5 bg-white text-stone-900 font-bold rounded-xl shadow-sm active:scale-95 transition-all text-sm flex items-center gap-2">
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={syncTemplates} disabled={syncing} className="px-6 py-2.5 bg-stone-900 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all text-sm flex items-center gap-2">
            <FiLink className={syncing ? 'animate-spin' : ''} /> Sync Meta
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-stone-100 overflow-hidden">
        <div className="p-8 sm:p-14 border-b border-stone-50">
          <h2 className="text-2xl font-black text-heritage-dark tracking-tight">Create Blueprint</h2>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Design your communication template</p>
        </div>

        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-stone-50">
          <div className="flex-1 p-8 sm:p-14 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Name</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="order_confirm_v1" className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold outline-none appearance-none">
                  {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Language</label>
                <input value={form.language} onChange={e => setForm(p => ({ ...p, language: e.target.value }))} className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Header Type</label>
                <select value={form.headerType} onChange={e => setForm(p => ({ ...p, headerType: e.target.value, headerText: "", headerMediaFile: null }))} className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold outline-none">
                  {HEADER_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {form.headerType === 'text' && (
                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Header Text</label>
                  <input value={form.headerText} onChange={e => setForm(p => ({ ...p, headerText: e.target.value }))} className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold outline-none" />
                </div>
              )}
              {form.headerType === 'media' && (
                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Source Asset</label>
                  <input type="file" onChange={e => setForm(p => ({ ...p, headerMediaFile: e.target.files[0] }))} className="w-full px-5 py-3 text-xs" />
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Payload Content</label>
              <textarea value={form.bodyContent} onChange={e => handleContentChange(e.target.value)} rows={5} className="w-full px-6 py-5 rounded-[2rem] bg-stone-50 border border-stone-100 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none" />
              <div className="flex justify-between mt-3">
                <button onClick={addVariableToken} className="px-5 py-2 bg-stone-900 text-white text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all">+ Add Token</button>
                <span className="text-[10px] font-bold text-stone-300">{form.bodyContent.length}/1024</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Footer Metadata</label>
                  <input value={form.footerText} onChange={e => setForm(p => ({ ...p, footerText: e.target.value }))} maxLength={60} className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold outline-none" placeholder="e.g. Reply STOP to opt out" />
                </div>

                {formVariables.length > 0 && (
                  <div className="p-6 rounded-[2rem] bg-stone-800 text-white space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Variable Intelligence</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {formVariables.map(num => (
                        <div key={num} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono font-black text-blue-400 w-8">{"{{"}{num}{"}}"}</span>
                          <input
                            value={form.variableExamples[num] || ""}
                            onChange={e => setForm(p => ({ ...p, variableExamples: { ...p.variableExamples, [num]: e.target.value } }))}
                            placeholder={`Example for variable ${num}...`}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-bold outline-none focus:bg-white/10 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Button Logic</label>
                  <select value={form.buttonType} onChange={e => setForm(p => ({ ...p, buttonType: e.target.value, buttons: [] }))} className="w-full px-5 py-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-sm font-bold outline-none">
                    <option value="none">Standard Message</option>
                    <option value="quick_reply">Quick Response Flow</option>
                    <option value="call_to_action">Direct Action Flow</option>
                  </select>
                </div>
              </div>
              {form.buttonType !== 'none' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-stone-400 mb-2 block">Configuration</label>
                  {form.buttons.map(btn => (
                    <div key={btn.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 relative group animate-in slide-in-from-right duration-300">
                      <button onClick={() => removeButton(btn.id)} className="absolute top-2 right-2 text-stone-300 hover:text-red-500 transition-colors"><FiXCircle /></button>
                      <div className="mb-2">
                        <label className="text-[8px] font-bold text-stone-400 uppercase block mb-1">Button text (Name)</label>
                        <input value={btn.text} onChange={e => updateButton(btn.id, "text", e.target.value)} placeholder="e.g. Visit Website" className="w-full bg-stone-100/50 rounded-lg px-3 py-1.5 text-[11px] font-black outline-none border border-stone-200/50 focus:border-blue-500/30 transition-all font-sans" />
                      </div>

                      {form.buttonType === 'call_to_action' && (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateButton(btn.id, "type", "url")}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all ${btn.type === 'url' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-stone-400 border-stone-100'}`}
                            >
                              Website URL
                            </button>
                            <button
                              onClick={() => updateButton(btn.id, "type", "phone")}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all ${btn.type === 'phone' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-stone-400 border-stone-100'}`}
                            >
                              Phone Number
                            </button>
                          </div>
                          <input
                            value={btn.value}
                            onChange={e => updateButton(btn.id, "value", e.target.value)}
                            placeholder={btn.type === 'url' ? 'https://example.com' : '+91 9999999999'}
                            className="w-full px-3 py-2 bg-white rounded-lg text-[10px] font-bold border border-stone-100 outline-none shadow-sm focus:ring-2 focus:ring-blue-500/10"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button onClick={addButton} className="w-full py-4 border-2 border-dashed border-stone-100 rounded-2xl text-[10px] font-black text-stone-300 hover:border-blue-500/20 hover:text-blue-500 transition-all">+ Add Action Segment</button>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-[420px] bg-[#fcfcfb] p-8 sm:p-14 flex flex-col items-center justify-center shrink-0">
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-[0.4em] mb-12">Simulation Engine</p>
            <WhatsAppSimulator
              sampleValues={form.variableExamples}
              template={{
                structure_json: [
                  { type: 'HEADER', format: form.headerType.toUpperCase(), text: form.headerText },
                  { type: 'BODY', text: form.bodyContent || "Write something to preview..." },
                  { type: 'FOOTER', text: form.footerText },
                  { type: 'BUTTONS', buttons: form.buttons }
                ].filter(c => c.type === 'BODY' || (c.type === 'HEADER' && c.format !== 'NONE') || c.text || (c.buttons && c.buttons.length > 0))
              }}
            />
            {createError && (
              <div className="mt-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <FiXCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[10px] font-black text-red-700 uppercase tracking-widest leading-none mb-1">Deployment Error</p>
                  <p className="text-[11px] font-bold text-red-600/80 leading-relaxed font-sans">{createError}</p>
                </div>
              </div>
            )}

            <button onClick={createTemplate} disabled={creating} className="mt-14 w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-4">
              {creating ? <Loader2 className="animate-spin" /> : <FiSave />} Deploy to Meta Registry
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-stone-100 overflow-hidden">
        <div className="p-8 sm:p-14 border-b border-stone-50">
          <h2 className="text-2xl font-black text-heritage-dark tracking-tight">Cloud Repository</h2>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Registry of synchronized enterprise blueprints</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-10 py-5 text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none">Resource</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none">Meta ID</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none">Status</th>
                <th className="px-10 py-5 text-[10px] font-black uppercase text-stone-400 tracking-widest leading-none text-right">Interaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {templates.map(t => (
                <tr key={t.id} className="group hover:bg-stone-50/50 transition-all">
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-heritage-dark truncate max-w-[200px]">{t.name}</p>
                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">{t.category} • {t.language}</p>
                  </td>
                  <td className="px-10 py-6 text-[10px] font-mono font-bold text-stone-400">{t.meta_template_id || 'LOCAL'}</td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle(t.meta_status)}`}>
                      {t.meta_status || 'DRAFT'}
                    </span>
                    {t.rejection_reason && (
                      <p className="mt-2 text-[9px] font-bold text-red-400 line-clamp-1 max-w-[150px]" title={t.rejection_reason}>
                        Error: {t.rejection_reason}
                      </p>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right space-x-2">
                    <button onClick={() => setPreviewTemplate(t)} className="p-3 rounded-xl bg-white border border-stone-100 shadow-sm hover:border-blue-500/30 transition-all active:scale-90"><FiEye /></button>
                    <button onClick={() => toggleTemplateActive(t)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all active:scale-95 ${Number(t.is_active) === 1 ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' : 'bg-white text-stone-400 border-stone-100'}`}>{Number(t.is_active) === 1 ? 'Live' : 'Standby'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {previewTemplate && <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />}
      </AnimatePresence>

      <div className="bg-white rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-stone-100 overflow-hidden">
        <div className="p-8 sm:p-14 border-b border-stone-50">
          <h2 className="text-2xl font-black text-heritage-dark tracking-tight">Active Matrix Mapping</h2>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Bind blueprints to operational triggers</p>
        </div>
        <div className="p-8 sm:p-14 grid grid-cols-1 gap-10">
          {useCases.map(uc => {
            const draft = drafts[uc.key] || { templateId: "", variableMapping: {} };
            return (
              <div key={uc.key} className="p-8 rounded-[2rem] bg-stone-50 border border-stone-100 space-y-8">
                <div>
                  <h4 className="text-sm font-black text-heritage-dark uppercase tracking-widest">{uc.label}</h4>
                  <p className="text-[10px] font-bold text-stone-400 mt-1">{uc.description}</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] font-black uppercase text-stone-400 mb-2 block">Assigned Resource</label>
                    <select value={draft.templateId} onChange={e => updateUseCaseTemplate(uc.key, e.target.value)} className="w-full px-5 py-3.5 bg-white rounded-2xl border border-stone-100 text-[11px] font-black outline-none focus:ring-4 focus:ring-blue-500/5 transition-all">
                      <option value="">Select Resource...</option>
                      {approvedActiveTemplates.map(t => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
                    </select>
                  </div>
                  {draft.templateId && (
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1 space-y-4">
                        <label className="text-[9px] font-black uppercase text-stone-400 block">Variable Tunneling</label>
                        {Object.keys(draft.variableMapping).map(num => (
                          <div key={num} className="flex items-center gap-3">
                            <span className="text-[10px] font-mono font-black text-blue-500 w-8">{"{{"}{num}{"}}"}</span>
                            <select value={draft.variableMapping[num]} onChange={e => updateUseCaseVariable(uc.key, num, e.target.value)} className="flex-1 px-4 py-2 border-none bg-white rounded-xl text-[10px] font-bold outline-none shadow-sm">
                              {uc.allowedVariables.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
                            </select>
                          </div>
                        ))}
                        <button onClick={() => saveUseCaseMapping(uc.key)} disabled={savingUseCase === uc.key} className="w-full py-3.5 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">{savingUseCase === uc.key ? 'Saving Matrix...' : 'Commit Mapping'}</button>
                      </div>
                      <div className="lg:w-[260px] flex flex-col items-center">
                        <p className="text-[9px] font-black text-stone-300 uppercase mb-4">Signal Preview</p>
                        <div className="scale-[0.7] origin-top -mb-24">
                          <WhatsAppBubble template={getTemplateById(draft.templateId)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
