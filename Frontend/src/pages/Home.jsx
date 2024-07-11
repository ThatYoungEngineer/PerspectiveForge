import Header from "../components/Header"
import Footer from "../components/Footer"
import underConstruction from "../assets/images/under-construction.webp"
import { useSelector } from "react-redux"

const Home = () => {
  const {currentUser} = useSelector((state) => state.user)
  return (
    <div className="w-screen min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex flex-col gap-20 items-center justify-center">
        {/* <h1 className="text-4xl" >Perspective Forge</h1>
        <h1 className="text-2xl" >Home Page</h1> */}
    
        <img src={underConstruction} alt="under construction" />
      </div>
      <Footer />
    </div>
  )
}

export default Home
