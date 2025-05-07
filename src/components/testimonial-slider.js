"use client"

import React from "react";
import Slider from "react-slick";
import Link from 'next/link';

const TestimonialSlider = ({ testimonials }) => {
  function PreviousArrow(props) {
    const { onClick } = props
    return (
      <div
        className="bg-white border-black border-2 w-8 h-8 md:w-10 md:h-10 font-fira rounded-full text-md md:text-2xl font-bold cursor-pointer absolute top-1/2 -translate-y-1/2 -left-10 md:-left-20 flex items-center justify-center"
        onClick={onClick}
      >&lt;</div>
    )
  }

  function NextArrow(props) {
    const { onClick } = props
    return (
      <div
        className="bg-white border-black border-2 w-8 h-8 md:w-10 md:h-10 font-fira rounded-full text-md md:text-2xl font-bold cursor-pointer absolute top-1/2 -translate-y-1/2 -right-10 md:-right-20 flex items-center justify-center"
        onClick={onClick}
      >&gt;
      </div>
    )
  }


  function testimonyName(testimony) {
    if (testimony.name.length > 1) {
      return <div className="pt-5 font-medium">{testimony.name}</div>
    }
  }

  return (
  <div className="w-full flex items-center justify-center bg-purple py-10 md:py-20">
          <div className="w-3/4 md:w-1/2"> 
            <Slider
              dots={false}
              infinite={true}
              lazyLoad={true}
              speed={300}
              arrows={true}
              swipeToSlide={true}
              slidesToScroll={1}
              centerMode={false}
              adaptiveHeight={false}
              fade={true}
              mobileFirst={true}
              nextArrow={<NextArrow />}
              prevArrow={<PreviousArrow />}
            >
              {testimonials.data.map((testimonial, index) => (
                <div
                className="flex"
                key={index}
              >
                <div className="flex content m-5 border-black border-2 rounded-3xl bg-white p-5 font-fira text-center">
                  <div className="">
                  <div>{testimonial.body}</div>
                  {testimonyName(testimonial)}
                  </div>
                </div>
              </div>
              ))}
            </Slider>
            <div className="text-center pt-10">
                <Link className="underline font-bold" href="/testimonials">Submit a Testimonial</Link>
            </div>
          </div>
        </div>
  )
}

export default TestimonialSlider
