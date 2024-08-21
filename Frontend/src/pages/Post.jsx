import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getPostBySlug } from '../store/postSlice'
import { Spinner } from 'flowbite-react'

const Post = () => {
    const dispatch = useDispatch()
    const { slug } = useParams()
    const [postData, setPostData ] = useState(null)
    const [loading, setLoading ] = useState(false)
    useEffect(() => {
      setLoading(true)
      dispatch(getPostBySlug(slug))
      .then((data) => {
        setPostData(data?.payload[0][0])
        setLoading(false)
      })
    }, [slug])

    console.log('post data', postData)
  return loading 
  ? <section className='w-full h-[90vh] FlexCenter'>
      <Spinner size="xl" />
    </section>
  : <section className='flex items-center flex-col gap-10 px-28 py-16'>
      <h1 className='text-4xl leading-tight font-Onest-Medium max-w-2xl text-center'>{postData?.title}</h1>
      <span className='text-xs p-2 border border-slate-300 rounded-full'>{postData?.category}</span>
      <img src={postData?.image} alt="post-image" className='bg-slate-200 rounded-lg' />
      <section className='w-full px-28 space-y-3'>
        <div className='w-full flex justify-between items-center text-xs px-5'>
          <p>{new Date(postData?.updatedAt).toLocaleDateString()}</p>
          <p className='italic'>{(postData?.description.length / 1000).toFixed(0)} minutes read</p>
        </div>
        <hr />
        <section dangerouslySetInnerHTML={{__html: postData?.description}} className='px-5 post-content text-gray-700 dark:text-gray-200'> 
        </section>
      </section>
  </section>
}

export default Post