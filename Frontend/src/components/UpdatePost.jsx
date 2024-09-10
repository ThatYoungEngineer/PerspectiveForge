import { useEffect, useState } from 'react'
import { TextInput, Select, Button, FileInput, Alert, Spinner } from "flowbite-react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

import * as yup from "yup"
import { useFormik } from "formik"

import { useDispatch, useSelector } from 'react-redux'
import { updatePost } from '../store/postSlice.js'

import { app } from '../utils/firebase.js'
import {
    getDownloadURL,
    ref,
    getStorage,
    uploadBytesResumable
} from 'firebase/storage'

import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { IoWarning } from 'react-icons/io5'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { HiInformationCircle } from 'react-icons/hi'


const options = [
    { key: 'select', value: 'Select a category', disabled: true, hidden: true, selected: true },
    { key: 'typescript', value: 'TypeScript' }, { key: 'javascript', value: 'JavaScript' }, 
    { key: 'reactjs', value: 'React JS' }, { key: 'nodejs', value: 'Node JS' },
    { key: 'expressjs', value: 'Express JS' }, { key: 'nextjs', value: 'Next JS' },
    { key: 'mongodb', value: 'MongoDB' }, { key: 'php', value: 'PHP' },
    { key: 'laravel', value: 'Laravel' }, { key: 'mysql', value: 'My SQL' },
    { key: 'ml', value: 'Machine Learning' }, { key: 'cpp', value: 'C++' },
    { key: 'python', value: 'Python' }, { key: 'django', value: 'Django' },
    { key: 'aws', value: 'AWS' }, { key: 'nginx', value: 'Nginx' },
    { key: 'ai', value: 'Artificial Intelligence' }, { key: 'non-tech', value: 'Non-Technical' },
]

