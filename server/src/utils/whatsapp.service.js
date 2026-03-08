const getConfig = () => ({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.META_PHONE_NUMBER_ID,
  graphVersion: process.env.WHATSAPP_GRAPH_VERSION || process.env.META_VERSION || "v22.0",
  defaultCountryCode: process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || "91",
  publicBaseUrl: process.env.WHATSAPP_PUBLIC_BASE_URL || process.env.PUBLIC_URL || null,
});

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
    const msg = data?.error?.message || "Failed to send template message";
    throw new Error(msg);
  }

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
    const msg = data?.error?.message || "Failed to send document message";
    throw new Error(msg);
  }

  return {
    wamid: data?.messages?.[0]?.id || null,
    raw: data,
  };
};

export const buildOrderTemplateComponents = ({ customerName, orderNumber }) => {
  const parameters = [];

  if (customerName) {
    parameters.push({ type: "text", text: String(customerName) });
  }

  if (orderNumber) {
    parameters.push({ type: "text", text: String(orderNumber) });
  }

  if (parameters.length === 0) return [];
  return [{ type: "body", parameters }];
};
