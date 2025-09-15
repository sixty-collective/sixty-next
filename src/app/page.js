import React from "react";
import PropTypes from "prop-types";
import Image from 'next/image';

import Link from 'next/link';
// import Layout from "../app/layout"
// import Seo from "../components/seo"
import Headings from "@/components/headings";
import TestimonialSlider from "@/components/testimonial-slider";
// import axios from "axios"
// import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
// import { CookieNotice } from "gatsby-cookie-notice"

const  IndexPage = async () => {
  const { testimonials,
    global } = await getData()

  return (
    <div>
      <Headings
        title={global.data.siteName}
        description={global.data.siteDescription}
      />
      <div className="flex flex-col justify-center items-center width-full">
        <Image unoptimized className="w-full max-h-96" src={'/images/Sixty-Collective-Homepage.gif'} alt="An animation of a book opening up to have several tools fly out" width={500} height={500} />
        <div className="w-full">
          <h1 className="text-xl w-full bg-black font-medium text-white text-center p-5 home-header-text poppins">
            <div
        dangerouslySetInnerHTML={{
          __html: global.data.homeHeaderText,
        }}
      />
          </h1>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <div className="flex flex-col md:border-r-2 border-black bg-[#E1EEF6] justify-between">
          <h2 className="text-5xl min-[400px]:text-6xl sm:text-7xl min-[400px]:leading-extra-tight md:leading-extra-tight sm:text-7xl md:text-4xl text-center uppercase font-bold w-full px-8 pt-10 member-gradient sm:leading-extra-tight md:leading-extra-tight lg:leading-extra-tight xl:leading-extra-tight lg:text-6xl xl:text-7xl">
              Member<br /> Profiles
            </h2>
            <div className="">
              <div className="flex w-full align-center justify-center">
              <p className="p-10 text-center max-w-md poppins text-lg">
              Learn about our members, hire talent, find collaborators, and more.
              </p>
              </div>
              <div className="flex border-black p-8 rounded-t-3xl member-gradient top-curve-border flex-col">
              <div className="w-full text-center font-bold text-sm mb-5">
                  Search profiles by popular discipline:
                </div>
                <div className="w-full text-center">
                <Link href={"/profiles?disciplineName=Writer&disciplineSlug=writer"}>
                <span
                  className="text-xs mr-2 mb-2 rounded-full px-2 py-1 bg-white font-fira border-black border inline-block hover:bg-[#E1EEF6]"
                  
                >
                  Writer
                </span></Link>
                <Link href={"/profiles?disciplineName=Photographer&disciplineSlug=photographer"}>
                <span
                  className="text-xs mr-2 mb-2 rounded-full px-2 py-1 bg-white font-fira border-black border inline-block hover:bg-[#E1EEF6]"
                  
                >
                  Photographer
                </span></Link>
                <Link href={"/profiles?disciplineName=Editor&disciplineSlug=editor"}>
                <span
                  className="text-xs mr-2 mb-2 rounded-full px-2 py-1 bg-white font-fira border-black border inline-block hover:bg-[#E1EEF6]"
                  
                >
                  Editor
                </span></Link>
                </div>
                <div className="w-full text-center mt-5 underline font-bold">
                <Link href={"/profiles"}>View All Member Profiles</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:border-r-2 border-black bg-[#F8E3D3] border-t-2 md:border-t-0 justify-between">
          <h2 className="text-5xl min-[400px]:text-6xl min-[400px]:leading-extra-tight md:leading-extra-tight sm:text-7xl md:text-4xl lg:text-6xl xl:text-7xl text-center uppercase font-bold w-full md:px-8 pt-10 knowledge-gradient sm:leading-extra-tight md:leading-extra-tight lg:leading-extra-tight xl:leading-extra-tight">
              Knowledge<br /> Share
            </h2>
            <div className="">
              <div className="flex w-full align-center justify-center">
              <p className="p-10 text-center max-w-md poppins text-lg">
              Browse through our carefully selected articles, tools, career advice, and more.
              </p>

              </div>
              <div className="flex border-black p-8 rounded-t-3xl knowledge-gradient top-curve-border flex-col">
                <div className="w-full text-center font-bold text-sm mb-5">
                  Search resources by popular tag:
                </div>
                <div className="w-full text-center">
                <Link href={"/resources?tagName=Activism%20%26%20Advocacy&tagSlug=activism-advocacy"}>
                <span
                  className="text-xs mr-2 mb-2 rounded-full px-2 py-1 bg-white font-fira border-black border inline-block hover:bg-[#F8E3D3]"
                  
                >
                  Activism & Advocacy
                </span></Link>
                <Link href={"/resources?tagName=Accessibility&tagSlug=accessibility"}>
                <span
                  className="text-xs mr-2 mb-2 rounded-full px-2 py-1 bg-white font-fira border-black border inline-block hover:bg-[#F8E3D3]"
                  
                >
                  Accessibility
                </span></Link>
                <Link href={"/resources?tagName=Financial&tagSlug=financial"}>
                <span
                  className="text-xs mr-2 mb-2 rounded-full px-2 py-1 bg-white font-fira border-black border inline-block hover:bg-[#F8E3D3]"
                  
                >
                  Financial
                </span></Link>
                </div>
                <div className="w-full text-center mt-5 underline font-bold">
                <Link href={"/resources"}>View All Resources</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col width-full justify-center items-center container p-10">
          <h3 className="text-3xl font-bold text-center poppins">Sign up for Sixty&apos;s newsletter for the latest publishings, events, and gig & job opportunities.</h3>
          <a href="https://sixtyinchesfromcenter.us2.list-manage.com/subscribe?u=d2aa2358e3e7d016e0c842845&id=87d8eba843">
          <button className="hover:bg-black hover:text-[#F7F4F0] rounded-full text-black text-sm px-2 py-1 mt-5 border-2 border-black w-48">
            Subscribe
          </button>
          </a>
        </div>
        <TestimonialSlider testimonials={testimonials} />
        <div>
        </div>
      </div>
    </div>
  )
}

IndexPage.propTypes = {
  queryStrings: PropTypes.object,
}

export default IndexPage;

async function getData() {
  // Fetch data from a hypothetical CMS API endpoint
  const testimonialsUrl = "https://sixty-backend-new.onrender.com/api/testimonials"
  const disciplinesUrl = "https://sixty-backend-new.onrender.com/api/disciplines"
  const descriptorsUrl = "https://sixty-backend-new.onrender.com/api/descriptors"
  const globalUrl = "https://sixty-backend-new.onrender.com/api/global"
  const testimonialsRes = await fetch(testimonialsUrl);
  const testimonials = await testimonialsRes.json();
  const disciplinesRes = await fetch(disciplinesUrl);
  const disciplines = await disciplinesRes.json();

  const descriptorsRes = await fetch(descriptorsUrl);
  const descriptors = await descriptorsRes.json();

  const globalRes = await fetch(globalUrl);
  const global = await globalRes.json();

  // Return the fetched data as props
  return {
      testimonials,
      disciplines,
      descriptors,
      global
  };
}
