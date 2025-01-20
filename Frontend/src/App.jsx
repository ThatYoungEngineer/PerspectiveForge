import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { checkUserAuth } from "./store/userSlice"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from './pages/SignUp'
import DashboardLinks from './pages/DashboardLinks'
import About from "./pages/About"
import AuthRoutes from "./components/AuthRoutes"
import PrivateRoutes from "./components/PrivateRoutes"
import AdminRoutes from "./components/AdminRoutes"
import CreatePost from "./components/CreatePost"
import RestoreScroll from "./components/RestoreScroll"
import Header from "./components/Header"
import Footer from "./components/Footer"
import UpdatePost from "./components/UpdatePost"
import Posts from "./pages/Posts"
import Post from "./pages/Post"
import PrivacyPolicy from "./pages/PrivacyPolicy"

const App = () => {

  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const getPersistedData = async () => {
    try {
      if (currentUser !== null) {
        dispatch(checkUserAuth())
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getPersistedData()
  }, [])
  
  return (
    <>
      <BrowserRouter>
      <RestoreScroll />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:slug" element={<Post />} />
        <Route element={<AuthRoutes />} >
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route element={<PrivateRoutes />} >
          <Route path="/dashboard" element={<DashboardLinks />} />
          <Route element={<AdminRoutes />}>
            <Route path="/dashboard?tab=create-new-post" element={<CreatePost />} />
            <Route path="/dashboard/update-post/:postId" element={<UpdatePost />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
      </BrowserRouter> 
    </>
  )
}

export default App