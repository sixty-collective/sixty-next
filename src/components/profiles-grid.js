import React from "react"
// import { graphql } from "gatsby"
// import axios from "axios"
import InfiniteScroll from 'react-infinite-scroll-component';

import ProfileCard from "./profile-card"

function fetchData() {
  console.log("fetch more")
}

const ProfilesGrid = ({ profiles }) => {
  if (profiles.length === 0) {
    <div>
    <div className="container py-10">
      <p>
      Unfortunately, there are no profiles that match your search requirements. We are regularly updating our database with more members, so please check back again soon. 
      </p>
    </div>
    </div>
  } else {
    return (
      <div>
        <InfiniteScroll
          dataLength={profiles.length} //This is important field to render the next data
          next={fetchData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
              <div className="container py-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {profiles.map((profile, index) => (
            
            <ProfileCard profile={profile} key={index} index={index} />
          ))}
        </div>
        </InfiniteScroll>
      </div>
    )
  }
}

export default ProfilesGrid
