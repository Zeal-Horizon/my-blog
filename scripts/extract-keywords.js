/**
 * Extract keywords from markdown content.
 * Handles both Chinese and English text without external dependencies.
 * Returns up to `count` keywords.
 */

// Common Chinese stop words
const ZH_STOP = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一',
  '一个', '可以', '我们', '这', '与', '也', '很', '到', '要', '会', '但',
  '这个', '那', '上', '下', '自己', '之', '将', '被', '而', '及', '所',
  '让', '从', '对', '没有', '如果', '因为', '用', '通过', '进行', '使用',
  '以及', '或者', '于', '其', '中', '更', '为', '等', '并', '或', '已',
  '以', '后', '前', '能', '做', '还', '它', '她', '他', '时', '来', '把',
])

// Common English stop words
const EN_STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'shall', 'can', 'need',
  'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their',
  'we', 'you', 'your', 'our', 'not', 'no', 'nor', 'so', 'if', 'then',
  'than', 'too', 'very', 'just', 'about', 'also', 'more', 'some', 'any',
  'each', 'every', 'both', 'all', 'into', 'over', 'such', 'only', 'other',
  'after', 'before', 'between', 'through', 'during', 'because', 'use',
  'using', 'used', 'like', 'how', 'what', 'which', 'who', 'when', 'where',
  'why', 'get', 'got', 'way', 'make', 'made', 'new', 'one', 'two',
])

function stripCodeBlocks(text) {
  return text.replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
}

function stripMarkdownSyntax(text) {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/[*_]/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, ' ')
    .replace(/[<>]/g, ' ')
    .replace(/[#|>\-=\\~]/g, ' ')
}

function extractChineseTerms(text) {
  // Split by Chinese punctuation to get phrase segments
  const segments = text.split(/[。，；：！？、()（）【】《》""''\n\r]+/)
    .map(s => s.replace(/[a-zA-Z0-9\s+/#<>]/g, ''))
    .filter(s => s.length >= 2)

  const freq = {}

  for (const seg of segments) {
    // Try 4-char, then 3-char, then 2-char terms
    for (let len of [4, 3, 2]) {
      if (seg.length < len) continue
      for (let i = 0; i <= seg.length - len; i++) {
        const term = seg.slice(i, i + len)
        if (ZH_STOP.has(term)) continue
        freq[term] = (freq[term] || 0) + 1
      }
    }
  }

  // Keep terms that appear more than once
  const entries = Object.entries(freq).filter(([, count]) => count > 1)

  // Remove substrings: if a term is part of a longer term with similar or higher score
  const filtered = entries.filter(([term, score]) => {
    return !entries.some(([other, otherScore]) => {
      if (other === term) return false
      return other.includes(term) && otherScore >= score
    })
  })

  return filtered.sort((a, b) => b[1] - a[1])
}

function extractEnglishTerms(text) {
  const words = text.toLowerCase().split(/[^a-z0-9+#]+/).filter(w => {
    return w.length > 2 && !EN_STOP.has(w) && !/^\d+$/.test(w)
  })

  const freq = {}
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1
  }

  return Object.entries(freq)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
}

function extractHeadings(text) {
  const headings = text.match(/^#{2,3}\s+(.+)/gm)
  if (!headings) return []

  const terms = []
  for (const h of headings) {
    const clean = h.replace(/^#{2,3}\s+/, '').trim()
    // Extract key Chinese/English terms from headings
    const zh = clean.match(/[一-鿿]{2,}/g)
    if (zh) terms.push(...zh)
    const en = clean.match(/[a-zA-Z][a-zA-Z0-9+#]+/g)
    if (en) terms.push(...en.map(w => w.toLowerCase()))
  }
  return terms
}

export function extractKeywords(content, count = 3) {
  // Extract headings with extra weight
  const headingTerms = extractHeadings(content)

  // Clean content
  let text = stripCodeBlocks(content)
  text = stripMarkdownSyntax(text)

  // Get Chinese and English candidates
  const zhCandidates = extractChineseTerms(text)
  const enCandidates = extractEnglishTerms(text)

  // Score candidates
  const scoreMap = {}

  function addScore(term, score) {
    scoreMap[term] = (scoreMap[term] || 0) + score
  }

  for (const [term, freq] of zhCandidates) {
    addScore(term, freq * 2)
  }
  for (const [term, freq] of enCandidates) {
    addScore(term, freq)
  }
  for (const term of headingTerms) {
    addScore(term, 5)
  }

  // Sort by score and return top keywords
  return Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([term]) => term)
}
