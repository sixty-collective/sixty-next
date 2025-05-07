"use client"

import React from "react"
import Image from "next/image"
import Slider from "react-slick"
import Script from 'next/script'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faLink } from "@fortawesome/free-solid-svg-icons"
// import axios from "axios"

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
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{ ...style, left: "10px", zIndex: "10" }}
        onClick={onClick}
      />
    )
  }

  function NextArrow(props) {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        style={{ ...style, right: "10px" }}
        onClick={onClick}
      />
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
        <button className={`rounded-full sixty-color-${colorIndex} hover:opacity-70 px-2 py-1 flex items-center line-clamp-1`}>
          <i className="faLink" />{" "}
          <span className="ml-2 line-clamp-1 underline">{data.link}</span>
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
            frameborder="0"
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
          {data.images.map(file => (
            <Image
              key={file.id}
              src={file.url}
              alt={file.alternativeText}
              width={500}
              height={500}
            />
          ))}
        </Slider>
      )
    } else {
      <div></div>
    }
  }

  return (
    <div className="card bg-white rounded-3xl border-black border-2">
      <div className="card-header border-b-2 border-black pt-5 pb-3 flex justify-center items-center flex-wrap	">
        {disciplinesSection()}
      </div>
      {mediaSection()}
      <div className="p-10">
        <p className="font-medium poppins pb-4 text-2xl">{data.name}</p>
        <p className="pb-4">{data.description}</p>
        {dataLink()}
      </div>
    </div>
  )
}

export default BlockWorkSample;
