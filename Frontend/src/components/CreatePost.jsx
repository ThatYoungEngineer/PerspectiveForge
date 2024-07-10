import { TextInput, Select, Button, FileInput } from "flowbite-react"
import ReactQuill from "react-quill"
import 'react-quill/dist/quill.snow.css'

const options = [
    { key: 'select', value: 'Select a category', disabled: true, hidden: true, selected: true },
    { key: 'typescript', value: 'TypeScript' }, { key: 'javascript', value: 'JavaScript' }, 
    { key: 'reactjs', value: 'React JS' }, { key: 'nodejs', value: 'Node JS' },
    { key: 'expressjs', value: 'Express JS' }, { key: 'nextjs', value: 'Next JS' },
    { key: 'mongodb', value: 'MongoDB' }, { key: 'php', value: 'PHP' },
    { key: 'laravel', value: 'Laravel' }, { key: 'mysql', value: 'My SQL' },
    { key: 'ml', value: 'Machine Learning' }
];
const CreatePost = () => {
  return (
    <div className="p-3 w-full min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-center text-4xl my-7 font-semibold">Create Post.</h1>
        <form action="" className="w-full max-w-3xl flex flex-col gap-5">
            <div className="flex flex-col md:flex-row gap-4">
                <TextInput type="text" id="title" className="flex-1" placeholder="Title" required  />
                <Select style={{cursor: 'pointer'}}>
                    {options.map( (option, index) => (
                        <option 
                            key={index} 
                            value={option.value} 
                            // disabled={option.disabled} 
                            hidden={option.hidden} 
                            defaultChecked={option.selected}
                        >
                            {option.value}
                        </option>
                    ))}
                </Select>       
            </div>
            <div className="p-3 border-4 border-dotted border-teal-400 flex items-center justify-between">
                <FileInput type='file' accept='image' />
                {/* <Button type="button" gradientDuoTone='purpleToBlue' size='sm' outline>
                    Upload Image
                </Button> */}
            </div>
            <ReactQuill 
                theme="snow"
                placeholder="Write post description.."
                className="h-72 mb-12" 
            />
            <Button type="submit" gradientDuoTone='purpleToPink'>Publish</Button>
        </form>
    </div>
  )
}
export default CreatePost