// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/vsDark')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Smplrspace demos',
  tagline: 'Private access demos and proof of concepts for our clients',
  url: 'https://demos.smplrspace.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'smplrspace',
  projectName: 'demos',

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/og-image.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true
      },
      navbar: {
        title: 'Demos',
        logo: {
          alt: 'Smplrspace logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo-white.svg'
        },
        items: [
          {
            href: 'https://www.smplrspace.com',
            label: 'Visit Smplrspace website',
            position: 'right'
          }
        ]
      },
      footer: {
        links: [],
        copyright: `© 2019-${new Date().getFullYear()} Smplrspace Pte Ltd. All rights reserved.`
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme
      }
    }),

  scripts: [
    {
      src: 'https://twentyfour-handsome.smplrspace.com/script.js',
      'data-site': 'FUKCMVQX',
      defer: true
    }
  ]
}

module.exports = config
