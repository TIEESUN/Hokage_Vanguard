import React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri"
import Layout from "../components/layout"
import Seo from "../components/seo"

export const blogListQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { template: { eq: "blog-post" } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          excerpt(pruneLength: 200)
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            slug
            title
            researchers {
              name
            }
            featuredImage {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED, width: 600, height: 340)
              }
            }
          }
        }
      }
    }
  }
`

const formatAuthors = node => {
  // Project schema uses `researchers: [{ name }]`. Fall back to v4-spec
  // `author` / `authors` (string or array) if either is ever added.
  const researchers = node.frontmatter.researchers
  if (Array.isArray(researchers) && researchers.length) {
    return researchers
      .map(r => r?.name)
      .filter(Boolean)
      .join(" · ")
  }
  const rawAuthor = node.frontmatter.author || node.frontmatter.authors
  if (Array.isArray(rawAuthor)) return rawAuthor.join(" · ")
  return rawAuthor || "Hokage Vanguard"
}

const BlogCard = ({ node }) => {
  const title = node.frontmatter.title
  const date = node.frontmatter.date
  const description = node.excerpt
  const slug = node.frontmatter.slug
  const image = node.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData
  const authorDisplay = formatAuthors(node)

  return (
    <Link to={slug} className="blog-card">
      {image ? (
        <div className="blog-card-img-wrap">
          <GatsbyImage image={image} alt={title} />
        </div>
      ) : (
        <div
          className="blog-card-img-wrap blog-card-img-placeholder"
          aria-hidden="true"
        />
      )}

      <div className="blog-card-body">
        <h2 className="blog-card-title">{title}</h2>
        {description && <p className="blog-card-excerpt">{description}</p>}
        <div className="blog-card-meta">
          <span className="blog-card-author">✦ {authorDisplay}</span>
          <span className="blog-card-date">{date}</span>
        </div>
      </div>
    </Link>
  )
}

const Pagination = props => (
  <div className="pagination">
    <ul>
      {!props.isFirst && (
        <li>
          <Link to={props.prevPage} rel="prev">
            <span className="icon -left">
              <RiArrowLeftLine />
            </span>{" "}
            Previous
          </Link>
        </li>
      )}
      {Array.from({ length: props.numPages }, (_, i) => (
        <li key={`pagination-number${i + 1}`}>
          <Link
            to={`${props.blogSlug}${i === 0 ? "" : i + 1}`}
            className={props.currentPage === i + 1 ? "is-active num" : "num"}
          >
            {i + 1}
          </Link>
        </li>
      ))}
      {!props.isLast && (
        <li>
          <Link to={props.nextPage} rel="next">
            Next{" "}
            <span className="icon -right">
              <RiArrowRightLine />
            </span>
          </Link>
        </li>
      )}
    </ul>
  </div>
)

const BlogIndex = ({ data, pageContext }) => {
  const { currentPage, numPages } = pageContext
  const blogSlug = "/blog/"
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage =
    currentPage - 1 === 1 ? blogSlug : blogSlug + (currentPage - 1).toString()
  const nextPage = blogSlug + (currentPage + 1).toString()

  const posts = data.allMarkdownRemark.edges.filter(
    edge => !!edge.node.frontmatter.date
  )

  return (
    <Layout>
      <Seo
        title={`Blog — Page ${currentPage} of ${numPages}`}
        description={`Hokage Vanguard blog — page ${currentPage} of ${numPages}`}
      />
      <div className="blog-list-page">
        <h1 className="blog-list-heading">Blog</h1>
        <div className="blog-card-grid">
          {posts.map(({ node }) => (
            <BlogCard key={node.id} node={node} />
          ))}
        </div>
        <Pagination
          isFirst={isFirst}
          prevPage={prevPage}
          numPages={numPages}
          blogSlug={blogSlug}
          currentPage={currentPage}
          isLast={isLast}
          nextPage={nextPage}
        />
      </div>
    </Layout>
  )
}

export default BlogIndex
