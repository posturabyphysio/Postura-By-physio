import type { BookingDto } from "@repo/types";
import { BOOKING_PROGRAM_LABELS } from "@repo/types";
import { formatInZone, getClinicTimezone } from "@/lib/time/clinic";

/**
 * Inline-styled email templates — most clients strip <style> blocks so we
 * keep everything inline. Light palette mirrors the public site
 * (primary = teal-ish, secondary gold).
 *
 * Timezone policy:
 *   - Customer-facing mail renders the appointment in the patient's
 *     timezone (`b.patientTimezone`) so the time matches what they saw
 *     on the website at submission.
 *   - Admin mail renders in the clinic's timezone so the team reads a
 *     consistent wall-clock regardless of which device opened the mail.
 *   - Legacy rows without UTC fall back to the stored display string.
 */

/** Format the appointment in the patient's own timezone. */
function patientDisplay(b: BookingDto): string {
  if (b.preferredDateTimeUtc && b.patientTimezone) {
    return formatInZone(b.preferredDateTimeUtc, b.patientTimezone);
  }
  return b.preferredDateTime;
}

/** Format the appointment in the clinic's timezone (for admin mail). */
function clinicDisplay(b: BookingDto): string {
  if (b.preferredDateTimeUtc) {
    return formatInZone(b.preferredDateTimeUtc, getClinicTimezone());
  }
  return b.preferredDateTime;
}

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

/** Simple "label: value" row; skipped entirely when value is empty. */
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

/** Section heading inside the email body. */
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

function bookingDetailsRows(b: BookingDto, displayTime: string, tzNote?: string): string {
  return [
    row("Program", BOOKING_PROGRAM_LABELS[b.program]),
    row("Service", b.service),
    row("Preferred", tzNote ? `${displayTime} (${tzNote})` : displayTime),
    row("Consultation", b.consultationType),
    row("Pain area", b.discomfortArea),
  ].join("");
}

function contactRows(b: BookingDto): string {
  return [
    row("Name", b.fullName),
    row("Phone", b.phone),
    row("Email", b.email),
    row("Address", b.address),
  ].join("");
}

function questionnaireRows(b: BookingDto): string {
  return [
    row("Profile", b.profileAbout),
    row("Activity level", b.activityLevel),
    row("Pain area", b.discomfortArea),
    row("Possible cause", b.possibleCause),
  ].join("");
}

/**
 * Message to the clinic / admin. Uses plaintext "Reply-To" so hitting reply
 * writes directly to the customer.
 */
export function adminBookingEmail(b: BookingDto) {
  const subject = `New booking: ${b.fullName} — ${BOOKING_PROGRAM_LABELS[b.program]}`;

  const adminTime = clinicDisplay(b);
  const patientTime = patientDisplay(b);
  const showPatientRow =
    Boolean(b.patientTimezone) &&
    b.patientTimezone !== getClinicTimezone() &&
    adminTime !== patientTime;

  const appointmentRows = [
    row("Program", BOOKING_PROGRAM_LABELS[b.program]),
    row("Service", b.service),
    row("Clinic time", `${adminTime} (${getClinicTimezone()})`),
    showPatientRow
      ? row("Patient time", `${patientTime} (${b.patientTimezone})`)
      : "",
    row("Consultation", b.consultationType),
    row("Pain area", b.discomfortArea),
  ].join("");

  const html = shell(
    `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
        New booking request
      </h1>
      <p style="margin:0 0 6px;color:#6b7280;font-size:14px;line-height:1.6;">
        A new appointment has just been requested from the website.
        Reply to this email to reach the customer directly.
      </p>

      ${section("Appointment", appointmentRows)}
      ${section("Contact", contactRows(b))}
      ${section("Questionnaire (patient-interaction)", questionnaireRows(b))}
      ${
        b.message
          ? section(
              "Message",
              `<tr><td style="padding:6px 0;color:#111827;font-size:14px;line-height:1.6;">${escape(
                b.message
              )}</td></tr>`
            )
          : ""
      }

      <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">
        Ref: <code>${escape(b.id)}</code> · Received ${escape(
          new Date(b.createdAt).toLocaleString("en-IN")
        )}
      </p>
    `,
    `New booking from ${b.fullName} for ${BOOKING_PROGRAM_LABELS[b.program]}.`
  );

  const text =
    `New booking request\n\n` +
    `Program:     ${BOOKING_PROGRAM_LABELS[b.program]}\n` +
    (b.service ? `Service:     ${b.service}\n` : "") +
    `Clinic time: ${adminTime} (${getClinicTimezone()})\n` +
    (showPatientRow
      ? `Patient time: ${patientTime} (${b.patientTimezone})\n`
      : "") +
    (b.consultationType ? `Consultation: ${b.consultationType}\n` : "") +
    (b.discomfortArea ? `Pain area:    ${b.discomfortArea}\n` : "") +
    `\nName:  ${b.fullName}\n` +
    `Phone: ${b.phone}\n` +
    `Email: ${b.email}\n` +
    (b.address ? `Address: ${b.address}\n` : "") +
    (b.profileAbout
      ? `\nProfile: ${b.profileAbout}\n` +
        (b.activityLevel ? `Activity: ${b.activityLevel}\n` : "") +
        (b.discomfortArea ? `Discomfort: ${b.discomfortArea}\n` : "") +
        (b.possibleCause ? `Cause: ${b.possibleCause}\n` : "")
      : "") +
    (b.message ? `\nMessage:\n${b.message}\n` : "") +
    `\nRef: ${b.id}\n`;

  return { subject, html, text };
}

