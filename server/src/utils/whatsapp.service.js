const DEFAULT_ORDER_TEMPLATE_LANGUAGE = "en_US";

const getConfig = () => ({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID,
  wabaId: process.env.WHATSAPP_WABA_ID || process.env.META_WABA_ID,
  graphVersion: process.env.WHATSAPP_GRAPH_VERSION || process.env.META_VERSION || "v22.0",
  defaultCountryCode: process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91",
  publicBaseUrl: process.env.WHATSAPP_PUBLIC_BASE_URL || process.env.PUBLIC_URL || null,
});

const parseGraphError = (data, fallbackMessage) => {
  const code = data?.error?.code;
  const message = data?.error?.message || fallbackMessage;
  return code ? `${message} (code=${code})` : message;
};

const postGraphJson = async ({ url, accessToken, payload, fallbackMessage }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = parseGraphError(data, fallbackMessage);
    const error = new Error(errorMsg);
    error.code = data?.error?.code; // Attach code for logic check
    error.type = "meta_graph_error";
    throw error;
  }

  return data;
};

const getGraphJson = async ({ url, accessToken, fallbackMessage }) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = parseGraphError(data, fallbackMessage);
    const error = new Error(errorMsg);
    error.code = data?.error?.code;
    error.type = "meta_graph_error";
    throw error;
  }

  return data;
};

export const sanitizeTemplateName = (name) => {
  if (!name) return null;

  const normalized = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return normalized || null;
};

const toTemplateText = (value, fallback, maxLength = 240) => {
  const base = String(value || "").trim() || fallback;
  return base.length > maxLength ? base.slice(0, maxLength) : base;
};

export const extractVariableNumbers = (text) => {
  const matches = String(text || "").match(/{{(\d+)}}/g) || [];
  const nums = matches
    .map((token) => Number(token.replace(/[^\d]/g, "")))
    .filter((n) => Number.isFinite(n));

  return [...new Set(nums)].sort((a, b) => a - b);
};

export const extractBodyTextFromComponents = (components) => {
  const list = Array.isArray(components) ? components : [];
  const body = list.find((c) => String(c?.type || "").toUpperCase() === "BODY");
  return String(body?.text || "");
};

export const resolveOrderTemplateName = () => {
  return sanitizeTemplateName(
    process.env.WHATSAPP_ORDER_TEMPLATE || process.env.WHATSAPP_ORDER_TEMPLATE_NAME
  );
};

export const resolveOrderTemplateLanguage = () => {
  return process.env.WHATSAPP_ORDER_TEMPLATE_LANG || DEFAULT_ORDER_TEMPLATE_LANGUAGE;
};

export const buildOrderFollowupLine = (productType) => {
  if (productType === "product") {
    return "Your order will be delivered within 10 days.";
  }

  return "You will shortly receive the video of the pooja/chadawa.";
};

export const normalizePhone = (rawPhone, defaultCountryCode = "91") => {
  if (!rawPhone) return null;

  const cleaned = String(rawPhone).replace(/[^\d+]/g, "");
  if (!cleaned) return null;

  let digits = cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
  digits = digits.replace(/\D/g, "");

  if (digits.length === 10) {
    digits = `${defaultCountryCode}${digits}`;
  }

  if (digits.length < 10) return null;
  return digits;
};

export const toPublicUrl = (pathOrUrl) => {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const { publicBaseUrl } = getConfig();
  if (!publicBaseUrl) return null;

  const base = publicBaseUrl.replace(/\/$/, "");
  const cleanPath = String(pathOrUrl).startsWith("/")
    ? String(pathOrUrl)
    : `/${pathOrUrl}`;

  return `${base}${cleanPath}`;
};

export const sendTemplateMessage = async ({
  to,
  templateName,
  languageCode = "en_US",
  components = [],
}) => {
  const { accessToken, phoneNumberId, graphVersion } = getConfig();

  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp credentials missing in environment.");
  }

  if (!templateName) {
    throw new Error("Template name is required to send template message.");
  }

  const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components,
    },
  };

  const data = await postGraphJson({
    url,
    accessToken,
    payload,
    fallbackMessage: "Failed to send template message",
  });

  return {
    wamid: data?.messages?.[0]?.id || null,
    raw: data,
  };
};

export const sendDocumentMessage = async ({
  to,
  documentUrl,
  caption = null,
  fileName = null,
}) => {
  const { accessToken, phoneNumberId, graphVersion } = getConfig();

  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp credentials missing in environment.");
  }

  if (!documentUrl) {
    throw new Error("Document URL is required for document message.");
  }

  const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "document",
    document: {
      link: documentUrl,
      caption,
      filename: fileName,
    },
  };

  const data = await postGraphJson({
    url,
    accessToken,
    payload,
    fallbackMessage: "Failed to send document message",
  });

  return {
    wamid: data?.messages?.[0]?.id || null,
    raw: data,
  };
};

