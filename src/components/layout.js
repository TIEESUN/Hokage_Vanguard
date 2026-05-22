/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React from "react"
import { jsx } from "theme-ui"

import "../assets/scss/style.scss"

import Header from "./header"
import Footer from "./footer"

const Layout = ({ children, className }) => {
  const videoRef = React.useRef(null)

  React.useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      // Jump back 0.3s before the end — never let it reach the last frame,
      // so the `ended` event never fires and there's no playback pause.
      if (video.duration && video.currentTime >= video.duration - 0.3) {
        video.currentTime = 0.1
      }
    }

    const handleEnded = () => {
      // Fallback if timeupdate's resolution misses the cutoff.
      video.currentTime = 0.1
      video.play()
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        className="site-bg-video"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      <div className="site-bg-overlay" aria-hidden="true" />

      <div className="site-content">
        <Header />
        <main className={className || ""}>{children}</main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
