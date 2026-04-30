import type { CreateContactInput } from "@/lib/validations/contact";

/**
 * Inline-styled email templates for the simple contact form.
 * Palette matches the rest of the site (primary teal).
 */

const BRAND_PRIMARY = "#2f8f8b";
const BRAND_BG = "#fafafa";

function escape(v: string | null | undefined): string {
  if (v == null) return "";
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">
        ${escape(label)}
      </td>
      <td style="padding:6px 0;color:#111827;font-size:14px;line-height:1.5;">
        ${escape(value)}
      </td>
    </tr>`;
}

function section(title: string, innerRows: string): string {
  if (!innerRows.trim()) return "";
  return `
    <div style="margin-top:20px;">
      <h3 style="margin:0 0 8px;font-size:14px;font-weight:600;color:${BRAND_PRIMARY};text-transform:uppercase;letter-spacing:0.04em;">
        ${escape(title)}
      </h3>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
        ${innerRows}
      </table>
    </div>`;
}

function shell(innerHtml: string, preheader: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:'Helvetica Neue',Arial,sans-serif;color:#111827;">
  <span style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">${escape(preheader)}</span>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND_BG};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
        <tr>
          <td style="padding:24px 28px;background:${BRAND_PRIMARY};color:#ffffff;">
            <p style="margin:0;font-size:14px;letter-spacing:0.08em;opacity:0.85;">POSTURA BY PHYSIO</p>
          </td>
        </tr>
        <tr><td style="padding:28px;">${innerHtml}</td></tr>
        <tr>
          <td style="padding:18px 28px;border-top:1px solid #f1f5f9;font-size:12px;color:#9ca3af;">
            Postura by Physio · Vadodara, India
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** Notification sent to the clinic / admin. */
export function adminContactEmail(data: CreateContactInput) {
  const subject = `New contact message from ${data.fullName}`;

  const detailRows = [
    row("Name", data.fullName),
    row("Phone", data.phone),
    row("Email", data.email),
    row("Service interest", data.service ?? null),
    row("Address", data.address ?? null),
  ].join("");

  const html = shell(
    `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
        New contact enquiry
      </h1>
      <p style="margin:0 0 6px;color:#6b7280;font-size:14px;line-height:1.6;">
        Someone just submitted the contact form on the website.
        Reply to this email to write directly to them.
      </p>

      ${section("Contact details", detailRows)}
      ${
        data.message
          ? section(
              "Message",
              `<tr><td style="padding:6px 0;color:#111827;font-size:14px;line-height:1.6;">${escape(data.message)}</td></tr>`
            )
          : ""
      }

      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
        Received ${escape(new Date().toLocaleString("en-IN"))}
      </p>
    `,
    `New contact message from ${data.fullName}.`
  );

  const text =
    `New contact enquiry\n\n` +
    `Name:    ${data.fullName}\n` +
    `Phone:   ${data.phone}\n` +
    `Email:   ${data.email}\n` +
    (data.service ? `Service: ${data.service}\n` : "") +
    (data.address ? `Address: ${data.address}\n` : "") +
    (data.message ? `\nMessage:\n${data.message}\n` : "") +
    `\nReceived: ${new Date().toLocaleString("en-IN")}\n`;

  return { subject, html, text };
}

/** Confirmation sent to the person who filled the form. */
export function customerContactEmail(data: CreateContactInput) {
  const firstName = data.fullName.split(/\s+/)[0] ?? data.fullName;
  const subject = `We've received your message, ${firstName}`;

  const detailRows = [
    row("Name", data.fullName),
    row("Phone", data.phone),
    row("Email", data.email),
    row("Service interest", data.service ?? null),
    row("Address", data.address ?? null),
  ].join("");

  const html = shell(
    `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
        Thanks, ${escape(firstName)} — we'll be in touch!
      </h1>
      <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">
        We've received your message and our team will get back to you shortly.
        Here's a copy of what you submitted for your records.
      </p>

      ${section("Your details", detailRows)}
      ${
        data.message
          ? section(
              "Your message",
              `<tr><td style="padding:6px 0;color:#111827;font-size:14px;line-height:1.6;">${escape(data.message)}</td></tr>`
            )
          : ""
      }

      <p style="margin:22px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
        If anything looks off, just reply to this email and we'll sort it out.
      </p>
    `,
    `Your message has been received. We'll be in touch soon.`
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Thanks for reaching out! We've received your message and will be in touch shortly.\n\n` +
    `Your details\n` +
    `  Name:    ${data.fullName}\n` +
    `  Phone:   ${data.phone}\n` +
    `  Email:   ${data.email}\n` +
    (data.service ? `  Service: ${data.service}\n` : "") +
    (data.address ? `  Address: ${data.address}\n` : "") +
    (data.message ? `\nYour message:\n  ${data.message}\n` : "") +
    `\n— Postura by Physio\n`;

  return { subject, html, text };
}
