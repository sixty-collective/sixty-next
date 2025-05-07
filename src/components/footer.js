import Link from 'next/link';
import React from "react"
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="mt-16 py-8 flex justify-center">
      <Link href="/" className="text-xl font-medium p-4">
        <Image alt="" width="50" height="50" className="" src="/images/footer-logo.png" />
      </Link>
    </footer>
  )
}

export default Footer
