import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'UniappConfigForm',
  description: '支持uniapp的配置式表单引擎',
  /* prettier-ignore */
  head: [
    ['link', { rel: 'icon', type: 'image/webp', href: '/logo.webp' }],
  ],
  themeConfig: {
    logo: { src: '/logo.webp', width: 24, height: 24 },

    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '开始', link: '/install' },
    ],

    search: {
      provider: 'local',
    },

    sidebar: [
      {
        text: '开始',
        items: [
          { text: '快速上手', link: '/install' },
          // { text: '演练场', link: '/playground' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/njzzzz/uni-mp-form' },
    ],
  },
})
