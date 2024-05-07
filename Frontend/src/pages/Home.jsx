import Header from "../components/Header"
import Footer from "../components/Footer"

const Home = () => {

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      <h1 className="mx-auto">This is Home Page</h1>
      <Footer />
    </div>
  )
}

export default Home