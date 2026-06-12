import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let email: string
  try {
    const body = await request.json()
    email = String(body.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // 1. Store the email — this is the source of truth.
  const { error } = await supabaseAdmin
    .from('waitlist')
    .insert({ email })

  if (error) {
    // 23505 = unique_violation. Already signed up — treat as success, don't leak details.
    if (error.code === '23505') {
      return NextResponse.json({ ok: true, alreadyJoined: true })
    }
    console.error('[waitlist] supabase insert failed:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  // 2. Fire a confirmation email (best-effort — never fail the signup if this errors).
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.WAITLIST_FROM_EMAIL || 'Saylo <onboarding@resend.dev>',
        to: email,
        subject: "You're on the Saylo waitlist",
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
            <h1 style="font-size:22px">You're in. 🎯</h1>
            <p>Thanks for joining the Saylo waitlist. You'll get first access — we reach out in order of signup.</p>
            <p>The next meeting is coming. This time, you'll know exactly what happened.</p>
            <p style="color:#888;font-size:13px;margin-top:32px">— The Saylo team</p>
          </div>
        `,
      })
    } catch (mailErr) {
      console.error('[waitlist] resend email failed (non-fatal):', mailErr)
    }
  }

  return NextResponse.json({ ok: true })
}
