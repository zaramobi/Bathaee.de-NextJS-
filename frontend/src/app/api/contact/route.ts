import { NextRequest, NextResponse } from "next/server";
import type { ContactMessage, ContactResponse } from "@/types/profile";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactMessage;

    // Log the message — add nodemailer here when SMTP is needed.
    console.log("[contact]", {
      from:    body.email,
      subject: body.subject,
      message: body.message,
      time:    new Date().toISOString(),
    });

    return NextResponse.json<ContactResponse>({
      success: true,
      detail:  "Message received. We'll be in touch soon.",
    });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json<ContactResponse>(
      { success: false, detail: "Failed to process your message. Please try again." },
      { status: 500 },
    );
  }
}
