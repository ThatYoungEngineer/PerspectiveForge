import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPosts } from "../store/postSlice"

const RecentPosts = () => {
  const dispatch = useDispatch()
  const {post} = useSelector(state=>state.post)
  const [postsData, setPostsData] = useState(null)
  useEffect(() => {
    if(!post || post.length === 0) {
      dispatch( getPosts() )
      .then((data) => {
        setPostsData(data.payload[0])
      })
    } else {
      setPostsData(post[0])
    }  
  }, [])

  return (
    <section className='w-full h-full px-24 flex items-center justify-center flex-col gap-10'>
      <h1 className='text-2xl md:text-3xl lg:text-4xl font-Onest-Medium'>Recent Posts</h1>
      <section className="w-full grid grid-cols-3 gap-10">
        {postsData?.map(p => (
          <div className="border border-teal-300 rounded-lg" key={p._id}>
            <img src={p.image} alt="post image" className="bg-slate-300 object-cover rounded-t-lg" />
            <div className="p-4 space-y-2">
              <h2 className="font-Onest-Medium text-xl">{p.title}</h2>
              <p className="text-sm italic">{p.category}</p>
            </div>
          </div>
        ))}
      </section>
    </section>
  )
}

export default RecentPosts