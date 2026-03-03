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
  const token = import.meta.env.AIRTABLE_API_TOKEN

  const res = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableName}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return data.records.map((r: { fields: Movie }) => r.fields)
}
