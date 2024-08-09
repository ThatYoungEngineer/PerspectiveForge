import { useDispatch, useSelector } from "react-redux"
import { getPosts, showMorePosts } from "../store/postSlice"
import { useEffect, useState, memo } from "react"
import { Spinner, Alert, Table } from "flowbite-react"
import { GoPencil, GoAlertFill, GoTrash } from "react-icons/go"
import { FaRegEye } from "react-icons/fa"
import { Link } from "react-router-dom"

const Posts = () => {
  const dispatch = useDispatch()
  const { post, status, error } = useSelector(state => state.post)
  const { currentUser } = useSelector(state => state.user)

  let totalPostsFromServer = post[1]?.totalPosts
  const postsArray = post[0]
  const postsIndex = postsArray?.length

  const [showMore, setShowMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [hideShowMore, setHideShowMore] = useState(false)

  useEffect(() => {
    if ( currentUser.userData.isAdmin) {
      if (!post || post.length === 0) {
        dispatch(getPosts())
      }
    }
    console.log('totalPosts: ', totalPostsFromServer?.totalPosts)
    console.log('postsIndex: ', postsIndex)

    if (totalPostsFromServer <= postsIndex) {
      setHideShowMore(true)
    }
  }, [post])

  console.log(hideShowMore)


  const handleShowMore = () => {
    setLoading(true)
    setShowMore(false)
    dispatch(showMorePosts(postsIndex))
    .then(() => {
      setLoading(false)
      setShowMore(true)
    })
  }

  return (
    <>
            {currentUser.userData.isAdmin
            ?   <>
                    {status === 'loading' && (
                        <div className="w-full h-[85%] flex items-center justify-center">
                            <Spinner size='xl' />
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="w-full h-[85%] flex items-center justify-center">
                            <Alert color='failure' icon={GoAlertFill} className="w-full px-10">
                              {error}
                            </Alert>
                        </div>
                    )}

                    {status === 'fulfilled' && (
                        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 ">
                            <Table hoverable className="shadow-md rounded-xl" >
                                <Table.Head >
                                    <Table.HeadCell className="w-1/6 whitespace-nowrap" >Date Updated</Table.HeadCell>
                                    <Table.HeadCell className="w-1/6 whitespace-nowrap">Post Image</Table.HeadCell>
                                    <Table.HeadCell className="w-1/6 whitespace-nowrap">Post Title</Table.HeadCell>
                                    <Table.HeadCell className="w-1/6 whitespace-nowrap">Category</Table.HeadCell>
                                    <Table.HeadCell className="w-1/6 whitespace-nowrap">Actions</Table.HeadCell>
                                </Table.Head>
                                {postsArray.map((p) => (
                                    <Table.Body key={p._id} className="divide-y" >
                                        <Table.Row className="w-full">
                                            <Table.Cell className="w-1/6 whitespace-nowrap">
                                              {new Date(p.updatedAt).toLocaleDateString()}
                                            </Table.Cell>
                                            <Table.Cell className="w-1/6 whitespace-nowrap" >
                                                <div className="w-28 h-16 max-w-28 max-h-16 overflow-hidden border-none rounded-md">
                                                  <img src={p.image} alt={p.title} className="bg-gray-300 w-28 h-16 hover:scale-[1.1] transition-all ease-in-out duration-200 border-none object-center object-fill " />
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className=" min-w-[70vw] md:min-w-[50vw] lg:min-w-[60%] lg:w-full font-Onest-SemiBold " > {p.title} </Table.Cell>
                                            <Table.Cell className="w-1/6 whitespace-nowrap" > {p.category} </Table.Cell>
                                            <Table.Cell className="w-1/6 whitespace-nowrap" > 
                                              <div className="flex items-center" >
                                                <Link to={`/post/${p.slug}`}>
                                                  <div className="ActionButtonBG"> <FaRegEye size={15} /> </div>
                                                </Link>
                                                <Link to={`/update-post/${post._id}`}>
                                                  <div className="ActionButtonBG"> <GoPencil size={15} /> </div>
                                                </Link>
                                                <div className="ActionButtonBG"> <GoTrash size={15} color="red" /> </div>
                                              </div>    
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ))}
                                  {hideShowMore == false &&
                                    <Table.Body>
                                      <Table.Row className="w-full">
                                        <Table.Cell className="w-full" colSpan="5" >
                                        {loading
                                        ? <div className="FlexCenter h-[10vh]">
                                          <Spinner size='xl' />
                                        </div> 
                                        : showMore && (
                                          <div
                                            onClick={handleShowMore}
                                            className='w-full text-teal-500 self-center text-sm py-7 hover:underline FlexCenter cursor-pointer'
                                          >
                                            Show more
                                          </div>
                                        )}

                                        </Table.Cell>
                                      </Table.Row>
                                    </Table.Body>
      }
                            </Table>
                        </div>
                    )}
                </>  
            : <p className="mx-auto text-base">No posts found.</p>
            }
        </>
  )
}

const postsMemo = memo(Posts)
export default postsMemo