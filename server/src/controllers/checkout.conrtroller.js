import * as CartModel from "../models/cart.model.js";
import * as OrderModel from "../models/order.model.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const cart = await CartModel.getOrCreateCart(req);
    const cartItems = await CartModel.getCartDetail(cart.id);

    if (!cartItems.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let totalAmount = 0;

    for (const item of cartItems) {
      let itemTotal = item.base_price * item.quantity;

      if (item.addons?.length) {
        for (const addon of item.addons) {
          itemTotal += addon.price * addon.quantity;
        }
      }

      totalAmount += itemTotal;
    }

    const orderId = await OrderModel.createOrder({
      user_id: userId,
      total_amount: totalAmount,
    });

    for (const item of cartItems) {
      const orderItemId = await OrderModel.createOrderItem({
        order_id: orderId,
        product_type: item.product_type,
        pooja_variant_id: item.pooja_variant_id,
        chadawa_item_id: item.chadawa_item_id,
        temple_id: item.temple_id,
        quantity: item.quantity,
        price: item.base_price,
      });

      if (item.addons?.length) {
        for (const addon of item.addons) {
          await OrderModel.createOrderItemAddon({
            order_item_id: orderItemId,
            addon_id: addon.addon_id,
            price: addon.price,
            quantity: addon.quantity,
          });
        }
      }
    }

    res.json({
      success: true,
      order_id: orderId,
      total_amount: totalAmount,
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({ success: false, message: "Checkout failed" });
  }
};
