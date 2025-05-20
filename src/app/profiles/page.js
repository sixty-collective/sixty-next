'use client'; // add this part!

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Image from "next/image"
import InfiniteScroll from 'react-infinite-scroll-component';
// import { useStaticQuery, graphql } from "gatsby"
// import Layout from "../components/layout"
// import Seo from "../components/seo"
import Headings from "@/components/headings"
import ProfileLine from "@/components/profile-line"
import ProfileCard from "@/components/profile-card"


const IndexPage = () => {
    const [global, setGlobal] = useState({})
    const [input, setInput] = useState("")
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirectory, setIsDirectory] = useState(false);
    const [initial, setInitial] = useState(true)
    const [visible, setVisible] = useState([
      false,
      false,
      false,
      false,
      false,
      false,
    ])
    const [descriptorVisible, setDescriptorVisible] = useState([
      false,
      false,
      false,
      false,
    ])
    const [selectedDisciplines, setSelectedDisciplines] = useState([])
    const [disciplines, setDisciplines] = useState([])
    const [selectedDescriptors, setSelectedDescriptors] = useState([])
    const [descriptors, setDescriptors] = useState([])
    const [results, setResults] = useState([])
    const [totalLength, setTotalLength] = useState(0)
    const [listText, setListText] = useState("List")
    const [hasMore, setHasMore] = useState(true)
    const [checkedDisciplinesState, setCheckedDisciplinesState] = useState(
      []
    )
    const [checkedDescriptorsState, setCheckedDescriptorsState] = useState(
      []
    )
    const [openDisciplines, setOpenDisciplines] = React.useState(false)
    const [openDescriptors, setOpenDescriptors] = React.useState(false)

    const toggleDisciplines = () => {
      setOpenDisciplines(!openDisciplines)
      setOpenDescriptors(false)
    }
    const toggleDescriptors = () => {
      setOpenDescriptors(!openDescriptors)
      setOpenDisciplines(false)
    }
  
    const disciplinesCountSection = () => {
      if (selectedDisciplines.length > 0) {
        return <span className="mr-2">({selectedDisciplines.length})</span>
      } else {
        return <span className="mr-2"></span>
      }
    }
  
    const descriptorsCountSection = () => {
      if (selectedDescriptors.length > 0) {
        return <span className="mr-2">({selectedDescriptors.length})</span>
      } else {
        return <span className="mr-2"></span>
      }
    }

    const toggleDirectory = async () => {
      setIsDirectory(!isDirectory)
      if (isDirectory) {
        setListText("List")
      } else {
        setListText("Grid")
      }

      sendSearch(true, 100)
    }
  
    const sendSearch = async (resetPage, pageSize) => {
      let pageSizeNum = pageSize || 10
      setIsLoading(true);
      let url;
      if (resetPage) {
        url =
        "https://sixty-backend-new.onrender.com" +
        "/api/profiles?sort=name&pagination[pageSize]=" + pageSizeNum + "&pagination[page]=" + 1 + "&populate[0]=disciplines&populate[1]=descriptors&populate[2]=profilePicture"
      } else {
        url =
        "https://sixty-backend-new.onrender.com" +
          "/api/profiles?sort=name&pagination[pageSize]=" + pageSizeNum + "&pagination[page]=" + page + "&populate[0]=disciplines&populate[1]=descriptors&populate[2]=profilePicture"
      }
      
      if (selectedDescriptors.length > 0) {
        selectedDescriptors.forEach((selected, index) => {
          url = url.concat("&filters[$or][" + index + "][descriptors][slug][$in]=" + selected.slug)
        })
      }
  
      if (selectedDisciplines.length > 0) {
        selectedDisciplines.forEach((selected, index) => {
          url = url.concat("&filters[$or][" + index + "][disciplines][slug][$in]=" + selected.slug)
        })
      }

      if (input.length > 0) {
        url = url.concat("&filters[name][$containsi]=" + input)
      }

      try {
        await fetch(url).then(async response => {
          const responseJson = await response.json();
          setTotalLength(responseJson.meta.pagination.total)
          if (responseJson.meta.pagination.page == responseJson.meta.pagination.pageCount) {
            setHasMore(false)
          }
          if (resetPage) {
            setResults(responseJson.data)
            setPage(() => {
              return 2;
            });
          } else {
            setResults((prevResults) => {
              return [...prevResults, ...responseJson.data]
            })
            setPage((prevPage) => {
              return prevPage + 1;
            });
          }
        })
      } finally {
        setIsLoading(false);
      }
    }

    function fetchData() {
      console.log("fetch more")
      sendSearch();
    }

    useEffect(() => {
      async function getData() {
        // Fetch data from a hypothetical CMS API endpoint
        const disciplinesUrl = "https://sixty-backend-new.onrender.com/api/disciplines?populate[0]=discipline_category"
        const descriptorsUrl = "https://sixty-backend-new.onrender.com/api/descriptors?populate[0]=descriptor_category"
        const globalUrl = "https://sixty-backend-new.onrender.com/api/global"
        const profilesUrl = "https://sixty-backend-new.onrender.com/api/profiles?populate[0]=disciplines&populate[1]=descriptors&populate[2]=profilePicture"
  
      
        const disciplinesRes = await fetch(disciplinesUrl);
        const disciplinesData = await disciplinesRes.json();
        setDisciplines(disciplinesData.data)
        setCheckedDisciplinesState(new Array(disciplinesData.data.length).fill({status: false, discipline: ""}))
  
        const descriptorsRes = await fetch(descriptorsUrl);
        const descriptorsData = await descriptorsRes.json();
        setDescriptors(descriptorsData.data)
        setCheckedDescriptorsState(new Array(descriptorsData.data.length).fill({status: false, descriptor: ""}))
      
        const globalRes = await fetch(globalUrl);
        const globalJSON = await globalRes.json();
        setGlobal(globalJSON)
      
        const profilesRes = await fetch(profilesUrl);
        const profiles = await profilesRes.json();
        setTotalLength(profiles.meta.pagination.total)
        // setResults(profiles.data)
        setInitial(false)
      }
      getData();
    }, [initial])
  
    useEffect(() => {
      sendSearch(true)
    }, [selectedDisciplines, selectedDescriptors, input])
  
    const handleInputChange = e => {
      setInput(e.target.value)
    }
  
    const handleDisciplinesChange = (position, discipline) => {
      const updatedCheckedDisciplinesState = checkedDisciplinesState.map(
        (item, index) => {
          return (index === position ? {status: !item.status, discipline: discipline} : item)
        }
      )
      setCheckedDisciplinesState(updatedCheckedDisciplinesState)
    }
  
    const handleDescriptorsChange = (position, descriptor) => {
      const updatedCheckedDescriptorsState = checkedDescriptorsState.map(
        (item, index) => {
          return (index === position ? {status: !item.status, descriptor: descriptor} : item)
        }
      )
      setCheckedDescriptorsState(updatedCheckedDescriptorsState)
    }
  
    const Checkbox = ({ obj, check, checked, onChange }) => {
      return (
        <>
          <input
            type="checkbox"
            id={`custom-checkbox-${obj.slug}`}
            className={check}
            name={obj.name}
            value={obj.slug}
            checked={checked}
            onChange={onChange}
          />
          <span className="ml-2">{obj.name}</span>
        </>
      )
    }
  
    const handleDisciplinesApply = () => {
      const checkedBoxes = document.querySelectorAll(
        "input[class=disciplines-box]:checked"
      )
      const disciplinesFilters = Array.from(checkedBoxes).map(input => {
        return { name: input.name, slug: input.value }
      })
  
      setSelectedDisciplines(disciplinesFilters)
      toggleDisciplines()
    }
  
    const handleClearDisciplines = () => {
      setSelectedDisciplines([])
      toggleDisciplines()
      setCheckedDisciplinesState(
        new Array(disciplines.length).fill({status: false, discipline: ""})
      )
    }
  
    const handleClearSpecificDiscipline = (clearDiscipline) => {
      setSelectedDisciplines(selectedDisciplines.filter(function(discipline) { 
          return discipline !== clearDiscipline 
      }));
      let newArray = checkedDisciplinesState.map(function(discipline) { 
        if (discipline.slug !== clearDiscipline.slug) {
          return discipline
        } else {
          return {status: false, discipline: discipline}
        }
      })
      setCheckedDisciplinesState(newArray)
    }
  
    const handleClearSpecificDescriptor = (clearDescriptor) => {
      setSelectedDescriptors(selectedDescriptors.filter(function(descriptor) { 
          return descriptor !== clearDescriptor 
      }));
      let newArray = checkedDescriptorsState.map(function(descriptor) { 
        if (descriptor.descriptor.slug !== clearDescriptor.slug) {
          return descriptor
        } else {
          return {status: false, descriptor: descriptor.descriptor}
        }
      })
      setCheckedDescriptorsState(newArray)
    }
  
    const handleDescriptorsApply = () => {
      const checkedBoxes = document.querySelectorAll(
        "input[class=descriptors-box]:checked"
      )
      const descriptorsFilters = Array.from(checkedBoxes).map(input => {
        return { name: input.name, slug: input.value }
      })
  
      setSelectedDescriptors(descriptorsFilters)
      toggleDescriptors()
    }
  
    const handleClearDescriptors = () => {
      setSelectedDescriptors([])
      toggleDescriptors()
      setCheckedDescriptorsState(
        new Array(descriptors.length).fill({status: false, descriptor: ""})
      )
    }
  
    function fdisciplines() {
      let pDisciplines = []
      let vDisciplines = []
      let rDisciplines = []
      let wDisciplines = []
      let aDisciplines = []
      let lDisciplines = []
      disciplines.forEach(discipline => {
        if (discipline.discipline_category) {
          switch (discipline.discipline_category.slug) {
            case "performance":
              pDisciplines.push(discipline)
              return
            case "studio-arts":
              vDisciplines.push(discipline)
              return
            case "design-multimedia":
              rDisciplines.push(discipline)
              return
            case "archives-research":
              aDisciplines.push(discipline)
              return
            case "arts-professionalism":
              lDisciplines.push(discipline)
              return
            case "writing-publishing":
              wDisciplines.push(discipline)
              return
          }
        }
      })
      return (
        <div className="border-2 border-black rounded-2xl max-h-96 overflow-scroll bg-white">
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md	">
            <div
              className={
                visible[2] ? "overflow-none" : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Archives + Research</h2>
              <div className="flex flex-wrap mt-2">
                {aDisciplines.map((discipline, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={discipline}
                        index={index}
                        check="disciplines-box"
                        checked={
                          checkedDisciplinesState[
                            vDisciplines.length + wDisciplines.length + index
                          ].status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                            vDisciplines.length + wDisciplines.length + index, discipline
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setVisible([false, false, !visible[2], false, false, false])
              }
            >
              {visible[2] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md	">
            <div
              className={
                visible[4] ? "overflow-none" : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Arts Professionals</h2>
              <div className="flex flex-wrap mt-2">
                {lDisciplines.map((discipline, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={discipline}
                        index={index}
                        check="disciplines-box"
                        checked={
                          checkedDisciplinesState[
                            vDisciplines.length +
                              wDisciplines.length +
                              aDisciplines.length +
                              pDisciplines.length +
                              index
                          ].status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                            vDisciplines.length +
                              wDisciplines.length +
                              aDisciplines.length +
                              pDisciplines.length +
                              index, discipline
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setVisible([false, false, false, false, !visible[4], false])
              }
            >
              {visible[4] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md	">
            <div
              className={
                visible[0] ? "overflow-none" : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Studio Arts</h2>
              <div className="flex flex-wrap mt-2">
                {vDisciplines.map((discipline, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={discipline}
                        index={index}
                        check="disciplines-box"
                        checked={checkedDisciplinesState[index].status}
                        onChange={() => handleDisciplinesChange(index, discipline)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setVisible([!visible[0], false, false, false, false, false])
              }
            >
              {visible[0] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md	">
            <div
              className={
                visible[3] ? "overflow-none" : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Performance</h2>
              <div className="flex flex-wrap mt-2">
                {pDisciplines.map((discipline, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={discipline}
                        index={index}
                        check="disciplines-box"
                        checked={
                          checkedDisciplinesState[
                            vDisciplines.length +
                              wDisciplines.length +
                              aDisciplines.length +
                              index
                          ].status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                            vDisciplines.length +
                              wDisciplines.length +
                              aDisciplines.length +
                              index, discipline
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setVisible([false, false, false, !visible[3], false, false])
              }
            >
              {visible[3] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md">
            <div
              className={
                visible[5] ? "overflow-none" : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Design + Multimedia</h2>
              <div className="flex flex-wrap mt-2">
                {rDisciplines.map((discipline, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={discipline}
                        index={index}
                        check="disciplines-box"
                        checked={
                          checkedDisciplinesState[
                            vDisciplines.length +
                              wDisciplines.length +
                              pDisciplines.length +
                              aDisciplines.length +
                              lDisciplines.length +
                              index
                          ].status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                            vDisciplines.length +
                              wDisciplines.length +
                              pDisciplines.length +
                              aDisciplines.length +
                              lDisciplines.length +
                              index, discipline
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setVisible([false, false, false, false, false, !visible[5]])
              }
            >
              {visible[5] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 border-black max-w-md">
            <div
              className={
                visible[1] ? "overflow-none" : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Writing + Publishing</h2>
              <div className="flex flex-wrap mt-2">
                {wDisciplines.map((discipline, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={discipline}
                        index={index}
                        check="disciplines-box"
                        checked={
                          checkedDisciplinesState[vDisciplines.length + index].status
                        }
                        onChange={() =>
                          handleDisciplinesChange(vDisciplines.length + index, discipline)
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setVisible([false, !visible[1], false, false, false, false])
              }
            >
              {visible[1] ? "See less" : "See more"}
            </button>
          </div>
          <div className="flex border-t-2 border-black p-5 justify-between items-center">
            <a href="#" onClick={handleClearDisciplines}>
              Clear All
            </a>
            <button
              className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
              onClick={handleDisciplinesApply}
            >
              Apply
            </button>
          </div>
        </div>
      )
    }
  
    const disciplinesSection = () => {
      if (openDisciplines) {
        return <div className="absolute mt-3 z-20">{fdisciplines()}</div>
      } else {
        ;<span></span>
      }
    }
  
    function fdescriptors() {
      let cDescriptors = []
      let jDescriptors = []
      let aDescriptors = []
      let eDescriptors = []
      descriptors.forEach(descriptor => {
        if (descriptor.descriptor_category) {
          switch (descriptor.descriptor_category.slug) {
            case "culture-and-identity-alignment":
              cDescriptors.push(descriptor)
              return
            case "justice-organizing-labor":
              jDescriptors.push(descriptor)
              return
            case "area-of-focus-practice":
              aDescriptors.push(descriptor)
              return
            case "education":
              eDescriptors.push(descriptor)
              return
          }
        }
      })
      return (
        <div className="border-2 border-black rounded-2xl max-h-96 overflow-scroll bg-white">
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md	">
            <div
              className={
                descriptorVisible[0]
                  ? "overflow-none"
                  : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Culture & Identity Alignment</h2>
              <div className="flex flex-wrap mt-2">
                {cDescriptors.map((descriptor, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={descriptor}
                        index={index}
                        check="descriptors-box"
                        checked={checkedDescriptorsState[index].status}
                        onChange={() => handleDescriptorsChange(index, descriptor)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setDescriptorVisible([!descriptorVisible[0], false, false, false])
              }
            >
              {descriptorVisible[0] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md	">
            <div
              className={
                descriptorVisible[1]
                  ? "overflow-none"
                  : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Justice, Organizing, Labor</h2>
              <div className="flex flex-wrap mt-2">
                {jDescriptors.map((descriptor, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={descriptor}
                        index={index}
                        check="descriptors-box"
                        checked={
                          checkedDescriptorsState[cDescriptors.length + index].status
                        }
                        onChange={() =>
                          handleDescriptorsChange(cDescriptors.length + index, descriptor)
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setDescriptorVisible([false, !descriptorVisible[1], false, false])
              }
            >
              {descriptorVisible[1] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 pb-5 border-b-2 border-black max-w-md	">
            <div
              className={
                descriptorVisible[2]
                  ? "overflow-none"
                  : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Area of Focus</h2>
              <div className="flex flex-wrap mt-2">
                {aDescriptors.map((descriptor, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={descriptor}
                        index={index}
                        check="descriptors-box"
                        checked={
                          checkedDescriptorsState[
                            cDescriptors.length + jDescriptors.length + index
                          ].status
                        }
                        onChange={() =>
                          handleDescriptorsChange(
                            cDescriptors.length + jDescriptors.length + index, descriptor
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setDescriptorVisible([false, false, !descriptorVisible[2], false])
              }
            >
              {descriptorVisible[2] ? "See less" : "See more"}
            </button>
          </div>
          <div className="relative m-5 border-black max-w-md	">
            <div
              className={
                descriptorVisible[3]
                  ? "overflow-none"
                  : "overflow-hidden max-h-24"
              }
            >
              <h2 className="font-bold">Education</h2>
              <div className="flex flex-wrap mt-2">
                {eDescriptors.map((descriptor, index) => {
                  return (
                    <div className="w-1/2 text-xs items-center flex my-0.5" key={index}>
                      <Checkbox
                        obj={descriptor}
                        index={index}
                        check="descriptors-box"
                        checked={
                          checkedDescriptorsState[
                            cDescriptors.length +
                              jDescriptors.length +
                              aDescriptors.length +
                              index
                          ].status
                        }
                        onChange={() =>
                          handleDescriptorsChange(
                            cDescriptors.length +
                              jDescriptors.length +
                              aDescriptors.length +
                              index, descriptor
                          )
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <button
              className="text-sm font-bold mt-3"
              onClick={() =>
                setDescriptorVisible([false, false, false, !descriptorVisible[3]])
              }
            >
              {descriptorVisible[3] ? "See less" : "See more"}
            </button>
          </div>
          <div className="flex border-t-2 border-black p-5 justify-between items-center">
            <a href="#" onClick={handleClearDescriptors}>
              Clear All
            </a>
            <button
              className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
              onClick={handleDescriptorsApply}
            >
              Apply
            </button>
          </div>
        </div>
      )
    }
  
    const descriptorsSection = () => {
      if (openDescriptors) {
      return <div className="absolute mt-3 z-20">{fdescriptors()}</div>
      } else {
      ;<span></span>
      }
    }
  
    const profileGrid = (results.length > 0) ? (
      <InfiniteScroll
          dataLength={results.length} //This is important field to render the next data
          next={fetchData}
          hasMore={hasMore}
          loader={<div style={{ textAlign: 'center' }}><h4>Loading...</h4></div>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b></b>
            </p>
          }
        >
          {
          isDirectory ? 
          (<div className="container py-10 grid grid-cols-1 gap-6 grid-cols-2">{
            results.map((profile, index) => (
              <ProfileLine profile={profile} key={index} index={index} />
            ))}</div>) : 
          (<div className="container py-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">{
          results.map((profile, index) => (
            <ProfileCard profile={profile} key={index} index={index} />
          ))}</div>)
        }
        </InfiniteScroll>
    ) : (
      <div className="container">
      {isLoading ? (<div className="mt-10 p-10 bg-white rounded-3xl font-fira border-black border-2 shadow-md">
      Loading... 
      </div>): (<div className="mt-10 p-10 bg-white rounded-3xl font-fira border-black border-2 shadow-md">
      Unfortunately, there are no profiles that match your search requirements. We are regularly updating our database with more members, so please check back again soon. 
      </div>)}
    </div>
    )
  
    const yourSearch =
      selectedDisciplines.length > 0 || selectedDescriptors.length > 0 ? (
        <div className="mt-5">
          <div className="text-xs">Your search:</div>
          {selectedDisciplines.map((discipline, index) => {
            return (
              <span
              className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border"
                key={index}
              >
                <a href="#" onClick={() => handleClearSpecificDiscipline(discipline)}>
                  <Image alt="close icon" width={50} height={50} className="w-4 h-4" objectFit="contain" src="/images/close.png" />
                </a>
                <span className="pl-1">{discipline.name}</span>
              </span>
            )
          })}
          {selectedDescriptors.map((descriptor, index) => {
            return (
              <span
              className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border"
                key={index}
              >
                <a href="#" onClick={() => handleClearSpecificDescriptor(descriptor)}>
                  <Image alt="close icon" width={50} height={50} className="w-4 h-4" objectFit="contain" src="/images/close.png" />
                </a>
                <span className="pl-1">{descriptor.name}</span>
              </span>
            )
          })}
        </div>
      ) : (
        <div></div>
      )

  return (
    <div>
      {/* <Seo seo={{ metaTitle: "Home" }} /> */}
      <Headings
        title={global.siteName}
        description={global.siteDescription}
      />
      <main className="flex flex-col justify-center items-center w-full ">
      <div className="flex flex-col w-full border-black border-b-2 items-center bg-[#E1EEF6]">
        <div className="m-10">
        <h2 className="text-5xl min-[400px]:text-6xl sm:text-7xl min-[400px]:leading-extra-tight leading-extra-tight md:text-8xl text-center uppercase font-bold w-full mb-5 px-8  member-gradient">
              Member Profiles
            </h2>
            <div className="text-center md:text-center poppins font-normal">Learn about our members, hire talent, find collaborators, and more.</div>
        </div>
          <div className="flex w-full flex-col items-center justify-center max-w-screen-xl margin-auto">
            <div className="lg:px-20 w-full">
            <div className="flex flex-col border-black px-8 lg:px-32 py-8 mx-10 rounded-t-3xl rounded-t-extra member-gradient top-curve-border">
            <div className="flex flex-col md:flex-row justify-center w-full">
              <div className="mr-0 md:mr-5 w-full md:w-1/2 md:block">
                <div className="ml-0 mt-10 md:mt-0 md:ml-0 w-full flex items-center flex-col md:w-1/2 md:items-start">
                <div className="hidden text-xs md:block">
                  Search by Name:
                </div>
                </div>
                <input
                  className=" rounded-full px-3 text-sm border-2 border-black mt-2 p-1 w-64"
                  placeholder="Enter 'Name'"
                  value={input}
                  onChange={handleInputChange}
                />
                {/* <button onClick={handleSearchPress} className="ml-2 rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2">
                  Search
                </button> */}
              </div>
              <div className="ml-0 mt-10 md:mt-0 md:ml-5 w-full flex items-center flex-col md:w-1/2 md:items-start">
                <div className="hidden text-xs md:block">
                  Select from these Disciplines and Descriptors:
                </div>
                <div className="block text-md md:hidden">
                  Select from these Disciplines and Descriptors:
                </div>
                <div className="mt-2 text-left">
                  <button
                    className={
                      "mb-2 mr-2 rounded-full px-3 text-sm p-1 border-black border-2 inline-flex items-center " +
                      (openDisciplines || selectedDisciplines.length > 0
                        ? "bg-black text-white"
                        : "bg-white text-black")
                    }
                    onClick={toggleDisciplines}
                  >
                    Disciplines {disciplinesCountSection()} {openDisciplines ? <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
      <path d="M5.00784 0.00168852C5.17445 0.00136286 5.3359 0.0594578 5.46419 0.165889L9.74241 3.73547C9.88803 3.85665 9.9796 4.03079 9.99698 4.21956C10.0144 4.40834 9.95614 4.5963 9.83511 4.7421C9.71408 4.88789 9.54016 4.97957 9.35161 4.99698C9.16307 5.01438 8.97534 4.95608 8.82973 4.83491L5.00784 1.63656L1.18596 4.72068C1.11303 4.77998 1.0291 4.82427 0.939019 4.85099C0.848934 4.87771 0.754464 4.88635 0.661036 4.87639C0.567607 4.86644 0.477064 4.8381 0.39461 4.793C0.312157 4.7479 0.239419 4.68693 0.180577 4.61359C0.115277 4.54018 0.0658217 4.45407 0.0353089 4.36063C0.00479609 4.2672 -0.00611584 4.16847 0.00325593 4.07061C0.0126277 3.97276 0.04208 3.8779 0.0897704 3.79198C0.137461 3.70605 0.202361 3.63092 0.280403 3.57127L4.55863 0.123055C4.6906 0.0334463 4.84876 -0.00928495 5.00784 0.00168852Z" fill="white" />
    </svg> : (selectedDisciplines.length > 0 ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="white"/>
    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="#1B1B1B"/>
    </svg>)}
                  </button>
                  {disciplinesSection()}
                  <button
                    className={
                      "mr-2 rounded-full px-3 text-sm p-1 border-black border-2 inline-flex items-center " +
                      (openDescriptors || selectedDescriptors.length > 0
                        ? "bg-black text-white"
                        : "bg-white text-black")
                    }
                    onClick={toggleDescriptors} 
                  >
                    Descriptors {descriptorsCountSection()} {openDescriptors ? <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
      <path d="M5.00784 0.00168852C5.17445 0.00136286 5.3359 0.0594578 5.46419 0.165889L9.74241 3.73547C9.88803 3.85665 9.9796 4.03079 9.99698 4.21956C10.0144 4.40834 9.95614 4.5963 9.83511 4.7421C9.71408 4.88789 9.54016 4.97957 9.35161 4.99698C9.16307 5.01438 8.97534 4.95608 8.82973 4.83491L5.00784 1.63656L1.18596 4.72068C1.11303 4.77998 1.0291 4.82427 0.939019 4.85099C0.848934 4.87771 0.754464 4.88635 0.661036 4.87639C0.567607 4.86644 0.477064 4.8381 0.39461 4.793C0.312157 4.7479 0.239419 4.68693 0.180577 4.61359C0.115277 4.54018 0.0658217 4.45407 0.0353089 4.36063C0.00479609 4.2672 -0.00611584 4.16847 0.00325593 4.07061C0.0126277 3.97276 0.04208 3.8779 0.0897704 3.79198C0.137461 3.70605 0.202361 3.63092 0.280403 3.57127L4.55863 0.123055C4.6906 0.0334463 4.84876 -0.00928495 5.00784 0.00168852Z" fill="white" />
    </svg> : (selectedDescriptors.length > 0 ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="white"/>
    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="#1B1B1B"/>
    </svg>)}
                  </button>
                  {descriptorsSection()}
                </div>
              </div>

            </div>
            <div>{yourSearch}</div>
            </div>

            </div>
          </div>
        </div>
        <div className="container flex-col justify-start mt-10 px-20">
          <div className="flex justify-between">
          <div className="text-xl font-bold">Search Results ({totalLength})</div>
          <button
            className={
              "mr-2 rounded-full px-3 text-sm p-1 border-black border-2 inline-flex items-center " +
              (openDescriptors || selectedDescriptors.length > 0
                ? "bg-black text-white"
                : "bg-white text-black")
            }
            onClick={toggleDirectory} 
          >{listText} View</button>

          </div>
          {profileGrid}
        </div>
      </main>
    </div>
  )
}

IndexPage.propTypes = {
  queryStrings: PropTypes.object,
}

export default IndexPage;

