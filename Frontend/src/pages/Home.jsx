import underConstruction from "../assets/images/under-construction.webp"
import { useSelector } from "react-redux"
import Header from '../components/Header'
import Hero from '../components/Hero'

const Home = () => {
  // const {currentUser} = useSelector((state) => state.user)
  // const {post} = useSelector((state) => state.post)

  // console.log('home posts: ', post.isArray())
  // const checkType = Array.isArray(post)
  // console.log(checkType)

  return (
    <div className="w-screen h-[200vh] flex flex-col justify-between">
        <Hero />
    </div>
  )

}

export default Home
