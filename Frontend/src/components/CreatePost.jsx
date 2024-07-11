import { useState } from 'react'
import { TextInput, Select, Button, FileInput, Alert } from "flowbite-react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'
import { IoWarning } from 'react-icons/io5'

import * as yup from "yup"
import { useFormik } from "formik"

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
]

const CreatePost = () => {
    const [ file, setFile ] = useState(null)
    const [ fileURL, setFileURL ] = useState(null)
    const [ fileError, setFileError ] = useState(null)
    
    console.log(file)
    
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
        blogImage: yup
        .mixed(),
        title: yup
        .string()
        .min(2, "Title must be at least 2 characters")
        .max(24, "Title is too long!")
        .trim(),
        description: yup
        .string()
        .trim()
        .min(20, "Too short"),
        category: yup
        .string()
        .required("Category is required"),
    })

  return (
    <div className=" w-full h-fit flex flex-col gap-10 items-center xl:p-20 py-10">
        <h1 className="text-center text-4xl font-semibold">Create Post.</h1>
        <form action="" className="w-[90vw] md:w-full max-w-3xl flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-4">
                <TextInput type="text" id="title" className="flex-1" placeholder="Title" required  />
                <Select style={{cursor: 'pointer'}}>
                    {options.map( (option, index) => (
                        <option 
                            key={index} 
                            value={option.value} 
                            hidden={option.hidden} 
                            defaultChecked={option.selected}
                        >
                            {option.value}
                        </option>
                    ))}
                </Select>       
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
            <ReactQuill 
                theme="snow"
                placeholder="Write post description.."
                className="h-80" 
            />
            <Button
                type="submit"
                gradientDuoTone='purpleToPink'
                className="mt-[10vh] md:mt-[6vh]"
                disabled    
            >
                Publish
            </Button>
        </form>
    </div>
  )
}
export default CreatePost
