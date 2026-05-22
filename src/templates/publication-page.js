import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const pageQuery = graphql`
  query PublicationQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { template: { eq: "publication-page" } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            abstract
            link
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`

const PublicationPage = ({ data }) => {
  const publications = data.allMarkdownRemark.edges
  return (
    <Layout className="content-page">
      <Seo title="Publications" />
      <h1>Publications</h1>
      <div className="publication-list">
        {publications.map(({ node }) => {
          const { title, abstract, link, date } = node.frontmatter
          return (
            <article key={node.id} className="publication-card">
              <h2 className="publication-title">
                {link ? (
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {title || "Untitled"}
                  </a>
                ) : (
                  <span>{title || "Untitled"}</span>
                )}
              </h2>
              <time className="publication-date">
                {date || "Unknown date"}
              </time>
              <p className="publication-abstract">
                {abstract || "No abstract available"}
              </p>
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                >
                  Read Full Paper →
                </a>
              )}
            </article>
          )
        })}
      </div>
    </Layout>
  )
}

export default PublicationPage
