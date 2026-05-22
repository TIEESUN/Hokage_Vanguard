const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);

// GraphQL schema customization.
//
// Two things here:
//  1) Strongly-type the `researchers` array (legacy).
//  2) Resolve `frontmatter.featuredImage` (a string like "/assets/foo.png")
//     to a File node so `childImageSharp { gatsbyImageData }` keeps working.
//     This used to happen implicitly via `gatsby-plugin-netlify-cms-paths`;
//     after that plugin was removed we have to wire the resolver ourselves.
exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions

  createTypes(`
    type MarkdownRemarkFrontmatterResearchers {
      name: String
      title: String
      profileUrl: String
    }
  `)

  createTypes([
    schema.buildObjectType({
      name: "MarkdownRemarkFrontmatter",
      interfaces: ["Node"],
      extensions: { infer: true },
      fields: {
        researchers: { type: "[MarkdownRemarkFrontmatterResearchers]" },
        featuredImage: {
          type: "File",
          resolve: async (source, args, context) => {
            if (!source.featuredImage) return null
            // gatsby-source-filesystem points at static/assets/ with name "assets",
            // so File nodes there have relativePath like "foo.png" (NOT "assets/foo.png").
            // Frontmatter writes "/assets/foo.png" — strip both prefixes to match.
            // Scoping to sourceInstanceName: "assets" prevents collisions with same-
            // named files under the content source.
            const cleaned = source.featuredImage
              .replace(/^\//, "")
              .replace(/^assets\//, "")
            return context.nodeModel.findOne({
              type: "File",
              query: {
                filter: {
                  sourceInstanceName: { eq: "assets" },
                  relativePath: { eq: cleaned },
                },
              },
            })
          },
        },
      },
    }),
  ])
}

// Redirects for slugs that were renamed (old slugs contained spaces / colons
// which break on Windows and aren't proper URL characters). gatsby-plugin-netlify
// writes these into the deployed _redirects file so old links keep working.
const SLUG_REDIRECTS = [
  {
    from: "/The Exploit-Theater: Nation-State-Cyber-Clashes-in-South Asia",
    to: "/the-exploit-theater-nation-state-cyber-clashes-in-south-asia",
  },
  {
    from: "/Rinnegan Awakening Unlocking Kimsuk’s-APT43 Hidden Shadow Network",
    to: "/rinnegan-awakening-unlocking-kimsuks-apt43-hidden-shadow-network",
  },
  {
    from: "/Hunting Chinese Cyber Espionage-Inspired-ORB-Proxy-Techniques-Leveraging-Zuorat-Style-Tradecraft-in-Phishing-and-Malware-Operations",
    to: "/hunting-chinese-cyber-espionage-inspired-orb-proxy-techniques-leveraging-zuorat-style-tradecraft-in-phishing-and-malware-operations",
  },
];

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage, createRedirect } = actions;

  SLUG_REDIRECTS.forEach(({ from, to }) => {
    createRedirect({ fromPath: from, toPath: to, isPermanent: true });
  });

  const blogList = path.resolve(`./src/templates/blog-list.js`);

  const result = await graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
        edges {
          node {
            id
            frontmatter {
              slug
              template
              title
            }
          }
        }
      }
    }
  `);

  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  // Create markdown pages
  const posts = result.data.allMarkdownRemark.edges;
  let blogPostsCount = 0;

  posts.forEach((post, index) => {
    const id = post.node.id;
    const { slug, template } = post.node.frontmatter;
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    if (!slug || !template) {
      reporter.warn(`Missing slug or template for node: ${id}`);
      return;
    }

    // Map `publication` to `publication-page.js`
    const componentPath = template === "publication" 
      ? path.resolve(`src/templates/publication-page.js`) 
      : path.resolve(`src/templates/${template}.js`);

    createPage({
      path: slug,
      component: componentPath,
      // Additional data can be passed via context
      context: {
        id,
        previous,
        next,
      },
    });

    // Count blog posts.
    if (template === "blog-post") {
      blogPostsCount++;
    }
  });

  // Create blog-list pages
  const postsPerPage = 9;
  const numPages = Math.ceil(blogPostsCount / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};
