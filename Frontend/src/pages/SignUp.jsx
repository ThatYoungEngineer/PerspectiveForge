import { useState } from "react"
import logo from "../assets/images/PerspectiveForge.png"
import logoLight from "../assets/images/PerspectiveForge-light.png"
import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react"
import { IoCloseCircleOutline } from "react-icons/io5"
import { IoIosCheckmarkCircleOutline } from "react-icons/io"
import { Link } from "react-router-dom"
import * as yup from "yup"
import { useFormik } from "formik"
import { useDispatch, useSelector } from "react-redux" 
import { signUpUser } from "../store/userSlice"
import OAuth from "../components/OAuth"
import { FaQuoteRight } from "react-icons/fa6"
import { FaQuoteLeft } from "react-icons/fa6"

const SignUp = () => {    
    const dispatch = useDispatch()
    const {status} = useSelector(state=>state.user) 
    const {theme} = useSelector(state=>state.theme) 
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [authBtnDisabled, setAuthBtnDisabled] = useState("")

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

    const getSignUpError = (error) => {
        setErrorMessage(error)
    }    
    const getSignUpSuccess = (success) => {
        setSuccessMessage(success)
    }
    const getAuthBtnDisabled = (disabled) => {
        setAuthBtnDisabled(disabled)
    }

  return (
    <>
        <section className="w-full md:min-h-[89vh] h-[600px] flex items-center justify-center">
            <div className={`w-1/2 h-full hidden md:FlexCenter gap-2 flex-col ${theme==='light'? 'bg-green-50': 'bg-[rgb(28,37,61)]'}`}>
                {theme === 'light' 
                    ? <img src={logo} className=" w-44 cursor-pointer" alt="logo" /> 
                    : <img src={logoLight} className=" w-44 cursor-pointer" alt="logo" /> 
                }
                <h2 className="text-sm tracking-wide flex"> <FaQuoteLeft size={10} /> Crafting Perspectives, Shaping Minds <FaQuoteRight size={10} /> </h2>
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
                        {(signUpFormik.touched.full_name && signUpFormik.errors.full_name) && <p className='mt-1 text-xs text-red-600'>{signUpFormik.errors.full_name}</p>}
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
                        {(signUpFormik.touched.email && signUpFormik.errors.email) && <p className='mt-1 text-xs text-red-600'>{signUpFormik.errors.email}</p>}
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
                            status === 'loading' ||     // Disable when submitting
                            !signUpFormik.isValid ||    // Disable when form is invalid
                            !signUpFormik.dirty ||      // Disable when form has no changes
                            Object.values(signUpFormik.values).some(value => !value.trim()) ||    // Disable when any field is empty
                            authBtnDisabled === 'disabled'
                        }
                    >
                        {status === 'loading' ?  <Spinner aria-label="Default status example" /> : "Sign Up" }    
                    </Button>
                    <OAuth
                        getSignUpError = {getSignUpError}
                        getSignUpSuccess = {getSignUpSuccess}
                        getAuthBtnDisabled = {getAuthBtnDisabled}
                    />
                    <span className="text-sm">
                        Have an account? 
                        <Link to="/login" className="ml-1 text-green-500">
                            Login
                        </Link>
                    </span>

                    {successMessage  && (
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
    </>
  )
}

export default SignUp
