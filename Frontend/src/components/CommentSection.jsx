import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { Textarea, Button } from "flowbite-react"
import { LuExternalLink } from "react-icons/lu"
import { useState } from "react"

const CommentSection = (props) => {
    const { currentUser } = useSelector(state=>state.user)
    const navigate = useNavigate()
    const [comment, setComment] = useState('')

  return (
    <div className="px-2 lg:px-5 w-full">
        {currentUser
        ?   <div>
            <span className="flex gap-1 items-center text-sm"> Signed in as:
                <img src={currentUser?.userData?.profilePhoto} alt="" className="w-7 h-7 rounded-full bg-gray-200" />
                <Link to={"/dashboard?tab=profile"}>
                    <span className="text-xs text-cyan-400 hover:underline">
                        @{currentUser?.userData?.username ?? 'unknown'}
                    </span> 
                </Link>
            </span>
        </div> 
        :   <div className="flex flex-col gap-4 mt-10">
            <div className="flex gap-1 text-sm">
                <Link to={'/login'} className="w-fit">
                    <h2 className="w-fit hover:underline text-teal-300">
                        Sign in
                    </h2>
                </Link>
                <h2>to comment.</h2>
            </div>
        </div>
        }
        <h2 className="text-2xl font-Onest-SemiBold">739 Comments</h2>
        {currentUser?.userData &&
            <div className="w-full border border-teal-300 p-3 rounded-lg my-4">
                {currentUser?.userData?.username 
                ?   <form className="flex flex-col gap-3" onSubmit={(e)=>e.preventDefault}>
                        <Textarea 
                            id="comment" placeholder="Leave a comment..." required 
                            rows={4} maxLength='400' className="cursor-pointer" 
                            onChange={(e)=>setComment(e.target.value)}
                            value={comment}
                        />
                        <div className="w-full flex items-center justify-between">
                            <span className="text-xs text-gray-400">{400 - comment.length} characters remaining </span>
                            <Button outline gradientDuoTone="purpleToBlue" type="submit" disabled >Submit</Button>
                        </div>
                    </form> 
                : <div className="w-full">
                    <div 
                        onClick={()=>{navigate('/dashboard?tab=profile',
                            {replace: false, state: {username: 'username'}}
                        )}} 
                        className="text-sm flex items-center gap-2 justify-center hover:underline hover:text-[#E3A008] transition-all ease-in-out duration-150 cursor-pointer" 
                    >
                        <p>Please enter a username and update your profile, to add comment</p>
                        <LuExternalLink size={20} />
                    </div>
                </div>
                }            
            </div>
        }
    </div>
  )
}

export default CommentSection