import Header from "../components/Header"
import Footer from "../components/Footer"
import OAuth from "../components/OAuth"

import { useState } from "react"
import logo from "../assets/images/PerspectiveForge.png"
import logoLight from "../assets/images/PerspectiveForge-light.png"
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react"
// import { FaGoogle } from "react-icons/fa"
import { IoCloseCircleOutline } from "react-icons/io5"
import { Link } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"
import { useDispatch, useSelector } from "react-redux"
import { signInUser } from "../store/userSlice"

const SignIn = () => {

  const dispatch = useDispatch()
  const {theme} = useSelector(state=>state.theme)
  const [errorMessage , setErrorMessage] = useState(null)
  const [googleBtnStatus , setGoogleBtnStatus] = useState(false)

  const schema = yup.object().shape({
    email: yup
    .string()
    .trim()
    .required("Email is required")
    .matches( /^[A-Za-z][A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid Email Format' ),
    password: yup
    .string()
    .trim()
    .required("Password is required"),
  })

  const loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values ) => {
      const userData = {
        email: values.email,
        password: values.password,
      }
      try {
        setErrorMessage('')
        setGoogleBtnStatus(true)
        await dispatch(signInUser(userData))
        .then((data) => data.error?.message && setErrorMessage(data.error.message))
        setGoogleBtnStatus(false)
      } catch (error) {
        setErrorMessage(error)  
      }
    }
  })

  return (
    <>
        <Header />
        <section className="w-full md:min-h-[90vh] h-[600px] flex items-center justify-center">
            <div className={`w-1/2 h-full hidden md:FlexCenter gap-2 flex-col ${theme==='light'? 'bg-green-50': 'bg-[rgb(28,37,61)]'}`}>
              {theme === 'light' 
                ? <img src={logo} className=" w-44 cursor-pointer" alt="logo" /> 
                : <img src={logoLight} className=" w-44 cursor-pointer" alt="logo" /> 
              }
              <h2 className="text-sm"> &quot;Crafting Perspectives, Shaping Minds&quot; </h2>
            </div>
            <div className="w-full p-10 md:w-1/2 md:p-20 FlexCenter">
                <form onSubmit={loginFormik.handleSubmit} noValidate className="flex w-full md:max-w-md flex-col gap-4">
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="email" value="Email" />
                      </div>
                      <TextInput 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="name@email.com" 
                        value={loginFormik.values.email} 
                        onBlur={loginFormik.handleBlur}
                        onChange={loginFormik.handleChange} 
                      />
                      {(loginFormik.touched.email && loginFormik.errors.email) && <p className='mt-1 text-xs text-red-600'>{loginFormik.errors.email}</p>}
                    </div>
                    <div>
                      <div className="mb-2 block">
                        <Label htmlFor="password" value="Password" />
                      </div>
                      <TextInput 
                        id="password"
                        name="password"
                        type="password"
                        placeholder="password"
                        value={loginFormik.values.password} 
                        onBlur={loginFormik.handleBlur}
                        onChange={loginFormik.handleChange} 
                      />
                      {(loginFormik.touched.password && loginFormik.errors.password) && <p className='mt-1 text-xs text-red-600'>{loginFormik.errors.password}</p>}
                    </div>
                    <Button 
                      type="submit" 
                      className="mt-2"
                      disabled={
                        loginFormik.isSubmitting || // Disable when submitting
                        !loginFormik.isValid ||    // Disable when form is invalid
                        !loginFormik.dirty ||      // Disable when form has no changes
                        Object.values(loginFormik.values).some(value => !value.trim()) // Disable when any field is empty
                      }
                    >
                      {loginFormik.isSubmitting ?  <Spinner aria-label="Default status example" /> : "Sign In" }    
                    </Button>
                    <OAuth btnStatus = {googleBtnStatus} />
                    <span className="text-sm">
                      Don&apos;t have an account? 
                      <Link to="/signup" className="ml-1 text-green-500">
                        Sign Up
                      </Link>
                    </span>
                    {errorMessage && (
                      <Alert color="failure" icon={IoCloseCircleOutline}>
                        {errorMessage}
                      </Alert>
                    )}
                </form>
            </div>
        </section>
        <Footer />
    </>
  )
}

export default SignIn