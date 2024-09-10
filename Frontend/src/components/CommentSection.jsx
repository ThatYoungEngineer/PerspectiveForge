import { useSelector } from "react-redux"

const CommentSection = (props) => {
    const { currentUser } = useSelector(state=>state.user)

  return (
    <div className="bg-red-300 w-full">
        {currentUser
        ?   <div>
            <p className="text-sm"> Signed in as:
                <img src={currentUser?.userData?.profilePhoto} alt="" />
                <span className="text-xs text-teal-300 hover:underline">{currentUser?.userData?.email}</span> 
            </p>
        </div> 
        :   <div>
            Sign in to comment.
        </div>
        }
    </div>
  )
}

export default CommentSection