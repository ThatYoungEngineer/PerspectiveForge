import underConstruction from "../assets/images/under-construction.webp"
import { useSelector } from "react-redux"
import Header from '../components/Header'
import Hero from '../components/Hero'
import RecentPosts from "../components/RecentPosts"

const Home = () => {
  // const {currentUser} = useSelector((state) => state.user)
  // const {post} = useSelector((state) => state.post)

  // console.log('home posts: ', post.isArray())
  // const checkType = Array.isArray(post)
  // console.log(checkType)

  return (
    <div className="w-screen flex flex-col">
      <div className="w-screen min-h-[650px] h-screen max-h-[950px]">
        <Hero />
      </div>
      <RecentPosts />
    </div>
  )

}

export default Home
