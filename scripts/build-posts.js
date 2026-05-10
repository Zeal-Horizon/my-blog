import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import matter from 'gray-matter'
import { marked } from 'marked'
import AdmZip from 'adm-zip'
import { extractKeywords } from './extract-keywords.js'

const POSTS_DIR = path.resolve('posts')
const OUTPUT_DIR = path.resolve('src/data')
const IMG_DIR = path.resolve('public/images/posts')

function extractTitle(content) {
  const match = content.match(/^#\s+(.+)/m)
  return match ? match[1].trim() : '无题'
}

function extractDate(content, filepath) {
  const { data } = matter(content)
  if (data.date) return data.date
  const stat = fs.statSync(filepath)
  return stat.mtime.toISOString().slice(0, 10)
}

function slugify(name) {
  return name
    .replace(/\.md$/i, '')
    .replace(/[^\w一-鿿-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function processMdContent(raw, filepath, category = '') {
  const { data, content } = matter(raw)
  const html = marked.parse(content, { breaks: true })
  const readingTime = Math.max(1, Math.ceil(content.length / 500))
  const title = data.title || extractTitle(content)
  const date = data.date || extractDate(content, filepath)

  // Rewrite image paths
  const processedHtml = html.replace(
    /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi,
    (match, src) => {
      const imgFile = path.basename(src)
      return match.replace(src, `/my-blog/images/posts/${imgFile}`)
    }
  )

  let tags = data.tags || []
  if (!tags || tags.length === 0) {
    tags = extractKeywords(content, 3)
  }

  return {
    slug: data.slug || slugify(filepath),
    title,
    date,
    category,
    tags,
    description: data.description || '',
    content: processedHtml,
    readingTime,
  }
}

async function build() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true })

  const posts = []

  // Scan subdirectories in posts/ — each folder name is a category
  const dirs = fs.readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const category of dirs) {
    const catDir = path.join(POSTS_DIR, category)

    // Process zips in this category folder
    const zipFiles = await glob('*.zip', { cwd: catDir })
    for (const zipFile of zipFiles) {
      try {
        const zip = new AdmZip(path.join(catDir, zipFile))
        for (const entry of zip.getEntries()) {
          if (!entry.isDirectory && /\.(png|jpg|jpeg|gif|svg|webp|bmp)$/i.test(entry.name)) {
            fs.writeFileSync(path.join(IMG_DIR, path.basename(entry.name)), entry.getData())
            continue
          }
          if (!entry.isDirectory && /\.md$/i.test(entry.name)) {
            const raw = entry.getData().toString('utf-8')
            posts.push(processMdContent(raw, path.join(catDir, zipFile), category))
          }
        }
        console.log(`  📦 ${category}/${zipFile}`)
      } catch (err) {
        console.error(`  ❌ ${category}/${zipFile}: ${err.message}`)
      }
    }

    // Process standalone .md files in this category folder
    const mdFiles = await glob('*.md', { cwd: catDir })
    for (const file of mdFiles) {
      const raw = fs.readFileSync(path.join(catDir, file), 'utf-8')
      posts.push(processMdContent(raw, path.join(catDir, file), category))
    }
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date))

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'posts.json'),
    JSON.stringify(posts, null, 2),
    'utf-8'
  )

  console.log(`✅ 构建完成: ${posts.length} 篇文章 (${dirs.length} 个分类)`)
}

build().catch(err => {
  console.error('构建失败:', err)
  process.exit(1)
})
