"use client"
import {  useEffect, useState } from "react";
import {unified} from 'unified'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeRaw from 'rehype-raw';
const PageBlockText = ({ data }) => {
  const [content, setContent] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const processedContent = await unified()
        .use(remarkParse)
        .use(remarkRehype, {"allowDangerousHtml": true})
        .use(rehypeRaw)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(data.text);
      setContent(processedContent.toString())
      console.log(processedContent)
    };
    fetchData();
  }, [data]);

  return (
    <div className="prose mx-auto md:py-8 max-w-none">
      <div
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </div>
  )
}

export default PageBlockText