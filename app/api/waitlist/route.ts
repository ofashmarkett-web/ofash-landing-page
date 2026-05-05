import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // 1. Send a confirmation email to the user
    await resend.emails.send({
      from: "O-Fash Markett <hello@ofashmarkett.com>",   // ← change to your verified domain
      to: email,
      subject: "🎉 You're on the O-Fash Markett Waitlist!",
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;background:#020f0f;color:#e8f5f5;padding:48px 32px;border-radius:16px;max-width:560px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px;">
            <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#0d9488,#14b8a6);display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#020f0f;">OF</div>
            <span style="font-size:20px;font-weight:800;color:#14b8a6;">O-Fash Markett</span>
          </div>
          <h1 style="font-size:32px;font-weight:900;color:#5eead4;margin-bottom:16px;letter-spacing:-1px;">You're In! 🎉</h1>
          <p style="font-size:16px;color:rgba(232,245,245,0.7);line-height:1.7;margin-bottom:24px;">
            Thanks for joining the O-Fash Markett waitlist. You're among the first to experience Nigeria's premier fashion marketplace — connecting buyers, vendors, and riders.
          </p>
          <p style="font-size:15px;color:rgba(232,245,245,0.5);line-height:1.7;">
            We'll notify you the moment early access opens. Stay stylish! 👗
          </p>
          <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(20,184,166,0.15);font-size:12px;color:rgba(232,245,245,0.3);">
            © ${new Date().getFullYear()} O-Fash Markett · You received this because you signed up for our waitlist.
          </div>
        </div>
      `,
    });

    // 2. Notify your team
    await resend.emails.send({
      from: "O-Fash Markett <hello@ofashmarkett.com>",
      to: "team@ofashmarkett.com",   // ← your team email
      subject: `🆕 New Waitlist Signup: ${email}`,
      html: `<p>New waitlist signup: <strong>${email}</strong></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }
}