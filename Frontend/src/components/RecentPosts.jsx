import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPosts } from "../store/postSlice"
import { Alert, Spinner, Button } from 'flowbite-react'
import { GoAlertFill } from "react-icons/go"
import PostCard from "./PostCard"
import { Link } from "react-router-dom"

const RecentPosts = () => {
  const dispatch = useDispatch()
  const {post} = useSelector(state=>state.post)
  const [postsData, setPostsData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(!post || post.length === 0) {
      setLoading(true)
      dispatch( getPosts() )
      .then((data) => {
        setLoading(false)
        if (data?.error) setError(data?.error?.message)
        else setPostsData(data.payload[0])
      })
    } else {
      setPostsData(post[0])
    }  
  }, [])

  return (
    <section className='w-full h-full px-24 pb-24 flex items-center justify-center flex-col gap-10'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl font-Onest-Medium'>Recent Posts</h1>
      {loading ?
        <Spinner size='xl' className="mt-20 mb-10" />
      : 
        <>
          {error ? 
            <Alert color='failure' icon={GoAlertFill}>
              {error}
            </Alert>
          :  
            <>
              <section className="w-full max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {postsData?.map(p => (
                  <Link to={`/posts/${p.slug}`} key={p._id}>
                    <PostCard
                      image = {p.image}
                      title = {p.title}
                      category = {p.category}
                      updatedAt = {p.updatedAt}
                    />
                  </Link>
                ))}
              </section>
              <Link to={'/posts'}>
                <Button>
                  View All Posts
                </Button>
              </Link>
            </>
          }
        </>
      }
    </section>
  )
}

export default RecentPosts
