export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;

    if (!apiKey) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    if (!fromEmail) {
      throw new Error("Missing FROM_EMAIL environment variable");
    }

    const body = await req.json();
    const to = body?.to;
    const filename = body?.filename || "timesheet.pdf";
    const pdfDataUri = body?.pdfDataUri;
    const totals = body?.totals || {};

    if (!to) {
      throw new Error("Missing recipient email address");
    }
    if (!pdfDataUri || !pdfDataUri.startsWith("data:application/pdf")) {
      throw new Error("Missing or invalid PDF data");
    }

    const base64 = pdfDataUri.split(",")[1];

    const emailPayload = {
      from: fromEmail,
      to: [to],
      subject: "Ane Yulviane Timesheet",
      html: `
        <p>Please find the attached timesheet PDF.</p>
        <p><strong>Total hours:</strong> ${totals.hours || "0.00"}<br>
        <strong>Small:</strong> ${totals.small || "0"}<br>
        <strong>Big:</strong> ${totals.big || "0"}</p>
      `,
      attachments: [
        {
          filename,
          content: base64
        }
      ]
    };

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailPayload)
    });

    const resendJson = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      throw new Error(resendJson?.message || "Resend API request failed");
    }

    return new Response(JSON.stringify({ ok: true, id: resendJson.id || null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
