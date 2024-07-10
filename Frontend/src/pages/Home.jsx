import Header from "../components/Header"
import Footer from "../components/Footer"

const Home = () => {
  return (
    <div className="w-screen min-h-screen flex flex-col justify-between">
      <Header />
      <div className="flex h-[50vh] flex-col gap-20 items-center justify-center">
        <h1 className="text-4xl" >Perspective Forge</h1>
        <h1 className="text-2xl" >Home Page</h1>
      </div>
      <Footer />
    </div>
  )
}

export default Home
