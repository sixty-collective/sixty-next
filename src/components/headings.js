import React from "react"
import Head from 'next/head';

const Headings = ({ title, description }) => {
  return (
    <Head>
      <title className="text-6xl font-bold text-neutral-700">{title}</title>
      {description && (
        <p className="mt-4 text-2xl text-neutral-500">{description}</p>
      )}
      <meta
        name="description"
        content={description}
        key="desc"
      />
    </Head>
  )
}

export default Headings
