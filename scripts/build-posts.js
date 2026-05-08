import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import { marked } from 'marked'

const POSTS_DIR = path.resolve('posts')
const OUTPUT_DIR = path.resolve('src/data')

async function build() {
  const files = await glob('*.md', { cwd: POSTS_DIR })

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const posts = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')
    const { data, content } = matter(raw)

    const html = marked.parse(content, { breaks: true })

    const readingTime = Math.max(1, Math.ceil(content.length / 500))

    posts.push({
      slug: file.replace(/\.md$/, ''),
      title: data.title || '无题',
      date: data.date || '未知日期',
      tags: data.tags || [],
      description: data.description || '',
      content: html,
      readingTime,
    })
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'posts.json'),
    JSON.stringify(posts, null, 2),
    'utf-8'
  )

  console.log(`✅ 构建完成: ${posts.length} 篇文章`)
}

build().catch(err => {
  console.error('构建失败:', err)
  process.exit(1)
})
