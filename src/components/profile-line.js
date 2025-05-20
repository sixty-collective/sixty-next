import React from "react"
import Link from "next/link"
import Image from "next/image"

const ProfileLine = ({ profile, index }) => {
  if (profile.attributes) {
    profile = profile.attributes
  }

  const colorIndex = index % 7
  function defaultProfileImage() {
    switch (colorIndex) {
      case 0:
        return (<Image width={50} height={50} src="/images/Avatar_ProfilePic_Pink.jpg"
        alt="default profile picture image"
        className="profile-icon  border-2 border-black">
        </Image>);
      case 1:
        return (<Image width={50} height={50} src="/images/Avatar_ProfilePic_Purple.jpg"
        alt="default profile picture image"
        className="profile-icon  border-2 border-black">
        </Image>);
      case 2:
        return (<Image width={50} height={50} src="/images/Avatar_ProfilePic_Green.jpg"
        alt="default profile picture image"
        className="profile-icon  border-2 border-black">
        </Image>);
      case 3:
        return (<Image width={50} height={50} src="/images/Avatar_ProfilePic_Orange.jpg"
        alt="default profile picture image"
        className="profile-icon  border-2 border-black">
        </Image>);
      case 4:
        return (<Image width={50} height={50} src="/images/Avatar_ProfilePic_Blue.jpg"
        alt="default profile picture image"
        className="profile-icon  border-2 border-black">
        </Image>);
      case 5:
        return (<Image width={50} height={50} src="/images/Avatar_ProfilePic_Yellow.jpg"
        alt="default profile picture image"
        className="profile-icon  border-2 border-black">
        </Image>);
      default:
        return (<Image width={50} height={50} src="/images/Avatar_ProfilePic_Grey.jpg"
        alt="default profile picture image"
        className="profile-icon  border-2 border-black">
        </Image>);
  }}
  const availability = profile.availableForWork ? (
    <div className="rounded-full bg-green-500 w-3 h-3 border-2 border-black"></div>
  ) : (
    <div className="rounded-full bg-red-500 w-3 h-3 border-2 border-black"></div>
  )

  function disciplinesSection() {
    if (profile.disciplines) {
      if (profile.disciplines.data) {
        return profile.disciplines.data.map((discipline, index) => {
          return (
            <span
              className="text-xs mr-2 rounded-full px-1 bg-white font-fira border-black border inline-block"
              key={index}
            >
              {discipline.attributes.name}
            </span>
          )
        })
      } else {
        return profile.disciplines.map((discipline, index) => {
          return (
            <span
              className="text-xs mr-2 rounded-full px-1 bg-white font-fira border-black border inline-block"
              key={index}
            >
              {discipline.name}
            </span>
          )
        })
      }
    } else {
      return <div></div>
    }
  }

  function descriptorsSection() {
    if (profile.descriptors) {
      if (profile.descriptors.data) {
        return profile.descriptors.data.map((descriptor, index) => {
          return (
            <span
              className="text-xs mr-2 rounded-full px-1 bg-white font-fira border-black border inline-block"
              key={index}
            >
              {descriptor.attributes.name}
            </span>
          )
        })
      } else {
        return profile.descriptors.map((descriptor, index) => {
          return (
            <span
              className="text-xs mr-2 rounded-full px-1 bg-white font-fira border-black border inline-block"
              key={index}
            >
              {descriptor.name}
            </span>
          )
        })
      }
    } else {
      return <div></div>
    }
  }

  function profilePicture() {
    if (profile?.profilePicture?.localFile) {
      return (
        <Image
          width={50}
          height={50}
          image={getImage(profile?.profilePicture?.localFile)}
          alt={profile?.profilePicture?.alternativeText || "alt text not provided"}
          className="profile-icon border-2 border-black"
        />
      )
      
    } else if (profile.profilePicture?.url) {
      return (
        <Image
          width={50}
          height={50}
          src={profile?.profilePicture.url}
          alt={profile?.profilePicture?.alternativeText || "alt text not provided"}
          className="profile-icon border-2 border-black"
        />
      )
    } else {
      return (
      defaultProfileImage()
      )
    }
  }

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