export const sendTextMessage = async ({ to, text }) => {
  const { accessToken, phoneNumberId, graphVersion } = getConfig();

  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp credentials missing in environment.");
  }

  if (!text) {
    throw new Error("Text content is required for text message.");
  }

  const url = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: {
      preview_url: false,
      body: text,
    },
  };

  const data = await postGraphJson({
    url,
    accessToken,
    payload,
    fallbackMessage: "Failed to send text message",
  });

  return {
    wamid: data?.messages?.[0]?.id || null,
    raw: data,
  };
};


export const getMessageTemplateByName = async (templateNameInput) => {
  const templateName = sanitizeTemplateName(templateNameInput);
  if (!templateName) {
    throw new Error("Template name is required.");
  }

  const { accessToken, wabaId, graphVersion } = getConfig();

  if (!accessToken || !wabaId) {
    throw new Error(
      "WhatsApp credentials missing: WHATSAPP_ACCESS_TOKEN and WHATSAPP_WABA_ID are required."
    );
  }

  const query = new URLSearchParams({
    name: templateName,
    limit: "1",
  }).toString();

  const url = `https://graph.facebook.com/${graphVersion}/${wabaId}/message_templates?${query}`;
  const data = await getGraphJson({
    url,
    accessToken,
    fallbackMessage: "Failed to fetch message templates",
  });

  const list = Array.isArray(data?.data) ? data.data : [];
  return list.find((t) => t.name === templateName) || null;
};

export const listMessageTemplates = async ({
  limit = 50,
  after = null,
  category = null,
} = {}) => {
  const { accessToken, wabaId, graphVersion } = getConfig();

  if (!accessToken || !wabaId) {
    throw new Error(
      "WhatsApp credentials missing: WHATSAPP_ACCESS_TOKEN and WHATSAPP_WABA_ID are required."
    );
  }

  const queryParams = new URLSearchParams({
    limit: String(limit),
  });

  if (after) queryParams.set("after", after);
  if (category) queryParams.set("category", category);

  const url = `https://graph.facebook.com/${graphVersion}/${wabaId}/message_templates?${queryParams.toString()}`;
  const data = await getGraphJson({
    url,
    accessToken,
    fallbackMessage: "Failed to list message templates",
  });

  return {
    data: Array.isArray(data?.data) ? data.data : [],
    paging: data?.paging || null,
  };
};

export const createMessageTemplate = async ({
  name,
  category,
  language = "en_US",
  components,
  allowCategoryChange = true,
}) => {
  const templateName = sanitizeTemplateName(name);
  const categoryValue = String(category || "").toUpperCase();
  const componentList = Array.isArray(components) ? components : [];

  if (!templateName) {
    throw new Error("Template name is required.");
  }

  if (!["UTILITY", "MARKETING"].includes(categoryValue)) {
    throw new Error("Template category must be either UTILITY or MARKETING.");
  }

  if (componentList.length === 0) {
    throw new Error("At least one template component is required.");
  }

  const { accessToken, wabaId, graphVersion } = getConfig();

  if (!accessToken || !wabaId) {
    throw new Error(
      "WhatsApp credentials missing: WHATSAPP_ACCESS_TOKEN and WHATSAPP_WABA_ID are required."
    );
  }

  const payload = {
    name: templateName,
    category: categoryValue,
    language,
    allow_category_change: !!allowCategoryChange,
    components: componentList,
  };

  const url = `https://graph.facebook.com/${graphVersion}/${wabaId}/message_templates`;
  const data = await postGraphJson({
    url,
    accessToken,
    payload,
    fallbackMessage: "Failed to create message template",
  });

  return {
    id: data?.id || null,
    status: data?.status || "PENDING",
    category: data?.category || categoryValue,
    name: templateName,
    language,
    raw: data,
  };
};

