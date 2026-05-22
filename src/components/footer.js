import React from "react"

const Footer = () => (
  <footer className="site-footer">
    <em>"Guarding against the Unknown, Just Like a Hokage"</em>
    <p
      style={{
        marginTop: "0.5rem",
        fontSize: "0.8rem",
        opacity: 0.45,
        fontStyle: "normal",
      }}
    >
      © {new Date().getFullYear()} Hokage Vanguard — All rights reserved.
    </p>
  </footer>
)

export default Footer
