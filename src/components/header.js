import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Header = () => {
  const [open, setOpen] = useState(false)

  const data = useStaticQuery(graphql`
    query HeaderTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const siteTitle = data?.site?.siteMetadata?.title || "Hokage Vanguard"

  const close = () => setOpen(false)

  return (
    <header className="nav-bar">
      <Link to="/" className="nav-logo" onClick={close}>
        {siteTitle}
      </Link>

      <nav>
        <ul className={`nav-links${open ? " open" : ""}`}>
          <li>
            <Link to="/" activeClassName="active" onClick={close}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/blog" activeClassName="active" partiallyActive onClick={close}>
              Blog
            </Link>
          </li>
          <li>
            <Link to="/publication" activeClassName="active" partiallyActive onClick={close}>
              Publication
            </Link>
          </li>
        </ul>
      </nav>

      <button
        className="nav-hamburger"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  )
}

export default Header