export const deleteMessageTemplateByName = async (name) => {
  const templateName = sanitizeTemplateName(name);
  if (!templateName) {
    throw new Error("Template name is required.");
  }

  const { accessToken, wabaId, graphVersion } = getConfig();
  if (!accessToken || !wabaId) {
    throw new Error(
      "WhatsApp credentials missing: WHATSAPP_ACCESS_TOKEN and WHATSAPP_WABA_ID are required."
    );
  }

  const query = new URLSearchParams({ name: templateName }).toString();
  const url = `https://graph.facebook.com/${graphVersion}/${wabaId}/message_templates?${query}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(parseGraphError(data, "Failed to delete template on Meta"));
  }

  return data;
};

export const buildTemplateComponentsFromVariableMapping = ({
  variableMapping,
  context,
  structure = [],
  headerDocumentUrl = null,
  headerFileName = null,
  headerImageUrl = null,
  headerVideoUrl = null,
}) => {
  const components = [];
  const mapping = variableMapping && typeof variableMapping === "object" ? variableMapping : {};
  const source = context && typeof context === "object" ? context : {};
  console.log("--- [WHATSAPP MAPPING DEBUG] ---");
  console.log("Mapping Config:", JSON.stringify(mapping));
  console.log("Data Context:", JSON.stringify(source));
  console.log("Template Structure Found:", structure.length > 0 ? "YES" : "NO (Empty structure in database)");

  if (structure.length === 0) {
    console.log("[FALLBACK] No structure found, mapping all numeric variables sequentially.");
    
    // Header (Document Fallback)
    if (headerDocumentUrl) {
      components.push({
        type: "header",
        parameters: [{
          type: "document",
          document: { link: headerDocumentUrl, filename: headerFileName || "document.pdf" }
        }]
      });
    }

    // Body (Sequential Fallback)
    const entries = Object.entries(mapping)
      .filter(([key]) => /^\d+$/.test(String(key)))
      .sort((a, b) => Number(a[0]) - Number(b[0]));

    if (entries.length > 0) {
      const parameters = entries.map(([index, runtimeKey]) => {
        const val = source[runtimeKey];
        return { type: "text", text: toTemplateText(val, `val_${index}`) };
      });
      components.push({ type: "body", parameters });
    }
    
    console.log(`[FALLBACK] Created ${components.length} components with sequential mapping.`);
    console.log("--- [WHATSAPP MAPPING COMPLETE] ---");
    return components;
  }

  // 1. Header Handling
  const headerComp = (structure || []).find(
    (c) => String(c.type).toUpperCase() === "HEADER"
  );

  if (headerComp) {
    const format = String(headerComp.format || "").toUpperCase();
    if (format === "DOCUMENT" && headerDocumentUrl) {
      console.log(`[HEADER] Mapped DOCUMENT: ${headerFileName}`);
      components.push({
        type: "header",
        parameters: [
          {
            type: "document",
            document: {
              link: headerDocumentUrl,
              filename: headerFileName || "document.pdf",
            },
          },
        ],
      });
    } else if (format === "IMAGE" && (headerImageUrl || source.header_image_url)) {
      const imgUrl = headerImageUrl || source.header_image_url;
      console.log(`[HEADER] Mapped IMAGE: ${imgUrl}`);
      components.push({
        type: "header",
        parameters: [
          {
            type: "image",
            image: {
              link: toPublicUrl(imgUrl)
            },
          },
        ],
      });
    } else if (format === "VIDEO" && (headerVideoUrl || source.header_video_url)) {
      const vUrl = headerVideoUrl || source.header_video_url;
      console.log(`[HEADER] Mapped VIDEO: ${vUrl}`);
      components.push({
        type: "header",
        parameters: [
          {
            type: "video",
            video: {
              link: toPublicUrl(vUrl)
            },
          },
        ],
      });
    } else if (format === "TEXT") {
      const vars = extractVariableNumbers(headerComp.text);
      if (vars.length > 0) {
        const parameters = vars.map((n) => {
          const runtimeKey = mapping[String(n)];
          const val = source[runtimeKey];
          console.log(`[HEADER] Variable {{${n}}} mapped to "${runtimeKey}", value: "${val}"`);
          return { type: "text", text: toTemplateText(val, `val_${n}`) };
        });
        components.push({ type: "header", parameters });
      }
    }
  }

  // 2. Body Handling
  const bodyComp = (structure || []).find(
    (c) => String(c.type).toUpperCase() === "BODY"
  );

  if (bodyComp) {
    const vars = extractVariableNumbers(bodyComp.text);
    if (vars.length > 0) {
      console.log(`[BODY] Resolving ${vars.length} variables...`);
      const parameters = vars.map((n) => {
        const runtimeKey = mapping[String(n)];
        const val = source[runtimeKey];
        console.log(`[BODY] Variable {{${n}}} mapped to "${runtimeKey}", value: "${val}"`);
        return { type: "text", text: toTemplateText(val, `val_${n}`) };
      });
      components.push({ type: "body", parameters });
    }
  }

  // 3. Button Handling
  const buttonComp = (structure || []).find(
    (c) => String(c.type).toUpperCase() === "BUTTONS"
  );

  if (buttonComp && Array.isArray(buttonComp.buttons)) {
    buttonComp.buttons.forEach((btn, idx) => {
      if (btn.type === "URL") {
        const vars = extractVariableNumbers(btn.url);
        if (vars.length > 0) {
          console.log(`[BUTTON #${idx}] Resolving ${vars.length} variables for URL...`);
          const parameters = vars.map((n) => {
            const runtimeKey = mapping[String(n)];
            const val = source[runtimeKey];
            console.log(`[BUTTON #${idx}] Variable {{${n}}} mapped to "${runtimeKey}", value: "${val}"`);
            return { type: "text", text: toTemplateText(val, `val_${n}`) };
          });
          components.push({
            type: "button",
            sub_type: "url",
            index: String(idx),
            parameters,
          });
        }
      }
    });
  }

  console.log("--- [WHATSAPP MAPPING COMPLETE] ---");
  return components;
};

