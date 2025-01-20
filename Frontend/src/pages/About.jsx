// import { useState, useEffect} from 'react'


// const About = () => {

//   const [ data, setData ] = useState(null)
//   const [ value, setValue ] = useState('')

//   useEffect(() => {

//     const fetchData = async () => {
//       const res =  await fetch('https://codejudge-question-artifacts-dev.s3.amazonaws.com/q-1709/data.json', {
//         method: 'GET'
//       })

//       if (res.ok) {
//         const jsonResponse = await res.json()
//         console.log(jsonResponse)
//         setData(jsonResponse)
//       }

//     }

//     fetchData()

//   }, [])

//   const handleChange = (value) => {
//     setValue(value)
//   }

//   const handleSearch = () => {
//     return
//   }

//   const displayedMaps = data?.filter((d) => d.name.toLowerCase().includes(value.toLowerCase()))
//   const lengthOfDisplayedMaps = displayedMaps?.length

//   return (
//     <>
//       <section className='m-10 space-y-10'>
//         <div className="w-full flex gap-5">
//           <input
//             type="text" placeholder='search country ...' className='rounded-md w-72 text-gray-800' 
//             onChange={(e) => handleChange(e.target.value)} 
//             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//           />
//           <button type='button' onClick={handleSearch} className='border bg-gray-400 p-2 rounded-md'>Search</button>
//         </div>
//         <div className='flex gap-10'>
//           <h1>Total Flags: {data?.length}</h1>
//           <h1>Total Searched Flags: {lengthOfDisplayedMaps}</h1>
//         </div>
//         <section className='w-full grid grid-cols-4 gap-10'>
//           {displayedMaps?.map((d) => (
//             <div key={d.id} className='w-fit border bg-gray-300 text-gray-600'>
//               <img src={d.flag} alt={d.name} className='h-52' />
//               <div className='m-2'>
//                 <h1 className='text-xl mb-2'>{d.name}</h1>
//                 <h3 className='font-Onest-SemiBold'>Population: <span className='capitalize font-Onest-Regular'>{d.population}</span> </h3>
//                 <h3 className='font-Onest-SemiBold'>Region: <span className='capitalize font-Onest-Regular'>{d.region}</span> </h3>
//                 <h3 className='font-Onest-SemiBold'>Capital: <span className='capitalize font-Onest-Regular'>{d.capital}</span> </h3>
//               </div>

//             </div>
//           ))}
//         </section>
//       </section>
//     </>
//   )
// }

// export default About


import React from 'react'

const About = () => {
  return (
    <div className="w-screen flex flex-col">
      <div className="w-screen min-h-full p-16">
        <h1 className='font-Onest-Medium text-2xl text-center '>About
            <span className='font-Onest-Bold'> Perspective Forge</span>
        </h1>
        <div className='space-y-5 my-10 leading-10  text-lg'>
          <p>
            Perspective Forge is an innovative blog platform designed to empower creators, thinkers, and visionaries to share their perspectives with the world. Whether you're a seasoned blogger or just starting your journey in the world of content creation, Perspective Forge provides a seamless, intuitive environment to craft, publish, and share your ideas.
          </p>
          <p>
            Our platform is built with a focus on user experience, offering a clean and modern interface for writing, commenting, and connecting with others. We believe that every voice has value, and our mission is to give people the tools they need to express themselves freely and meaningfully.          
          </p>
          <p>
            At Perspective Forge, we offer more than just a blogging platform — we aim to cultivate a community of individuals who value thoughtful discussion, diverse viewpoints, and constructive feedback. Our features are designed to help you not only share your thoughts but also engage with a global community, find inspiration, and learn from others.
          </p>
          <p>
            We are committed to providing a safe and inclusive space for all users, where privacy and security are top priorities. Whether you’re here to write, read, or connect, Perspective Forge is the platform where your ideas can thrive.          
          </p>
        </div>
      </div>
    </div>

  )
}

export default About
