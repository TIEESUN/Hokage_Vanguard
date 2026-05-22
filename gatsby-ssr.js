const React = require("react")

// Injects the Netlify Identity widget on every page so that the magic-link
// invite flow (which lands on https://YOURSITE/#invite_token=...) can finish
// the user signup wherever the link is opened. After signup, the user is
// redirected to /admin/ to start managing content.
exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    React.createElement("script", {
      key: "netlify-identity-widget",
      src: "https://identity.netlify.com/v1/netlify-identity-widget.js",
    }),
    React.createElement("script", {
      key: "netlify-identity-login-redirect",
      dangerouslySetInnerHTML: {
        __html: `
          if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", function (u) {
              if (!u) window.netlifyIdentity.on("login", function () {
                document.location.href = "/admin/";
              });
            });
          }
        `,
      },
    }),
  ])
}
