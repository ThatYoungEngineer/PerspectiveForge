import underConstruction from "../assets/images/under-construction.webp"
import { useSelector } from "react-redux"

const Home = () => {
  const {currentUser} = useSelector((state) => state.user)
  const {post} = useSelector((state) => state.post)

  // console.log('home posts: ', post.isArray())
  const checkType = Array.isArray(post)
  console.log(checkType)
  return (
    <div className="w-screen min-h-screen flex flex-col justify-between">
      <div className="flex flex-col gap-20 items-center justify-center">    
        <img src={underConstruction} alt="under construction" />
      </div>
    </div>
  )
}

export default Home
