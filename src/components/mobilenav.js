"use client"

import Link from "next/link"
import React, {useState, useEffect} from "react"
import Image from "next/image"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import {
//   faBars,
// } from "@fortawesome/free-solid-svg-icons"



const MobileNav = ({ sidebarText }) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (open) {
      document.body.style.position = 'initial';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = 'relative';
      document.body.style.overflow = 'auto';
    }
  },[open])
  const handleClick = (e) => {
    e.preventDefault();
    setOpen(!open);
  }
  return (
    <header className="flex justify-between items-center w-full lg:hidden text-black lg:w-48 lg:h-full shadow-2xl">
      <Link href="/" className="text-xl font-bold p-4 w-40 z-50">
        <Image width={50} height={50} alt="" className="" src="/images/logo.png" />
      </Link>
      <button className="z-50" onClick={handleClick}>
        {/* <FontAwesomeIcon className="p-4 text-3xl" icon={faBars} /> */}
      </button>
      <nav className={"" + (open ? 'overflow-scroll flex flex-col absolute items-baseline justify-start bg-[#F7F4F0] h-full w-full top-0 z-40' : 'hidden')}>
        <div className="block p-10"></div>
        <div className="flex grow flex-col items-baseline justify-center w-full text-2xl text-black p-5 border-y-2 border-black">
          <Link
            className="pb-2 font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/profiles"
          >
            Member Profiles{" "}
            
          </Link>
          <Link
            className="py-2 font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/resources"
          >
            Knowledge Share
            
          </Link>
          <Link
            className="py-2 font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/about"
          >
            About Us
            
          </Link>
          <Link
            className="py-2 font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/support"
          >
            Support Sixty
            
          </Link>
          <Link
            className="pt-2 font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/faq"
          >
            FAQ
            
          </Link>
        </div>
        <div className="p-5 w-full">
          {/* <p className="text-sm">{sidebarText}</p> */}
          <p className="text-md lg:text-2xl pb-2">
          Paid opportunities, grants, residencies, and more sent to your inbox.
          </p>
          <a href="/sign-up">
          <button className="rounded-full text-black text-lg lg:text-xl px-2 py-2 lg:py-4 mt-5 border-2 border-black w-full hover:bg-black hover:text-[#F7F4F0]">
            Sign Me Up
          </button>

          </a>
        </div>
        <div className="flex flex-col items-baseline justify-end w-full text-black p-5 border-y-2 border-black">
          <Link
            className="uppercase text-lg py-2 w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/member"
          >
            Become a Member
            
          </Link>
          <Link
            className="uppercase text-lg py-2 w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/community-agreements"
          >
            Community Agreements
            
          </Link>
          <Link
            className="uppercase text-xs py-1 w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/hiring-tools-tips"
          >
            Hiring Tools + Tips
            
          </Link>
          <Link
            className="uppercase text-lg py-2 w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/testimonials"
          >
            Testimonials
            
          </Link>
          <Link
            className="uppercase text-lg py-2 border-black w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/contact"
          >
            Contact Us
            
          </Link>
        </div>
          <div className="pt-5 pb-3 flex justify-center items-center w-full border-b-2 border-black">
          <div className="p-2">
            <Link href="/" className="text-xl font-bold">
              <Image width={50} height={50} alt="" className="w-10 h-10" src="/images/instagram-black.svg" />
            </Link>
            <Link href="/" className="text-xl font-bold  ml-5">
              <Image width={50} height={50} alt="" className="w-10 h-10" src="/images/x-twitter-black.svg" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default MobileNav
