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

  const movies: Movie[] = data.records.map((r: { fields: Movie }) => r.fields)

  // ビルド時に画像をローカルにダウンロードして期限切れURLを回避
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'movies')
  fs.mkdirSync(imagesDir, { recursive: true })

  await Promise.all(
    movies.map(async (movie) => {
      if (!movie.image?.[0]) return
      const { url, filename } = movie.image[0]
      const ext = path.extname(filename) || '.jpg'
      const localFilename = `${movie.slug}${ext}`
      const localPath = path.join(imagesDir, localFilename)

      if (!fs.existsSync(localPath)) {
        try {
          const imgRes = await fetch(url)
          const buffer = await imgRes.arrayBuffer()
          fs.writeFileSync(localPath, Buffer.from(buffer))
        } catch (e) {
          console.warn(`画像のダウンロードに失敗: ${movie.slug}`, e)
        }
      }

      movie.image[0].url = `/images/movies/${localFilename}`
    })
  )

  return movies
}
