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
        <Route path="/" exact element={<Home />} />
        <Route element={<AuthRoutes />} >
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoutes />} >
          <Route path="/dashboard" element={<DashboardLinks />} />
        </Route>
        <Route element={<AdminRoutes />}>
          <Route path="/dashboard?tab=create-new-post" element={<CreatePost />} />
        </Route>
      </Routes>
      <Footer />
      </BrowserRouter> 
    </>
  )
}

export default App