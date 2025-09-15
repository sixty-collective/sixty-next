"use client"

import { useEffect, useState, use } from "react";
import BlockWorkSample from "@/components/block-work-sample"
// import { i class "rom "@fortawesome/react-fontawes"me"
import Image from "next/image"
// import scrollTo from 'gatsby-plugin-smoothscroll';

// import {
//   faDesktop,
//   faGlobe,
//   faLocationDot,
//   faArrowLeft,
// } from "@fortawesome/free-solid-svg-icons"

const ProfilePage = (props: { params: Promise<{ slug: string }> }) => {
  const params = use(props.params);
  const { slug } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState({name: "", id: "", bio: "", pronouns: "", profilePicture: {url: "", alternativeText: ""}, location: "", workStyleBio: "", pastWork: "", gigsSeeking: "", availableForWork: "", instagramHandle: "", twitterHandle: "", website: "", secondaryWebsite: "", disciplines: [{name: ""}], descriptors: [{name: ""}], workSamples: []});
  const [allProfiles, setAllProfiles] = useState([{name: "", id: ""}]);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const getData = async () => {
      try {
        const allProfilesUrl = `https://sixty-backend-new.onrender.com/api/profiles?fields=name&pagination[pageSize]=200&sort[0]=name`
        const allProfilesRes = await fetch(allProfilesUrl);
        const profiles = await allProfilesRes.json();
        setAllProfiles(profiles.data)
      } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
              throw error;
          }
      } finally {
        setLoading(false);
      }
      if (slug) {
        try {
          const profilesUrl = `https://sixty-backend-new.onrender.com/api/profiles?filters[slug][$eq]=${slug}&populate[0]=disciplines&populate[1]=descriptors&populate[2]=profilePicture&populate[3]=workSamples&populate[4]=workSamples.work_sample_disciplines&populate[5]=workSamples.images`
          const profilesRes = await fetch(profilesUrl);
          const profile = await profilesRes.json();
          setProfile(profile.data[0])
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
              throw error;
          }
        } finally {
          setLoading(false);
        }
      }
    }
    getData();
    }, [slug])

  const handleToggle = () => {
    // if (visible) {
    //   scrollTo('#contact')
    // } else {
    //   scrollTo('#profile')
    // }
    setVisible(current => !current)
  }
  const colorIndex = Math.floor(Math.random() * 7)

  const availability = profile.availableForWork
    ? "Available for hire"
    : "Unavailable for hire"

  const availabilityColor = profile.availableForWork ? (
    <div className="rounded-full bg-green-500 w-3 h-3 border-2 border-black inline-block mr-2"></div>
  ) : (
    <div className="rounded-full bg-red-500 w-3 h-3 border-2 border-black inline-block mr-2"></div>
  )

  function contactText() {
    if (visible) {
      return "PROFILE"
    } else {
      return "CONTACT"
    }
  }

  function instagramIcon() {
    if (profile.instagramHandle) {
      return (
      <a
        target="_blank" rel="noreferrer"
        className="hover:opacity-50 px-2	"
        href={"https://instagram.com/" + profile.instagramHandle}
      >
      <Image width={50} height={50}
        alt=""
        className="w-6"
        src="/images/instagram-black.svg"
      />
      </a>
      )
    }
  }

  function twitterIcon() {
    if (profile.twitterHandle?.length > 1) {
      return (
        <a
          target="_blank" rel="noreferrer"
          className="hover:opacity-50 px-2	"
          href={"https://x.com/" + profile.twitterHandle}
        >
        <Image width={50} height={50} alt="" className="w-6 h-6" src="/images/x-twitter-black.svg" />
        </a>
      )
    }
  }

  function primaryWebsite() {
    if (profile.website?.length > 1) {
      return (
        <a target="_blank" rel="noreferrer" className="hover:opacity-50 px-2 text-2xl" href={profile.website}>
          <Image width={50} height={50}
            alt=""
            className="w-6"
            src="/images/globe.svg"
          />
        </a>
      )
    }
  }

  function secondaryWebsite() {
    if (profile.secondaryWebsite) {
      return (
        <a target="_blank" rel="noreferrer" className="hover:opacity-50 px-2 text-2xl" href={profile.secondaryWebsite}>
          <Image width={50} height={50}
            alt=""
            className="w-6"
            src="/images/globe2.svg"
          />
        </a>
      )
    }
  }

  function disciplinesSection() {
    if (profile.disciplines?.length > 0) {
      return profile.disciplines.map(discipline => {
        return (
          <span key={discipline.name} className="text-center line-clamp-1 text-xs mr-2 rounded-full px-1 bg-white font-fira border-black border inline-block">
            {discipline.name}
          </span>
        )
      })
    } else {
      return <div></div>
    }
  }

  function descriptorsSection() {
    if (profile.descriptors?.length > 0) {
      return profile.descriptors.map(descriptor => {
        return (
          <span key={descriptor.name} className="text-center line-clamp-1 text-xs mr-2 rounded-full px-1 bg-white font-fira border-black border inline-block">
            {descriptor.name}
          </span>
        )
      })
    } else {
      return <div></div>
    }
  }

  function allProfilesOptions() {
    if (allProfiles.length > 0) {
      return allProfiles.map((profileOption) => {
        if (profileOption.name == profile.name) {
          return (
            <option selected key={profileOption.id} value={profileOption.name}>{profileOption.name}</option>
          )
        } else {
          return (
            <option key={profileOption.id} value={profileOption.name}>{profileOption.name}</option>
          )
        }
      })
    }
  }

  function mainProfileSection() {
    if (visible) {
      return (
        <div className="main-content col-span-3 pt-5 lg:p-5 mt-10 lg:mt-0 relative">
          <div
            className="hidden md:absolute -top-5 left-5 z-10 cursor-pointer hover:underline"
            onClick={handleToggle}
          >
            <i className="faArrowLeft" /> Back to Proile
          </div>
          <div id="contact" className="card bg-white rounded-3xl border-black border-2">
            <div className="card-header border-b-2 border-black p-5 flex justify-center items-center">
              <h2 className="text-xl font-bold">Contact a Sixty Collective Member</h2>
            </div>
            <form
              id="fs-frm"
              name="sixty-contact-form"
              acceptCharset="utf-8"
              action="https://formspree.io/f/mblrebdn"
              method="post"
              className="pb-10"
            >
              <fieldset id="fs-frm-inputs" className="flex flex-col p-10">
                <label htmlFor="full-name" className="mb-2">
                  Your Name*
                </label>
                <input
                  type="text"
                  name="name"
                  id="full-name"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="email" className="mt-10 mb-2">
                  Your Email*
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="member" className="mt-10 mb-2">
                  Who are you contacting?*
                </label>
                <select className="bg-gray-200 rounded-lg p-2" name="member">
                  {allProfilesOptions()}
                </select>
                <label htmlFor="statement" className="mt-10 mb-2">
                  Write a brief statement about yourself and/or the collective,
                  project, or organization you are affiliated with.*
                </label>
                <textarea
                  rows={5}
                  name="statement"
                  id="statement"
                  required
                  defaultValue={""}
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="seeking" className="mt-10 mb-2">
                  Tell us about the skills or services you're looking for and
                  any relevant gig information. Are there specific skill sets,
                  experiences, or backgrounds you're seeking?*
                </label>
                <textarea
                  rows={5}
                  name="seeking"
                  id="seeking"
                  required
                  defaultValue={""}
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="timeframe" className="mt-10 mb-2">
                  When do you need to have this job filled by? (Date,
                  Timeframe)*
                </label>
                <textarea
                  rows={5}
                  name="timeframe"
                  id="timeframe"
                  required
                  defaultValue={""}
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="materials" className="mt-10 mb-2">
                  Please share any relevant links, websites or materials that
                  would help us to better understand the job, your work, and/or
                  your organization's work?*
                </label>
                <textarea
                  rows={5}
                  name="materials"
                  id="materials"
                  required
                  defaultValue={""}
                  className="bg-gray-200 rounded-lg p-2"
                />
                <>
                  <div className="mt-10 mb-2">What is the budget for this project?*</div>
                  <div className="flex mt-5">
                    <input
                      type="radio"
                      id="0-500"
                      name="budget"
                      defaultValue="0-500"
                      className="mr-3 bg-gray-200"
                    />
                    <label htmlFor="0-500">$0-$500</label>
                  </div>
                  <div className="flex mt-2">
                    <input
                      type="radio"
                      id="500-1000"
                      name="budget"
                      defaultValue="500-1000"
                      className="mr-3 bg-gray-200"
                    />
                    <label htmlFor="500-1000">$500-$1,000</label>
                  </div>
                  <div className="flex mt-2">
                    <input
                      type="radio"
                      id="1000-5000"
                      name="budget"
                      defaultValue="1000-5000"
                      className="mr-3 bg-gray-200"
                    />
                    <label htmlFor="1000-5000">$1,000-$5,000</label>
                  </div>
                  <div className="flex mt-2">
                    <input
                      type="radio"
                      id="5000+"
                      name="budget"
                      defaultValue="5000+"
                      className="mr-3 bg-gray-200"
                    />
                    <label htmlFor="5000+">$5,000+</label>
                  </div>
                </>

                <label htmlFor="interest" className="mt-10 mb-2">
                  Why are you interested in working with this artist?*
                </label>
                <textarea
                  rows={5}
                  name="interest"
                  id="interest"
                  required
                  defaultValue={""}
                  className="bg-gray-200 rounded-lg p-2"
                />
                <input
                  type="hidden"
                  name="_subject"
                  id="email-subject"
                  defaultValue="Contact Form Submission"
                />
              </fieldset>
              <div className="text-center">
                <input
                  className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
            </form>
          </div>
        </div>
      )
    } else {
      return (
        <div id="profile" className="main-content col-span-3 pt-5 lg:p-5 mt-10 lg:mt-0 relative">
          <div
            className="hidden md:absolute -top-5 left-5 z-10 cursor-pointer hover:underline"
            // onClick={back}
          >
            <i className="faArrowLeft" /> Back to Member Profiles
          </div>
          <div className="card bg-white rounded-3xl border-black border-2">
            <div className="px-10 py-10">
              <p className="font-bold mb-2">Something you should know about me</p>
              <p className="mb-6">{profile.bio}</p>
              <p className="font-bold mb-2">
                About my work, unique skills, and the types of environments I thrive in
              </p>
              <p className="mb-6">{profile.workStyleBio}</p>
              <p className="font-bold mb-2">Projects, people, and/or organizations I’ve worked with</p>
              <p className="mb-6">{profile.pastWork}</p>
              <p className="font-bold mb-2">
                Gigs and opportunities I'm open to
              </p>
              <p>{profile.gigsSeeking}</p>
            </div>
          </div>
          <div className="mt-12">
            <h2 className="text-3xl font-bold">Work Samples</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-1 lg:grid-cols-1">
              {profile.workSamples?.map(sample => (
                <BlockWorkSample key={sample} data={sample} colorIndex={colorIndex} />
              ))}
            </div>
          </div>
        </div>
      )
    }
  }

  function defaultProfileImage() {
    switch (colorIndex) {
      case 0:
        return (<Image width={50} height={50} src={"/images/Avatar_ProfilePic_Pink.jpg"}
        alt="default image"
        className="profile-picture  border-2 border-black">
        </Image>);
      case 1:
        return (<Image width={50} height={50} src={"/images/Avatar_ProfilePic_Purple.jpg"}
        alt="default image"
        className="profile-picture  border-2 border-black">
        </Image>);
      case 2:
        return (<Image width={50} height={50} src={"/images/Avatar_ProfilePic_Green.jpg"}
        alt="default image"
        className="profile-picture  border-2 border-black">
        </Image>);
      case 3:
        return (<Image width={50} height={50} src={"/images/Avatar_ProfilePic_Orange.jpg"}
        alt="default image"
        className="profile-picture  border-2 border-black">
        </Image>);
      case 4:
        return (<Image width={50} height={50} src={"/images/Avatar_ProfilePic_Blue.jpg"}
        alt="default image"
        className="profile-picture  border-2 border-black">
        </Image>);
      case 5:
        return (<Image width={50} height={50} src={"/images/Avatar_ProfilePic_Yellow.jpg"}
        alt="default image"
        className="profile-picture  border-2 border-black">
        </Image>);
      default:
        return (<Image width={50} height={50} src={"/images/Avatar_ProfilePic_Grey.jpg"}
        alt="default image"
        className="profile-picture  border-2 border-black">
        </Image>);
  }}

  function profilePicture() {
    if (profile?.profilePicture) {
      return (
        <Image
          width={50}
          height={50}
          src={profile.profilePicture.url}
          alt={profile.profilePicture.alternativeText}
          className="profile-picture border-2 border-black"
        />
      )
    } else {
      return (
      defaultProfileImage()
      )
    }
  }

  return (
    <div>
    {!loading && !error && (
    <div>
      <main className="flex flex-col-reverse mt-8 lg:grid lg:grid-cols-4 lg:gap-3 lg:p-20 container">
        {mainProfileSection()}
        <div className="side-content flex flex-col col-span-1 lg:p-5">
          <div
            className={`sixty-color-${colorIndex} p-8 flex flex-col justify-center items-center border-2 rounded-2xl border-black`}
          >
            {profilePicture()}
            
            <div className="pt-2 name-card flex justify-center items-center flex-col">
              <h1 className="text-lg font-medium poppins text-neutral-700 text-center">
                {profile.name}
              </h1>
              <div className="mt-2 text-sm text-neutral-700">
                {profile.pronouns}
              </div>
              <div className="mt-2 text-sm text-neutral-700 rounded-full bg-white border-2 border-black px-2 flex items-center">
                <Image width={10} height={10}
                  alt=""
                  className="w-3"
                  src="/images/location.svg"
                />
                <span className="ml-1">{profile.location}</span>
              </div>
              <div className="mt-2 text-sm text-neutral-700 rounded-full bg-white border-2 border-black px-2 flex items-center">
                {availabilityColor}
                {availability}
              </div>
            </div>
          </div>
          <button
            onClick={handleToggle}
            disabled={!profile.availableForWork}
            className="disabled:opacity-25 font-bold text-xl bg-slate-900 width-full text-white py-3 px-5 mt-5 rounded-full"
          >
            {contactText()}
          </button>
          <div className="mt-5 card bg-white rounded-3xl border-black border-2 p-4 overflow-clip text-center">
            {disciplinesSection()}{descriptorsSection()}
          </div>
          <div className="mt-5 card bg-white rounded-3xl border-black border-2 p-5 overflow-clip break-words justify-center	hyphens-auto items-center	flex line-clamp-1">
              {primaryWebsite()}
              {secondaryWebsite()}
              {instagramIcon()}
              {twitterIcon()}
          </div>
        </div>
      </main>
    </div>
     )}
    </div>
  )
}


export default ProfilePage;
