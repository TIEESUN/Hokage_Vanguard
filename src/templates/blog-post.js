import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import Seo from "../components/seo"
import researchersData from "../data/researchers.json"

// Build a lookup: lowercased name -> full researcher record.
// Lets us match the legacy frontmatter shape `{ name, profileUrl }`
// against the centralized JSON without changing any markdown.
const RESEARCHERS_BY_NAME = Object.values(researchersData).reduce((acc, r) => {
  if (r?.name) acc[r.name.toLowerCase()] = r
  return acc
}, {})

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
)

const ResearcherCard = ({ data }) => (
  <div className="hv-researcher-card">
    <div className="hv-researcher-photo">
      <img src={data.photo} alt={data.name} />
    </div>
    <div className="hv-researcher-name-row">
      <span className="hv-researcher-name">{data.name}</span>
      {data.linkedinUrl && (
        <a
          href={data.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hv-researcher-linkedin"
          aria-label={`${data.name} on LinkedIn`}
        >
          <LinkedInIcon />
        </a>
      )}
    </div>
    <div className="hv-researcher-title">{data.title}</div>
  </div>
)

const LegacyResearcherPill = ({ researcher }) => (
  <span className="hv-researcher-legacy">
    {researcher.profileUrl ? (
      <a
        href={researcher.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {researcher.name}
      </a>
    ) : (
      <span>{researcher.name}</span>
    )}
  </span>
)

const Researchers = ({ researchers }) => {
  if (!researchers || researchers.length === 0) return null

  // Each entry may be either:
  //   { id: "muhammad-sawood" }
  //   { name: "Muhammad Sawood", profileUrl: "..." }  (legacy)
  // We resolve to a researchersData record if possible, otherwise fall back
  // to the legacy plain-link treatment so old posts keep rendering.
  const resolved = researchers.map(r => {
    if (r?.id && researchersData[r.id]) {
      return { kind: "full", data: researchersData[r.id] }
    }
    if (r?.name) {
      const match = RESEARCHERS_BY_NAME[r.name.toLowerCase()]
      if (match) return { kind: "full", data: match }
    }
    return { kind: "legacy", data: r }
  })

  return (
    <div className="hv-researchers-row">
      {resolved.map((entry, i) =>
        entry.kind === "full" ? (
          <ResearcherCard key={i} data={entry.data} />
        ) : (
          <LegacyResearcherPill key={i} researcher={entry.data} />
        )
      )}
    </div>
  )
}

const Post = ({ data, pageContext }) => {
  const { markdownRemark } = data
  const { frontmatter, html, excerpt } = markdownRemark
  const Image = frontmatter.featuredImage
    ? frontmatter.featuredImage.childImageSharp.gatsbyImageData
    : null
  const ImageUrl =
    frontmatter.featuredImage?.childImageSharp?.gatsbyImageData?.images?.fallback?.src ||
    null
  const { previous, next } = pageContext
  const researchers = frontmatter.researchers || []

  const prevValid = previous && previous.frontmatter.template === "blog-post"
  const nextValid = next && next.frontmatter.template === "blog-post"

  return (
    <Layout>
      <Seo
        title={frontmatter.title}
        description={frontmatter.description || excerpt}
        image={ImageUrl}
        article={true}
      />

      <div className="hv-post-page">
        <header className="hv-post-header">
          <h1>{frontmatter.title}</h1>
          <time className="date">{frontmatter.date}</time>
          <Researchers researchers={researchers} />
        </header>

        <div className="hv-post-wrap">
          {Image && (
            <GatsbyImage
              image={Image}
              alt={frontmatter.title + " - Featured image"}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>

      {(prevValid || nextValid) && (
        <div className="hv-post-nav">
          {prevValid && (
            <Link
              to={previous.frontmatter.slug}
              rel="prev"
              className="hv-post-nav-btn"
            >
              <span className="hv-post-nav-dir">← Previous</span>
              <span className="hv-post-nav-title">
                {previous.frontmatter.title}
              </span>
            </Link>
          )}
          {nextValid && (
            <Link
              to={next.frontmatter.slug}
              rel="next"
              className="hv-post-nav-btn"
            >
              <span className="hv-post-nav-dir">Next →</span>
              <span className="hv-post-nav-title">
                {next.frontmatter.title}
              </span>
            </Link>
          )}
        </div>
      )}
    </Layout>
  )
}

export default Post

export const pageQuery = graphql`
  query BlogPostQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 148)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
        researchers {
          name
          title
          profileUrl
        }
        featuredImage {
          childImageSharp {
            gatsbyImageData(
              layout: CONSTRAINED
              width: 1200
              quality: 90
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`
