'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<'idle' | 'error' | 'success' | 'loading'>('idle')
  const [errorMsg, setErrorMsg] = useState('Please enter a valid email address.')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const scoreFillsRef = useRef<HTMLDivElement>(null)
  const scoreFillsAnimated = useRef(false)

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Score bar animation
  useEffect(() => {
    if (!scoreFillsRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !scoreFillsAnimated.current) {
            scoreFillsAnimated.current = true
            e.target.querySelectorAll<HTMLElement>('[data-width]').forEach((el) => {
              el.style.width = el.dataset.width + '%'
            })
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(scoreFillsRef.current)
    return () => observer.disconnect()
  }, [])

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      setFormState('error')
      return
    }
    setFormState('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setFormState('error')
        return
      }
      setEmail('')
      setFormState('success')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setFormState('error')
    }
  }

  const faqs = [
    {
      q: 'Is this recording my meetings and storing them?',
      a: 'Yes — your audio and video are stored securely on our servers. This is necessary for the report to work and for you to replay sessions when you want to analyze them. You can delete your data at any time and it will be permanently removed from our servers.',
    },
    {
      q: 'Will this create any compliance issues for my meetings?',
      a: 'Saylo only records and analyzes your own audio and video feed. It does not capture, analyze, or store anything from other participants in the meeting. There is no compliance concern on that front — only your side of the conversation is processed.',
    },
    {
      q: 'Do other meeting participants know it\'s running?',
      a: 'No. Saylo analyzes your side of the meeting only — your camera feed and your microphone. It has no access to other participants and does not require their consent or awareness.',
    },
    {
      q: 'Which platforms does it work on?',
      a: 'Google Meet, Zoom, and Microsoft Teams at launch — covering the vast majority of professional calls. Additional platforms will be added based on early access user demand.',
    },
    {
      q: 'I\'m already a strong communicator. Is this still useful?',
      a: 'Almost always yes. The people who benefit most are not beginners — they are high performers who have removed the obvious problems and want to understand the subtle ones. The gap between good and exceptional rarely shows up in a mirror. It shows up in how the room responds to you.',
    },
    {
      q: 'When does it launch and what does early access include?',
      a: 'We are in closed beta now. Waitlist members get first access and will be reached out to in order of signup. No pricing commitments, no strings attached.',
    },
  ]

  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="logo">Saylo<span>.</span></a>
        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#report">The report</a>
          <a href="#waitlist" className="nav-cta">Own the Room</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="eyebrow hero-animate delay-1">
            <span className="eyebrow-line" />
            AI Meeting Intelligence
          </div>
          <h1 className="hero-animate delay-2">
            You&apos;re still talking.
            <span className="line2">They&apos;re already done listening.</span>
          </h1>
          <p className="hero-sub hero-animate delay-3">
            Saylo joins your meetings silently, analyzes your voice, expressions, and presence in real time — and delivers the honest report your colleagues will never give you.
          </p>
          <p className="hero-sub-kicker hero-animate delay-3">After every single call.</p>
          <a href="#waitlist" className="btn-primary hero-animate delay-4">
            Own the Room
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p className="hero-footnote hero-animate delay-5">Free beta access · No credit card required</p>
        </div>

        <div className="hero-right" ref={scoreFillsRef}>
          <div className="report-card">
            <div className="report-header">
              <span>Post-meeting report</span>
              <strong>Board sync · 47 min</strong>
            </div>
            <div className="report-body">
              {[
                { label: 'Confidence', cls: 'green', val: 78 },
                { label: 'Leadership presence', cls: 'amber', val: 61 },
                { label: 'Emotional variance', cls: '', val: 44 },
                { label: 'Filler word rate', cls: 'amber', val: 55 },
                { label: 'Volume variation', cls: 'green', val: 82 },
              ].map((item) => (
                <div key={item.label} className="report-score-row">
                  <span className="score-label">{item.label}</span>
                  <div className="score-bar-wrap">
                    <div className="score-bar">
                      <div className={`score-fill ${item.cls}`} data-width={item.val} style={{ width: 0 }} />
                    </div>
                    <span className="score-val">{item.val}</span>
                  </div>
                </div>
              ))}
              <div className="ai-insight">
                <strong>AI Coach</strong>&nbsp; At the 31-minute mark, when challenged on Q3 projections, your speaking pace increased by 34%. You used hedging language 6 times. These words rob you of the authority you&apos;ve already earned.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROOF STRIP */}
      <div className="proof-strip">
        {[
          { num: '400+', label: 'professionals already waiting to level up' },
          { num: 'Voice', label: 'tone, pace, volume, filler words — all scored' },
          { num: 'Face', label: 'expressions, eye contact, energy — all tracked' },
          { num: 'Zero', label: 'setup. Silent from your very first meeting.' },
        ].map((item) => (
          <div key={item.num} className="proof-item">
            <div className="proof-num">{item.num}</div>
            <div className="proof-label">{item.label}</div>
          </div>
        ))}
      </div>

      {/* PROBLEM */}
      <section className="section problem-section">
        <div className="section-label">The problem</div>
        <h2>The highest performers<br />in any room still have <em>blind spots.</em></h2>

        <div className="problem-intro fade-up">
          <p>You have built expertise, credibility, and instinct over years. You know how to read a room. But there are moments — a pitch that went cold, a review that didn&apos;t move your career, a client who ghosted after one call — where you couldn&apos;t tell why.</p>
          <p>Not because you weren&apos;t good enough. Because <strong>no one was watching closely enough to tell you what happened.</strong></p>
          <p>Your colleagues won&apos;t say it. Your manager won&apos;t write it in a review. Your calendar data doesn&apos;t measure how you showed up — only that you did. Saylo is the honest observer you never had. It watches what everyone else notices but never says.</p>
        </div>

        <div className="scenarios-heading fade-up">Real moments where this changes everything</div>

        <div className="scenarios-grid fade-up">
          {[
            { n: '01', h: 'The client who ghosted after one call', p: 'The proposal was strong. The pricing was fair. You ended the call feeling good. Then — nothing. No reply. No explanation. Just silence. <em>You\'ll never know what they decided in those first three minutes.</em>' },
            { n: '02', h: 'The team that sees you as a taskmaster — not a leader', p: 'Every leader fears it. The team executes your instructions. But they don\'t rally behind you. They don\'t repeat what you say in other rooms. <em>They follow you. They don\'t believe in you.</em>' },
            { n: '03', h: 'The funding call where nobody got excited', p: 'You covered every slide. Every number was solid. But the energy in the room never lifted. Nobody leaned in. <em>Your tonality told them how to feel — and it said "cautious."</em>' },
            { n: '04', h: 'The leadership review you thought went well', p: 'You answered every question confidently. Three days later, someone else got the promotion. The feedback was two words: <em>"executive presence."</em> You still don\'t know what that means in practice.' },
            { n: '05', h: 'The networking room where you were just another face', p: 'You met twenty people. Three remembered your name. The rest filed you under: <em>"Oh, just another founder / CTO / agency owner."</em> You left without the conversation that would have mattered.' },
            { n: '06', h: 'The meeting where three people heard three different things', p: 'You were clear in your head. You said it clearly — or so you thought. By the end, your team had three different takeaways. <em>The message was never the problem. The delivery was.</em>' },
          ].map((s) => (
            <div key={s.n} className="scenario-card">
              <div className="scenario-num">{s.n}</div>
              <h4>{s.h}</h4>
              <p dangerouslySetInnerHTML={{ __html: s.p }} />
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section steps-section" id="how-it-works">
        <div className="section-label">How it works</div>
        <h2>Silent. Automatic.<br /><span style={{ color: 'var(--accent)', fontWeight: 900 }}>Brutally honest.</span></h2>

        <div className="steps-container">
          {/* Step 1 */}
          <div className="step-row fade-up">
            <div className="step-copy">
              <div className="step-tag">Step 01</div>
              <h3>Install once.<br /><em>It&apos;s just there.</em></h3>
              <p>Add the browser extension. Saylo connects to Google Meet, Zoom, and Microsoft Teams. No meeting bots to invite. No integrations to configure. No settings to touch.</p>
              <p>From your very first meeting, it&apos;s already running — silent in the background, watching everything, saying nothing.</p>
            </div>
            <div className="step-visual">
              <div className="meet-illustration">
                <div className="meet-topbar">
                  <span className="meet-dot" style={{ background: '#ff5f57' }} />
                  <span className="meet-dot" style={{ background: '#febc2e' }} />
                  <span className="meet-dot" style={{ background: '#28c840' }} />
                  <div className="meet-url">meet.google.com/abc-defg-hij</div>
                </div>
                <div className="meet-grid">
                  <div className="meet-tile meet-tile-1">
                    <div className="meet-avatar">AJ</div>
                    <div className="meet-name">Alex J. (You)</div>
                    <div className="product-badge"><span className="recording-dot" />Saylo</div>
                  </div>
                  <div className="meet-tile meet-tile-2"><div className="meet-avatar">SR</div><div className="meet-name">Sarah R.</div></div>
                  <div className="meet-tile meet-tile-3"><div className="meet-avatar">MK</div><div className="meet-name">Marcus K.</div></div>
                  <div className="meet-tile meet-tile-4"><div className="meet-avatar">LP</div><div className="meet-name">Lisa P.</div></div>
                </div>
                <div className="meet-controls">
                  <div className="ctrl-btn active">🎙️</div>
                  <div className="ctrl-btn active">📷</div>
                  <div className="ctrl-btn active">💬</div>
                  <div className="ctrl-btn red">✕</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="step-row reverse fade-up">
            <div className="step-copy">
              <div className="step-tag">Step 02</div>
              <h3>Run your meeting<br /><em>as normal.</em></h3>
              <p>Don&apos;t change anything. Saylo monitors your voice, facial expressions, eye contact, volume variation, emotional tone, and language patterns throughout the entire call.</p>
              <p>All without interrupting you.</p>
            </div>
            <div className="step-visual">
              <div className="coach-illustration">
                <div className="ai-brain">
                  <div className="brain-icon">
                    🧠
                    <div className="brain-pulse" />
                  </div>
                  <div className="brain-info">
                    <h5>Saylo AI Coach</h5>
                    <span>Analyzing live session · 23:41</span>
                  </div>
                </div>
                {[
                  { label: 'Voice confidence & filler words', cls: 'td-done', fillCls: 'tf-green', active: true },
                  { label: 'Facial engagement & eye contact', cls: 'td-done', fillCls: 'tf-green', active: true },
                  { label: 'Emotional tone & volume variation', cls: 'td-active', fillCls: 'tf-accent', active: true },
                  { label: 'Ownership vs. hedging language', cls: 'td-pending', fillCls: '', active: false },
                  { label: 'Leadership signal scoring', cls: 'td-pending', fillCls: '', active: false },
                ].map((t) => (
                  <div key={t.label} className={`thinking-line${t.active ? ' active' : ''}`}>
                    <div className={`thinking-dot ${t.cls}`} />
                    <span>{t.label}</span>
                    <div className="thinking-bar">
                      {t.fillCls && <div className={`thinking-fill ${t.fillCls}`} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="step-row fade-up">
            <div className="step-copy">
              <div className="step-tag">Step 03</div>
              <h3>The meeting ended.<br /><em>The truth just arrived.</em></h3>
              <p>Your full communication scorecard is ready. Timestamped. Specific. Every weak moment flagged, every strong moment confirmed. With an AI coach note for every insight.</p>
              <p>The feedback your colleagues noticed but never said out loud — written down, with timestamps.</p>
            </div>
            <div className="step-visual">
              <div className="report-ui">
                <div className="rui-topbar">
                  <span>Session report · Q3 board sync</span>
                  <span style={{ color: 'rgba(247,244,239,0.5)', fontSize: '0.72rem' }}>47 min · Today</span>
                </div>
                <div className="rui-body">
                  <div className="rui-score-hero">
                    <div className="rui-big-score"><div className="score-title">Overall</div><div className="score-number warn">71</div></div>
                    <div className="rui-big-score"><div className="score-title">Confidence</div><div className="score-number good">78</div></div>
                    <div className="rui-big-score"><div className="score-title">Presence</div><div className="score-number flag">58</div></div>
                  </div>
                  {[
                    { name: 'Filler words', val: '14 instances', cls: 'a' },
                    { name: 'Volume variation', val: 'Strong', cls: 'g' },
                    { name: 'Hedging language', val: '7 instances', cls: 'r' },
                    { name: 'Eye contact', val: 'Inconsistent', cls: 'a' },
                    { name: 'Emotional expressiveness', val: 'Below baseline', cls: 'r' },
                  ].map((m) => (
                    <div key={m.name} className="rui-metric-row">
                      <span className="rui-metric-name">{m.name}</span>
                      <span className={`rui-metric-val ${m.cls}`}>{m.val}</span>
                    </div>
                  ))}
                  <div className="rui-flag">
                    <strong>⚠ AI Coach · 31:14</strong>
                    When challenged on Q3 projections, your pace increased and you used &quot;I think,&quot; &quot;maybe,&quot; &quot;probably&quot; within 40 seconds. These words rob you of the authority you&apos;ve already earned.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT BREAKDOWN */}
      <section className="section report-section" id="report">
        <div className="section-label">The report</div>
        <h2>Not a summary.<br />A <em>forensic breakdown</em> of your meeting.</h2>

        <div className="metrics-grid fade-up">
          {[
            { icon: '🎙️', title: 'Speaking Analysis', desc: 'Every dimension of how you sound — tracked, scored, flagged.', bullets: ['Filler word rate & patterns', 'Speaking pace & words per minute', 'Volume & volume variation', 'Pause usage & emphasis points', 'Clarity score', 'Emotional variance in voice'] },
            { icon: '👁️', title: 'Behavioral Intelligence', desc: 'What your face and body communicate when your words say something else.', bullets: ['Eye contact consistency', 'Facial engagement level', 'Emotional expressiveness', 'Energy across the meeting duration', 'Attentiveness signals'] },
            { icon: '⚡', title: 'Leadership Signals', desc: 'The difference between someone who speaks and someone who commands.', bullets: ['Ownership vs. hedging language ratio', 'Confidence under pressure score', 'Decisive vs. weak phrasing', 'Tonality and authority markers'] },
            { icon: '⏱️', title: 'Moment-by-Moment Timeline', desc: 'Timestamped flags for where your delivery strengthened — and where it broke down.', bullets: ['Peak performance moments', 'Flagged breakdown points', 'Exact timestamp for every insight'] },
            { icon: '📈', title: 'Meeting-over-Meeting Progress', desc: 'Track whether you are taking more command of every room over time.', bullets: ['All scores tracked across sessions', 'Trend lines per metric', 'Improvement highlights each week'] },
            { icon: '🤖', title: 'AI Coach Response', desc: 'Every insight paired with a specific, actionable coaching note.', bullets: ['One coaching note per flagged moment', 'Specific language to use instead', 'Priority fix for your next meeting'] },
          ].map((m) => (
            <div key={m.title} className="metric-card">
              <span className="metric-icon">{m.icon}</span>
              <h4>{m.title}</h4>
              <p>{m.desc}</p>
              <ul className="metric-bullets">
                {m.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="insights-list fade-up">
          {[
            { tag: 'flag', label: 'Flag · 31:14', text: 'During the pricing discussion, your speaking pace increased by <strong>34%</strong> and your tonality flattened. The room registered uncertainty — not preparation. <em>Slow down before the numbers. Own them.</em>' },
            { tag: 'warn', label: 'Watch · 18:00+', text: 'You maintained strong presence for the first 18 minutes. After that, your facial expressiveness dropped and your energy followed. <em>In group settings, a flat face reads as disengagement.</em>' },
            { tag: 'good', label: 'Strong · 09:20', text: 'When presenting the roadmap, your pause-to-emphasis ratio was excellent. Your volume variation was at its peak. <strong>This was your strongest two minutes in this meeting.</strong> Replicate it.' },
            { tag: 'flag', label: 'Flag · 38:50', text: 'When challenged, you used <strong>"I think," "maybe," "probably"</strong> seven times in 40 seconds. <em>These words rob you of the authority you\'ve already earned.</em> Replace them with declarative statements.' },
          ].map((ins) => (
            <div key={ins.label} className="insight-item">
              <span className={`insight-tag ${ins.tag}`}>{ins.label}</span>
              <p className="insight-text" dangerouslySetInnerHTML={{ __html: ins.text }} />
            </div>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="section">
        <div className="section-label">Who it&apos;s built for</div>
        <h2>Built for people whose<br />meetings <em>move things.</em></h2>
        <div className="roles-grid fade-up">
          {[
            { icon: '🏗️', title: 'Founders', desc: "Every investor call, board meeting, and all-hands is a performance. Know exactly how yours land — before the silence tells you they didn't." },
            { icon: '📣', title: 'Sales Leaders', desc: "The close happens in the conversation, not the deck. Track exactly where you hold the room — and where you quietly lose it." },
            { icon: '⚙️', title: 'Engineering Managers', desc: "Technical credibility only takes you so far. Your leadership presence in meetings is what determines where you go next." },
            { icon: '🗺️', title: 'Product Leaders', desc: "You're selling a vision in every roadmap review and stakeholder sync. Now you'll know if it's actually landing." },
            { icon: '🤝', title: 'Consultants', desc: "Client trust is built call by call. Saylo shows you what you're building — and what you're quietly eroding." },
            { icon: '📊', title: 'Executives', desc: "At your level, presence is the product. See yourself with the same clarity your board and direct reports already do." },
            { icon: '💼', title: 'Client-Facing Professionals', desc: "Every external call is a first impression that compounds. Make sure yours compound in the right direction." },
            { icon: '🚀', title: 'High Performers', desc: "Your work is a 9/10. Your communication is a 4/10. The room still sees a 5. Fix the number that multiplies everything else." },
          ].map((r) => (
            <div key={r.title} className="role-card">
              <span className="role-icon">{r.icon}</span>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="section-label">Questions</div>
        <h2>Before you decide.</h2>
        <div className="faq-wrap fade-up">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.q}
                <span className="faq-q-icon">{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && <div className="faq-a">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section className="waitlist-section" id="waitlist">
        <div className="live-badge"><span className="live-dot" /> Waitlist open</div>
        <h2>The next meeting is coming.<br /><em>This time, you&apos;ll know exactly what happened.</em></h2>
        <p className="ws-sub">Join the waitlist. Get first access and the report that changes how you see yourself in every room.</p>
        <div className="waitlist-form fade-up">
          <input
            type="email"
            placeholder="alex@company.com"
            value={email}
            disabled={formState === 'loading'}
            onChange={(e) => { setEmail(e.target.value); setFormState('idle') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button onClick={handleSubmit} disabled={formState === 'loading'}>
            {formState === 'loading' ? 'Joining…' : 'Own the Room'}
          </button>
        </div>
        <p className={`waitlist-note${formState === 'success' ? ' success' : ''}`} style={formState === 'error' ? { color: 'var(--accent)' } : {}}>
          {formState === 'success' ? '✓ You\'re on the list. We\'ll be in touch.' : formState === 'error' ? errorMsg : 'Free beta access · No credit card · First in, first served'}
        </p>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="#" className="footer-logo">Saylo<span>.</span></a>
        <p>© 2026 Saylo. All rights reserved.</p>
      </footer>
    </>
  )
}
