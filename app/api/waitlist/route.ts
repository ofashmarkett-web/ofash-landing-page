import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "O-Fash Markett <contact@o-fashmarkett.com>";
const TEAM_EMAIL = "contact@o-fashmarkett.com";
const YEAR = new Date().getFullYear();

// In-memory store for registered emails (replace with database in production)
const registeredEmails = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    // Validate Resend API key
    if (!process.env.RESEND_API_KEY) {
      console.error("[waitlist] Missing RESEND_API_KEY environment variable");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const email: string = (body.email ?? "").trim().toLowerCase();
    const whatsapp: string = (body.whatsapp ?? "").trim();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check for duplicate email registration
    if (registeredEmails.has(email)) {
      return NextResponse.json(
        {
          error:
            "This email is already on the waitlist. Check your inbox for confirmation!",
        },
        { status: 409 },
      );
    }

    const hasWhatsApp = whatsapp.length > 0;

    // ── 1. Confirmation email to the user ──────────────────────────────────
    const userEmailRes = await resend.emails.send({
      from: FROM,
      to: email,
      subject: "🎉 You're on the O-Fash Markett Waitlist!",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>You're on the waitlist!</title>
</head>
<body style="margin:0;padding:0;background:#060e0d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060e0d;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:linear-gradient(145deg,#081a17,#0a1612);border-radius:24px;border:1px solid rgba(20,184,166,0.2);overflow:hidden;">

        <!-- Header bar -->
        <tr>
          <td style="background:linear-gradient(135deg,#042e2a,#065f58);padding:28px 36px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:44px;height:44px;background:linear-gradient(135deg,#0d9488,#14b8a6);border-radius:12px;text-align:center;vertical-align:middle;">
                  <span style="font-family:Georgia,serif;font-size:16px;font-weight:900;color:#060e0d;">OF</span>
                </td>
                <td style="padding-left:12px;">
                  <div style="font-size:20px;font-weight:800;color:#5eead4;font-family:'Helvetica Neue',Arial,sans-serif;letter-spacing:-0.5px;">O-Fash Markett</div>
                  <div style="font-size:10px;color:rgba(220,250,245,0.45);letter-spacing:0.15em;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">Africa's Fashion Market</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px 36px 32px;">
            <div style="font-size:42px;margin-bottom:16px;">🎉</div>
            <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:900;color:#5eead4;margin:0 0 16px;letter-spacing:-1.5px;line-height:1.1;">You're In!</h1>
            <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;color:rgba(220,250,245,0.72);line-height:1.75;margin:0 0 20px;">
              Welcome to the O-Fash Markett waitlist. You're among the first to experience Nigeria's premier digital fashion marketplace — connecting buyers, vendors, and riders in one seamless platform.
            </p>
            <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:rgba(220,250,245,0.5);line-height:1.75;margin:0 0 32px;">
              The moment we launch, you'll be the first to know — with a direct download link and exclusive founding member perks. 🚀
            </p>

            <!-- What to expect box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(20,184,166,0.07);border:1px solid rgba(20,184,166,0.18);border-radius:16px;margin-bottom:32px;">
              <tr><td style="padding:24px 28px;">
                <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#14b8a6;margin:0 0 14px;">What happens next</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  ${[
                    [
                      "🔔",
                      "Launch notification",
                      "You'll get an email (and WhatsApp if you shared your number) the moment we go live.",
                    ],
                    [
                      "🎁",
                      "Founding perks",
                      "Early adopters get exclusive access to special launch discounts and features.",
                    ],
                    [
                      "🛍",
                      "Start shopping",
                      "Browse verified vendors from Balogun, Onitsha, Dutse & more — all in one app.",
                    ],
                  ]
                    .map(
                      ([icon, title, desc]) => `
                  <tr>
                    <td style="width:36px;vertical-align:top;padding-bottom:14px;">
                      <span style="font-size:20px;">${icon}</span>
                    </td>
                    <td style="padding-bottom:14px;padding-left:10px;">
                      <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:700;color:#e8f7f5;margin-bottom:2px;">${title}</div>
                      <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:rgba(220,250,245,0.5);line-height:1.6;">${desc}</div>
                    </td>
                  </tr>`,
                    )
                    .join("")}
                </table>
              </td></tr>
            </table>

            ${
              hasWhatsApp
                ? `
            <!-- WhatsApp note -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(13,148,136,0.08);border:1px solid rgba(20,184,166,0.15);border-radius:12px;margin-bottom:32px;">
              <tr><td style="padding:16px 20px;">
                <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:rgba(220,250,245,0.55);margin:0;line-height:1.65;">
                  📱 <strong style="color:#a7f3d0;">WhatsApp noted (${whatsapp}).</strong> We'll only message you with your launch notification — no spam, ever. Reply STOP at any time to opt out.
                </p>
              </td></tr>
            </table>`
                : ""
            }

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(135deg,#065f58,#0d9488,#14b8a6);border-radius:12px;">
                  <a href="https://www.o-fashmarkett.com" style="display:inline-block;padding:14px 32px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:800;color:#e8f7f5;text-decoration:none;letter-spacing:-0.2px;">
                    Visit Our Website →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px 32px;border-top:1px solid rgba(20,184,166,0.1);">
            <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;color:rgba(220,250,245,0.25);margin:0;line-height:1.7;">
              © ${YEAR} O-Fash Markett · Lagos, Nigeria 🇳🇬<br/>
              You received this because you signed up at o-fashmarkett.com.<br/>
              <a href="mailto:contact@o-fashmarkett.com" style="color:rgba(20,184,166,0.5);text-decoration:none;">Unsubscribe</a> · <a href="mailto:contact@o-fashmarkett.com" style="color:rgba(20,184,166,0.5);text-decoration:none;">Contact us</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    // ── 2. Team notification ───────────────────────────────────────────────
    const teamEmailRes = await resend.emails.send({
      from: FROM,
      to: TEAM_EMAIL,
      subject: `🆕 New Waitlist Signup: ${email}`,
      html: `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f0fdf9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #d1fae5;overflow:hidden;">

        <!-- Top accent bar -->
        <tr><td style="background:linear-gradient(135deg,#065f58,#14b8a6);height:6px;"></td></tr>

        <tr>
          <td style="padding:32px 36px 28px;">
            <div style="display:inline-block;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:100px;padding:4px 14px;font-size:12px;font-weight:700;color:#0d9488;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">
              🔔 New Waitlist Signup
            </div>
            <h1 style="font-size:24px;font-weight:900;color:#065f58;margin:0 0 6px;letter-spacing:-0.5px;">Someone just joined!</h1>
            <p style="font-size:14px;color:#6b7280;margin:0 0 28px;">A new person has reserved their spot on the O-Fash Markett waitlist.</p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf9;border:1px solid #a7f3d0;border-radius:12px;margin-bottom:24px;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:14px;border-bottom:1px solid #d1fae5;">
                      <div style="font-size:11px;font-weight:700;color:#0d9488;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">Email</div>
                      <div style="font-size:16px;font-weight:700;color:#065f58;">${email}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:14px;">
                      <div style="font-size:11px;font-weight:700;color:#0d9488;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:4px;">WhatsApp</div>
                      <div style="font-size:16px;font-weight:700;color:#065f58;">${hasWhatsApp ? whatsapp : "—  not provided"}</div>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Meta row -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                ${[
                  [
                    "🕐",
                    "Time",
                    new Date().toLocaleString("en-NG", {
                      timeZone: "Africa/Lagos",
                      dateStyle: "medium",
                      timeStyle: "short",
                    }) + " WAT",
                  ],
                  ["📍", "Timezone", "Africa/Lagos (WAT)"],
                ]
                  .map(
                    ([icon, label, value]) => `
                <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px 16px;width:48%;">
                  <div style="font-size:11px;color:#9ca3af;font-weight:600;margin-bottom:3px;">${icon} ${label}</div>
                  <div style="font-size:13px;color:#374151;font-weight:700;">${value}</div>
                </td>`,
                  )
                  .join('<td style="width:4%;"></td>')}
              </tr>
            </table>

            <p style="font-size:13px;color:#9ca3af;margin:0;line-height:1.6;">
              This is an automated notification from your O-Fash Markett waitlist system.<br/>
              Reply to this email to reach the team inbox.
            </p>
          </td>
        </tr>

        <tr><td style="background:linear-gradient(135deg,#065f58,#14b8a6);height:4px;"></td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    // Check if both emails were sent successfully
    if (userEmailRes.error) {
      console.error(
        "[waitlist] Failed to send user confirmation email:",
        userEmailRes.error,
      );
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 },
      );
    }

    if (teamEmailRes.error) {
      console.error(
        "[waitlist] Failed to send team notification email:",
        teamEmailRes.error,
      );
      // Still return success to user even if team email fails
      console.warn("[waitlist] User email sent but team notification failed");
    }

    // Add email to registered set after successful email send
    registeredEmails.add(email);

    return NextResponse.json(
      {
        success: true,
        message: "Successfully joined the waitlist!",
      },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[waitlist] Unexpected error:", errorMessage, error);
    return NextResponse.json(
      { error: "Failed to process waitlist signup. Please try again later." },
      { status: 500 },
    );
  }
}

console.log("KEY loaded:", !!process.env.RESEND_API_KEY);
