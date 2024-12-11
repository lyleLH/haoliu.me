import type { Project } from '~/types/data'

export const PROJECTS: Project[] = [
  {
    type: 'work',
    title: "REVERY AI - The world's luxury and designer fashion pieces are at your fingertips.",
    description: `With its unique features, Reverie allows users to create personalized looks, mood boards, and collages, making it an engaging tool for style expression.`,
    imgSrc: '/static/images/projects/revery_ai_website_screenshot.png',
    url: '/blog/202304/Revery_ai_jobs',
    // demo: <AvpDemo />,
    builtWith: ['Swift', 'SwiftPackageManager', 'Cocoapods'],
  },
  {
    type: 'work',
    title: "ShouYinTong App - Aurora's Big Data Brand",
    description: `收银SaaS版是一款专为商家设计的收银管理工具，旨在通过云端技术提升商家的运营效率。该应用提供了一系列功能，帮助商家更好地管理日常交易、库存和客户信息。`,
    imgSrc: '/static/images/projects/shou_yin_tong_company_apps_screenshot.png',
    url: '/blog/202011/Shouyintong_app',
    builtWith: ['ObjectiveC', 'Swift', 'Cocoapods', 'Flutter'],
  },

  {
    type: 'self',
    title: 'mt_tool - viper module files generator',
    description: `Quickly generate Viper module files for iOS development.`,
    imgSrc:
      'https://github.com/lyleLH/mt_tool/blob/master/img/69786f8e2a527b8c26f2c1311e230e5f.webp.png?raw=true',
    repo: 'lyleLH/mt_tool',
    url: 'https://github.com/lyleLH/mt_tool',
    builtWith: ['Ruby', 'Cocoapods', 'Terminal'],
  },

  {
    type: 'self',
    title: 'fork of wechat-format - markdown format for wechat',
    description: `convert markdown to wechat format`,
    imgSrc: 'https://github.com/lyleLH/wechat-format/blob/main/assets/images/banner.jpg?raw=true',
    repo: 'lyleLH/wechat-format',
    url: 'https://lylelh.github.io/wechat-format/',
    builtWith: ['Javascript'],
  },

  {
    type: 'self',
    title: 'mini-saas-used-car-website',
    description: `mini-saas-used-car-website`,
    imgSrc: '/static/images/projects/used_car_sass_demo.png',
    url: 'https://my-mini-saas-used-car-website-fwsx-jl163cihl-lylelhs-projects.vercel.app/',
    builtWith: ['Javascript', 'React', 'NextJS', 'TailwindCSS'],
  },
]
