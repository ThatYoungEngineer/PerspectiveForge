import Header from "../components/Header"
import Footer from "../components/Footer"
const Dashboard = () => {
  return (
    <div className="w-scren h-screen flex justify-between flex-col">
        <Header />
        <div className="w-full flex items-center justify-center">
            <h1 className="text-xl" >This is Dashboard Page</h1>
        </div>
        <Footer />
    </div>
  )
}

export default Dashboard