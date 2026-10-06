/**
 * POST /api/inquiry: the one server endpoint, used by the "Book a Visit" form.
 *
 * - Sends the inquiry by email through Resend when RESEND_API_KEY and INQUIRY_TO_EMAIL are set.
 * - Demo mode: when either env var is missing, it validates and returns success without sending,
 *   so the form works in previews.
 * - Works with and without JavaScript: JSON for fetch requests, a redirect for plain form posts.
 */
import type { APIRoute } from 'astro';
import { INQUIRY_FROM_EMAIL, INQUIRY_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { labelFor, parseInquiry, type Inquiry } from '../../lib/inquiry';
import { site } from '../../config/site';

export const prerender = false;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function emailBody(d: Inquiry) {
  const rows: [string, string][] = [
    ['Name', d.name],
    ['Mobile', d.mobile],
    ['Email', d.email || '—'],
    ['Interested in', labelFor.interest(d.interest) + (d.className ? ` (${d.className})` : '')],
    ['Rate', labelFor.rate(d.rate)],
    ['Preferred day', d.day || 'Any day'],
    ['Preferred time', d.time ? labelFor.time(d.time) : 'Any time'],
    ['New to the gym', d.isNew ? 'Yes' : 'No'],
    ['Found us via', d.source || '—'],
    ['Notes', d.notes || '—'],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#111311">
  <h2 style="margin:0 0 12px">New visit request from the website</h2>
  <table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#5a6159;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('')}</table>
  <p style="margin-top:16px"><a href="tel:+63${d.mobile.slice(1)}">Call ${esc(d.mobile)}</a></p>
</div>`;
  return { text, html };
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const respond = (status: number, body: Record<string, unknown>) =>
    wantsJson
      ? new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
      : status < 400
        ? redirect('/book-a-visit/thanks/', 303)
        : redirect('/book-a-visit/?error=1', 303);

  let raw: Record<string, unknown> = {};
  try {
    const type = request.headers.get('content-type') || '';
    if (type.includes('application/json')) raw = await request.json();
    else raw = Object.fromEntries((await request.formData()).entries());
  } catch {
    return respond(400, { ok: false, error: 'Invalid request' });
  }

  // Spam checks: honeypot filled, or submitted faster than a person could type. Pretend it worked.
  // TODO-confirm: add rate limiting (e.g. Vercel Firewall rule) if spam becomes a problem after launch.
  const elapsed = Number(raw.elapsed);
  if ((typeof raw.company === 'string' && raw.company.trim() !== '') || (raw.elapsed !== undefined && elapsed < 2500)) {
    return respond(200, { ok: true });
  }

  const { data, errors } = parseInquiry(raw);
  if (Object.keys(errors).length) return respond(422, { ok: false, errors });

  if (!RESEND_API_KEY || !INQUIRY_TO_EMAIL) {
    console.info('[inquiry] Demo mode: RESEND_API_KEY or INQUIRY_TO_EMAIL not set. Inquiry not sent.');
    return respond(200, { ok: true, demo: true });
  }

  const { text, html } = emailBody(data);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: INQUIRY_FROM_EMAIL || `${site.shortName} Website <onboarding@resend.dev>`,
        to: INQUIRY_TO_EMAIL.split(',').map((s) => s.trim()),
        reply_to: data.email || undefined,
        subject: `Visit request: ${data.name} (${labelFor.interest(data.interest)})`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error('[inquiry] Resend error', res.status, await res.text());
      return respond(502, { ok: false, error: 'Could not send right now' });
    }
  } catch (e) {
    console.error('[inquiry] Network error', e);
    return respond(502, { ok: false, error: 'Could not send right now' });
  }

  return respond(200, { ok: true });
};

export const ALL: APIRoute = () => new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
