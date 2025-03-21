#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 创建一个 Promise 包装的 question 函数
const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function generateFrontmatter() {
  try {
    // Get current date for default values
    const now = new Date()
    const defaultDate = now.toISOString().split('T')[0]

    // Collect frontmatter data
    const title = await question('请输入文章标题: ')
    const date = (await question(`请输入发布日期 (默认 ${defaultDate}): `)) || defaultDate
    const tagsInput = await question('请输入标签 (用逗号分隔): ')
    const tags = tagsInput ? tagsInput.split(',').map((tag) => tag.trim()) : []

    const draftInput = await question('是否为草稿? (y/n): ')
    const draft = draftInput.toLowerCase() === 'y'

    const summary = await question('请输入文章摘要: ')
    const imagesInput = await question('请输入图片路径 (用逗号分隔): ')
    const images = imagesInput ? imagesInput.split(',').map((img) => img.trim()) : []

    const authorsInput = await question('请输入作者 (用逗号分隔): ')
    const authors = authorsInput
      ? authorsInput.split(',').map((author) => author.trim())
      : ['default']

    // Generate frontmatter
    const frontmatter = `---
title: '${title}'
date: '${date}'
tags: ${JSON.stringify(tags)}
draft: ${draft}
summary: '${summary}'
images: ${JSON.stringify(images)}
authors: ${JSON.stringify(authors)}
---

`

    // Create filename from title
    const filename =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '.mdx'

    // Create year-month directory if it doesn't exist
    const [year, month] = date.split('-')
    const dirPath = path.join('data', 'blog', `${year}${month}`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    // Write the file
    const filePath = path.join(dirPath, filename)
    fs.writeFileSync(filePath, frontmatter)

    console.log(`\nMDX 文件已创建: ${filePath}`)
    console.log('Frontmatter 内容:')
    console.log(frontmatter)

    rl.close()
  } catch (error) {
    console.error('发生错误:', error)
    rl.close()
    process.exit(1)
  }
}

generateFrontmatter()
