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
const tmdbToken = process.env.TMDB_API_TOKEN

if (!token || !baseId || !tableName || !tmdbToken) {
  console.log('Airtable / TMDb の環境変数が未設定です')
  // Netlify では画像なしのまま公開されないようビルドを失敗させる
  process.exit(process.env.NETLIFY ? 1 : 0)
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

// TMDb をタイトル＋年 → slug（英語名）＋年 → タイトルのみの順で検索し、横長の背景画像、なければポスターのパスを返す
async function findTmdbImage(title, year, slug) {
  const name = title.normalize('NFKC') // 全角数字・記号を半角に
  const attempts = [[name, year], ...(year ? [[slug.replace(/-/g, ' '), year]] : []), [name, '']]
  for (const [query, y] of attempts) {
    const params = new URLSearchParams({ query, language: 'ja-JP', include_adult: 'false' })
    if (y) params.set('year', y)
    const r = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`, {
      headers: { Authorization: `Bearer ${tmdbToken}` },
    })
    if (r.status === 401) {
      console.error('TMDb の認証に失敗しました。TMDB_API_TOKEN を確認してください')
      process.exit(1)
    }
    if (!r.ok) throw new Error(`TMDb API error (${r.status}): ${await r.text()}`)
    const hit = (await r.json()).results?.find((m) => m.backdrop_path || m.poster_path)
    if (hit) return { path: hit.backdrop_path ?? hit.poster_path, matched: `${hit.title} (${hit.release_date})` }
  }
  return null
}

const imagesDir = path.join(rootDir, 'public', 'images', 'movies')
fs.mkdirSync(imagesDir, { recursive: true })

for (const record of data.records) {
  const movie = record.fields
  if (!movie.slug || !movie.title) continue

  const localFilename = `${movie.slug}.jpg`
  const localPath = path.join(imagesDir, localFilename)

  if (fs.existsSync(localPath)) {
    console.log(`スキップ（既存）: ${localFilename}`)
    continue
  }

  try {
    const found = await findTmdbImage(movie.title, movie.year, movie.slug)
    if (!found) {
      console.warn(`TMDb で見つかりません: ${movie.title}`)
      continue
    }
    const imgRes = await fetch(`https://image.tmdb.org/t/p/w780${found.path}`)
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`)
    fs.writeFileSync(localPath, Buffer.from(await imgRes.arrayBuffer()))
    console.log(`ダウンロード完了: ${localFilename} ← ${movie.title} => ${found.matched}`)
  } catch (e) {
    console.warn(`ダウンロード失敗: ${localFilename}`, e)
  }
}

console.log('画像ダウンロード完了')
