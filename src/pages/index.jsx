import React from "react"
import { graphql } from "gatsby"
import { Cards, Hero, SiteMetadata } from "../components"
import { Layout } from "../layouts/Layout"

export default ({ data }) => {
  return (
    <Layout>
      <SiteMetadata
        title="ピータン映画"
        description="私のお気に入りの映画(10点満点中8点以上）です。"
        image={data.hero.url}
      />

      <Hero
        image={data.hero}
        tag="#movie"
        title="ピータンのお気に入りの映画"
        description="私のお気に入りの映画(10点満点中8点以上）です。"
      />

      <Cards nodes={data.items.nodes} />
    </Layout>
  )
}

export const query = graphql`
  query IndexQuery($tableName: String!) {
    hero: file(relativePath: { eq: "hero-movie.jpg" }) {
      ...HeroImageFragment
    }
    items: allAirtable(filter: { table: { eq: $tableName } }) {
      nodes {
        data {
          image {
            ...CardImageFragment
          }
          title
          slug
          rating
          year
        }
      }
    }
  }
`
