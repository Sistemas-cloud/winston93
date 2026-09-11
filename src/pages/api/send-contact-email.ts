// 2026-09-11: Anti-spam — honeypot, tiempo mínimo, URLs y patrones comerciales.
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const SPAM_PATTERNS = [
  /https?:\/\//i,
  /www\./i,
  /freeb2bdata/i,
  /download your data/i,
  /million compan/i,
  /b2b data/i,
  /shutting down/i,
  /seo\s*(services|package|ranking)/i,
  /cryptocurrenc/i,
  /viagra|cialis/i,
  /casino|betting/i,
]

function isSpam(body: Record<string, unknown>): boolean {
  const honeypot = String(body.companyWebsite ?? body.company_website ?? '').trim()
  if (honeypot.length > 0) return true

  const startedAt = Number(body.formStartedAt ?? body.form_started_at ?? 0)
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 3000) return true

  const phone = String(body.phone ?? '').replace(/\D/g, '')
  if (phone.length < 8) return true

  const blob = [
    body.parentName,
    body.studentName,
    body.email,
    body.message,
  ]
    .map((v) => String(v ?? ''))
    .join('\n')

  if (SPAM_PATTERNS.some((re) => re.test(blob))) return true
  if (String(body.message ?? '').length > 1200) return true

  return false
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  }

  const { parentName, studentName, email, message, phone } = req.body || {}

  if (!parentName || !studentName || !email || !phone) {
    return res.status(400).json({ ok: false, message: 'Campos requeridos faltantes' })
  }

  // Respuesta silenciosa a bots (no incentivar reintentos)
  if (isSpam(req.body || {})) {
    console.warn('[contacto] spam bloqueado', { email, parentName })
    return res.status(200).json({ ok: true })
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const toEmail = process.env.CONTACT_TO || process.env.SMTP_USER || ''

    await transporter.sendMail({
      from: `Winston Contacto <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Nuevo contacto desde el sitio web',
      replyTo: email,
      html: `
        <h2>Nuevo contacto</h2>
        <p><strong>Padre/Tutor:</strong> ${parentName}</p>
        <p><strong>Aspirante:</strong> ${studentName}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${(message || '').replace(/\n/g, '<br/>')}</p>
      `,
    })

    return res.status(200).json({ ok: true })
  } catch (error: unknown) {
    console.error('Email error:', error)
    return res.status(500).json({ ok: false, message: 'No se pudo enviar el correo' })
  }
}
