import Header from "../components/Header"
import Footer from "../components/Footer"
import Sidebar from "../components/Sidebar"
import Profile from "../components/Profile"
import { useLocation } from "react-router"
import { useState, useEffect } from "react"
import CreatePost from "../components/CreatePost"

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
    <>
      <Header />
      <div className="w-full min-h-screen flex">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        <section className="w-full">
          {tab === 'profile' && <Profile /> }
          {tab === 'create-new-post' && <CreatePost /> }
        </section>
      </div>
      <Footer />
    </>
  )
}

export default Dashboard
