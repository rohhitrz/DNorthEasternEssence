import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️ Resend API key not set. Email features will not work.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "");

const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";

/**
 * Send order confirmation email.
 */
export async function sendOrderConfirmation(params: {
  to: string;
  customerName: string;
  orderId: string;
  total: string;
  currency: string;
  items: Array<{ name: string; quantity: number; price: string }>;
}) {
  const itemsList = params.items
    .map((item) => `• ${item.name} × ${item.quantity} — ${params.currency} ${item.price}`)
    .join("\n");

  return resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Order Confirmed — ${params.orderId} | DNorthEasternEssence`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #0a0807; color: #f5f0e8; padding: 40px;">
        <h1 style="color: #c9a96e; font-size: 24px; margin-bottom: 8px;">Thank You, ${params.customerName}!</h1>
        <p style="color: #9a8878; margin-bottom: 24px;">Your order has been confirmed.</p>
        
        <div style="border: 1px solid #2a2420; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #9a8878; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
          <p style="color: #c9a96e; font-size: 16px; font-weight: bold;">${params.orderId}</p>
        </div>
        
        <div style="border: 1px solid #2a2420; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #9a8878; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Items</p>
          <pre style="color: #f5f0e8; font-family: inherit; white-space: pre-wrap;">${itemsList}</pre>
        </div>
        
        <div style="border-top: 1px solid #2a2420; padding-top: 16px;">
          <p style="font-size: 20px; color: #c9a96e; font-weight: bold;">
            Total: ${params.currency} ${params.total}
          </p>
        </div>
        
        <p style="color: #9a8878; font-size: 12px; margin-top: 40px; text-align: center;">
          © 2025 DNorthEasternEssence. All rights reserved.
        </p>
      </div>
    `,
  });
}

/**
 * Send shipping notification email.
 */
export async function sendShippingNotification(params: {
  to: string;
  customerName: string;
  orderId: string;
  trackingNumber?: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Your Order Has Shipped — ${params.orderId} | DNorthEasternEssence`,
    html: `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #0a0807; color: #f5f0e8; padding: 40px;">
        <h1 style="color: #c9a96e; font-size: 24px;">Your Order Is On Its Way!</h1>
        <p style="color: #9a8878;">Hi ${params.customerName}, your order <strong style="color: #c9a96e;">${params.orderId}</strong> has been shipped.</p>
        ${params.trackingNumber ? `<p style="color: #f5f0e8;">Tracking Number: <strong>${params.trackingNumber}</strong></p>` : ""}
        <p style="color: #9a8878; font-size: 12px; margin-top: 40px; text-align: center;">
          © 2025 DNorthEasternEssence. All rights reserved.
        </p>
      </div>
    `,
  });
}
