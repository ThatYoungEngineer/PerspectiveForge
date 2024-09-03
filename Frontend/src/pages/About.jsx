import { useState, useEffect} from 'react'


const About = () => {

  const [ data, setData ] = useState(null)
  const [ value, setValue ] = useState('')

  useEffect(() => {

    const fetchData = async () => {
      const res =  await fetch('https://codejudge-question-artifacts-dev.s3.amazonaws.com/q-1709/data.json', {
        method: 'GET'
      })

      if (res.ok) {
        const jsonResponse = await res.json()
        console.log(jsonResponse)
        setData(jsonResponse)
      }

    }

    fetchData()

  }, [])

  const handleChange = (value) => {
    setValue(value)
  }

  const handleSearch = () => {
    const filteredData = data?.filter((d) => d.name.toLowerCase().includes(value.toLowerCase()))
    setData(filteredData)
  }

  return (
    <>
      <section className='m-10 space-y-10'>
        <div className="w-full flex gap-5">
          <input
            type="text" placeholder='search country ...' className='rounded-md w-72 text-gray-800' 
            onChange={(e) => handleChange(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button type='button' onClick={handleSearch} className='border bg-gray-400 p-2 rounded-md'>Search</button>
        </div>
        <h1>Total Flags: {data?.length}</h1>
        <section className='w-full grid grid-cols-4 gap-10'>
          {data?.map((d) => (
            <div key={d.id} className='w-fit border bg-gray-300 text-gray-600'>
              <img src={d.flag} alt={d.name} className='h-52' />
              <div className='m-2'>
                <h1 className='text-xl mb-2'>{d.name}</h1>
                <h3 className='font-Onest-SemiBold'>Population: <span className='capitalize font-Onest-Regular'>{d.population}</span> </h3>
                <h3 className='font-Onest-SemiBold'>Region: <span className='capitalize font-Onest-Regular'>{d.region}</span> </h3>
                <h3 className='font-Onest-SemiBold'>Capital: <span className='capitalize font-Onest-Regular'>{d.capital}</span> </h3>
              </div>

            </div>
          ))}
        </section>
      </section>
    </>
  )
}

export default About