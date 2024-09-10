import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug } from '../store/postSlice'
import { Spinner, Button, Alert } from 'flowbite-react'
import { GoAlertFill, GoPencil } from 'react-icons/go'
import CommentSection from '../components/CommentSection'

const Post = () => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state=>state.user)  
    const { slug } = useParams()
    const [postData, setPostData ] = useState(null)
    const [loading, setLoading ] = useState(false)
    const [error, setError ] = useState("")

    useEffect(() => {
      setLoading(true)
      dispatch(getPostBySlug(slug))
      .then((data) => {
        setLoading(false)
        if (data?.error) {
          setError(data?.error?.message)
        } else setPostData(data?.payload[0][0])
      })
    }, [slug])

  return loading 
  ? <section className='w-full h-[90vh] FlexCenter'>
      <Spinner size="xl" />
    </section>
  : 
    error ? 
      <div className='h-[90vh] FlexCenter'>
        <Alert color='failure' icon={GoAlertFill} > {error}! Invalid Slug </Alert>
      </div>
    :
    <section className={`flex items-center flex-col gap-10 px-28 ${currentUser?.userData?.isAdmin ? 'py-5' : 'py-16'} `}>
      {currentUser?.userData?.isAdmin && 
        <div className='w-full flex items-center justify-end'> 
          <Link to={`/dashboard/update-post/${postData?._id}`}>
            <Button> <GoPencil className='self-center mr-2' />Edit Post</Button>
          </Link>
        </div>
      }
      <h1 className='text-4xl leading-tight font-Onest-Medium max-w-2xl text-center'>{postData?.title}</h1>
      <Button pill className="text-sm italic text-center" size='xs' color='gray' type='button'>
        {postData?.category}
      </Button>
      <img src={postData?.image} alt="post-image" className='rounded-lg' />
      <section className='w-full px-28 space-y-3'>
        <div className='w-full flex justify-between items-center text-xs px-5'>
          <p>{new Date(postData?.updatedAt).toLocaleDateString()}</p>
          <p className='italic'>
            {(postData?.description.length / 1000).toFixed(0) == 0 ? 'Less than 1 minute read' : `${(postData?.description.length / 1000).toFixed(0)} minutes read`}
          </p>
        </div>
        <hr />
        <section dangerouslySetInnerHTML={{__html: postData?.description}} className='px-5 post-content text-gray-700 dark:text-gray-200'> 
        </section>
      </section>
      <CommentSection id={postData?._id} />
  </section>
}

export default Post