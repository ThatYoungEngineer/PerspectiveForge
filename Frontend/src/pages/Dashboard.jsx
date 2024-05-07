import Header from "../components/Header"
import Footer from "../components/Footer"
import Sidebar from "../components/Sidebar"
import Profile from "../components/Profile"
import { useLocation } from "react-router"
import { useState, useEffect } from "react"

const Dashboard = () => {

  const location = useLocation()
  const [tab, setTab] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromURL = urlParams.get("tab")
    if (tabFromURL ) {
      setTab(tabFromURL)
    }
  }, [location.search])
  
  return (
    <div className="w-scren h-full flex justify-between flex-col">
      <Header />
      <div className="w-full min-h-screen flex">
        <aside>
          <Sidebar />
        </aside>
        <section className="w-full">
          {tab === 'profile' && <Profile /> }
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard
