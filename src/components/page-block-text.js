"use client"
import {  useEffect, useState } from "react";
import { remark } from 'remark';
import html from 'remark-html';

const PageBlockText = ({ data }) => {
  const [content, setContent] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const processedContent = await remark()
        .use(html)
        .process(data.text);
      setContent(processedContent.toString())
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