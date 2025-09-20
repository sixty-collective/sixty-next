"use client"

import React from "react"
import Image from "next/image"
import Slider from "react-slick"
import Script from 'next/script'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const BlockWorkSample = ({ data, colorIndex }) => {
  let soundcloudEmbed = ""

  function disciplinesSection() {
    if (data.work_sample_disciplines.length > 0) {
      return data.work_sample_disciplines.map((discipline, index) => {
        return (
          <span key={index} className="text-center text-xs mr-2 mb-2 rounded-full px-1 bg-white font-fira border-black border inline-block">
            {discipline.name}
          </span>
        )
      })
    } else {
      return <div></div>
    }
  }

  function PreviousArrow(props) {
    const { onClick } = props
    return (
      <div
        className="z-10 bg-white border-black border-2 w-8 h-8 font-fira rounded-full text-md font-bold cursor-pointer absolute top-1/2 -translate-y-1/2 left-5 md:left-5 flex items-center justify-center"
        onClick={onClick}
      >&lt;</div>
    )
  }

  function NextArrow(props) {
    const { onClick } = props
    return (
      <div
        className="bg-white border-black border-2 w-8 h-8 font-fira rounded-full text-md font-bold cursor-pointer absolute top-1/2 -translate-y-1/2 right-5 md:right-5 flex items-center justify-center"
        onClick={onClick}
      >&gt;
      </div>
    )
  }

  function fetchSoundcloud(url) {
    var settings = {
      "url": url,
      "headers": {"Access-Control-Allow-Origin": "*"},
      "format": "json",
    }
    
    axios.get("https://soundcloud.com/oembed", settings).then(function (response) {
      if (response) {
        setSoundcloudEmbed(response.data["html"])
      }
    });
  }

  function dataLink() {
    if (data.link) {
      return (
      <a target="_blank" rel="noreferrer" className="flex justify-left" href={data.link}>
        <button className={`rounded-full line-clamp-1 sixty-color-${colorIndex} hover:opacity-70 px-2 py-1 flex items-center`}>
          <Image width={30} height={30}
            alt=""
            className="w-4"
            src="/images/link.svg"
          />
          <span className="ml-2 line-clamp-1 underline text-left">{data.link}</span>
        </button>
      </a>
      )
    }
  }

  function mediaSection() {
    if (!!data.embed && data.embedLink?.includes("vimeo")) {
      const vimeoLink = data.embedLink?.match(/[^/]+$/g)
      return (
        <div>
          <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
            <iframe
              src={"https://player.vimeo.com/video/" + vimeoLink}
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <Script src="https://player.vimeo.com/api/player.js"></Script>
        </div>
      )
    } else if (!!data.embed && (data.embedLink?.includes("youtube") || data.embedLink?.includes("youtu.be"))) {
      const youTubeLink = data.embedLink?.match(/[^/=]+$/g)
      return (
        <div>
          <iframe
            className="aspect-video	w-full"
            src={"https://www.youtube.com/embed/" + youTubeLink}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      )
    } else if (!!data.embed && data.embedLink?.includes("soundcloud")) {
      fetchSoundcloud(data.embedLink)
      
      return (
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  soundcloudEmbed,
              }}
            />
          </div>
      )
    } else if (data.images) {
      if (data.images.length == 1) {
        return (
          <Slider
            dots={false}
            infinite={true}
            speed={300}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={false}
            fade={true}
            swipe={false}
            adaptiveHeight={true}
            nextArrow={<NextArrow />}
            prevArrow={<PreviousArrow />}
          >
            {data.images.map(file => {
              if (file.ext == ".pdf") {
                return (
                  <embed
                  className="h-[500px]"
                  key={file.id}
                  type='application/pdf'
                  src={file.url}
                  />
                )
              } else {
                return (
                  <Image
                    key={file.id}
                    src={file.url}
                    alt={file.alternativeText}
                    width={500}
                    height={500}
                    className="max-h-[600px] object-contain"
                  />
                )
              }
            })}
          </Slider>
          )
      } else {
        return (
          <Slider
            dots={true}
            infinite={true}
            speed={300}
            slidesToShow={1}
            slidesToScroll={1}
            arrows={true}
            fade={true}
            swipe={true}
            adaptiveHeight={true}
            nextArrow={<NextArrow />}
            prevArrow={<PreviousArrow />}
          >
            {data.images.map(file => {
              if (file.ext == ".pdf") {
                return (
                  <embed
                  className="h-[500px]"
                  key={file.id}
                  type='application/pdf'
                  src={file.url}
                  />
                )
              } else {
                return (
                  <Image
                    key={file.id}
                    src={file.url}
                    alt={file.alternativeText}
                    width={500}
                    height={500}
                    className="max-h-[600px] object-contain"
                  />
                )
              }
            })}
          </Slider>
        )
      }
    } else {
      <div></div>
    }
  }

  return (
    <div className="card bg-white rounded-3xl border-black border-2">
      <div className="card-header border-b-2 border-black pt-5 pb-3 flex justify-center items-center flex-wrap	">
        {disciplinesSection()}
      </div>
      <div className="bg-black">{mediaSection()}</div>
      <div className="p-10">
        <p className="font-medium poppins pb-4 text-2xl">{data.name}</p>
        <p className="pb-4">{data.description}</p>
        {dataLink()}
      </div>
    </div>
  )
}

export default BlockWorkSample;
