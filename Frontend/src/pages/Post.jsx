import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../store/postSlice'

const Post = () => {
    const dispatch = useDispatch()
    const { slug } = useParams()
    const [postData, setPostData ] = useState(null)
    useEffect(() => {
        dispatch(getPostBySlug(slug))
        .then((data) => {
            setPostData(data?.payload[0][0])
            console.log('post data: ', data)
        })
    }, [slug])
  return (
    <div className='FlexCenter min-h-screen w-full gap-2'>
            <div className='p-2 border-2 border-teal-400' key={postData?._id}>
                <img src={postData?.image} alt="" className='max-w-2xl mx-auto' />
                <h1>{postData?.title}</h1>
                <h2>{postData?.category}</h2>
                <p>{postData?.description}</p>

            </div>
    </div>
  )
}

export default Post