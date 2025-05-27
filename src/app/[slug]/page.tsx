"use client"

import { useEffect, useState, use } from "react";
import Image from "next/image"
import BlocksRenderer from "@/components/blocks-renderer"

const Page = (props: { params: Promise<{ slug: string }> }) => {
  const params = use(props.params);
  const { slug } = params;
  const [page, setPage] = useState({title:"", coverImage: {ext: "", url: "", alternativeText: ""}, blocks: {}, sideBlocks: {}})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (slug) {
          try {
            const fetchedPage = await getPage(slug);
            setPage(fetchedPage.page);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
          } else {
              throw error;
          }
          } finally {
            setLoading(false);
          }
      }
    }
    fetchPage();
  }, [slug])

  function coverImageSection() {
    if (page.coverImage.ext === ".gif") {
      return (
        <Image width={50}
          height={50} src={page.coverImage.url} alt={page.coverImage.alternativeText} className="max-h-56 w-full border-black border-b-2 object-cover" />
      )
    } else if (page.coverImage) {
      return (
        <Image
          src={page.coverImage.url}
          alt={page.coverImage.alternativeText}
          width={50}
          height={50}
          className="max-h-56 w-full border-black border-b-2"
        />
      )
    } else {
      <div></div>
    }
  }

  function columnsToggle() {
    if (page.sideBlocks === null) {
      return (
        <main className="w-full grid grid-cols-1 gap-3 pt-10">
          <BlocksRenderer blocks={page.blocks} />
        </main>
      )
    } else {
      return (
        <main className="lg:mt-8 grid lg:grid-cols-2 lg:gap-20">
          <BlocksRenderer blocks={page.blocks} />
          <BlocksRenderer blocks={page.sideBlocks} />
        </main>
      )
    }
  }

  return (
    <div>
    {!loading && !error && (
      <div>
        {coverImageSection()}
        <div className="container pt-10 md:pt-20">
          <h1 className="poppins text-4xl font-semibold text-black">{page.title}</h1>
          {columnsToggle()}
        </div>
      </div>
    )}
    </div>
  )
}

export default Page;

async function getPage(slug: string) {
  // Fetch data from a hypothetical CMS API endpoint
  const pagesUrl = `https://sixty-backend-new.onrender.com/api/pages?filters[slug][$eq]=${slug}&populate[0]=coverImage&populate[1]=blocks&populate[2]=sideBlocks&populate[3]=blocks.qa&populate[4]=sideBlocks.qa`
  const pagesRes = await fetch(pagesUrl);
  let page = await pagesRes.json();
  page = page.data[0]
  // Return the fetched data as props
  return {
      page
  };
}
