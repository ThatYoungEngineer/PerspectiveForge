import Header from "../components/Header"
import Footer from "../components/Footer"

const Home = () => {
  return (
    <>
      <Header />
      <div className="w-screen h-screen flex flex-col gap-20 items-center justify-center">
        <h1 className="text-4xl" >Perspective Forge</h1>
        <h1 className="text-2xl" >Home Page</h1>
      </div>
      <Footer />
    </>
  )
}

export default Home
