import Sidebar from "../components/Sidebar"
import MemoizedProfile from "../components/Profile"
import { useLocation } from "react-router"
import { useState, useEffect } from "react"
import CreatePost from "../components/CreatePost"
import Posts from "../components/Posts"

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
      <div className="w-full min-h-screen flex">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        <section className="w-full">
          {tab === 'profile' && <MemoizedProfile /> }
          {tab === 'create-new-post' && <CreatePost /> }
          {tab === 'posts' && <Posts /> }
        </section>
      </div>
    </>
  )
}

export default Dashboard
