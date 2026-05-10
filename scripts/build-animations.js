import fs from 'fs'
import path from 'path'

const IMAGES_DIR = path.resolve('public/images')
const OUTPUT_DIR = path.resolve('public/data')

const files = fs.readdirSync(IMAGES_DIR)
  .filter(f => f.endsWith('.json'))
  .sort()

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'animations.json'),
  JSON.stringify(files, null, 2),
  'utf-8'
)

console.log(`✅ 动画清单生成: ${files.length} 个文件`)