const UpdatePost = () => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state)=>state.user)
    const { post, status } = useSelector((state)=>state.post)

    const [imageFile, setImageFile] = useState(null)
    const [imageUploadingProgress, setImageUploadingProgress] = useState(null)
    const [imageFileUploadError, setImageFileUploadError] = useState(null)
    const [imageFileURL, setImageFileURL] = useState(null)
    const [imageFileError, setImageFileError] = useState(null)

    const [ error, setError ] = useState(null)
    const [ success, setSuccess ] = useState(null)

    const [postData, setPostData ] = useState(null)
    const [loadingData, setLoadingData ] = useState(false)
    const [postDoesNotExist, setPostDoesNotExist] = useState(null)

    const { postId } = useParams()

    useEffect(() => {
      const fetchPost = async (postId) => {
        setPostDoesNotExist(null)
        setLoadingData(true)
        try {
          const res = await fetch(`/api/post/get-posts?postId=${postId}`, {
            method: 'GET',
          })
          if (!res.ok) {
            setLoadingData(false)
            setPostDoesNotExist("Post with this id does not exist!")            
          } else {
           const data = await res.json()
           setPostData(data[0][0])
           setLoadingData(false)
          }
        } catch (error) {
          console.log(error.message)
          setLoadingData(false)
        }
      }
      fetchPost(postId)
    }, [postId])
        
    const handleFileChange = (event) => {
        setImageFileURL(null)
        setImageFileError(null)
        const image = event.target.files[0]
        try{
            if (image?.type.includes('image/')) {
                if (image.size < 2097152) {              //  Greater than 2MB
                    const imageURL = URL.createObjectURL(image);
                    setImageFile(image);
                    setImageFileURL(imageURL);
                    updatePostFormik.setFieldValue("blogImage", imageURL);  // Set the image URL in the form
                    updatePostFormik.setFieldTouched("blogImage", true)
                } else setImageFileError('Failure. Image must be less than 2MB!')
            } else setImageFileError('Failure. File type must be an image!')
        } catch(e) {return}
    }

    const uploadImage = async () => {
        if (!navigator.onLine) return
    
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile?.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
        const uploadPromise = new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadingProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageFileUploadError("Could not upload image. Please try again!");
                    reject(error);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        setImageFileURL(url);
                        resolve(url);
                    } catch (error) {
                        setImageFileUploadError("Could not retrieve download URL.");
                        reject(error);
                    }
                }
            );
        });
    
        return await uploadPromise;
    }
    
    const schema = yup.object().shape({
        title: yup
        .string()
        .required("Title is required")
        .min(2, "Title must be at least 2 characters")
        .max(100, "Title is too long!")
        .trim(),
        description: yup
        .string()
        .min(100, "Too short. Must be at least 100 characters")
        .required("Description is required")
        .trim(),
        category: yup
        .string()
        .required("Category is required"),
    })

    const updatePostFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
          title: postData?.title,
          category: postData?.category,
          blogImage: postData?.image,
          description: postData?.description,
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                setSuccess('')
                setError('')
                let data = {
                    postId: postId,
                    title: values.title,
                    category: values.category,
                    description: values.description,
                }
                if (imageFile) {
                    const firebaseUpload = await uploadImage();
                    if (firebaseUpload) {
                        data = {
                            ...data,
                            blogImage: firebaseUpload
                        }
                        setImageFile(null)
                    } else {
                        throw new Error("Image upload failed!")
                    }
                }
                dispatch(updatePost(data))
                .then((data) => {
                    if (data?.error) {
                        setError(data.error.message)                    
                    } else {
                        setSuccess(data.payload?.message)
                        setImageFile(null)
                        setImageFileURL(null)
                    }
                })
            } catch (error) {
                setError('There is an error, while processing your request')
                console.log('There is an error, while processing your request: ', error)
            }       
        }
    })

    return loadingData 
    ?   <div className="w-screen h-[90vh] FlexCenter">
            <Spinner size='xl' />
        </div>
    :   
    postDoesNotExist 
    ? <div className="w-screen h-[90vh] FlexCenter">
        <div className='w-fit flex flex-col gap-5'>
            <Alert color="failure" icon={HiInformationCircle} >
                <p>{postDoesNotExist}</p>
            </Alert> 
            <Link to="/dashboard?tab=posts">
                <Button className='w-full' gradientMonochrome="cyan"> <FaArrowLeftLong className='mr-3 self-center' /> Go Back  </Button>
            </Link>
        </div>
        </div>
    :
    <div className=" w-full h-fit flex flex-col gap-10 items-center xl:p-20 py-10">
        <h1 className="text-center text-4xl font-semibold">Update Post.</h1>
        <form onSubmit={updatePostFormik.handleSubmit} className="w-[90vw] md:w-full max-w-3xl flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <TextInput type="text" id="title" name="title" className="w-full" placeholder="Title" 
                    defaultValue={postData?.title}
                    // value={updatePostFormik.title} 
                    onBlur={updatePostFormik.handleBlur}
                    onChange={()=>{updatePostFormik.handleChange, setSuccess(null), setError(null)}} 
                    />
                    {(updatePostFormik.touched.title && updatePostFormik.errors.title) && <p className='mt-1 text-xs text-red-600'>{updatePostFormik.errors.title}</p>}
                </div>
                <div className='flex flex-col'>
                    <Select style={{cursor: 'pointer'}} as='select' name='category'
                        defaultValue={postData?.category}
                        // value={updatePostFormik.values.category}
                        onBlur={updatePostFormik.handleBlur}
                        onChange={updatePostFormik.handleChange}                                         
                    >
                        {options.map( (option, index) => (
                            <option 
                                key={index} 
                                value={option.key} 
                                hidden={option.hidden} 
                                defaultChecked={option.selected}
                            >
                                {option.value}
                            </option>
                        ))}
                    </Select>  
                    {(updatePostFormik.touched.category && updatePostFormik.errors.category) && <p className='mt-1 text-xs text-red-600'>{updatePostFormik.errors.category}</p>}
                </div>
            </div>
            <div className="p-3 border-4 border-dotted border-teal-400 flex flex-col gap-3 md:flex-row md:items-center justify-between">
                <FileInput 
                    type='file' name='blogImage' accept='image' multiple={false}
                    placeholder='Upload Image' className='order-2 md:order-1' 
                    onChange={handleFileChange}
                    defaultValue={imageFile}
                />
                <Alert color='info' icon={IoWarning} className='order-1 md:order-2'>
                    Blog Thumbnail
                </Alert>
            </div>
            {imageFileError &&
                <Alert color='failure'>{imageFileError}</Alert>
            }
            {imageFileUploadError &&
                <Alert color='failure' >
                    <p>{imageFileUploadError}</p>
                </Alert> 
            }
            {(updatePostFormik.values.blogImage !== '' || imageFileURL) && 
                <img 
                    src={imageFileURL || updatePostFormik.values.blogImage } alt='blog-image'
                    className={`border-2 border-teal-400 h-[450px] object-cover
                    ${(imageUploadingProgress && imageUploadingProgress < 100) && 'opacity-40 cursor-not-allowed'}
                    ${(updatePostFormik.isSubmitting || status === 'loading') && 'opacity-40 cursor-not-allowed'}`}
                />
            }
            <div className='relative'>
                <ReactQuill 
                    name='description'
                    theme="snow"
                    placeholder="Write post description.. (Must be atleast 200 characters)"
                    className="h-80" 
                    value={updatePostFormik.values.description}
                    onBlur={() => {
                        updatePostFormik.setFieldTouched('description', true)
                    }}
                    onChange={(value) => {
                        updatePostFormik.setFieldValue('description', value),
                        setSuccess(null),
                        setError(null)
                    }}
                />
                {(updatePostFormik.touched.description && updatePostFormik.errors.description) && <p className='mt-1 text-xs text-red-600 absolute left-0 -bottom-16'>{updatePostFormik.errors.description}</p>}
            </div>
            <Button
                type="submit"
                gradientDuoTone='purpleToPink'
                className="mt-[10vh] md:mt-[7vh]"
                disabled={
                    updatePostFormik.isSubmitting || status === 'loading' ||    // Disable when submitting
                    !updatePostFormik.isValid ||                               // Disable when form is invalid
                    !updatePostFormik.dirty ||                                // Disable when form has no changes
                    success || error
                }
            >
                {status === 'loading' || updatePostFormik.isSubmitting ?  <Spinner /> : "Update" }    
            </Button>
            {success && 
                <Alert  color="success" icon={IoIosCheckmarkCircleOutline}>
                    <p>{success}</p>
                </Alert> 
            }
            {error && 
                <Alert color="failure" icon={HiInformationCircle} >
                    <p>{error}</p>
                </Alert> 
            }
        </form>
    </div>
        
}
export default UpdatePost