/** Confirmation to the customer. Always renders in the patient's own TZ. */
export function customerBookingEmail(b: BookingDto) {
  const firstName = b.fullName.split(/\s+/)[0] ?? b.fullName;
  const subject = `We've received your booking request, ${firstName}`;
  const time = patientDisplay(b);

  const html = shell(
    `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
        Thanks, ${escape(firstName)} — we've got it.
      </h1>
      <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">
        Our team will reach out shortly to confirm your session. Here's a copy
        of the details you submitted for your records.
      </p>

      ${section("Your appointment", bookingDetailsRows(b, time, b.patientTimezone ?? undefined))}
      ${section("We'll contact you at", contactRows(b))}

      <p style="margin:22px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
        If anything looks off, just reply to this email with a correction.
      </p>
    `,
    `Your booking for ${BOOKING_PROGRAM_LABELS[b.program]} has been received.`
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Thanks — we've received your booking request. Our team will be in touch shortly to confirm.\n\n` +
    `Your appointment\n` +
    `  Program:     ${BOOKING_PROGRAM_LABELS[b.program]}\n` +
    (b.service ? `  Service:     ${b.service}\n` : "") +
    `  Preferred:   ${time}${b.patientTimezone ? ` (${b.patientTimezone})` : ""}\n` +
    (b.consultationType ? `  Consultation: ${b.consultationType}\n` : "") +
    (b.discomfortArea ? `  Pain area:    ${b.discomfortArea}\n` : "") +
    `\nWe'll contact you at\n` +
    `  Phone: ${b.phone}\n` +
    `  Email: ${b.email}\n` +
    (b.address ? `  Address: ${b.address}\n` : "") +
    `\nReply to this email if any detail needs correcting.\n` +
    `\n— Postura by Physio\n`;

  return { subject, html, text };
}

function firstNameOf(b: BookingDto): string {
  return b.fullName.split(/\s+/)[0] ?? b.fullName;
}

/**
 * Sent when the admin marks a booking `confirmed`. May include a fresh
 * `preferredDateTime` if the admin also rescheduled in the same save.
 */
export function customerConfirmedEmail(b: BookingDto) {
  const firstName = firstNameOf(b);
  const time = patientDisplay(b);
  const subject = `Appointment confirmed — ${time}`;

  const html = shell(
    `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
        You're confirmed, ${escape(firstName)}.
      </h1>
      <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">
        Your appointment has been confirmed by our team. Please save the details below.
      </p>

      ${section("Confirmed appointment", bookingDetailsRows(b, time, b.patientTimezone ?? undefined))}
      ${section("We'll contact you at", contactRows(b))}

      <p style="margin:22px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
        Need to change anything? Just reply to this email and we'll sort it out.
      </p>
    `,
    `Your ${BOOKING_PROGRAM_LABELS[b.program]} appointment has been confirmed.`
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Your appointment has been confirmed.\n\n` +
    `  Program:     ${BOOKING_PROGRAM_LABELS[b.program]}\n` +
    (b.service ? `  Service:     ${b.service}\n` : "") +
    `  Date & time: ${time}${b.patientTimezone ? ` (${b.patientTimezone})` : ""}\n` +
    (b.consultationType ? `  Consultation: ${b.consultationType}\n` : "") +
    (b.discomfortArea ? `  Pain area:    ${b.discomfortArea}\n` : "") +
    `\nReply to this email if you need to change anything.\n\n— Postura by Physio\n`;

  return { subject, html, text };
}

/**
 * Sent when the admin changes a booking's time (reshuffle after phone call).
 * We re-derive both the previous and the new time in the patient's own
 * timezone so the customer never sees the admin's wall-clock by accident.
 */
export function customerRescheduledEmail(before: BookingDto, after: BookingDto) {
  const firstName = firstNameOf(after);
  const tz = after.patientTimezone ?? before.patientTimezone ?? null;

  const prevTime =
    before.preferredDateTimeUtc && tz
      ? formatInZone(before.preferredDateTimeUtc, tz)
      : before.preferredDateTime;
  const newTime =
    after.preferredDateTimeUtc && tz
      ? formatInZone(after.preferredDateTimeUtc, tz)
      : after.preferredDateTime;
  const tzSuffix = tz ? ` (${tz})` : "";

  const subject = `Appointment rescheduled to ${newTime}`;

  const changeRow = `
    <tr>
      <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">
        Previously
      </td>
      <td style="padding:6px 0;color:#111827;font-size:14px;line-height:1.5;text-decoration:line-through;">
        ${escape(prevTime)}${escape(tzSuffix)}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 16px 6px 0;color:#6b7280;font-size:13px;vertical-align:top;white-space:nowrap;">
        New time
      </td>
      <td style="padding:6px 0;color:${BRAND_PRIMARY};font-size:14px;line-height:1.5;font-weight:600;">
        ${escape(newTime)}${escape(tzSuffix)}
      </td>
    </tr>`;

  const html = shell(
    `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
        Your appointment has been rescheduled.
      </h1>
      <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">
        Hi ${escape(firstName)}, as discussed, we've moved your session to a new slot.
      </p>

      ${section("Schedule change", changeRow)}
      ${section("Appointment", `${row("Program", BOOKING_PROGRAM_LABELS[after.program])}${row("Consultation", after.consultationType)}`)}

      <p style="margin:22px 0 0;color:#6b7280;font-size:13px;line-height:1.6;">
        Reply to this email if the new time doesn't work after all.
      </p>
    `,
    `Your appointment is now ${newTime}.`
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Your appointment has been rescheduled as discussed.\n\n` +
    `  Previously: ${prevTime}${tzSuffix}\n` +
    `  New time:   ${newTime}${tzSuffix}\n` +
    `  Program:    ${BOOKING_PROGRAM_LABELS[after.program]}\n` +
    (after.consultationType ? `  Consultation: ${after.consultationType}\n` : "") +
    `\nReply to this email if the new time doesn't work.\n\n— Postura by Physio\n`;

  return { subject, html, text };
}

/** Sent when the admin marks a booking `cancelled`. */
export function customerCancelledEmail(b: BookingDto) {
  const firstName = firstNameOf(b);
  const time = patientDisplay(b);
  const tzSuffix = b.patientTimezone ? ` (${b.patientTimezone})` : "";
  const subject = `Your appointment has been cancelled`;

  const html = shell(
    `
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827;">
        Your appointment has been cancelled.
      </h1>
      <p style="margin:0 0 6px;color:#374151;font-size:14px;line-height:1.6;">
        Hi ${escape(firstName)}, this is a confirmation that your ${escape(
          BOOKING_PROGRAM_LABELS[b.program]
        )} session for <strong>${escape(time)}${escape(tzSuffix)}</strong> has been cancelled.
      </p>
      <p style="margin:14px 0 0;color:#374151;font-size:14px;line-height:1.6;">
        Would you like to reschedule? Reply to this email with a time that works
        for you and we'll get it booked.
      </p>
    `,
    `Your ${BOOKING_PROGRAM_LABELS[b.program]} appointment has been cancelled.`
  );

  const text =
    `Hi ${firstName},\n\n` +
    `Your ${BOOKING_PROGRAM_LABELS[b.program]} session for ${time}${tzSuffix} has been cancelled.\n\n` +
    `Want to reschedule? Just reply with a time that works and we'll book it in.\n\n— Postura by Physio\n`;

  return { subject, html, text };
}
