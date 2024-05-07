import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { signOut } from "./store/userSlice"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import About from "./pages/About"
import AuthRoutes from "./components/AuthRoutes"
import PrivateRoutes from "./components/PrivateRoutes"


const App = () => {

  const dispatch = useDispatch()
  
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
      </Routes>
      </BrowserRouter> 
    </>
  )
}

export default App
