import React from "react"
import Image from "next/image"

const BlockMedia = ({ data }) => {
  const isVideo = data.file.mime.startsWith("video")

  return (
    <div className="py-8">
      {isVideo ? (
        <p>TODO video</p>
      ) : (
        <Image
          image={getImage(data.file.localFile)}
          alt={data.file.alternativeText}
        />
      )}
    </div>
  )
}

export default BlockMedia
