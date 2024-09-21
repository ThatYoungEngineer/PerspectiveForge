import { useSelector } from "react-redux"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Textarea, Button, Alert } from "flowbite-react"
import { LuExternalLink } from "react-icons/lu"
import { useEffect, useState } from "react"
import { GoAlertFill } from "react-icons/go"
import Comment from "./Comment"

const CommentSection = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { currentUser } = useSelector(state=>state.user)
    const [comment, setComment] = useState('')
    const [commentError, setCommentError] = useState(null)
    const [comments, setComments] = useState([])
    const [commentsError, setCommentsError] = useState(null)


    const handleSubmit = async (e) => {
        e.preventDefault()
        if(comment.length > 200) {
            return
        } 
        setCommentError(null)
        try {
            const res = await fetch('/api/comment/post-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: props.id,
                    content: comment,
                    userId: currentUser?.userData?._id,
                })
            })
            if(res.ok) {
                const data = await res.json()
                setComments([data.comment, ...comments])
            }            
        } catch (error) {
            setCommentError(error.message)
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            setCommentsError(null)
            try {
                const res = await fetch(`/api/comment/getPostComments/${props.id}`, {
                    method: 'GET'
                })
                if(res.ok) {
                    const data = await res.json()
                    setComments(data)
                }
            } catch (error) {
                setCommentsError(error.message)
            }
        }
        props.id && fetchComments()

    }, [props.id])


  return (
    <div className="px-2 lg:px-5 w-full">
        {currentUser
        ?   <div className="mt-10">
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
                <div
                    onClick={()=>{navigate('/login',
                        {replace: false, state: {prevLocation: location?.pathname}}
                    )}} 
                    className="w-fit"
                >
                    <h2 className="w-fit hover:underline text-teal-300 cursor-pointer">
                        Sign in
                    </h2>
                </div>
                <h2>to comment.</h2>
            </div>
        </div>
        }
        <h2 className="mt-7 text-2xl font-Onest-SemiBold mb-4">{comments?.length ?? 0} {comments?.length == 1 ? "Comment" : "Comments"} </h2>
        {currentUser?.userData &&
            <div className="w-full border border-teal-300 p-3 rounded-lg mb-4">
                {currentUser?.userData?.username 
                ?   <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                        <Textarea 
                            id="comment" placeholder="Leave a comment..." required 
                            rows={4} maxLength='400' className="cursor-pointer" 
                            onChange={(e)=>setComment(e.target.value)}
                            value={comment}
                        />
                        <div className="w-full flex items-center justify-between">
                            <span className="text-xs text-gray-400">{400 - comment.length} characters remaining </span>
                            <Button outline gradientDuoTone="purpleToBlue" type="submit" >Comment</Button>
                        </div>
                        { commentError && <Alert color='failure' className="mt-5" icon={GoAlertFill}>{commentError}</Alert> }
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
        <section className="w-full flex flex-col gap-5 my-10">
            {comments?.message 
            ?   
                <p className="w-full text-center italic">{comments?.message}</p>
            :   
                comments?.map((c) => (
                    <Comment 
                        key={c._id}
                        comment = {c} 
                    />
                ))
            }
        </section>
    </div>
  )
}

export default CommentSection