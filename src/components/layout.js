/** @jsx jsx */
/** @jsxFrag React.Fragment */
import React from "react"
import { jsx } from "theme-ui"

import "../assets/scss/style.scss"

import Header from "./header"
import Footer from "./footer"

const Layout = ({ children, className }) => {
  return (
    <>
      <img
        src="/bg-image.jpg"
        alt=""
        className="site-bg-video"
        aria-hidden="true"
      />

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
