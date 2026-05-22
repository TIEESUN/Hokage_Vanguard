import React from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

const PostCard = ({ data }) => {
  const { frontmatter } = data
  const image = frontmatter.featuredImage?.childImageSharp?.gatsbyImageData

  return (
    <Link to={frontmatter.slug} className="post-card">
      {image && (
        <GatsbyImage
          image={image}
          alt={frontmatter.title + " - Featured image"}
          className="featured-image"
        />
      )}
      <h2 className="title">{frontmatter.title}</h2>
      <p className="post-date">
        <time>{frontmatter.date}</time>
      </p>
    </Link>
  )
}

export default PostCard
