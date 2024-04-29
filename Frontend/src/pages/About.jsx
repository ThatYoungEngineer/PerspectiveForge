import Header from "../components/Header"
import Footer from "../components/Footer"

const About = () => {
  return (
    <div className="w-screen h-screen flex justify-between flex-col ">
        <Header />
        <h1 className="mx-auto">This is About Page</h1>
        <Footer />
    </div>
  )
}

export default About