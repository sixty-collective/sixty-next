import Script from 'next/script'
import Link from 'next/link'
import React from "react"
import Image from "next/image"

const Navbar = () => {
  return (
    <header className="hidden md:block relative w-full md:fixed text-black md:w-52 md:h-full shadow-2xl border-r-2 border-black">
      <Script src="https://cdn.userway.org/widget.js" data-account="FDvSmHKPEz" />
      <nav className="flex flex-col items-baseline justify-between">
        <Link href="/" className="text-xl font-bold p-5 hover:opacity-50">
          <Image alt="" width={200} height={200} className="" src="/images/logo.png" />
        </Link>
        <div className="flex flex-col items-baseline justify-end w-full text-black p-5 border-y-2 border-black">
          <Link
            className="font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/profiles"
          >
            Member Profiles{" "}
            
          </Link>
          <Link
            className="font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/resources"
          >
            Knowledge Share
            
          </Link>
          <Link
            className="font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/about"
          >
            About Us
            
          </Link>
          <Link
            className="font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/support"
          >
            Support Sixty
            
          </Link>
          <Link
            className="font-bold w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/faq"
          >
            FAQ
            
          </Link>
        </div>
        <div className="p-5 w-full">
          <p className="text-sm">
          Paid opportunities, grants, residencies, and more sent to your inbox.
          </p>
          <a href="https://sixtyinchesfromcenter.us2.list-manage.com/subscribe?u=d2aa2358e3e7d016e0c842845&id=87d8eba843">
          <button className="rounded-full text-black text-sm px-2 py-1 mt-5 border-2 border-black w-full hover:bg-black hover:text-[#F7F4F0]">
            Subscribe
          </button>

          </a>
        </div>
        <div className="flex flex-col items-baseline justify-end w-full text-black p-5 border-y-2 border-black">
        <Link
            className="uppercase text-xs py-1 w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/member"
          >
            Become a Member
            
          </Link>
          <Link
            className="uppercase text-xs py-1 w-full hover:text-gray-600 flex items-center justify-between"
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
            className="uppercase text-xs py-1 w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/testimonials"
          >
            Testimonials
            
          </Link>
          <Link
            className="uppercase text-xs py-1 border-black w-full hover:text-gray-600 flex items-center justify-between"
            activeclassname="active underline"
            href="/contact"
          >
            Contact Us
            
          </Link>
        </div>
          <div className="pt-5 pb-3 flex justify-center items-center w-full border-b-2 border-black">
          <a
              target="_blank" rel="noreferrer"
              className="text-xl font-bold"
              href="https://www.instagram.com/sixtyinchesfromcenter/"
            >
              <Image alt="" width={50} height={50} className="w-6 h-6" src="../images/instagram-black.svg" />
              </a>
            <a
              target="_blank" rel="noreferrer"
              className="text-xl font-bold  ml-3"
              href="https://sixtyinchesfromcenter.org/"
            >
              <Image alt="" width={45} height={45} className="w-6 h-6" src="../images/globe.svg" />
              </a>
        </div>
        <div className="p-4 flex justify-center items-center w-full border-b-2 border-black">
          Sixty Collective is a network of artists, writers, and arts workers based in the Midwest.
        </div>
      </nav>
    </header>
  )
}

export default Navbar
