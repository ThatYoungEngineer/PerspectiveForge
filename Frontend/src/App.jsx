import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import About from "./pages/About"
import PrivateRoutes from "./components/PrivateRoutes"


const App = () => {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
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
