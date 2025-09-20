import React from "react"

const Headings = ({ title, description }) => {
  return (
    <div>
    <header>
      <title className="text-6xl font-bold text-neutral-700">{title}</title>
      <meta
        name="description"
        content={description}
        key="desc"
      />
    </header>
    </div>
  )
}

export default Headings
