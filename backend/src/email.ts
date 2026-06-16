import { Resend } from 'resend';
import { QuoteRequest } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendQuoteEmail(data: QuoteRequest): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const fromEmail = process.env.FROM_EMAIL ?? 'quotes@yourdomain.com';

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 16px;color:#8b8b94;font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;width:140px;border-bottom:1px solid #1e1e24;">${label}</td>
      <td style="padding:10px 16px;color:#f3f3f5;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;border-bottom:1px solid #1e1e24;">${value}</td>
    </tr>`;

  const section = (title: string, rows: string) => `
    <div style="margin-bottom:24px;">
      <div style="background:linear-gradient(90deg,#ff7a18,#ffc247);height:3px;border-radius:2px;margin-bottom:0;"></div>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#16161a;border:1px solid #1e1e24;border-top:none;border-radius:0 0 10px 10px;">
        <thead>
          <tr><td colspan="2" style="padding:14px 16px 10px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;color:#ff7a18;">${title}</td></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;

  const vehicleRows = [
    row('Vehicle', `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel}`),
    data.vehicleType     ? row('Type', data.vehicleType) : '',
    data.vehicleCondition ? row('Condition', data.vehicleCondition) : '',
    data.vehicleMileage != null && data.vehicleMileage !== 0
      ? row('Mileage', `${Number(data.vehicleMileage).toLocaleString()} miles`) : '',
    data.vin             ? row('VIN', data.vin) : '',
  ].join('');

  const shippingRows = [
    row('Pickup', data.pickupLocation),
    row('Drop-off', data.dropOffLocation),
    row('Ship Date', data.shipDate),
    data.flexibility ? row('Flexibility', data.flexibility) : '',
    row('Trailer', `${data.trailerType} carrier`),
  ].join('');

  const contactRows = [
    row('Name', `${data.firstName} ${data.lastName}`),
    row('Email', `<a href="mailto:${data.email}" style="color:#ffa02e;text-decoration:none;">${data.email}</a>`),
    row('Phone', data.phone),
    data.contactPref ? row('Prefers', data.contactPref) : '',
  ].join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Quote Request</title></head>
<body style="margin:0;padding:0;background:#0a0a0b;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

      <!-- Header / Logo -->
      <tr><td style="background:linear-gradient(180deg,#1c1c21 0%,#16161a 100%);border:1px solid #1e1e24;border-radius:16px 16px 0 0;padding:36px 32px 28px;text-align:center;">
        <div style="display:inline-block;background:linear-gradient(180deg,#ff7a18,#cc5500);border-radius:50%;width:60px;height:60px;line-height:60px;font-size:28px;margin-bottom:16px;">🚛</div>
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.42em;text-transform:uppercase;color:#ffa02e;margin-bottom:8px;">Horizon Highway Haulers</div>
        <h1 style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:26px;font-weight:800;color:#f3f3f5;margin:0 0 6px;">New Quote Request</h1>
        <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#8b8b94;margin:0;">Submitted via the website quote form</p>
      </td></tr>

      <!-- Orange accent line -->
      <tr><td style="background:linear-gradient(90deg,#ff7a18,#ffc247);height:3px;"></td></tr>

      <!-- Body -->
      <tr><td style="background:#0f0f12;border:1px solid #1e1e24;border-top:none;border-radius:0 0 16px 16px;padding:28px 24px;">

        ${section('🚗  Vehicle', vehicleRows)}
        ${section('📍  Shipping', shippingRows)}
        ${section('👤  Contact', contactRows)}

        <!-- CTA -->
        <div style="text-align:center;margin-top:28px;">
          <a href="mailto:${data.email}"
             style="display:inline-block;background:linear-gradient(180deg,#ffa02e,#ff7a18);color:#1a0d00;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;text-decoration:none;padding:14px 36px;border-radius:10px;box-shadow:0 8px 24px rgba(255,122,24,0.35);">
            Reply to ${data.firstName}
          </a>
        </div>

        <!-- Footer -->
        <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1e1e24;text-align:center;">
          <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#55555e;margin:0 0 4px;">Horizon Highway Haulers · Licensed &amp; Insured · USDOT #——</p>
          <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#55555e;margin:0;">This is an internal notification. Do not forward.</p>
        </div>

      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  await resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    reply_to: data.email,
    subject: `🚛 New Quote — ${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel} · ${data.firstName} ${data.lastName}`,
    html,
  });
}
