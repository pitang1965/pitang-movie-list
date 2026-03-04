import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

// ローカル開発用に .env を読み込む
const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = val
  }
}

const baseId = process.env.AIRTABLE_BASE_ID
const tableName = process.env.AIRTABLE_TABLE_NAME
const token = process.env.AIRTABLE_API_KEY

if (!token || !baseId || !tableName) {
  console.log('Airtable の環境変数が未設定のため画像ダウンロードをスキップします')
  process.exit(0)
}

const res = await fetch(
  `https://api.airtable.com/v0/${baseId}/${tableName}`,
  { headers: { Authorization: `Bearer ${token}` } }
)
const data = await res.json()

if (!data.records) {
  console.error('Airtable からのレコード取得に失敗:', data)
  process.exit(1)
}

const imagesDir = path.join(rootDir, 'public', 'images', 'movies')
fs.mkdirSync(imagesDir, { recursive: true })

for (const record of data.records) {
  const movie = record.fields
  if (!movie.image?.[0] || !movie.slug) continue

  const { url, filename } = movie.image[0]
  const ext = path.extname(filename) || '.jpg'
  const localFilename = `${movie.slug}${ext}`
  const localPath = path.join(imagesDir, localFilename)

  if (fs.existsSync(localPath)) {
    console.log(`スキップ（既存）: ${localFilename}`)
    continue
  }

  try {
    const imgRes = await fetch(url)
    const buffer = await imgRes.arrayBuffer()
    fs.writeFileSync(localPath, Buffer.from(buffer))
    console.log(`ダウンロード完了: ${localFilename}`)
  } catch (e) {
    console.warn(`ダウンロード失敗: ${localFilename}`, e)
  }
}

console.log('画像ダウンロード完了')
