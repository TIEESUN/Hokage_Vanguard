import React, { useEffect, useRef, useState, useCallback } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import researchersData from "../data/researchers.json"
import "../styles/home.css"

// Page query kept so the template stays compatible with the gatsby-node
// `context: { id }` passed in for index.md. The data isn't used.
export const pageQuery = graphql`
  query HomeQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
    }
  }
`

// Social SVGs — sized inside the existing .hv-card-social-btn (2.4rem circle).
const LinkedInSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
)

const GitHubSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
  </svg>
)

const XSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

/* ═══════════════════════════════════════════════════════════
   HOLOGRAPHIC CARD — data-driven
   ═══════════════════════════════════════════════════════════ */
const HoloCard = ({ data }) => {
  const socials = [
    data.linkedinUrl && { type: "linkedin", url: data.linkedinUrl, Icon: LinkedInSvg, label: "LinkedIn" },
    data.githubUrl   && { type: "github",   url: data.githubUrl,   Icon: GitHubSvg,   label: "GitHub" },
    data.twitterUrl  && { type: "twitter",  url: data.twitterUrl,  Icon: XSvg,        label: "X" },
  ].filter(Boolean)

  const hitRef = useRef(null)
  const cardRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const hit = hitRef.current
    const card = cardRef.current
    if (!hit || !card) return

    let tRx = 0,
      tRy = 0,
      tPx = 50,
      tPy = 50,
      tHyp = 0
    let cRx = 0,
      cRy = 0,
      cPx = 50,
      cPy = 50,
      cHyp = 0,
      cScale = 1
    let hovering = false
    const EASE = 0.09

    const lerp = (a, b, t) => a + (b - a) * t
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

    const tick = () => {
      cRx = lerp(cRx, hovering ? tRx : 0, EASE)
      cRy = lerp(cRy, hovering ? tRy : 0, EASE)
      cPx = lerp(cPx, hovering ? tPx : 50, EASE)
      cPy = lerp(cPy, hovering ? tPy : 50, EASE)
      cHyp = lerp(cHyp, hovering ? tHyp : 0, EASE)
      cScale = lerp(cScale, hovering ? 1.06 : 1.0, EASE)

      card.style.setProperty("--rotate-x", `${cRx}deg`)
      card.style.setProperty("--rotate-y", `${cRy}deg`)
      card.style.setProperty("--pointer-x", `${cPx}%`)
      card.style.setProperty("--pointer-y", `${cPy}%`)
      card.style.setProperty("--background-x", `${cPx}%`)
      card.style.setProperty("--background-y", `${cPy}%`)
      card.style.setProperty(
        "--pointer-from-center",
        `${clamp(cHyp, 0, 1)}`
      )
      card.style.setProperty("--card-scale", `${cScale}`)
      card.style.setProperty("--card-opacity", `${hovering ? 1 : 0}`)
      card.style.setProperty("--hyp", `${clamp(cHyp, 0, 1)}`)

      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const calc = (clientX, clientY) => {
      const rect = hit.getBoundingClientRect()
      const x = clamp((clientX - rect.left) / rect.width, 0, 1)
      const y = clamp((clientY - rect.top) / rect.height, 0, 1)
      tPx = x * 100
      tPy = y * 100
      tRx = (0.5 - y) * 24
      tRy = (x - 0.5) * 24
      tHyp = Math.min(
        1,
        Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2) * Math.SQRT2
      )
    }

    const onMove = e => calc(e.clientX, e.clientY)
    const onEnter = () => {
      hovering = true
    }
    const onLeave = () => {
      hovering = false
    }
    const onTouch = e => {
      calc(e.touches[0].clientX, e.touches[0].clientY)
      hovering = true
    }
    const onTouchEnd = () => {
      hovering = false
    }

    hit.addEventListener("mousemove", onMove)
    hit.addEventListener("mouseenter", onEnter)
    hit.addEventListener("mouseleave", onLeave)
    hit.addEventListener("touchmove", onTouch, { passive: true })
    hit.addEventListener("touchend", onTouchEnd)

    return () => {
      cancelAnimationFrame(rafRef.current)
      hit.removeEventListener("mousemove", onMove)
      hit.removeEventListener("mouseenter", onEnter)
      hit.removeEventListener("mouseleave", onLeave)
      hit.removeEventListener("touchmove", onTouch)
      hit.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  return (
    <div className="hv-card-hit" ref={hitRef}>
      <div className="hv-card" ref={cardRef} data-parallax="true">
        <div className="hv-card-base">
          <img
            src={data.photo}
            alt={data.name}
            onError={e => {
              e.target.onerror = null
              e.target.style.opacity = "0"
            }}
          />
        </div>
        <div className="hv-card-foil" />
        <div className="hv-card-shine" />
        <div className="hv-card-glare" />
        <div className="hv-card-shine-edge" />
        <div className="hv-card-content">
          <p className="hv-card-name">{data.name}</p>
          <p className="hv-card-title">{data.title}</p>
          <div className="hv-card-divider" />
          <p className="hv-card-bio">{data.bio}</p>
          {socials.length > 0 && (
            <div className="hv-card-socials">
              {socials.map(s => (
                <a
                  key={s.type}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hv-card-social-btn"
                  aria-label={s.label}
                  title={s.label}
                >
                  <s.Icon />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   CARD MODAL — two cards side by side
   ═══════════════════════════════════════════════════════════ */
const CardModal = ({ onClose }) => {
  useEffect(() => {
    const orig = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = e => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = orig
      window.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  return (
    <div
      className="hv-modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="hv-modal-inner">
        <button
          className="hv-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="hv-modal-card-row">
          <div className="hv-modal-card">
            <HoloCard data={researchersData["muhammad-sawood"]} />
          </div>
          <div className="hv-modal-card">
            <HoloCard data={researchersData["sarah-jawaid"]} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════ */
const IndexPage = () => {
  const [cardOpen, setCardOpen] = useState(false)
  const openCard = useCallback(() => setCardOpen(true), [])
  const closeCard = useCallback(() => setCardOpen(false), [])

  return (
    <Layout>
      <Seo title="Hokage Vanguard — Threat Intelligence & Security Research" />

      <section className="hv-home-hero">
        <div className="hv-hero-right">
          <div className="hv-glass-panel liquid-glass-strong">
            <div className="hv-panel-inner">
              <p className="hv-panel-label">About This Platform</p>
              <h2 className="hv-panel-heading">
                Hokage
                <br />
                <em className="hv-panel-heading-em">Vanguard</em>
              </h2>
              <div className="hv-panel-body">
                <p>
                  <strong>Hokage Vanguard</strong> is your ultimate zone for
                  everything related to cyber threats. Inspired by the profound
                  lessons from Naruto, Hokage Vanguard embodies the spirit of
                  vigilance and protection. Here, you’ll find in-depth insights
                  into APT groups, their TTPs, security research, threat
                  intelligence, adversary infrastructure hunting tactics, and
                  cutting-edge security findings.
                </p>
                <p>
                  Our mission is clear: to shield the world and its people from
                  malicious cyber espionage actors. We firmly believe that the
                  rise of cyber threats demands preparation, innovation, and
                  collective defense.
                </p>
              </div>
              <button
                className="hv-about-btn liquid-glass"
                onClick={openCard}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                Meet the Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {cardOpen && <CardModal onClose={closeCard} />}
    </Layout>
  )
}

export default IndexPage
