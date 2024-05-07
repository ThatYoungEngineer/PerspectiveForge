import { useDispatch, useSelector } from "react-redux"
import { Button, TextInput, Alert, Spinner } from "flowbite-react"
import { MdModeEditOutline } from "react-icons/md"
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs"
import { useState, useRef, useEffect } from "react"
import * as yup from "yup"
import { useFormik } from "formik"

import {
    getDownloadURL,
    ref,
    getStorage,
    uploadBytesResumable
} from 'firebase/storage'

import { app } from '../utils/firebase.js'
import { updateUser } from "../store/userSlice.js"

const Profile = () => {

    const dispatch = useDispatch()
    const { currentUser, status } = useSelector(state => state.user)

    const [showPassword, setShowPassword] = useState(false)
    const [imageFile, setImageFile] = useState(null)
    const [imageUploadingProgress, setImageUploadingProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileURL, setImageFileURL] = useState(null)
    const [formSuccessMessage, setFormSuccessMessage] = useState(null)
    const [formErrorMessage, setFormErrorMessage] = useState(null)
    const filePickerRef = useRef()

    console.log("imagefileURL: ", imageFileURL)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleImageChange = (e) => {
        setImageFileUploadError(null)
        setImageFile(null)
        setImageFileURL(null)

        const file = e.target.files[0]

        if (file.type.includes('image/')) {
            if (file.size < 2097152) {        //  Greater than 2MB
                setImageFile(file)
                setImageFileURL(URL.createObjectURL(file))
            } else setImageFileUploadError('Failure. Image must be less than 2MB!')
        } else setImageFileUploadError('Failure. File type must be an image!')
    }


    const uploadImage = async () => {
        setImageFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        console.log("UploadTask", uploadTask)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setImageUploadingProgress(progress.toFixed(0))
        }, (err) => {
            setImageFileUploadError("Could not upload image. Please try again!")
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setImageFileURL(url)
            })
        })
    }

    useEffect(() => {
      if (imageFile) {
        uploadImage()
      }
    }, [imageFile])
    

    const schema = yup.object().shape({
        profilePhoto: yup
        .mixed(),
        full_name: yup
        .string()
        .min(3, "Name must be at least 3 characters")
        .trim(),
        password: yup
        .string()
        .trim()
        .min(7, "Password must be at least 7 characters")
        .matches( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{7,}$/, "Choose a strong password" ),
        confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')        
    })

    const updateUserFormik = useFormik({
        initialValues: {
          full_name: currentUser.userData.full_name,
          email: currentUser.userData.email,
          profilePhoto: currentUser.userData.profilePhoto,
          password: "",
          confirmPassword: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { resetForm } ) => {
            const userData = {
                id: currentUser.userData._id,
                profilePhoto: imageFileURL ?? currentUser.userData.profilePhoto,
                full_name: values.full_name,
                password: values.password,
            }
            try{
                setFormErrorMessage("")
                setFormSuccessMessage("")
                dispatch(updateUser(userData))
                .then((data) => {
                    console.log('data hai ye: ', data)
                    if (data.error?.message) {
                        console.log('data hai ye bsdwala: ', data)
                        setFormErrorMessage(data.error.message)
                    } else {
                        console.log('data hai ye bsdwala: ', data)
                        setFormSuccessMessage(data.payload.message)
                        resetForm()
                    }    
                })
            } catch (error) {
                setFormErrorMessage(error)
                setFormSuccessMessage("")         
                console.log(error)
            }
        }
    })

  return (
    <div className='w-full h-full p-20 flex flex-col gap-10 items-center justify-center'>
        <h2 className="text-4xl font-semibold"> Profile </h2>

        <form onSubmit={updateUserFormik.handleSubmit} className="w-full flex gap-5 flex-col items-center justify-center">
            
            {console.log("iiner consoe: ", updateUserFormik.values.profilePhoto)}

            <input 
                type="file" accept="image/*"
                multiple={false} ref={filePickerRef}
                onChange={handleImageChange} 
            />
            <picture className="w-44 h-44 rounded-full border-4 border-teal-500 relative" >
                <img
                    name="profilePhoto" 
                    // src={imageFileURL || currentUser.userData.profilePhoto}
                    src={imageFileURL || updateUserFormik.values.profilePhoto}
                    alt="profile_picture"
                    className={`w-full h-full object-cover rounded-full ${imageUploadingProgress && imageUploadingProgress < 100 && 'opacity-40 cursor-not-allowed '} transition ease-in-out duration-200 `} 
                    // value={updateUserFormik.values.profilePhoto}
                    onChange={updateUserFormik.handleChange}
                />
                <MdModeEditOutline className="absolute -bottom-1 -right-5 hover:bg-[#ececec62] rounded-full w-9 h-9 p-2 transition ease-in-out duration-200 cursor-pointer" onClick={ () => filePickerRef.current.click() } />
            </picture>
                {(updateUserFormik.touched.profilePhoto && updateUserFormik.errors.profilePhoto) && <p className='mt-1 text-xs text-red-600'>{updateUserFormik.errors.profilePhoto}</p>}

                {imageFileUploadError &&
                    <Alert color='red' >
                        <p className="text-red-600">{imageFileUploadError}</p>
                    </Alert> 
                }
            <div>
                <label htmlFor="full_name" className="text-sm"> Full Name </label>
                <TextInput
                    id="full_name"
                    name="full_name"
                    type="text"
                    className="w-[30rem]"
                    value={updateUserFormik.values.full_name} 
                    onBlur={updateUserFormik.handleBlur}
                    onChange={updateUserFormik.handleChange} 
                />
                {(updateUserFormik.touched.full_name && updateUserFormik.errors.full_name) && <p className='mt-1 text-xs text-red-600'>{updateUserFormik.errors.full_name}</p>}
            </div>
            <div>
                <label htmlFor="email" className="text-sm"> Email </label>
                <TextInput
                    value={currentUser.userData.email}
                    id="email"
                    type="text"
                    className="w-[30rem]"
                    readOnly
                />
            </div>
            <div>
                <label htmlFor="password" className="text-sm"> New Password </label>
                <div className="relative">
                    <TextInput
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-[30rem]"
                        placeholder="Enter New Password"
                        value={updateUserFormik.values.password} 
                        onBlur={updateUserFormik.handleBlur}
                        onChange={updateUserFormik.handleChange} 

                    />
                    {showPassword ? 
                        <BsEyeFill className="absolute right-5 transform top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword} /> 
                        : 
                        <BsEyeSlashFill className="absolute right-5 transform top-1/2 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword} /> 
                    }
                </div>
                    {(updateUserFormik.touched.password && updateUserFormik.errors.password) && <p className='mt-1 text-xs text-red-600'>{updateUserFormik.errors.password}</p>}
            </div>
            <div>
                <label htmlFor="confirmPassword" className="text-sm"> Confirm New Password </label>
                <TextInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="w-[30rem]"
                    placeholder="Enter Confirm Password"
                    value={updateUserFormik.values.confirmPassword} 
                    onBlur={updateUserFormik.handleBlur}
                    onChange={updateUserFormik.handleChange} 

                />
                {(updateUserFormik.touched.confirmPassword && updateUserFormik.errors.confirmPassword) && <p className='mt-1 text-xs text-red-600'>{updateUserFormik.errors.confirmPassword}</p>}

            </div>
            <Button type="submit" className="w-[30rem] mt-5" outline gradientDuoTone="pinkToOrange" 
                disabled={
                    status === 'loading' || // Disable when submitting
                    !updateUserFormik.isValid ||    // Disable when form is invalid
                    !updateUserFormik.dirty      // Disable when form has no changes
                }
            >
                {status === 'loading' ?  <Spinner aria-label="Default status example" /> : "Save Changes" }    
            </Button>

            {formSuccessMessage && 
                <Alert color="success">
                    <p>{formSuccessMessage}</p>
                </Alert >
            }
            {formErrorMessage && 
                <Alert color="failure">
                    <p>{formErrorMessage}</p>
                </Alert>
            }
        </form>
    </div>
  )
}

export default Profile
