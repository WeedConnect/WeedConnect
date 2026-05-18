import { Resend } from "resend";

// El cliente se instancia solo si la API key está disponible — no rompe el servidor si falta
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.RESEND_FROM_EMAIL ?? "WeedConnect <noreply@weedconnect.app>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://weedconnect.app";

// --- Plantillas HTML ---

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#059669;padding:24px 32px;">
              <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">🌿 WeedConnect</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:16px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">
                WeedConnect · Plataforma informativa +18 · Solo para adultos<br/>
                <a href="${APP_URL}/legal/privacidad" style="color:#9ca3af;">Privacidad</a> &middot;
                <a href="${APP_URL}/legal/terminos-uso" style="color:#9ca3af;">Términos</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function btnHtml(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#059669;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">${label}</a>`;
}

// --- Funciones de envío ---

type EmailResult = { ok: true; id: string } | { ok: false; error: string };

async function send(to: string, subject: string, html: string): Promise<EmailResult> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY no configurada — email no enviado:", subject);
    return { ok: false, error: "RESEND_API_KEY no configurada" };
  }
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data!.id };
}

export async function sendWelcomeEmail(to: string, username: string): Promise<EmailResult> {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">¡Bienvenido, ${username}!</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
      Tu cuenta en WeedConnect ya está activa. Puedes explorar el foro, añadir strains favoritos,
      llevar un diario de cultivo y mucho más.
    </p>
    <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
      Recuerda que WeedConnect es una plataforma informativa y de comunidad. Todo el contenido
      es orientativo y está destinado exclusivamente a mayores de 18 años.
    </p>
    ${btnHtml(APP_URL, "Ir a WeedConnect")}
  `;
  return send(to, "Bienvenido a WeedConnect 🌿", baseTemplate("Bienvenido a WeedConnect", body));
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<EmailResult> {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Restablece tu contraseña</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
      Hemos recibido una solicitud para restablecer la contraseña de tu cuenta WeedConnect.
      Pulsa el botón para crear una contraseña nueva.
    </p>
    <p style="margin:0;font-size:13px;color:#6b7280;">
      Este enlace expira en <strong>1 hora</strong>. Si no solicitaste el cambio, puedes ignorar este correo.
    </p>
    ${btnHtml(resetUrl, "Restablecer contraseña")}
    <p style="margin-top:20px;font-size:12px;color:#9ca3af;">
      Si el botón no funciona, copia y pega esta URL en tu navegador:<br/>
      <span style="word-break:break-all;">${resetUrl}</span>
    </p>
  `;
  return send(to, "Restablece tu contraseña · WeedConnect", baseTemplate("Restablecer contraseña", body));
}

export async function sendEmailConfirmation(to: string, confirmUrl: string): Promise<EmailResult> {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Confirma tu correo</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
      Solo falta un paso para activar tu cuenta WeedConnect. Pulsa el botón para confirmar
      tu dirección de correo electrónico.
    </p>
    <p style="margin:0;font-size:13px;color:#6b7280;">
      Este enlace expira en <strong>24 horas</strong>.
    </p>
    ${btnHtml(confirmUrl, "Confirmar correo")}
    <p style="margin-top:20px;font-size:12px;color:#9ca3af;">
      Si no has creado una cuenta en WeedConnect, ignora este mensaje.
    </p>
  `;
  return send(to, "Confirma tu correo · WeedConnect", baseTemplate("Confirma tu correo", body));
}

export async function sendForumReplyNotification(
  to: string,
  username: string,
  threadTitle: string,
  threadUrl: string,
): Promise<EmailResult> {
  const body = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Nueva respuesta en tu hilo</h1>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">
      Hola <strong>${username}</strong>, alguien ha respondido al hilo
      <strong>&laquo;${threadTitle}&raquo;</strong>.
    </p>
    ${btnHtml(threadUrl, "Ver respuesta")}
    <p style="margin-top:20px;font-size:12px;color:#9ca3af;">
      Puedes gestionar tus notificaciones desde la configuración de tu perfil.
    </p>
  `;
  return send(to, `Nueva respuesta en "${threadTitle}" · WeedConnect`, baseTemplate("Nueva respuesta", body));
}
