"use client"

import { useEffect, useState } from "react";

const Page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const [page, setPage] = useState({})
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (slug) {
          try {
            const fetchedPage = await getPage(slug);
            setPage(fetchedPage);
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
      }
    }
    fetchPage();
  }, [slug])

  return (
    <div>{page.title}</div>
  )
}

export default Page;

async function getPage(slug: string) {
  // Fetch data from a hypothetical CMS API endpoint
  const pagesUrl = `https://sixty-backend-new.onrender.com/api/pages?filters[slug][$eq]=${slug}`
  const pagesRes = await fetch(pagesUrl);
  let page = await pagesRes.json();
  page = page.data[0]
  // Return the fetched data as props
  return {
      page
  };
}
