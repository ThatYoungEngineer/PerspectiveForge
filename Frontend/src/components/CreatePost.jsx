import { useState } from 'react'
import { TextInput, Select, Button, FileInput, Alert, Spinner } from "flowbite-react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { IoWarning } from 'react-icons/io5'

import * as yup from "yup"
import { useFormik } from "formik"

import { createPost } from '../store/postSlice.js'
import { useDispatch, useSelector } from 'react-redux'

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

const CreatePost = () => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector((state)=>state.user)
    const { status } = useSelector((state)=>state.post)

    const [ file, setFile ] = useState(null)
    const [ fileURL, setFileURL ] = useState(null)
    const [ fileError, setFileError ] = useState(null)

    const [ error, setError ] = useState(null)
    const [ success, setSuccess ] = useState(null)
        
    const handleFileChange = (event) => {
        setFileURL(null)
        setFileError(null)
        const image = event.target.files[0]
        try{
            if (image?.type.includes('image/')) {
                if (image.size < 2097152) {              //  Greater than 2MB
                    setFile(image)
                    setFileURL(URL.createObjectURL(image))
                    // updateUserFormik.setFieldValue("profilePhoto", URL.createObjectURL(file))
                    // updateUserFormik.setFieldTouched("profilePhoto", true, true);
                } else setFileError('Failure. Image must be less than 2MB!')
            } else setFileError('Failure. File type must be an image!')
        } catch(e) {return}
    }
    const schema = yup.object().shape({
        title: yup
        .string()
        .required("Title is required")
        .min(2, "Title must be at least 2 characters")
        .max(24, "Title is too long!")
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

    const createPostFormik = useFormik({
        initialValues: {
          title: "",
          category: "",
          blogImage: "",
          description: "",
        },
        validationSchema: schema,
        onSubmit: async (values, { resetForm } ) => {
            console.log('submit')
            try {
                const data = {
                    id: currentUser.userData.id,
                    title: values.title,
                    category: values.category,
                    description: values.description,
                }
                dispatch(createPost(data))
                .then((data) =>{
                    console.log(data.payload)
                })
                .catch((error) => {
                    console.log(error)
                })
            } catch (error) {
                console.log(error)
            }            
        }
    })

  return (
    <div className=" w-full h-fit flex flex-col gap-10 items-center xl:p-20 py-10">
        <h1 className="text-center text-4xl font-semibold">Create Post.</h1>
        <form onSubmit={createPostFormik.handleSubmit} className="w-[90vw] md:w-full max-w-3xl flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <TextInput type="text" name="title" className="w-full" placeholder="Title" 
                        onBlur={createPostFormik.handleBlur}
                        onChange={createPostFormik.handleChange}                     
                    />
                    {(createPostFormik.touched.title && createPostFormik.errors.title) && <p className='mt-1 text-xs text-red-600'>{createPostFormik.errors.title}</p>}
                </div>
                <div className='flex flex-col'>
                    <Select style={{cursor: 'pointer'}} as='select' name='category'
                        onBlur={createPostFormik.handleBlur}
                        onChange={createPostFormik.handleChange}                                         
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
                    {(createPostFormik.touched.category && createPostFormik.errors.category) && <p className='mt-1 text-xs text-red-600'>{createPostFormik.errors.category}</p>}
                </div>
            </div>
            <div className="p-3 border-4 border-dotted border-teal-400 flex flex-col gap-3 md:flex-row md:items-center justify-between">
                <FileInput type='file' accept='image' onChange={handleFileChange} placeholder='Upload Image' className='order-2 md:order-1' />
                <Alert color='info' icon={IoWarning} className='order-1 md:order-2'>
                    Blog Thumbnail
                </Alert>
            </div>
            {fileError &&
                <Alert color='failure' >{fileError}</Alert>
            }
            {fileURL && 
                <img src={fileURL} alt="selected-image" className='border-2 border-teal-400' />
            }
            <div className='relative'>
                <ReactQuill 
                    name='description'
                    theme="snow"
                    placeholder="Write post description.. (Must be atleast 200 characters)"
                    className="h-80" 
                    value={createPostFormik.values.description}
                    onBlur={() => {
                        createPostFormik.setFieldTouched('description', true)
                    }}
                    onChange={(value) => {
                        createPostFormik.setFieldValue('description', value);
                    }}
                />
                {(createPostFormik.touched.description && createPostFormik.errors.description) && <p className='mt-1 text-xs text-red-600 absolute left-0 -bottom-16'>{createPostFormik.errors.description}</p>}
            </div>
            <Button
                type="submit"
                gradientDuoTone='purpleToPink'
                className="mt-[10vh] md:mt-[7vh]"
                disabled={
                    createPostFormik.isSubmitting || status === 'loading' ||    // Disable when submitting
                    !createPostFormik.isValid ||                                // Disable when form is invalid
                    !createPostFormik.dirty                                     // Disable when form has no changes
                }
                >
                {status === 'loading' || createPostFormik.isSubmitting ?  <Spinner aria-label="Default status example" /> : "Publish" }    
            </Button>
        </form>
    </div>
  )
}
export default CreatePost
