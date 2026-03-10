export const WHATSAPP_TEMPLATE_USE_CASES = {
  order_confirmed: {
    key: "order_confirmed",
    label: "Order Confirmed",
    description: "Triggered automatically when payment is verified and order is marked paid.",
    allowedVariables: [
      { key: "customer_name", label: "Customer Name" },
      { key: "item_name", label: "Item Name" },
      { key: "followup_line", label: "Follow-up Line" },
      { key: "order_number", label: "Order Number" },
      { key: "order_details", label: "Order Details" },
    ],
    defaultVariableMapping: {
      1: "customer_name",
      2: "item_name",
      3: "order_details",
    },
    sampleValues: {
      customer_name: "Arjun",
      item_name: "Maha Rudra Abhishek",
      order_details: "Maha Rudra Abhishek (Order: #ORD-1001)",
    },
  },

};

export const isValidWhatsappUseCase = (useCase) =>
  Object.prototype.hasOwnProperty.call(WHATSAPP_TEMPLATE_USE_CASES, useCase);

export const getWhatsappUseCaseConfig = (useCase) =>
  WHATSAPP_TEMPLATE_USE_CASES[useCase] || null;

export const getWhatsappUseCaseList = () =>
  Object.values(WHATSAPP_TEMPLATE_USE_CASES);
