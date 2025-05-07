import React from "react";
import Image from "next/image";

const PageBlockImage = ({ data }) => {
  return (
    <div className="py-8">
      <Image
        image={getImage(data.image.localFile)}
        alt={data.image.alternativeText}
      />
    </div>
  )
}

export default PageBlockImage
