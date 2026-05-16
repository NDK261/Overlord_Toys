// src/lib/resend.ts
// Send transactional emails through Resend.

import { Resend } from "resend";

export interface OrderEmailData {
  to: string;
  orderId: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  shippingAddress: string;
}

const DEFAULT_FROM_EMAIL = "Overlord Toys <onboarding@resend.dev>";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing. Add it to .env.local to send real emails.");
  }

  return new Resend(apiKey);
}

function formatVnd(amount: number) {
  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(amount)} VND`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<void> {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL;

  const { error } = await resend.emails.send({
    from,
    to: data.to,
    subject: `Overlord Toys - Order confirmed #${data.orderId.slice(-8).toUpperCase()}`,
    html: generateOrderHTML(data),
    text: generateOrderText(data),
  });

  if (error) {
    throw new Error(error.message);
  }
}

function generateOrderText(data: OrderEmailData): string {
  const itemsText = data.items
    .map(
      (item) =>
        `- ${item.name} x${item.quantity}: ${formatVnd(item.price * item.quantity)}`
    )
    .join("\n");

  return [
    `Hi ${data.customerName},`,
    "",
    `Your order #${data.orderId.slice(-8).toUpperCase()} has been confirmed.`,
    "",
    itemsText,
    "",
    `Total: ${formatVnd(data.totalPrice)}`,
    `Shipping address: ${data.shippingAddress}`,
    "",
    "Thank you for shopping at Overlord Toys.",
  ].join("\n");
}

function generateOrderHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatVnd(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a;">
      <div style="background: #06151a; color: #EAFAF8; padding: 28px; border-radius: 12px 12px 0 0;">
        <p style="margin: 0 0 8px; color: #6FF7E8; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Overlord Toys</p>
        <h1 style="margin: 0; font-size: 26px;">Order confirmed</h1>
      </div>

      <div style="border: 1px solid #e5e7eb; border-top: 0; padding: 28px; border-radius: 0 0 12px 12px;">
        <p style="margin-top: 0;">Hi <strong>${escapeHtml(data.customerName)}</strong>,</p>
        <p>Your order <strong>#${escapeHtml(data.orderId.slice(-8).toUpperCase())}</strong> has been confirmed.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
          <thead>
            <tr style="background: #f8fafc;">
              <th align="left" style="padding: 12px;">Product</th>
              <th align="center" style="padding: 12px;">Qty</th>
              <th align="right" style="padding: 12px;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
        </table>

        <div style="background: #f8fafc; padding: 16px; border-radius: 10px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px;"><strong>Total:</strong> ${formatVnd(data.totalPrice)}</p>
          <p style="margin: 0;"><strong>Shipping address:</strong> ${escapeHtml(data.shippingAddress)}</p>
        </div>

        <p style="margin-bottom: 0;">Thank you for shopping at Overlord Toys.</p>
      </div>
    </div>
  `;
}

export { generateOrderHTML, generateOrderText };
