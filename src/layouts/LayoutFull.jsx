import { Link } from "gatsby"
import React from "react"
import { Footer } from "../components"

export const LayoutFull = ({ children }) => {
  return (
    <>
      <header className="bg-white py-6">
        <div className="container text-center">
          <Link to="/" className="inline-block">
            <img alt="幼少期のピータンと父" src="./baby-pitang.jpg" />
          </Link>
        </div>
      </header>
      {children}
      <Footer />
    </>
  )
}
