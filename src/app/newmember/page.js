'use client'; // add this part!

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Image from "next/image"
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import InfiniteScroll from 'react-infinite-scroll-component';
import Headings from "@/components/headings"
import ProfileLine from "@/components/profile-line"
import ProfileCard from "@/components/profile-card"
import { useDebouncedCallback } from 'use-debounce';


const IndexPage = ({}) => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const [page, setPage] = useState(1);
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(true);
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
    const [profiles, setProfiles] = useState([])
    const [results, setResults] = useState([])
    const [totalLength, setTotalLength] = useState(0)
    const [listText, setListText] = useState("List")
    const [hasMore, setHasMore] = useState(true)
    // const [checkedDisciplinesState, setCheckedDisciplinesState] = useState(
    //   []
    // )
    // const [checkedDescriptorsState, setCheckedDescriptorsState] = useState(
    //   []
    // )
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

    }
  
    const sendSearch = async (resetPage, pageSize) => {
       if (initial) {
      return;
    } else {
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
    }

    useEffect(() => {
      async function getData() {
        const disciplinesUrl = "https://sixty-backend-new.onrender.com/api/disciplines?populate[0]=discipline_category&pagination[pageSize]=200"
        const descriptorsUrl = "https://sixty-backend-new.onrender.com/api/descriptors?populate[0]=descriptor_category&pagination[pageSize]=200"
        // const profilesUrl = "https://sixty-backend-new.onrender.com/api/profiles?populate[0]=disciplines&populate[1]=descriptors&populate[2]=profilePicture&pagination[pageSize]=300&sort=name"

        let disciplineSelected = [];
        let disciplineSlugs = [];
        let disciplineNames = [];
        let descriptorSelected = [];
        let descriptorSlugs = [];
        let descriptorNames = [];

        if (searchParams.get('disciplineSlug')){
          disciplineSlugs = searchParams.get('disciplineSlug').split(',')
          disciplineNames = searchParams.get('disciplineName').split(',')
          for (var i = 0; i < disciplineSlugs.length; i++) {
            const toAdd = { name: disciplineNames[i], slug: disciplineSlugs[i]};
            disciplineSelected.push(toAdd)
          }
          setSelectedDisciplines(disciplineSelected)
        }
        if (searchParams.get('descriptorSlug')){
          descriptorSlugs = searchParams.get('descriptorSlug').split(',')
          descriptorNames = searchParams.get('descriptorName').split(',')
          for (var i = 0; i < descriptorSlugs.length; i++) {
            const toAdd = { name: descriptorNames[i], slug: descriptorSlugs[i]};
            descriptorSelected.push(toAdd)
          }
          setSelectedDescriptors(descriptorSelected)
        }
  
        const descriptorsRes = await fetch(descriptorsUrl);
        const descriptorsData = await descriptorsRes.json();
        const formattedDescriptors = descriptorsData.data.map((descriptor) => {
          if (descriptorSlugs.includes(descriptor.slug)) {
            descriptor.status = true;
          } else {
            descriptor.status = false;
          }
          return descriptor;
        })
        setDescriptors(formattedDescriptors)

        const disciplinesRes = await fetch(disciplinesUrl);
        const disciplinesData = await disciplinesRes.json();
        const formattedDisciplines = disciplinesData.data.map((discipline) => {
          if (disciplineSlugs.includes(discipline.slug)) {
            discipline.status = true;
          } else {
            discipline.status = false;
          }
          return discipline;
        })
        setDisciplines(formattedDisciplines)

        // const profilesRes = await fetch(profilesUrl);
        // const profileResults = await profilesRes.json();
        // setProfiles(profileResults.data)

        if (!searchParams.get('disciplineSlug') && !searchParams.get('descriptorSlug')) {
          // setResults(profileResults.data)
          // setTotalLength(profileResults.meta.pagination.total)
          sendSearch(true);
        } //else {
          //  let filteredProfiles = profileResults.data.filter((profile) => {
          // return profile.disciplines.some ((profileDiscipline) => {
          //   return disciplineSelected.some((discipline) => {
          //     if (discipline.slug == profileDiscipline.slug) {
          //       return true
          //     }
          //   })
          // })
          // })
          // console.log(selectedDescriptors)
          // let filteredDProfiles = profileResults.data.filter((profile) => {
          // return profile.descriptors.some ((profileDescriptor) => {
          //   return descriptorSelected.some((descriptor) => {
          //     if (descriptor.slug == profileDescriptor.slug) {
          //       return true
          //     }
          //   })
          // })
          // })
          // const profilesToFilter = [...new Set([...filteredProfiles, ...filteredDProfiles])]
        //    setResults(profilesToFilter)
        // setTotalLength(profilesToFilter.length)
        // }
        setInitial(false)
      }
      getData();
    }, [initial])
    
    useEffect(() => {
      // let profilesToFilter = profiles;
      router.replace(`${pathname}`);
      // if (selectedDescriptors.length + selectedDisciplines.length == 0) {
      //   profilesToFilter = profiles;
      // } else {
      //   let filteredProfiles = profiles.filter((profile) => {
      //   return profile.disciplines.some ((profileDiscipline) => {
      //     return selectedDisciplines.some((discipline) => {
      //       if (discipline.slug == profileDiscipline.slug) {
      //         return true
      //       }
      //     })
      //   })
      //   })
      //   let filteredDProfiles = profiles.filter((profile) => {
      //   return profile.descriptors.some ((profileDescriptor) => {
      //     return selectedDescriptors.some((descriptor) => {
      //       if (descriptor.slug == profileDescriptor.slug) {
      //         return true
      //       }
      //     })
      //   })
      //   })
      //   profilesToFilter = [...new Set([...filteredProfiles, ...filteredDProfiles])]
      // }
      setHasMore(true)
      const params = new URLSearchParams();

      if (selectedDisciplines.length > 0) {
        let nameArray = []
        let slugArray = []
        selectedDisciplines.forEach((discipline) => {
          nameArray.push(discipline.name)
          slugArray.push(discipline.slug)
        })

        params.append('disciplineSlug', slugArray.join());
        params.append('disciplineName', nameArray.join());
      }

      if (selectedDescriptors.length > 0) {
        let nameArray = []
        let slugArray = []
        selectedDescriptors.forEach((descriptor) => {
          nameArray.push(descriptor.name)
          slugArray.push(descriptor.slug)
        })

        params.append('descriptorSlug', slugArray.join());
        params.append('descriptorName', nameArray.join());
      }

      // if (input.length > 0) {
      //   let nameResults = profilesToFilter.filter((profile) => {
      //     return profile.name.toLowerCase().includes(input.toLowerCase());
      //   })
      //   setResults(nameResults)
      //   setTotalLength(nameResults.length)
      // } else {
      //   setResults(profilesToFilter)
      //   setTotalLength(profilesToFilter.length)
      // }

      if ((selectedDisciplines.length > 0) || (selectedDescriptors.length > 0)) {
        router.push(`?${params.toString().replaceAll("%2C", ",")}&`);
      }
      sendSearch(true)
    }, [selectedDisciplines, selectedDescriptors, input])
  
    const handleSearch = useDebouncedCallback((e) => {
      console.log(e)
        setInput(e)
      }, 300)
  
    const handleDisciplinesChange = (discipline) => {
      const updatedCheckedDisciplinesState = disciplines.map(
        (item) => {
          if (item.slug == discipline.slug) {
            item.status = !item.status;
          }
          return item;
        }
      )
      setDisciplines(updatedCheckedDisciplinesState)
    }
  
    const handleDescriptorsChange = (descriptor) => {
       const updatedCheckedDescriptorsState = descriptors.map(
        (item) => {
          if (item.slug == descriptor.slug) {
            item.status = !item.status;
          }
          return item;
        }
      )
      setDescriptors(updatedCheckedDescriptorsState)
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
      const disciplinesFilters = disciplines.filter((input) => {
        if (input.status == true) {
          return input;
        }
      })
      
      setSelectedDisciplines(disciplinesFilters)
      toggleDisciplines()
    }
  
    const handleClearDisciplines = () => {
      setSelectedDisciplines([])
      toggleDisciplines()
    }

    const handleClearInput = () => {
      setInput("")
    }
  
    const handleClearSpecificDiscipline = (clearDiscipline) => {
      let newSelectedDisciplines = selectedDisciplines.filter(function(discipline) { 
          return discipline !== clearDiscipline
      })
      setSelectedDisciplines(newSelectedDisciplines);

      let newArray = disciplines.map(function(discipline) { 
        if (discipline.slug == clearDiscipline.slug) {
          discipline.status = false;
        } 
        
        return discipline;
      })
      setDisciplines(newArray)
    }
  
    const handleClearSpecificDescriptor = (clearDescriptor) => {
      let newSelectedDescriptors = selectedDescriptors.filter(function(descriptor) { 
          return descriptor !== clearDescriptor
      })
      setSelectedDescriptors(newSelectedDescriptors);

      let newArray = descriptors.map(function(descriptor) { 
        if (descriptor.slug == clearDescriptor.slug) {
          descriptor.status = false;
        } 
        
        return descriptor;
      })
      setDescriptors(newArray)
    }
  
    const handleDescriptorsApply = () => {
      const descriptorsFilters = descriptors.filter((input) => {
        if (input.status == true) {
          return input;
        }
      })
      
      setSelectedDescriptors(descriptorsFilters)
      toggleDescriptors()
    }
  
    const handleClearDescriptors = () => {
      setSelectedDescriptors([])
      toggleDescriptors()
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
                          discipline.status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                           discipline
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
                          discipline.status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                           discipline
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
                        checked={
                          discipline.status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                           discipline
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
                          discipline.status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                           discipline
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
                          discipline.status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                           discipline
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
                          discipline.status
                        }
                        onChange={() =>
                          handleDisciplinesChange(
                           discipline
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
                        checked={
                          descriptor.status
                        }
                        onChange={() =>
                          handleDescriptorsChange(
                           descriptor
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
                          descriptor.status
                        }
                        onChange={() =>
                          handleDescriptorsChange(
                           descriptor
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
                          descriptor.status
                        }
                        onChange={() =>
                          handleDescriptorsChange(
                           descriptor
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
                          descriptor.status
                        }
                        onChange={() =>
                          handleDescriptorsChange(
                           descriptor
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

    function fetchData() {
      sendSearch();
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
        <div>
          {
          isDirectory ? 
          (<div className="py-10 grid grid-cols-1 gap-6 grid-cols-2">{
            results.map((profile, index) => (
              <ProfileLine profile={profile} key={index} index={index} />
            ))}</div>) : 
          (<div className="py-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">{
          results.map((profile, index) => (
            <ProfileCard profile={profile} key={index} index={index} />
          ))}</div>)
        }
        </div>
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

  return (
    <div>
      <Headings
        title={"Member Profiles"}
        description={"Learn about our members, hire talent, find collaborators, and more."}
      />
      <div className="container py-10">
      <div id="contact" className="card bg-white rounded-3xl border-black border-2">
            <div className="card-header border-b-2 border-black p-5 flex justify-center items-center">
              <h2 className="text-xl font-bold">Add a New Member</h2>
            </div>
      <form
              id="fs-frm"
              name="sixty-contact-form"
              acceptCharset="utf-8"
              action="http://localhost:1337/api/profiles"
              method="post"
              className="pb-10"
            >
              <fieldset id="fs-frm-inputs" className="flex flex-col p-10">
                <label htmlFor="name" className="mb-2">
                  Your Name*
                </label>
                <input
                  type="text"
                  name="data.name"
                  id="name"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="email" className="mt-10 mb-2">
                  Your Email*
                </label>
                <input
                  type="email"
                  name="data.email"
                  id="email"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="pronouns" className="mt-10 mb-2">
                  Pronouns
                </label>
                <input
                  type="pronouns"
                  name="data.pronouns"
                  id="pronouns"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="website" className="mt-10 mb-2">
                  Website
                </label>
                <input
                  type="website"
                  name="data.website"
                  id="website"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="instagramHandle" className="mt-10 mb-2">
                  Instagram Handle
                </label>
                <input
                  type="instagramHandle"
                  name="data.instagramHandle"
                  id="instagramHandle"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label className="mt-10 mb-2">
                  Available for Work
                  <input className="block" type="checkbox" ></input>
                  <span class="slider round"></span>
                </label>
                <label htmlFor="bio" className="mt-10 mb-2">
                  Bio
                </label>
                <textarea
                  type="bio"
                  name="data.bio"
                  id="bio"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="workStyleBio" className="mt-10 mb-2">
                  Workstyle Bio
                </label>
                <textarea
                  type="workStyleBio"
                  name="data.workStyleBio"
                  id="workStyleBio"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="gigsSeeking" className="mt-10 mb-2">
                  Gigs Seeking
                </label>
                <textarea
                  type="gigsSeeking"
                  name="data.gigsSeeking"
                  id="gigsSeeking"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="pastWork" className="mt-10 mb-2">
                  Past Work
                </label>
                <textarea
                  type="pastWork"
                  name="data.pastWork"
                  id="pastWork"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="profilePicture" className="mt-10 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="data.profilePicture.files"
                  id="profilePicture"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="email" className="mt-10 mb-2">
                  Work Sample 1
                </label>
                <label htmlFor="email" className="mt-10 mb-2">
                  Name
                </label>
                <input
                  type="workSamples"
                  name="data.workSamples[0][name]"
                  id="workSamples.0.name"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="email" className="mt-10 mb-2">
                  Work Sample 2
                </label>
                <label htmlFor="email" className="mt-10 mb-2">
                  Name
                </label>
                <input
                  type="workSamples"
                  name="data.workSamples[2][name]"
                  id="workSamples.2.name"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
              <div className="text-center">
                <input
                  className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
                  type="submit"
                  defaultValue="Submit"
                />
              </div>
              </fieldset>
      </form>
      </div>
    </div>
    </div>
  )
}

IndexPage.propTypes = {
  queryStrings: PropTypes.object,
}

export default IndexPage;

