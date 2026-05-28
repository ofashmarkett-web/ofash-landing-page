import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { hasEmail, saveRegistration } from "@/lib/waitlistStore";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "O-Fash Markett <noreply@o-fashmarkett.com>";
const TEAM_EMAIL = "contact@o-fashmarkett.com";
const YEAR = new Date().getFullYear();

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("[waitlist] ❌ Missing RESEND_API_KEY");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const whatsapp: string = (body.whatsapp ?? "").trim();
    const role: string = (body.role ?? "").trim().toLowerCase();
    const businessName: string = (body.businessName ?? "").trim();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Enforce role selection
    const validRoles = ["buyer", "vendor", "rider"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Please select a role — Buyer, Vendor, or Rider." },
        { status: 400 }
      );
    }

    // Enforce business name for vendors
    if (role === "vendor" && !businessName) {
      return NextResponse.json(
        { error: "Please enter your business / shop name." },
        { status: 400 }
      );
    }

    // Check duplicate
    if (hasEmail(email)) {
      return NextResponse.json(
        {
          error:
            "This email is already on the waitlist. Check your inbox for confirmation!",
        },
        { status: 409 }
      );
    }

    const hasWhatsApp = whatsapp.length > 7;
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

    // ── Send confirmation email to user ──────────────────────────────
    const userEmailRes = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "🎉 Welcome to O-Fash Markett Waitlist!",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', 'Helvetica', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 680px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 20px; text-align: center; }
    .header h1 { font-size: 44px; font-weight: 900; color: white; margin: 0; }
    .content { background: #f8fdfb; padding: 40px 30px; }
    .greeting { font-size: 20px; font-weight: bold; color: #0d9488; margin-bottom: 20px; }
    .main-text { font-size: 18px; line-height: 1.8; color: #042e2a; margin-bottom: 25px; }
    .subtext { font-size: 16px; line-height: 1.7; color: #065f58; margin-bottom: 30px; }
    .info-box { background: linear-gradient(135deg,rgba(13,148,136,0.1),rgba(20,184,166,0.08)); border-left: 5px solid #0d9488; padding: 25px; margin: 30px 0; border-radius: 10px; }
    .info-row { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 2px solid rgba(13,148,136,0.15); }
    .info-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .info-label { font-size: 13px; font-weight: 800; color: #0d9488; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .info-value { font-size: 18px; font-weight: 600; color: #042e2a; }
    .steps-box { background: linear-gradient(135deg,rgba(20,184,166,0.08),rgba(13,148,136,0.05)); border: 2px solid #5eead4; padding: 25px; margin: 30px 0; border-radius: 10px; }
    .steps-title { font-size: 16px; font-weight: 900; color: #0d9488; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 18px; }
    .step-item { font-size: 16px; color: #042e2a; margin-bottom: 14px; line-height: 1.6; padding-left: 30px; position: relative; }
    .step-item:before { content: "✓"; position: absolute; left: 0; font-weight: 900; color: #0d9488; font-size: 20px; }
    .whatsapp-note { background: linear-gradient(135deg,rgba(13,148,136,0.1),rgba(20,184,166,0.08)); border-left: 4px solid #14b8a6; padding: 18px 22px; margin: 25px 0; border-radius: 8px; font-size: 15px; color: #042e2a; line-height: 1.7; }
    .whatsapp-note strong { color: #0d9488; font-weight: 900; }
    .divider { height: 2px; background: linear-gradient(90deg,transparent,#0d9488,transparent); margin: 35px 0; }
    .footer { background: #042e2a; color: #a7f3d0; padding: 30px; text-align: center; font-size: 14px; border-top: 3px solid #0d9488; }
    .footer-text { margin: 10px 0; line-height: 1.6; }
    .footer-link { color: #5eead4; text-decoration: none; font-weight: 600; }
    .highlight { color: #0d9488; font-weight: 900; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🎉 You're In!</h1></div>
    <div class="content">
      <p class="greeting">Welcome to O-Fash Markett! 👋</p>
      <p class="main-text">
        You've successfully reserved your spot on <span class="highlight">Africa's Premier Digital Fashion Marketplace</span>.
        We're excited to have you as one of our founding members!
      </p>
      <p class="subtext">
        The moment we launch in Lagos, you'll be the first to know — with exclusive founding member perks and special welcome bonuses.
      </p>

      <div class="info-box">
        <div class="info-row">
          <div class="info-label">📧 Email Address</div>
          <div class="info-value">${email}</div>
        </div>
        <div class="info-row">
          <div class="info-label">👤 Registration Role</div>
          <div class="info-value">${roleLabel}</div>
        </div>
        ${businessName
          ? `<div class="info-row">
          <div class="info-label">${role === "rider" ? "🛵 Delivery Business" : "🏪 Business / Shop Name"}</div>
          <div class="info-value">${businessName}</div>
        </div>`
          : ""}
        ${hasWhatsApp
          ? `<div class="info-row">
          <div class="info-label">📱 WhatsApp Number</div>
          <div class="info-value">${whatsapp}</div>
        </div>`
          : ""}
      </div>

      <div class="steps-box">
        <div class="steps-title">📍 What Happens Next</div>
        <div class="step-item">We'll send you a <strong>launch notification</strong> via email${hasWhatsApp ? " and WhatsApp" : ""}</div>
        <div class="step-item">You'll receive <strong>exclusive founding member perks</strong> and early access</div>
        <div class="step-item">Start ${role === "buyer" ? "shopping from" : role === "vendor" ? "selling on" : "delivering for"} <strong>Nigeria's top fashion markets</strong> in one app</div>
        <div class="step-item">Enjoy <strong>special early-bird ${role === "vendor" ? "zero-commission" : "discounts"}</strong> and welcome bonuses</div>
        <div class="step-item">Get <strong>free ${role === "rider" ? "onboarding support" : "delivery"}</strong> on your first ${role === "rider" ? "10 trips" : "3 orders"}</div>
      </div>

      ${hasWhatsApp
        ? `<div class="whatsapp-note">
        📱 <strong>WhatsApp Confirmation:</strong> We've saved your number (${whatsapp}).
        We'll only contact you for launch updates. Reply <strong>STOP</strong> anytime to opt out.
      </div>`
        : ""}

      <div class="divider"></div>

      <div style="background:#eef6f4;padding:25px;border-radius:10px;margin:30px 0;">
        <h3 style="font-size:18px;font-weight:900;color:#0d9488;margin-bottom:18px;">🌟 O-Fash Markett Guarantee</h3>
        <div style="font-size:16px;color:#042e2a;line-height:1.8;">
          <div style="margin-bottom:12px;">✅ <strong>100% Free Registration</strong> — No hidden charges</div>
          <div style="margin-bottom:12px;">🔒 <strong>Secure Escrow Payments</strong> — Your money is protected</div>
          <div style="margin-bottom:12px;">⚡ <strong>Lightning-Fast Delivery</strong> — 30 min to 5 hours</div>
          <div style="margin-bottom:12px;">🛡️ <strong>Buyer Protection</strong> — Items guaranteed as described</div>
          <div>💬 <strong>24/7 Support</strong> — We're here for you</div>
        </div>
      </div>

      <p class="main-text" style="margin-top:35px;border-top:2px solid #e0ebe8;padding-top:25px;">
        We're building something special for Africa's fashion community. Thank you for believing in O-Fash Markett!
      </p>
      <p style="font-size:17px;color:#0d9488;font-weight:700;margin-top:20px;">See you at launch! 🚀</p>
    </div>
    <div class="footer">
      <div class="footer-text"><strong style="font-size:16px;color:#5eead4;">O-Fash Markett</strong></div>
      <div class="footer-text">Africa's Premier Digital Fashion Marketplace</div>
      <div class="footer-text" style="margin-top:20px;border-top:1px solid rgba(90,238,212,0.2);padding-top:15px;">
        📧 <a href="mailto:contact@o-fashmarkett.com" class="footer-link">contact@o-fashmarkett.com</a>
      </div>
      <div class="footer-text">📍 Lagos, Nigeria 🇳🇬</div>
      <div class="footer-text" style="margin-top:20px;color:#7dd3c0;font-size:13px;">
        © ${YEAR} O-Fash Markett. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>`,
    });

    if (userEmailRes.error) {
      console.error("[waitlist] ❌ User email failed:", userEmailRes.error);
      return NextResponse.json(
        { error: `Failed to send confirmation: ${userEmailRes.error.message ?? "Unknown"}` },
        { status: 500 }
      );
    }

    // ── Team notification ────────────────────────────────────────────
    resend.emails
      .send({
        from: FROM,
        to: TEAM_EMAIL,
        subject: `🆕 New Waitlist Signup: ${email} (${roleLabel}${businessName ? ` · ${businessName}` : ""})`,
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fdfb;padding:30px;border-radius:10px;">
          <h2 style="color:#0d9488;font-size:24px;margin-bottom:20px;">🔔 New Waitlist Registration</h2>
          <div style="background:#eef6f4;padding:20px;border-left:4px solid #0d9488;margin-bottom:20px;border-radius:8px;">
            <p style="margin:10px 0;font-size:16px;color:#042e2a;"><strong>Email:</strong> ${email}</p>
            <p style="margin:10px 0;font-size:16px;color:#042e2a;"><strong>Role:</strong> ${roleLabel}</p>
            ${businessName ? `<p style="margin:10px 0;font-size:16px;color:#042e2a;"><strong>${role === "rider" ? "Delivery Business" : "Business/Shop"}:</strong> ${businessName}</p>` : ""}
            ${hasWhatsApp ? `<p style="margin:10px 0;font-size:16px;color:#042e2a;"><strong>WhatsApp:</strong> ${whatsapp}</p>` : ""}
            <p style="margin:10px 0;font-size:16px;color:#042e2a;">
              <strong>Time:</strong> ${new Date().toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
                dateStyle: "medium",
                timeStyle: "short",
              })} WAT
            </p>
          </div>
        </div>`,
      })
      .catch((err) =>
        console.warn("[waitlist] ⚠️ Team notification failed:", err)
      );

    // ── Persist to store ─────────────────────────────────────────────
    saveRegistration({
      email,
      role,
      businessName: businessName || undefined,
      whatsapp: hasWhatsApp ? whatsapp : undefined,
      timestamp: new Date().toISOString(),
      emailId: userEmailRes.data?.id,
    });

    console.log(`[waitlist] ✅ Registered: ${email} (${roleLabel})`);

    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist! Check your email for confirmation." },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[waitlist] ❌ Critical error:", msg);
    return NextResponse.json(
      { error: "Failed to process request. Please try again later." },
      { status: 500 }
    );
  }
}
