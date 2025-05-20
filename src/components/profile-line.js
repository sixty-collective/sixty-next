import React from "react"
import Link from "next/link"

const ProfileLine = ({ profile, index }) => {
  if (profile.attributes) {
    profile = profile.attributes
  }

  const colorIndex = index % 7

  return (
    <Link
      href={`/profiles/${profile.slug}`}
      className={`z-10 bg-white rounded-3xl border-black border-2 overflow-hidden rounded-xxl bg-white shadow-sm transition-shadow hover:shadow-md hover:drop-shadow-2xl`}
    >
      <div className="">
        <div
          className={`flex card-header border-black px-5 py-3 justify-left items-center sixty-color-${colorIndex}`}
        >
          <div className="flex flex-row ml-3">
            <div className="flex items-center">
              <h3 className="font-medium poppins text-black mr-2 text-left leading-tight" >{profile.name}</h3>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

// export const query = graphql`
//   fragment ProfileLine on STRAPI_PROFILE {
//     id
//     slug
//     name
//     bio
//     profilePicture {
//       localFile {
//         childImageSharp {
//           gatsbyImageData
//         }
//       }
//     }
//     availableForWork
//     location
//     disciplines {
//       name
//     }
//     descriptors {
//       name
//     }
//     workSamples {
//       name
//       link
//       description
//       images {
//         id
//         mime
//         localFile {
//           childImageSharp {
//             gatsbyImageData
//           }
//         }
//       }
//       work_sample_disciplines {
//         name
//       }
//       embed
//       embedLink
//     }
//   }
// `

export default ProfileLine
