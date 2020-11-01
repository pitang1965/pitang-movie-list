import { graphql } from "gatsby"
import Img from "gatsby-image"
import { Link } from "gatsby-plugin-modal-routing"
import PropTypes from "prop-types"
import React from "react"

export const Card = props => {
  const {
    image: {
      localFiles: [cover],
    },
    title,
    navigation,
    slug,
    rating,
    year,
  } = props

  return (
    <div className="bg-white h-full shadow-sm rounded-md overflow-hidden hover:bg-blue-100">
      <Link to={`/${slug}`} state={{ navigation }} asModal>
        <div className="bg-blue-300">
          <Img fluid={cover.childImageSharp.fluid} alt={title} />
        </div>
        <div className="p-5 pb-1">
          <h1 className="text-2xl text-blue-500 font-bold leading-snug">
            {title} [{year}年]
          </h1>
          <p className="text-base text-blue-900 mb-5 font-medium">評価 {rating}点</p>
        </div>
      </Link>
    </div>
  )
}

Card.propTypes = {
  image: PropTypes.shape({
    localFiles: PropTypes.array,
  }).isRequired,
  title: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    current: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.string),
  }),
  slug: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
}

Card.defaultProps = {
  navigation: {},
}

export const query = graphql`
  fragment CardImageFragment on AirtableField {
    localFiles {
      childImageSharp {
        fluid(maxWidth: 640, maxHeight: 420, cropFocus: NORTH) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`
