import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { checkUserAuth } from "./store/userSlice"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import About from "./pages/About"
import AuthRoutes from "./components/AuthRoutes"
import PrivateRoutes from "./components/PrivateRoutes"
import AdminRoutes from "./components/AdminRoutes"
import CreatePost from "./components/CreatePost"


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
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route element={<AuthRoutes />} >
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoutes />} >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminRoutes />}>
          <Route path="/dashboard?tab=create-new-post" element={<CreatePost />} />
        </Route>
      </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App