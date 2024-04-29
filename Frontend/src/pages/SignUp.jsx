import Header from "../components/Header"
import Footer from "../components/Footer"

import { useState, useEffect } from "react"
import logo from "../assets/images/PerspectiveForge.png"
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react"
// import { FaGoogle } from "react-icons/fa"
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { Link, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"
import { useDispatch, useSelector } from "react-redux" 
import { signUpUser } from "../store/userSlice"
import OAuth from "../components/OAuth"

const SignUp = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {currentUser, status} = useSelector(state=>state.user) 
    const {theme} = useSelector(state=>state.theme) 
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
      currentUser && navigate('/dashboard')
    }, [currentUser])
    

    const schema = yup.object().shape({
        full_name: yup
        .string()
        .min(3, "Name must be at least 3 characters")
        .trim()
        .required("Name is required"),
        email: yup
        .string()
        .trim()
        .required("Email is required")
        .matches( /^[A-Za-z][A-Za-z0-9.]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid Email Format' ),
        password: yup
        .string()
        .trim()
        .min(7, "Password must be at least 7 characters")
        .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{7,}$/, "Choose a strong password" )
        .required("Password is required"),
    })

    const signUpFormik = useFormik({
        initialValues: {
          full_name: "",
          email: "",
          password: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { resetForm } ) => {
            document.getElementById("password").blur();
            const userData = {
                full_name: values.full_name,
                email: values.email,
                password: values.password,
            }
            try{
                setErrorMessage("")
                setSuccessMessage("")
                dispatch(signUpUser(userData))
                .then((data) => {
                    console.log(data)
                    if (data.error?.message) {
                        setErrorMessage(data.error.message)
                    } else {
                        setSuccessMessage(data.payload.message)
                        resetForm()
                    }    
                })
            } catch (error) {
                setErrorMessage(error)
                setSuccessMessage("")         
            }
        }
    })

  return (
    <>
        <Header />
        <section className="w-full min-h-[90vh] h-[600px] flex items-center justify-center">
            <div className={`w-1/2 h-full hidden md:FlexCenter gap-2 flex-col ${theme==='light'? 'bg-green-50': 'bg-[rgb(28,37,61)]'}`}>
                <img src={logo} className=" w-44 cursor-pointer " alt="logo" />
                <h2 className="text-sm"> &quot;Crafting Perspectives, Shaping Minds&quot; </h2>
            </div>
            <div className="w-full p-10 md:w-1/2 md:p-20 FlexCenter">
                <form onSubmit={signUpFormik.handleSubmit} noValidate className="flex w-full md:max-w-md flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="full_name" value="Full Name" />
                        </div>
                        <TextInput 
                            id="full_name" 
                            name="full_name" 
                            type="text" 
                            placeholder="John Doe" 
                            value={signUpFormik.values.full_name} 
                            onBlur={signUpFormik.handleBlur}
                            onChange={signUpFormik.handleChange} 
                        />
                        {(signUpFormik.touched.full_name && signUpFormik.errors.full_name) && <p className='mt-1 text-xs text-red-500'>{signUpFormik.errors.full_name}</p>}

                    </div>
                    <div>
                        <div className="mb-2 block">
                        <Label htmlFor="email" value="Email" />
                        </div>
                        <TextInput 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="name@email.com" 
                            value={signUpFormik.values.email} 
                            onBlur={signUpFormik.handleBlur}
                            onChange={signUpFormik.handleChange} 
                        />
                        {(signUpFormik.touched.email && signUpFormik.errors.email) && <p className='mt-1 text-xs text-red-500'>{signUpFormik.errors.email}</p>}

                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password" value="Password" />
                        </div>
                        <TextInput 
                            id="password"
                            name="password"
                            type="password"
                            placeholder="pass***"
                            value={signUpFormik.values.password} 
                            onBlur={signUpFormik.handleBlur}
                            onChange={signUpFormik.handleChange} 
                        />
                        {(signUpFormik.touched.password && signUpFormik.errors.password) && <p className='mt-1 text-xs text-red-600'>{signUpFormik.errors.password}</p>}

                    </div>
                    <Button
                        type="submit"
                        className="mt-2"
                        disabled={
                            status === 'loading' || // Disable when submitting
                            !signUpFormik.isValid ||    // Disable when form is invalid
                            !signUpFormik.dirty ||      // Disable when form has no changes
                            Object.values(signUpFormik.values).some(value => !value.trim()) // Disable when any field is empty
                        }
                    >
                        {status === 'loading' ?  <Spinner aria-label="Default status example" /> : "Sign Up" }    
                    </Button>
                    <OAuth />
                    <span className="text-sm">
                        Have an account? 
                        <Link to="/signin" className="ml-1 text-green-500">
                            Sign In
                        </Link>
                    </span>

                    {successMessage && (
                        <Alert color="success" icon={IoIosCheckmarkCircleOutline}>
                            {successMessage}
                        </Alert>
                    )}
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

export default SignUp