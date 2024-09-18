import Sidebar from "../components/Sidebar";
import MemoizedProfile from "../components/Profile";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import CreatePost from "../components/CreatePost";
import DashboardPosts from "../components/DashboardPosts";
import DashboardMemo from "../components/Dashboard";

const DashboardLinks = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const [dash, setDash] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");

    if (tabFromURL) {
      setTab(tabFromURL)
      setDash(false)
    } else if (location.pathname === "/dashboard" && location.search === "") {
      setDash(true)
      setTab("")
    } else {
      setDash(false)
    }
  }, [location.search, location.pathname])

  return (
    <div className="w-full min-h-screen flex">
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>
      <section className="w-full">
        {dash && <DashboardMemo />}
        {tab === "profile" && <MemoizedProfile />}
        {tab === "create-new-post" && <CreatePost />}
        {tab === "posts" && <DashboardPosts />}
      </section>
    </div>
  );
};

export default DashboardLinks;
