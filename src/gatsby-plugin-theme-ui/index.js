// Minimal theme — the real visual system lives in src/assets/scss/style.scss.
// Backgrounds are transparent so the site-wide video can show through.

const siteColor = "transparent"

const theme = {
  config: {
    useRootStyles: false,
    useColorSchemeMediaQuery: false,
  },
  colors: {
    siteColor,
    text: "#ffffff",
    background: "transparent",
    primary: "transparent",
    accent: "transparent",
    muted: "rgba(255, 255, 255, 0.55)",
    cardBg: "transparent",
    borderColor: "rgba(255, 255, 255, 0.10)",
    labelText: "rgba(255, 255, 255, 0.55)",
    inputBorder: "rgba(255, 255, 255, 0.10)",
    inputBackground: "rgba(255, 255, 255, 0.05)",
    socialIcons: "rgba(255, 255, 255, 0.80)",
    socialIconsHover: "#ffffff",
    buttonColor: "#ffffff",
    buttonHoverBg: "rgba(255, 255, 255, 0.10)",
    buttonHoverColor: "#ffffff",
  },
  links: {
    postLink: {
      color: "muted",
      "&:hover": {
        color: "text",
      },
    },
  },
  variants: {
    button: {
      bg: "rgba(255,255,255,0.05)",
      color: "buttonColor",
      "&:hover": {
        bg: "buttonHoverBg",
        color: "buttonHoverColor",
      },
    },
    socialIcons: {
      a: {
        color: "socialIcons",
        ":hover": {
          color: "socialIconsHover",
        },
      },
    },
  },
}
export default theme
