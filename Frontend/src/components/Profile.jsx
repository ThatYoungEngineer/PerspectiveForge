import { useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button, TextInput, Alert, Spinner, Modal } from "flowbite-react"

import { MdModeEditOutline } from "react-icons/md"
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs"
import { HiOutlineExclamationCircle } from "react-icons/hi"

import * as yup from "yup"
import { useFormik } from "formik"

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIbtn from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import MUIModal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';


import {
    getDownloadURL,
    ref,
    getStorage,
    uploadBytesResumable
} from 'firebase/storage'

import { app } from '../utils/firebase.js'
import { updateUser } from "../store/userSlice.js"

import Swal from 'sweetalert2'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

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
    const [deleteAccountEmail, setDeleteAccountEmail] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [open, setOpen] = useState(false)

    const filePickerRef = useRef()

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const handleSwalOpen = () => {
        Swal.fire({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success"
          });
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleImageChange = (e) => {
        setImageFileUploadError(null)
        setImageFile(null)
        setImageFileURL(null)
        const file = e.target.files[0]
        try{
            if (file?.type.includes('image/')) {
                if (file.size < 2097152) {                      //  Greater than 2MB
                    setImageFile(file)
                    setImageFileURL(URL.createObjectURL(file))
                    updateUserFormik.setFieldValue("profilePhoto", URL.createObjectURL(file))
                    updateUserFormik.setFieldTouched("profilePhoto", true, true);
                } else setImageFileUploadError('Failure. Image must be less than 2MB!')
            } else setImageFileUploadError('Failure. File type must be an image!')
        } catch(e){
            return
        }   
    }

    const uploadImage = async () => {
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile?.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
        const uploadPromise = new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadingProgress(progress.toFixed(0));
                },
                () => {
                    setImageFileUploadError("Could not upload image. Please try again!");
                    reject("Upload failed");
                },
                async () => {
                    try {
                        // Get the download URL
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        setImageFileURL(url)
                        resolve(url)
                    } catch (error) {
                        setImageFileUploadError("Could not retrieve download URL.");
                        reject(error)
                    }
                }
            )
        })
        return uploadPromise
    }
    
    const schema = yup.object().shape({
        profilePhoto: yup
        .mixed(),
        full_name: yup
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(24, "Name is too long!")
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
          profilePhoto: "",
          password: "",
          confirmPassword: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { resetForm } ) => {
            try {
                setFormErrorMessage("")
                setFormSuccessMessage("")
            
                let userData = {
                    id: currentUser.userData._id,
                    ...(values.full_name && { full_name: values.full_name }),
                    ...(values.password && { password: values.password }),
                }
            
                if (imageFile) {
                    const firebaseUpload = await uploadImage();
                    if (firebaseUpload) {
                        userData = {
                            ...userData,
                            profilePhoto: firebaseUpload,
                        };
                        setImageFile(null);
                    } else {
                        throw new Error("Image upload failed!")
                    }
                }
            
                const data = await dispatch(updateUser(userData));
                if (data.error?.message) {
                    setFormErrorMessage(data.error.message);
                } else {
                    setFormSuccessMessage(data.payload.message);
                    resetForm()
                }
            } catch (error) {
                setFormErrorMessage("Failed! An error occurred, please try again");
            }            
        }
    })

    const handleDeleteAccountEmail = (e) => {
        setDeleteAccountEmail(e.target.value);
    }

  return (
    <>
        <MUIModal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                    Text in a modal
                    </Typography>
                    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box>
            </Fade>
        </MUIModal>


        <div className='w-full h-full p-20 flex flex-col gap-10 items-center justify-center'>
            <h2 className="text-4xl font-semibold"> Profile </h2>

            <form onSubmit={updateUserFormik.handleSubmit} className="w-full flex gap-5 flex-col items-center justify-center">
        
                <input 
                    name="profilePhoto" 
                    type="file" accept="image/*"
                    multiple={false} ref={filePickerRef}
                    onChange={handleImageChange}  
                    hidden
                />
                <picture className="w-44 h-44 rounded-full border-4 border-teal-500 relative" >
                    <img
                        src={imageFileURL ?? currentUser.userData.profilePhoto}
                        alt="profile_picture"
                        className={`w-full h-full object-cover rounded-full transition ease-in-out duration-200 
                        ${(imageUploadingProgress && imageUploadingProgress < 100) && 'opacity-40 cursor-not-allowed'}
                        ${(updateUserFormik.isSubmitting || status === 'loading') && 'opacity-40 cursor-not-allowed'}`}
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
                        defaultValue={currentUser.userData.full_name}
                        // value={updateUserFormik.values.full_name} 
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
                        updateUserFormik.isSubmitting || status === 'loading' ||    // Disable when submitting
                        !updateUserFormik.isValid ||                                // Disable when form is invalid
                        !updateUserFormik.dirty                                     // Disable when form has no changes
                    }
                >
                    {status === 'loading' || updateUserFormik.isSubmitting ?  <Spinner aria-label="Default status example" /> : "Save Changes" }    
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

                {/* <section className="w-40 h-20" id="operator" >
                    <h2>operator</h2>
                </section> */}

                <Accordion className="w-[30rem] mt-10" style={{ background: 'rgb(252, 151, 151)', borderRadius: '.4rem' }} >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography style={{color: 'rgb(182, 28, 28)'}} > Delete Account? </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Type your email address below, to delete your account. <br />
                        </Typography>
                        <span className="mt-5 w-full flex justify-between items-center flex-row gap-[5%]" >
                            <TextInput
                                type="email" className="w-[70%]"
                                id="deleteAccountEmail"
                                onChange={handleDeleteAccountEmail}
                                placeholder="Your email address"
                            />
                            <MUIbtn
                                variant="contained" color="error" type="button"
                                disabled={ deleteAccountEmail !== currentUser.userData.email} className="w-[25%]"
                                onClick={handleSwalOpen}
                            >
                                Delete
                            </MUIbtn>
                        </span>

                        {openModal && 
                            <section >
                                <Modal show={"on"} size="md" onClose={() => setOpenModal(false)} popup
                                    base={"fixed w-screen left-0 top-0 z-50 h-[100vh] max-h-[100vh] overflow-hidden overflow-y-hidden"}
                                    style={{
                                        background: "red", position: "absolute", top: "0", left: "0",
                                        overflowY: 'hidden', height: '100vh', maxHeight: '100vh'
                                    }}
                                >
                                    <Modal.Header />
                                    <Modal.Body >
                                        <div className="text-center" >
                                            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">                                           
                                                Are you sure you want to delete this product?
                                            </h3>
                                                Are you sure you want to delete this product? <br />
                                            <div className="flex justify-center gap-4">
                                                <Button color="failure" onClick={() => setOpenModal(false)}>
                                                    {"Yes, I'm sure"}
                                                </Button>
                                                <Button color="gray" onClick={() => setOpenModal(false)}>
                                                    No, cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                </Modal>
                            </section>
                        }
                    </AccordionDetails>
                </Accordion>
            </form>
        </div>
    </>
  )
}

export default Profile
