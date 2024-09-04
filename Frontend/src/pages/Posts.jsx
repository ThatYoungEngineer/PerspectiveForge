import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPosts, showMorePosts } from "../store/postSlice"
import { Alert, Spinner, Button } from 'flowbite-react'
import { GoAlertFill } from "react-icons/go"
import PostCard from "../components/PostCard"
import { Link } from "react-router-dom"

const Posts = () => {

    const dispatch = useDispatch()
    const {post, status} = useSelector(state=>state.post)
    const [postsData, setPostsData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showMoreLoading, setShowMoreLoading] = useState(false)
    const [hideShowMore, setHideShowMore] = useState(false)

    let totalPostsFromServer = post[1]?.totalPosts
    const postsArray = post[0]
    const postsIndex = postsArray?.length  
  
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

      if (totalPostsFromServer <= postsIndex) {
        setHideShowMore(true)
      }
  
    }, [post])

    const handleShowMore = () => {
      setShowMoreLoading(true)
      dispatch(showMorePosts(postsIndex))
      .then(() => {
        setShowMoreLoading(false)
      })
    }
  
  
    return (
        <section className='w-full min-h-[90vh] px-5 md:px-16 lg:px-24 flex items-center justify-center flex-col gap-10 pb-16'>
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
                  <h2 className="mt-16 text-center font-Onest-SemiBold text-3xl lg:4xl italic">Crafting Perspectives, Shaping Minds</h2>
                  <section className="w-full max-w-[1600px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-[3vw]">
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
                  {!hideShowMore &&  
                    <Button onClick={handleShowMore} disabled={showMoreLoading}>
                      {showMoreLoading ? <Spinner /> : 'Show More'}
                    </Button>
                  }
                </>
              }
            </>
          }
        </section>
      )
}

export default Posts