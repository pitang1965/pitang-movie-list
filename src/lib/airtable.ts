import fs from 'node:fs'
import path from 'node:path'

export interface Movie {
  title: string
  slug: string
  rating: string
  year: string
  countries: string[]
  tags: string[]
  url: string
  review: string
  image: Array<{ url: string; filename: string }>
}

export async function getMovies(): Promise<Movie[]> {
  const baseId = import.meta.env.AIRTABLE_BASE_ID
  const tableName = import.meta.env.AIRTABLE_TABLE_NAME
  const token = import.meta.env.AIRTABLE_API_KEY

  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableName}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  if (!res.ok || !data.records) {
    throw new Error(`Airtable API error (${res.status}): ${JSON.stringify(data)}`)
  }

  return data.records.map((r: { fields: Movie }) => {
    const movie = r.fields
    // ビルド前スクリプトで TMDb からダウンロード済みのローカル画像を使用
    const file = `/images/movies/${movie.slug}.jpg`
    movie.image = fs.existsSync(path.join(process.cwd(), 'public', file))
      ? [{ url: file, filename: `${movie.slug}.jpg` }]
      : []
    return movie
  })
}
