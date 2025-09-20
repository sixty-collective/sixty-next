'use client'; // add this part!

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ResourceCard from "@/components/resource-card";
import InfiniteScroll from 'react-infinite-scroll-component';
import Headings from "@/components/headings"


const ResourcePage = ({}) => {
  const [initial, setInitial] = useState(true)
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedResourceTags, setSelectedResourceTags] = useState([])
  const [resourceTags, setResourceTags] = useState([])
  const [results, setResults] = useState([])
  const [totalLength, setTotalLength] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [checkedCategoriesState, setCheckedCategoriesState] = useState(
    []
  )
  const [checkedResourceTagsState, setCheckedResourceTagsState] = useState(
    []
  )
  const [openCategories, setOpenCategories] = React.useState(false)
  const [openResourceTags, setOpenResourceTags] = React.useState(false)

  const toggleCategories = () => {
    setOpenCategories(!openCategories)
    setOpenResourceTags(false)
  }

  const toggleTags = () => {
    setOpenResourceTags(!openResourceTags)
    setOpenCategories(false)
  }

  const categoriesCountSection = () => {
    if (selectedCategories.length > 0) {
      return <span className="mr-2">({selectedCategories.length})</span>
    } else {
      return <span className="mr-2"></span>
    }
  }

  const tagsCountSection = () => {
    if (selectedResourceTags.length > 0) {
      return <span className="mr-2">({selectedResourceTags.length})</span>
    } else {
      return <span className="mr-2"></span>
    }
  }

  const sendSearch = async (resetPage) => {
    setIsLoading(true);
    let url;
    if (resetPage) {
      url =
      "https://sixty-backend-new.onrender.com/api/resources?sort=id&pagination[pageSize]=10&pagination[page]="+ 1 + "&populate[0]=categories&populate[1]=resource_tags"
    } else {
      url =
      "https://sixty-backend-new.onrender.com/api/resources?sort=id&pagination[pageSize]=10&pagination[page]="+ page + "&populate[0]=categories&populate[1]=resource_tags"
    }
    
    if (selectedCategories.length > 0) {
      selectedCategories.forEach((selected, index) => {
        url = url.concat("&filters[$or][" + index + "][categories][slug][$in]=" + selected.slug)
      })
    }
    
    if (selectedResourceTags.length > 0) {
      selectedResourceTags.forEach((selected, index) => {
        url = url.concat("&filters[$or][" + index + "][resource_tags][slug][$in]=" + selected.slug)
      })
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

  useEffect(() => {
    async function getData() {
      // Fetch data from a hypothetical CMS API endpoint
      const categoriesUrl = "https://sixty-backend-new.onrender.com/api/categories"
      const resourceTagsUrl = "https://sixty-backend-new.onrender.com/api/resource-tags"
      const resourcesUrl = "https://sixty-backend-new.onrender.com/api/resources?populate[0]=categories&populate[1]=resource_tags"
    
    
      const categoriesRes = await fetch(categoriesUrl);
      const categoriesJSON = await categoriesRes.json();
      setCategories(categoriesJSON.data)
      setCheckedCategoriesState(new Array(categoriesJSON.data.length).fill({status: false, category: ""}))

    
      const resourceTagsRes = await fetch(resourceTagsUrl);
      const resourceTagsJSON = await resourceTagsRes.json();
      setResourceTags(resourceTagsJSON.data)
      setCheckedResourceTagsState(new Array(resourceTagsJSON.data.length).fill({status: false, tag: ""}))
    
      const resourcesRes = await fetch(resourcesUrl);
      const resourcesJSON = await resourcesRes.json();
      setTotalLength(resourcesJSON.meta.pagination.total)
      setInitial(false)
  
    }
    getData();
  }, [initial])


  useEffect(() => {
    // if (tagSlug && initial) {
    //   setInitial(false)
    //   setSelectedResourceTags([{ name: tagName, slug: tagSlug }])
    // }
    sendSearch(true)
  }, [selectedCategories, selectedResourceTags])

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [isLoading]);
  

  const handleCategoriesApply = () => {
    const checkedBoxes = document.querySelectorAll(
      "input[class=categories-box]:checked"
    )
    const categoriesFilters = Array.from(checkedBoxes).map(input => {
      return { name: input.name, slug: input.value }
    })

    setSelectedCategories(categoriesFilters)
    toggleCategories()
  }

  const handleTagsApply = () => {
    const checkedBoxes = document.querySelectorAll(
      "input[class=tags-box]:checked"
    )
    const tagsFilters = Array.from(checkedBoxes).map(input => {
      return { name: input.name, slug: input.value }
    })

    setSelectedResourceTags(tagsFilters)
    toggleTags()
  }

  const handleClearCategories = () => {
    setSelectedCategories([])
    toggleCategories()
    setCheckedCategoriesState(
      new Array(categories.length).fill({status: false, category: ""})
    )
  }

  const handleClearTags = () => {
    setSelectedResourceTags([])
    toggleTags()
    setCheckedResourceTagsState(
      new Array(resourceTags.length).fill({status: false, tag: ""})
    )
  }

  const handleCategoriesChange = (position, category) => {
    const updatedCheckedCategoriesState = checkedCategoriesState.map(
      (item, index) => {
        return (index === position ? {status: !item.status, category: category} : item)
      }
    )

    setCheckedCategoriesState(updatedCheckedCategoriesState)
  }

  const handleTagsChange = (position, tag) => {
    const updatedCheckedResourceTagsState = checkedResourceTagsState.map(
      (item, index) => {
        return (index === position ? {status: !item.status, tag: tag} : item)
      }
    )

    setCheckedResourceTagsState(updatedCheckedResourceTagsState)
  }

  const handleClearSpecificCategory = (clearCategory) => {
    setSelectedCategories(selectedCategories.filter(function(category) { 
        return category !== clearCategory 
    }));
    let newArray = checkedCategoriesState.map(function(category) { 
      console.log(category)
      console.log(clearCategory)
      if (category.category.slug !== clearCategory.slug) {
        return category
      } else {
        return {status: false, category: category.category}
      }
    })

    setCheckedCategoriesState(newArray)
  }

  const handleClearSpecificTag = (clearTag) => {
    setSelectedResourceTags(selectedResourceTags.filter(function(tag) { 
        return tag !== clearTag 
    }));
    let newArray = checkedResourceTagsState.map(function(tag) { 
      if (tag.tag.slug !== clearTag.slug) {
        return tag
      } else {
        return {status: false, tag: tag.tag}
      }
    })
    setCheckedResourceTagsState(newArray)
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

  function fcategories() {
    if (categories.length > 0) {
      return (
        <div className=" bg-white border-2 border-black rounded-2xl bg-white">
          <div className="p-5">
            {categories.map((category, index) => {
              return (
                <li className="list-none" key={index}>
                  <Checkbox
                    obj={category}
                    index={index}
                    check="categories-box"
                    checked={checkedCategoriesState[index].status}
                    onChange={() => handleCategoriesChange(index, category)}
                  />
                </li>
              )
            })}
          </div>
          <div className="flex border-t-2 border-black p-5 justify-between items-center">
            <a href="#" onClick={handleClearCategories}>
              Clear All
            </a>
            <button
              className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
              onClick={handleCategoriesApply}
            >
              Apply
            </button>
          </div>
        </div>
      )
    }
  }

  function ftags() {
    return (
      <div className=" bg-white border-2 border-black rounded-2xl bg-white">
        <div className="p-5">
          {resourceTags.map((tag, index) => {
            return (
              <li className="list-none" key={index}>
                <Checkbox
                  obj={tag}
                  index={index}
                  check="tags-box"
                  checked={checkedResourceTagsState[index].status}
                  onChange={() => handleTagsChange(index,tag)}
                />
              </li>
            )
          })}
        </div>
        <div className="flex border-t-2 border-black p-5 justify-between items-center">
          <a href="#" onClick={handleClearTags}>
            Clear All
          </a>
          <button
            className="rounded-full px-3 text-sm bg-black text-white p-1 border-black border-2"
            onClick={handleTagsApply}
          >
            Apply
          </button>
        </div>
      </div>
    )
  }

  const categoriesSection = openCategories ? (
    <div className="absolute mt-3 z-50">{fcategories()}</div>
  ) : (
    <span></span>
  )

  const tagsSection = openResourceTags ? (
    <div className="absolute mt-3 z-50">{ftags()}</div>
  ) : (
    <span></span>
  )

  const yourSearch =
    selectedCategories.length > 0 || selectedResourceTags.length > 0 ? (
      <div className="mt-5">
        <div className="text-xs">Your search:</div>
        {selectedCategories.map((categories, index) => {
          return (
            <span
            className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border items-center"
              key={index}
            >
              <a href="#" onClick={() => handleClearSpecificCategory(categories)}>
                <Image alt="" width={50} height={50} className="w-4 h-4" objectFit="contain" src="/images/close.png" />
              </a>
              <span className="pl-1">{categories.name}</span>
            </span>
          )
        })}
        {selectedResourceTags.map((tag, index) => {
          return (
            <span
            className="text-xs mr-2 rounded-full px-1 bg-white inline-flex font-fira border-black border items-center"
              key={index}
            >
              <a href="#" onClick={() => handleClearSpecificTag(tag)}>
                <Image width={50} height={50} alt="" className="w-4 h-4" objectFit="contain" src="/images/close.png" />
              </a>
              {tag.name}
            </span>
          )
        })}
      </div>
    ) : (
      <div></div>
    )

    function fetchData() {
      console.log("fetch more")
      sendSearch();
    }

  const resourceGrid = (results.length > 0) ? (
    <InfiniteScroll
      dataLength={results.length} //This is important field to render the next data
      next={fetchData}
      hasMore={hasMore}
      loader={<h4>Loading!...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b></b>
        </p>
      }
    >
          <div className="container py-10 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {results.map((resource, index) => (
        
        <ResourceCard resource={resource} key={index} index={index} />
      ))}
    </div>
    </InfiniteScroll>
  ) : (
    <div className="container">
    {isLoading ? (<div className="mt-10 p-10 bg-white rounded-3xl font-fira border-black border-2 shadow-md">
    Loading... 
    </div>): (<div className="mt-10 p-10 bg-white rounded-3xl font-fira border-black border-2 shadow-md">
    Unfortunately, there are no resources that match your search requirements. We are regularly updating our database with more members, so please check back again soon. 
    </div>)}
  </div>
  )

  return (
    <div>
      <Headings
        title={"Knowledge Share"}
        description={"Browse through our carefully selected articles, tools, career advice, and more."}
      />
      <main className="flex flex-col justify-center items-center w-full">
      <div className="flex flex-col w-full border-black border-b-2 items-center bg-[#F8E3D3]">
        <h2 className="text-5xl min-[400px]:text-6xl sm:text-7xl min-[400px]:leading-extra-tight leading-extra-tight md:text-8xl text-center uppercase font-bold w-full mb-10 px-8 pt-10 knowledge-gradient">
            Knowledge Share
          </h2>
          <div className="flex w-full flex-col items-center justify-center max-w-screen-xl margin-auto">
            <div className="lg:px-20 w-full">
            <div className="flex flex-col border-black px-8 lg:px-32 py-8 mx-10 rounded-t-extra rounded-t-3xl knowledge-gradient top-curve-border">
            <div className="flex flex-col md:flex-row justify-center w-full">
              <div className="mr-0 md:mr-5 font-bold poppins  md:w-1/2 md:block">
                <div className="text-center md:text-left font-normal">Browse through our carefully selected articles, tools, career advice, and more.</div>
              </div>
              <div className="ml-0 mt-10 md:mt-0 md:ml-5 w-full flex items-center flex-col md:w-1/2 md:items-start">
                <div className="hidden text-xs md:block">Select from these Categories and Tags:</div>
                <div className="block text-md md:hidden">
                  Select from these Categories and Tags:
                </div>
                <div className="mt-2 text-left">
                  <button
                    className={"mr-2 mb-2 rounded-full px-3 text-sm p-1 border-black border-2 inline-flex items-center " + 
                    (openCategories || selectedCategories.length > 0
                      ? "bg-black text-white "
                      : "bg-white text-black ")
                    }
                    onClick={toggleCategories}
                  >
                    Categories {categoriesCountSection()} {openCategories ? <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
      <path d="M5.00784 0.00168852C5.17445 0.00136286 5.3359 0.0594578 5.46419 0.165889L9.74241 3.73547C9.88803 3.85665 9.9796 4.03079 9.99698 4.21956C10.0144 4.40834 9.95614 4.5963 9.83511 4.7421C9.71408 4.88789 9.54016 4.97957 9.35161 4.99698C9.16307 5.01438 8.97534 4.95608 8.82973 4.83491L5.00784 1.63656L1.18596 4.72068C1.11303 4.77998 1.0291 4.82427 0.939019 4.85099C0.848934 4.87771 0.754464 4.88635 0.661036 4.87639C0.567607 4.86644 0.477064 4.8381 0.39461 4.793C0.312157 4.7479 0.239419 4.68693 0.180577 4.61359C0.115277 4.54018 0.0658217 4.45407 0.0353089 4.36063C0.00479609 4.2672 -0.00611584 4.16847 0.00325593 4.07061C0.0126277 3.97276 0.04208 3.8779 0.0897704 3.79198C0.137461 3.70605 0.202361 3.63092 0.280403 3.57127L4.55863 0.123055C4.6906 0.0334463 4.84876 -0.00928495 5.00784 0.00168852Z" fill="white" />
    </svg> : (selectedCategories.length > 0 ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="white"/>
    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="#1B1B1B"/>
    </svg>)}
                  </button>
                  {categoriesSection}
                  <button
                    className={
                      "mr-2 rounded-full px-3 text-sm p-1 border-black border-2 inline-flex items-center " +
                      (openResourceTags || selectedResourceTags.length > 0
                        ? "bg-black text-white"
                        : "bg-white text-black")
                    }
                    onClick={toggleTags}
                  >
                    Tags {tagsCountSection()} {openResourceTags ? <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
      <path d="M5.00784 0.00168852C5.17445 0.00136286 5.3359 0.0594578 5.46419 0.165889L9.74241 3.73547C9.88803 3.85665 9.9796 4.03079 9.99698 4.21956C10.0144 4.40834 9.95614 4.5963 9.83511 4.7421C9.71408 4.88789 9.54016 4.97957 9.35161 4.99698C9.16307 5.01438 8.97534 4.95608 8.82973 4.83491L5.00784 1.63656L1.18596 4.72068C1.11303 4.77998 1.0291 4.82427 0.939019 4.85099C0.848934 4.87771 0.754464 4.88635 0.661036 4.87639C0.567607 4.86644 0.477064 4.8381 0.39461 4.793C0.312157 4.7479 0.239419 4.68693 0.180577 4.61359C0.115277 4.54018 0.0658217 4.45407 0.0353089 4.36063C0.00479609 4.2672 -0.00611584 4.16847 0.00325593 4.07061C0.0126277 3.97276 0.04208 3.8779 0.0897704 3.79198C0.137461 3.70605 0.202361 3.63092 0.280403 3.57127L4.55863 0.123055C4.6906 0.0334463 4.84876 -0.00928495 5.00784 0.00168852Z" fill="white" />
    </svg> : (selectedResourceTags.length > 0 ? <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="white"/>
    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="5" viewBox="0 0 11 5" fill="none">
      <path d="M5.26759 4.99831C5.09179 4.99864 4.92143 4.94054 4.78606 4.83411L0.271798 1.26453C0.11815 1.14335 0.0215264 0.969215 0.00318368 0.780437C-0.0151591 0.591658 0.0462815 0.403697 0.173989 0.257904C0.301697 0.11211 0.48521 0.020426 0.684159 0.00302095C0.883107 -0.0143841 1.08119 0.0439153 1.23484 0.165095L5.26759 3.36344L9.30033 0.279322C9.37729 0.22002 9.46584 0.175734 9.5609 0.149011C9.65595 0.122288 9.75564 0.113654 9.85422 0.123605C9.9528 0.133557 10.0483 0.161897 10.1353 0.206998C10.2223 0.252099 10.2991 0.313071 10.3612 0.386409C10.4301 0.459815 10.4823 0.545932 10.5145 0.639365C10.5467 0.732798 10.5582 0.831533 10.5483 0.929385C10.5384 1.02724 10.5073 1.1221 10.457 1.20802C10.4067 1.29395 10.3382 1.36908 10.2559 1.42873L5.74158 4.87695C5.60233 4.96655 5.43544 5.00928 5.26759 4.99831Z" fill="#1B1B1B"/>
    </svg>)}
                  </button>
                  {tagsSection}
                </div>
              </div>
              </div>
              <div>{yourSearch}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="container flex-col justify-start mt-10 lg:px-20">
        <h2 className="text-xl font-bold">Search Results ({totalLength})</h2>
        </div>
        {resourceGrid}
      </main>
    </div>
  )
}


export default ResourcePage;

