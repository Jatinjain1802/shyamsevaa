import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as OrderModel from '../models/order.model.js';
import db from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = async (orderId, userId) => {
  try {
    const order = await OrderModel.getOrderById(orderId, userId);
    if (!order) return null;

    const items = await OrderModel.getOrderItems(orderId);

    const invoicesDir = path.join(__dirname, '../../uploads/invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const fileName = `invoice_${order.order_number}.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Path to Logo
    const logoPath = path.join(__dirname, '../../../client/public/logo.png');

    // Header Background
    doc.rect(0, 0, 600, 100).fill('#fafafa');

    // Add Logo if exists
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 20, { width: 70 });
    }

    // Company Info
    doc.fontSize(22).font('Helvetica-Bold').fillColor('#800000').text('Shyam Sevaa', 130, 30);
    doc.fontSize(10).fillColor('#666666')
       .text('The Sacred Spiritual Connection', 130, 55)
       .text('Email: support@shyamsevaa.com | Web: www.shyamsevaa.com', 130, 70);

    // Invoice Title
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#333333').text('TAX INVOICE', 400, 30, { align: 'right' });
    doc.fontSize(10).fillColor('#888888').text('Receipt for your service', 400, 55, { align: 'right' });

    doc.moveDown(3);
    
    // Header Details Block
    const detailsTopY = 130;
    
    // Billed To Block
    doc.rect(50, detailsTopY - 10, 240, 110).fillAndStroke('#ffffff', '#e2e8f0');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#800000').text('BILLED TO:', 60, detailsTopY);
    doc.font('Helvetica-Bold').fillColor('#333333').text(`${order.customer_name || order.user_name || 'Guest'}`, 60, detailsTopY + 20);
    doc.font('Helvetica').fillColor('#444444');
    
    let billedToY = detailsTopY + 35;
    if (order.shipping_address) {
      doc.text(order.shipping_address, 60, billedToY, { width: 220, align: 'left' });
      billedToY += 25;
    }
    doc.text(`Mobile: ${order.communication_mobile || 'N/A'}`, 60, billedToY);
    if (order.email) {
      doc.text(`Email: ${order.email}`, 60, billedToY + 15);
    }

    // Order Details Block
    doc.rect(310, detailsTopY - 10, 240, 110).fillAndStroke('#ffffff', '#e2e8f0');
    doc.fontSize(10).font('Helvetica-Bold').fillColor('#800000').text('ORDER DETAILS:', 320, detailsTopY);
    doc.font('Helvetica-Bold').fillColor('#333333').text(`Order #: ${order.order_number}`, 320, detailsTopY + 20);
    doc.font('Helvetica').fillColor('#444444');
    doc.text(`Date Ordered: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, 320, detailsTopY + 35);
    
    // Payment Status Chip
    doc.rect(320, detailsTopY + 55, 100, 20)
       .fill(order.payment_status === 'paid' ? '#dcfce7' : '#fef3c7');
    doc.fillColor(order.payment_status === 'paid' ? '#166534' : '#92400e')
       .font('Helvetica-Bold')
       .text(order.payment_status.toUpperCase(), 320, detailsTopY + 61, { width: 100, align: 'center' });
       
    if (order.payment_id) {
       doc.fillColor('#888888').font('Helvetica').fontSize(8).text(`Txn ID: ${order.payment_id}`, 320, detailsTopY + 80);
    }

    // Items Table Header
    doc.moveDown(5);
    let tableTop = 270;
    
    doc.rect(50, tableTop, 500, 30).fillAndStroke('#800000', '#800000');
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
    doc.text('Item Description', 60, tableTop + 10, { width: 280 });
    doc.text('Qty', 350, tableTop + 10, { width: 50, align: 'center' });
    doc.text('Rate', 400, tableTop + 10, { width: 60, align: 'right' });
    doc.text('Amount (INR)', 470, tableTop + 10, { width: 70, align: 'right' });

    let currentY = tableTop + 40;
    doc.font('Helvetica').fillColor('#333333');
    
    // Item Rows
    for (const item of items) {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      const itemName = item.pooja_title || item.chadawa_item_title || item.product_name || 'Sacred Item';
      const itemPrice = Number(item.price);
      
      doc.font('Helvetica-Bold').text(itemName, 60, currentY, { width: 280 });
      doc.font('Helvetica').text(`${item.quantity}`, 350, currentY, { width: 50, align: 'center' });
      doc.text(`₹${itemPrice.toFixed(2)}`, 400, currentY, { width: 60, align: 'right' });
      doc.text(`₹${(itemPrice * item.quantity).toFixed(2)}`, 470, currentY, { width: 70, align: 'right' });
      
      let itemHeight = 15;
      
      // Temples or Variants below item
      let extraInfo = [];
      if (item.temple_title) extraInfo.push(`Temple: ${item.temple_title}`);
      if (item.product_type === 'pooja_variant' && item.pooja_persons) extraInfo.push(`Participation: ${item.pooja_persons} Person(s)`);
      
      if (extraInfo.length > 0) {
        doc.fontSize(8).fillColor('#666666').text(extraInfo.join(' | '), 60, currentY + itemHeight);
        itemHeight += 12;
      }
      
      currentY += itemHeight + 5;

      // Addons Loop
      if (item.addons && item.addons.length > 0) {
        for (const addon of item.addons) {
          const addonPrice = Number(addon.price);
          doc.fontSize(9).fillColor('#64748b').text(`+ Addon: ${addon.addon_title}`, 75, currentY, { width: 265 });
          doc.fillColor('#333333').text(`${addon.quantity}`, 350, currentY, { width: 50, align: 'center' });
          doc.text(`₹${addonPrice.toFixed(2)}`, 400, currentY, { width: 60, align: 'right' });
          doc.text(`₹${(addonPrice * addon.quantity).toFixed(2)}`, 470, currentY, { width: 70, align: 'right' });
          currentY += 15;
        }
      }
      
      // Separator Line
      doc.moveTo(50, currentY).lineTo(550, currentY).lineWidth(0.5).strokeColor('#e2e8f0').stroke();
      currentY += 10;
      doc.fillColor('#333333').fontSize(10);
    }

    currentY += 20;

    // Totals Section
    doc.rect(350, currentY, 200, 40).fill('#fafafa');
    doc.rect(350, currentY, 200, 40).stroke('#e2e8f0');
    
    doc.font('Helvetica-Bold').fontSize(12).fillColor('#333333');
    doc.text('Grand Total:', 365, currentY + 14);
    doc.fillColor('#800000').text(`₹${Number(order.total_amount).toFixed(2)}`, 450, currentY + 14, { width: 85, align: 'right' });

    // Footer
    currentY += 80;
    doc.moveTo(50, currentY).lineTo(550, currentY).lineWidth(1).strokeColor('#800000').stroke();
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#888888');
    doc.text('Thank you for choosing Shyam Sevaa. May the divine blessings be with you always.', 50, currentY + 15, { align: 'center' });
    doc.text('This is a computer-generated document. No signature is required.', 50, currentY + 30, { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', async () => {
        const publicPath = `/uploads/invoices/${fileName}`;
        // Update DB with the path
        await db.query(`UPDATE orders SET invoice_path = ? WHERE id = ?`, [publicPath, orderId]);
        resolve(publicPath);
      });
      writeStream.on('error', reject);
    });

  } catch (error) {
    console.error("Invoice generation failed:", error);
    return null;
  }
};
