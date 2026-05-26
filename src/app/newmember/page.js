'use client'; // add this part!

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, usePathname } from 'next/navigation'
import InfiniteScroll from 'react-infinite-scroll-component';
import Headings from "@/components/headings"
import ProfileLine from "@/components/profile-line"
import ProfileCard from "@/components/profile-card"
import { useDebouncedCallback } from 'use-debounce';


const IndexPage = ({}) => {
    const pathname = usePathname()
    const router = useRouter()
    const [page, setPage] = useState(1);
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [isDirectory, setIsDirectory] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
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
    const [workSampleDisciplines, setWorkSampleDisciplines] = useState([])
    const [selectedWorkSampleDisciplines, setSelectedWorkSampleDisciplines] = useState([])
    const [selectedWorkSampleDisciplines2, setSelectedWorkSampleDisciplines2] = useState([])
    const [selectedWorkSampleDisciplines3, setSelectedWorkSampleDisciplines3] = useState([])
    const [selectedDescriptors, setSelectedDescriptors] = useState([])
    const [descriptors, setDescriptors] = useState([])
    const [profiles, setProfiles] = useState([])
    const [results, setResults] = useState([])
    const [profilePicture, setProfilePicture] = useState("")
    const [workSampleImages, setWorkSampleImages] = useState(["", "", ""])
    const [workSampleImages2, setWorkSampleImages2] = useState(["", "", ""])
    const [workSampleImages3, setWorkSampleImages3] = useState(["", "", ""])
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

    useEffect(() => {
      async function getData() {
        const disciplinesUrl = "https://sixty-backend-new.onrender.com/api/disciplines?populate[0]=discipline_category&pagination[pageSize]=200"
        const descriptorsUrl = "https://sixty-backend-new.onrender.com/api/descriptors?populate[0]=descriptor_category&pagination[pageSize]=200"
        const workSampleDisciplinesUrl = "https://sixty-backend-new.onrender.com/api/work-sample-disciplines?populate[0]=discipline_category&pagination[pageSize]=200"
        // const profilesUrl = "https://sixty-backend-new.onrender.com/api/profiles?populate[0]=disciplines&populate[1]=descriptors&populate[2]=profilePicture&pagination[pageSize]=300&sort=name"

        // let disciplineSelected = [];
        // let disciplineSlugs = [];
        // let disciplineNames = [];
        // let descriptorSelected = [];
        // let descriptorSlugs = [];
        // let descriptorNames = [];

        // if (searchParams.get('disciplineSlug')){
        //   disciplineSlugs = searchParams.get('disciplineSlug').split(',')
        //   disciplineNames = searchParams.get('disciplineName').split(',')
        //   for (var i = 0; i < disciplineSlugs.length; i++) {
        //     const toAdd = { name: disciplineNames[i], slug: disciplineSlugs[i]};
        //     disciplineSelected.push(toAdd)
        //   }
        //   setSelectedDisciplines(disciplineSelected)
        // }
        // if (searchParams.get('descriptorSlug')){
        //   descriptorSlugs = searchParams.get('descriptorSlug').split(',')
        //   descriptorNames = searchParams.get('descriptorName').split(',')
        //   for (var i = 0; i < descriptorSlugs.length; i++) {
        //     const toAdd = { name: descriptorNames[i], slug: descriptorSlugs[i]};
        //     descriptorSelected.push(toAdd)
        //   }
        //   setSelectedDescriptors(descriptorSelected)
        // }
  
        const descriptorsRes = await fetch(descriptorsUrl);
        const descriptorsData = await descriptorsRes.json();
        const formattedDescriptors = descriptorsData.data.map((descriptor) => {
          descriptor.status = false;
          return descriptor;
        })
        setDescriptors(formattedDescriptors)

        const disciplinesRes = await fetch(disciplinesUrl);
        const disciplinesData = await disciplinesRes.json();

        const formattedDisciplines = disciplinesData.data.map((discipline) => {
          discipline.status = false;
          return discipline;
        })
        setDisciplines(formattedDisciplines)

        const workSampleDisciplinesRes = await fetch(workSampleDisciplinesUrl);
        const workSampleDisciplinesData = await workSampleDisciplinesRes.json();
        const formattedWorkSampleDisciplines = workSampleDisciplinesData.data.map((discipline) => {
          discipline.status = [false, false, false];
          return discipline;
        })
        setWorkSampleDisciplines(formattedWorkSampleDisciplines)
        

        // const profilesRes = await fetch(profilesUrl);
        // const profileResults = await profilesRes.json();
        // setProfiles(profileResults.data)

        setInitial(false)
      }
      getData();
    }, [initial])

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
      const disciplinesFilters = disciplines.filter((input) => {
        if (input.status == true) {
          return input;
        }
      })
      setSelectedDisciplines(disciplinesFilters)
    }

    const handleWorkSampleDisciplinesChange = (workSampleDiscipline, workSampleNumber) => {
      let updatedWorkSampleDisciplinesState = []
      if (workSampleNumber == 1) {
        updatedWorkSampleDisciplinesState = workSampleDisciplines.map(
          (item) => {
            if (item.slug == workSampleDiscipline.slug) {
              item.status[0] = !item.status[0];
            }
            return item;
          }
        )
        const disciplinesFilters = workSampleDisciplines.filter((input) => {
          if (input.status[0] == true) {
            return input;
          }
        })
        setSelectedWorkSampleDisciplines(disciplinesFilters)
      } else if (workSampleNumber == 2) {
        updatedWorkSampleDisciplinesState = workSampleDisciplines.map(
          (item) => {
            if (item.slug == workSampleDiscipline.slug) {
              item.status[1] = !item.status[1];
            }
            return item;
          }
        )
         const disciplinesFilters = workSampleDisciplines.filter((input) => {
          if (input.status[1] == true) {
            return input;
          }
        })
        setSelectedWorkSampleDisciplines2(disciplinesFilters)
      } else if (workSampleNumber == 3) {
        updatedWorkSampleDisciplinesState = workSampleDisciplines.map(
          (item) => {
            if (item.slug == workSampleDiscipline.slug) {
              item.status[2] = !item.status[2];
            }
            return item;
          }
        )
        setSelectedWorkSampleDisciplines3(updatedWorkSampleDisciplinesState)
      }
      setWorkSampleDisciplines(updatedWorkSampleDisciplinesState)
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
       const descriptorsFilters = descriptors.filter((input) => {
        if (input.status == true) {
          return input;
        }
      })
      setSelectedDescriptors(descriptorsFilters)
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
          </div>
        </div>
      )
    }

    function fworkSampleDisciplines(workSampleNumber) {
      let pDisciplines = []
      let vDisciplines = []
      let rDisciplines = []
      let wDisciplines = []
      let aDisciplines = []
      let lDisciplines = []
      workSampleDisciplines.forEach(discipline => {
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
                          discipline.status[workSampleNumber-1]
                        }
                        onChange={() =>
                          handleWorkSampleDisciplinesChange(
                           discipline, workSampleNumber
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
                          discipline.status[workSampleNumber-1]
                        }
                        onChange={() =>
                          handleWorkSampleDisciplinesChange(
                           discipline, workSampleNumber
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
                          discipline.status[workSampleNumber-1]
                        }
                        onChange={() =>
                          handleWorkSampleDisciplinesChange(
                           discipline, workSampleNumber
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
                          discipline.status[workSampleNumber-1]
                        }
                        onChange={() =>
                          handleWorkSampleDisciplinesChange(
                           discipline, workSampleNumber
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
                          discipline.status[workSampleNumber-1]
                        }
                        onChange={() =>
                          handleWorkSampleDisciplinesChange(
                           discipline, workSampleNumber
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
                          discipline.status[workSampleNumber-1]
                        }
                        onChange={() =>
                          handleWorkSampleDisciplinesChange(
                           discipline, workSampleNumber
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
          </div>
        </div>
      )
    }
  
    const disciplinesSection = () => {
        return <div className="md:w-1/2 pb-10 mt-3 z-20">{fdisciplines()}</div>
    }

    const workSampleDisciplinesSection = (workSampleNumber) => {
      return <div className="w-full mt-3 z-20">{fworkSampleDisciplines(workSampleNumber)}</div>
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
          </div>
        </div>
      )
    }
  
    const descriptorsSection = () => {
      return <div className="md:w-1/2 pb-10 mt-3 z-20">{fdescriptors()}</div>
    }

    function fetchData() {
      // sendSearch();
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

    async function onSubmit(e) {
      e.preventDefault()
    try {
      const formData = new FormData(e.target)
      console.log(!!formData.get("availableForWork"))
      const profile = {
        "name": formData.get("name"),
        "email": formData.get("email"),
        "pronouns": formData.get("pronouns"),
        "instagramHandle": formData.get("instagramHandle"),
        "blueskyHandle": formData.get("blueskyHandle"),
        "twitterHandle": formData.get("twitterHandle"),
        "bio": formData.get("bio"),
        "workStyleBio": formData.get("workStyleBio"),
        "gigsSeeking": formData.get("gigsSeeking"),
        "availableForWork": !!formData.get("availableForWork"),
        "pastWork": formData.get("pastWork"),
        "location": formData.get("location"),
        "website": formData.get("website"),
        "secondaryWebsite": formData.get("secondaryWebsite"),
        "secondaryLocation": formData.get("secondaryLocation"),
        "displayName": formData.get("displayName"),
        "disciplines": {set: selectedDisciplines},
        "descriptors": {set: selectedDescriptors},
        "workSamples": [],
      }

      // profile picture upload
      const profilePictureFormData = new FormData();
      if (formData.get("profilePicture").size > 0) {
        profilePictureFormData.append("files", formData.get("profilePicture"))
        profilePictureFormData.set("ref", "api::profile.profile")
        profilePictureFormData.set("field", "profilePicture")
        profilePictureFormData.append("fileInfo[caption]", formData.get(`profilePictureCaption`))
        profilePictureFormData.append("fileInfo[alternativeText]", formData.get(`profilePictureAltText`))
        const pictureResponse = await fetch('https://sixty-backend-new.onrender.com/api/upload', {
          method: 'post',
          body: profilePictureFormData
        });
        const profilePictureData = await pictureResponse.json()
        profile.profilePicture =  profilePictureData[0].id
      }
      

      // // work sample upload
      const workSample1FilesFormData = new FormData();
      console.log(formData.getAll("workSamples1Files"))
      const activeWorkSamples1 = formData.getAll("workSamples1Files").filter((file) => {
        if (file.size != 0) {
          workSample1FilesFormData.append("files", file)
          return file;
        }
      })
      console.log(activeWorkSamples1)
      if (activeWorkSamples1.length > 0) {
        workSample1FilesFormData.set("ref", "api::profile.profile")
        workSample1FilesFormData.set("field", "workSamples[0].images")
        for (let i = 0; i < activeWorkSamples1.length; i++) {
          workSample1FilesFormData.append(`fileInfo`, JSON.stringify({caption: formData.get(`workSamples1FilesCaption${i}`), alternativeText: formData.get(`workSamples1FilesAltText${i}`)}))
        }
        const workSample1FilesResponse = await fetch('https://sixty-backend-new.onrender.com/api/upload', {
          method: 'post',
          body: workSample1FilesFormData
        });
        const workSample1FilesData = await workSample1FilesResponse.json()
        const workSample1Ids = workSample1FilesData.map(fileData => {
          return fileData.id;
        })
        profile.workSamples.push({
          name: formData.get("workSamples1Name"), 
          link: formData.get("workSamples1Link"), 
          description: formData.get("workSamples1Description"), 
          images: workSample1Ids,
          work_sample_disciplines: {set: selectedWorkSampleDisciplines}
        })
      }
      
      // // work sample upload
      const workSample2FilesFormData = new FormData();
      const activeWorkSamples2 = formData.getAll("workSamples2Files").filter((file) => {
        if (file.size != 0) {
          workSample2FilesFormData.append("files", file)
          return file;
        }
      })
      if (activeWorkSamples2.length > 0) {
        workSample2FilesFormData.set("ref", "api::profile.profile")
        workSample2FilesFormData.set("field", "workSamples[0].images")
        for (let i = 0; i < activeWorkSamples2.length; i++) {
          workSample2FilesFormData.append(`fileInfo`, JSON.stringify({caption: formData.get(`workSamples2FilesCaption${i}`), alternativeText: formData.get(`workSamples2FilesAltText${i}`)}))
        }
  
        const workSample2FilesResponse = await fetch('https://sixty-backend-new.onrender.com/api/upload', {
          method: 'post',
          body: workSample2FilesFormData
        });
        const workSample2FilesData = await workSample2FilesResponse.json()
        const workSample2Ids = workSample2FilesData.map(fileData => {
          return fileData.id;
        })
        profile.workSamples.push({
          name: formData.get("workSamples2Name"), 
          link: formData.get("workSamples2Link"), 
          description: formData.get("workSamples2Description"), 
          images: workSample2Ids,
          work_sample_disciplines: {set: selectedWorkSampleDisciplines2}
        })
      }

      // // work sample upload
      const workSample3FilesFormData = new FormData();
      const activeWorkSamples3 = formData.getAll("workSamples3Files").filter((file) => {
        if (file.size != 0) {
          workSample3FilesFormData.append("files", file)
          return file;
        }
      })

      if (activeWorkSamples3.length > 0) {
        workSample3FilesFormData.set("ref", "api::profile.profile")
        workSample3FilesFormData.set("field", "workSamples[0].images")
        for (let i = 0; i < activeWorkSamples3.length; i++) {
          workSample3FilesFormData.append(`fileInfo`, JSON.stringify({caption: formData.get(`workSamples3FilesCaption${i}`), alternativeText: formData.get(`workSamples3FilesAltText${i}`)}))
        }
        console.log(workSample3FilesFormData)
        const workSample3FilesResponse = await fetch('https://sixty-backend-new.onrender.com/api/upload', {
          method: 'post',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(workSample3FilesFormData)
        });
        const workSample3FilesData = await workSample3FilesResponse.json()
        const workSample3Ids = workSample3FilesData.map(fileData => {
          return fileData.id;
        })
        profile.workSamples.push({
          name: formData.get("workSamples3Name"), 
          link: formData.get("workSamples3Link"), 
          description: formData.get("workSamples3Description"), 
          images: workSample3Ids,
          work_sample_disciplines: {set: selectedWorkSampleDisciplines3}
        })
      }
      
    const response = await fetch('https://sixty-backend-new.onrender.com/api/profiles?status=draft', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({data: profile}),
    })
      return response;
  } catch (error) {
    console.error("Error", error.message)
  } finally {
    setFormSubmitted(true)
  }
  }

  const inputWorkSampleImages = (event, workSampleNumber) => {
    if (workSampleNumber == 1) {
      const images = Array.from(event.target.files)
      const formattedFiles = images.map ((obj) => {
        return URL.createObjectURL(obj)
      })
      setWorkSampleImages(formattedFiles)
    } else if (workSampleNumber == 2) {
const images = Array.from(event.target.files)
      const formattedFiles = images.map ((obj) => {
        return URL.createObjectURL(obj)
      })
      setWorkSampleImages2(formattedFiles)
    } else if (workSampleNumber == 3) {
const images = Array.from(event.target.files)
      const formattedFiles = images.map ((obj) => {
        return URL.createObjectURL(obj)
      })
      setWorkSampleImages3(formattedFiles)
    }
  }

  const handleChangeImage =(event) => {
    setProfilePicture(URL.createObjectURL(event.target.files[0]))
  }

  const form = () => {
    if (!!formSubmitted) {
      return <div className="p-10">Thank you for submitting. Sixty Collective will follow up with next steps soon!</div>
    } else {
      return  <form
              id="fs-frm"
              name="sixty-contact-form"
              acceptCharset="utf-8"
              onSubmit={onSubmit}
              method="post"
              className="pb-10"
            >
              <fieldset id="fs-frm-inputs" className="flex flex-col md:flex-row p-10 md:flex-wrap md:w-full">
                <h2 className="text-2xl font-bold mb-10 md:w-full">Section 1: The Basics</h2>
                <div className="w-auto md:w-1/2 flex flex-col md:pr-5">
                <label htmlFor="name" className="mb-2">
                  What's your name? (First, Last)*
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-gray-200 rounded-lg p-2"
                  required
                />
                </div>
                <div className="w-auto md:w-1/2 flex flex-col mt-10 md:mt-0">
                <label htmlFor="displayName" className="mb-2">
                  What name would you like appear on your profile?
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="w-auto md:w-1/2 flex flex-col mt-10 md:pr-5">
                <label htmlFor="pronouns" className="mb-2">
                  What are your pronouns?
                </label>
                <input
                  type="pronouns"
                  name="pronouns"
                  id="pronouns"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="w-auto md:w-1/2 flex flex-col mt-10">
                  <label htmlFor="email" className="mb-2">
                    What email address do you use for your practice?*
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="bg-gray-200 rounded-lg p-2"
                  />
                </div>
                <div className="w-auto md:w-1/2 flex flex-col md:pr-5">
                <label htmlFor="profilePicture" className="mt-10 mb-2">
                  If you want to include a photo, please upload it here. (.jpg or .png only)
                </label>
                <input
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                  onChange={(event) => handleChangeImage(event)}
                  className="bg-gray-200 rounded-lg p-2 w-1/2"
                />
                 <div className="bg-gray-100 mt-5 p-5 rounded-3xl">
                    {!!profilePicture && <Image objectFit="contain" width={300} height={300} src={profilePicture} alt="Uploaded preview" className="py-5" />}
                    {!!profilePicture && <div className="flex flex-col w-full"><label htmlFor="profilePictureCaption">Photo Credit</label><input
                      type="profilePictureCaption"
                      name="profilePictureCaption"
                      id="profilePictureCaption"
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                    {!!profilePicture && <div className="flex flex-col w-full mt-5"><label htmlFor="profilePictureAltText">Image Description (Alt Text)</label><input
                      type="profilePictureAltText"
                      name="profilePictureAltText"
                      id="profilePictureAltText"
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col mt-10">
                <label htmlFor="website" className="mb-2">
                  Please share your website for your practice(s)?
                </label>
                <input
                  type="website"
                  name="website"
                  id="website"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="md:w-1/2 flex flex-col mt-10 md:pr-5">
                <label htmlFor="secondaryWebsite" className="mb-2">
                  Do you have a second website?
                </label>
                <input
                  type="secondaryWebsite"
                  name="secondaryWebsite"
                  id="secondaryWebsite"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="md:w-1/2 flex flex-col">
                <label htmlFor="instagramHandle" className="mt-10 mb-2">
                  What is your Instagram handle?
                </label>
                <input
                  type="instagramHandle"
                  name="instagramHandle"
                  id="instagramHandle"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="md:w-1/2 flex flex-col md:pr-5">
                <label htmlFor="twitterHandle" className="mt-10 mb-2 ">
                  What is your X/Twitter handle?
                </label>
                <input
                  type="twitterHandle"
                  name="twitterHandle"
                  id="twitterHandle"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="md:w-1/2 flex flex-col">
                <label htmlFor="blueskyHandle" className="mt-10 mb-2 ">
                  What is your Bluesky handle?
                </label>
                <input
                  type="blueskyHandle"
                  name="blueskyHandle"
                  id="blueskyHandle"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="md:w-1/2 flex flex-col md:pr-5">
                <label htmlFor="location" className="mt-10 mb-2 ">
                  Where are you primarily based? (City, State)
                </label>
                <input
                  type="location"
                  name="location"
                  id="location"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="md:w-1/2 flex flex-col">
                <label htmlFor="secondaryLocation" className="mt-10 mb-2 ">
                  Would you like to add other locations?
                </label>
                <input
                  type="secondaryLocation"
                  name="secondaryLocation"
                  id="secondaryLocation"
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="md:w-1/2 flex flex-col">
                <label className="mt-10 mb-2 relative">
                  Are you available for work?*
                  <input className="block opacity-0" type="checkbox" name="availableForWork" ></input>
                  <span className="checkmark"></span>
                </label>
                </div>
                <div className="w-full mt-10 flex flex-col">
                <h2 className="text-2xl font-bold w-full my-10">Section 2: Written Statements</h2>
                <label htmlFor="bio" className=" mb-2">
                  What should people know about you? Share a brief bio. * (Character limit: 1,000)
                </label>
                <textarea
                  type="bio"
                  name="bio"
                  id="bio"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="w-full mt-10 flex flex-col">
                <label htmlFor="workStyleBio" className="mb-2">
                  Tell us about your work process, your unique skills, and the types of environments you thrive in. * (Character limit: 1,000)
                </label>
                <textarea
                  type="workStyleBio"
                  name="workStyleBio"
                  id="workStyleBio"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="w-full mt-10 flex flex-col">
                <label htmlFor="pastWork" className="mb-2">
                  What gigs, jobs, or opportunities are you actively pursuing right now? * (Character limit: 1,000)
                </label>
                <textarea
                  type="pastWork"
                  name="pastWork"
                  id="pastWork"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <div className="w-full mt-10 flex flex-col">
                <label htmlFor="gigsSeeking" className="mb-2">
                  Demonstrate your track record with co-creation by listing key projects, people, and organizations you’ve worked with. * (Character limit: 1,000)
                </label>
                <textarea
                  type="gigsSeeking"
                  name="gigsSeeking"
                  id="gigsSeeking"
                  required
                  className="bg-gray-200 rounded-lg p-2"
                />
                </div>
                <h2 className="text-2xl font-bold w-full mt-20 mb-10">Section 3: Defining Your Practice</h2>
                <div className="w-full flex flex-col">
                <label htmlFor="pastWork" className="mb-10">
                  Choose from the following list of disciplines to identify the practices in your written statements. These will help categorize your profile to make it more searchable on Sixty Collective's website.

                </label>
                <div className="flex flex-col md:flex-row">
                {disciplinesSection()}
                <div className="w-full md:w-1/2 md:pl-10">
                <div className="block mb-2">Selected Disciplines: </div>
                {selectedDisciplines.map((discipline, index) => {
                  return (
                    <span
                    className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border"
                      key={index}
                    >
                      <a onClick={() => handleClearSpecificDiscipline(discipline)}>
                        <Image alt="close icon" width={50} height={50} className="w-4 h-4" objectFit="contain" src="/images/close.png" />
                      </a>
                      <span className="pl-1">{discipline.name}</span>
                    </span>
                  )
                })}
                </div>
                <input type="hidden" id="disciplines" name="disciplines" value={selectedDisciplines} />
                </div>
                </div>
                <div className="w-full mt-10 flex flex-col">
                <label htmlFor="pastWork" className="mt-10 mb-10">
                  We've gathered an additional set of descriptors to help define the core themes throughout your practice. Please select from the following tags you might use to describe yourself, key concepts, and communities that inform your practice. 

                </label>
                <div className="flex flex-col md:flex-row">
                {descriptorsSection()}
                <div className="w-full md:w-1/2 md:pl-10">
                <div className="block mb-2">Selected Descriptors: </div>
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
                                <input type="hidden" id="descriptors" name="descriptors" value={selectedDescriptors} />

                </div>
                </div>
                <h2 className="text-2xl font-bold w-full mt-20 mb-10">Section 4: Work Samples</h2>
                <div>
                  Your Sixty Collective profile can showcase up to three work samples. Spotlight projects emphasizing skills that align with the kinds of opportunities you want to attract.
                </div>
                <div className="w-full flex flex-col px-10 py-10  my-10 card bg-white rounded-3xl border-black border-2">
                <label htmlFor="email" className="text-xl 10 mb-2">
                  Work Sample 1
                </label>
                <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 flex flex-col pr-10">
                <label htmlFor="workSamples1Name" className="mt-5 mb-2">
                  Project Name
                </label>
                <input
                  type="workSamples"
                  name="workSamples1Name"
                  id="workSamples1Name"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="workSamples1Link" className="mt-5 mb-2">
                  External Link
                </label>
                <input
                  type="workSamples"
                  name="workSamples1Link"
                  id="workSamples1Link"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="workSamples1Description" className="mt-5 mb-2">
                  Brief Description
                </label>
                <textarea
                  type="workSamples"
                  name="workSamples1Description"
                  id="workSamples1Description"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="email" className="mt-5 mb-2">
                  Work Sample Images
                </label>
                <label htmlFor="workSamples1Files" className="mb-2">Select up to 3 files:</label>
                <input type="file" id="workSampleImages" name="workSamples1Files" onChange={(event) => {inputWorkSampleImages(event, 1)}} multiple></input>
                {workSampleImages.map((file, index) => (
                  <div className="bg-gray-100 mt-5 p-5 rounded-3xl" key={index}>
                    {!!file && <Image width={200} height={200} src={file} alt="Uploaded preview" className="py-5" objectFit="contain" />}
                    {!!file && <div className="flex flex-col w-full"><label htmlFor="workSamples1FilesCaption">Photo Credit</label><input
                      type="workSamples"
                      name={`workSamples1FilesCaption${index}`}
                      id={`workSamples1FilesCaption${index}`}
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                    {!!file && <div className="flex flex-col w-full mt-5"><label htmlFor="workSamples1FilesAltText">Image Description (Alt Text)</label><input
                      type="workSamples"
                      name={`workSamples1FilesAltText${index}`}
                      id={`workSamples1FilesAltText${index}`}
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                  </div>
                ))}
                </div>
                <div className="w-full md:w-1/2 flex flex-col">
                <label htmlFor="email" className="mt-5 mb-2">
                  Work Sample Discipline Tags
                </label>
                {workSampleDisciplinesSection(1)}
                <div className="pt-10">
                <div className="block mb-2">Selected Disciplines: </div>
                {selectedWorkSampleDisciplines.map((discipline, index) => {
                  return (
                    <span
                    className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border"
                      key={index}
                    >
                      <a onClick={() => handleClearSpecificDiscipline(discipline)}>
                        <Image alt="close icon" width={50} height={50} className="w-4 h-4" objectFit="contain" src="/images/close.png" />
                      </a>
                      <span className="pl-1">{discipline.name}</span>
                    </span>
                  )
                })}
                </div>
                </div>
                </div>
                </div>
                <div className="w-full flex flex-col px-10 py-10  my-10 card bg-white rounded-3xl border-black border-2">
                <label htmlFor="email" className="text-xl 10 mb-2">
                  Work Sample 2
                </label>
                <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 flex flex-col pr-10">
                <label htmlFor="workSamples2Name" className="mt-5 mb-2">
                  Project Name
                </label>
                <input
                  type="workSamples"
                  name="workSamples2Name"
                  id="workSamples2Name"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="workSamples2Link" className="mt-5 mb-2">
                  External Link
                </label>
                <input
                  type="workSamples"
                  name="workSamples2Link"
                  id="workSamples2Link"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="workSamples2Description" className="mt-5 mb-2">
                  Brief Description
                </label>
                <textarea
                  type="workSamples"
                  name="workSamples2Description"
                  id="workSamples2Description"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="email" className="mt-5 mb-2">
                  Work Sample Images
                </label>
                <label htmlFor="workSamples2Files" className="mb-2">Select up to 3 files:</label>
                <input type="file" id="workSampleImages" name="workSamples2Files" onChange={(event) => {inputWorkSampleImages(event, 2)}} multiple></input>
                {workSampleImages2.map((file, index) => (
                  <div className="bg-gray-100 mt-5 p-5 rounded-3xl" key={index}>
                    {!!file && <Image width={200} height={200} src={file} alt="Uploaded preview" className="py-5" objectFit="contain" />}
                    {!!file && <div className="flex flex-col w-full"><label htmlFor="workSamples2FilesCaption">Photo Credit</label><input
                      type="workSamples"
                      name={`workSamples2FilesCaption${index}`}
                      id={`workSamples2FilesCaption${index}`}
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                    {!!file && <div className="flex flex-col w-full mt-5"><label htmlFor="workSamples2FilesAltText">Image Description (Alt Text)</label><input
                      type="workSamples"
                      name={`workSamples2FilesAltText${index}`}
                      id={`workSamples2FilesAltText${index}`}
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                  </div>
                ))}
                </div>
                <div className="md:w-1/2 flex flex-col">
                <label htmlFor="email" className="mt-5 mb-2">
                  Work Sample Discipline Tags
                </label>
                {workSampleDisciplinesSection(2)}
                <div className="pt-10">
                <div className="block mb-2">Selected Disciplines: </div>
                {selectedWorkSampleDisciplines2.map((discipline, index) => {
                  return (
                    <span
                    className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border"
                      key={index}
                    >
                      <a onClick={() => handleClearSpecificDiscipline(discipline)}>
                        <Image alt="close icon" width={50} height={50} className="w-4 h-4" objectFit="contain" src="/images/close.png" />
                      </a>
                      <span className="pl-1">{discipline.name}</span>
                    </span>
                  )
                })}
                </div>
                </div>
                </div>
                </div>
                <div className="w-full flex flex-col px-10 py-10  my-10 card bg-white rounded-3xl border-black border-2">
                <label htmlFor="email" className="text-xl 10 mb-2">
                  Work Sample 3
                </label>
                <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 flex flex-col pr-10">
                <label htmlFor="workSamples3Name" className="mt-5 mb-2">
                  Project Name
                </label>
                <input
                  type="workSamples"
                  name="workSamples3Name"
                  id="workSamples3Name"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="workSamples1Link" className="mt-5 mb-2">
                  External Link
                </label>
                <input
                  type="workSamples"
                  name="workSamples3Link"
                  id="workSamples3Link"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="workSamples3Description" className="mt-5 mb-2">
                  Brief Description
                </label>
                <textarea
                  type="workSamples"
                  name="workSamples3Description"
                  id="workSamples3Description"
                  // required
                  className="bg-gray-200 rounded-lg p-2"
                />
                <label htmlFor="email" className="mt-5 mb-2">
                  Work Sample Images
                </label>
                <label htmlFor="workSamples3Files" className="mb-2">Select up to 3 files:</label>
                <input type="file" id="workSampleImages" name="workSamples3Files" onChange={(event) => {inputWorkSampleImages(event, 3)}} multiple></input>
                {workSampleImages3.map((file, index) => (
                  <div className="bg-gray-100 mt-5 p-5 rounded-3xl" key={index}>
                    {!!file && <Image width={200} height={200} src={file} alt="Uploaded preview" className="py-5" objectFit="contain" />}
                    {!!file && <div className="flex flex-col w-full"><label htmlFor="workSamples3FilesCaption">Photo Credit</label><input
                      type="workSamples"
                      name={`workSamples3FilesCaption${index}`}
                      id={`workSamples3FilesCaption${index}`}
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                    {!!file && <div className="flex flex-col w-full mt-5"><label htmlFor="workSamples3FilesAltText">Image Description (Alt Text)</label><input
                      type="workSamples"
                      name={`workSamples3FilesAltText${index}`}
                      id={`workSamples3FilesAltText${index}`}
                      // required
                      className="bg-gray-200 rounded-lg p-2 mt-2"
                /></div>}
                  </div>
                ))}
                </div>
                <div className="md:w-1/2 flex flex-col">
                <label htmlFor="email" className="mt-5 mb-2">
                  Work Sample Discipline Tags
                </label>
                {workSampleDisciplinesSection(3)}
                <div className="pt-10">
                <div className="block mb-2">Selected Disciplines: </div>
                {selectedWorkSampleDisciplines3.map((discipline, index) => {
                  return (
                    <span
                    className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border"
                      key={index}
                    >
                      <a onClick={() => handleClearSpecificDiscipline(discipline)}>
                        <Image alt="close icon" width={50} height={50} className="w-4 h-4" objectFit="contain" src="/images/close.png" />
                      </a>
                      <span className="pl-1">{discipline.name}</span>
                    </span>
                  )
                })}
                </div>
                </div>
                </div>
                </div>
                <div className="text-center">
              </div>
              </fieldset>
                <input
                  className="ml-10 rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
                  type="submit"
                  defaultValue="Submit"
                />
      </form>
    }
  }

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
            {form()}
      </div>
    </div>
    </div>
  )
}

export default IndexPage;

