import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa6"

const Comment = (props) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const res = await fetch(`/api/user/getUserById/${props.comment.userId}`, {
          method: 'GET'
        })
        if(res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchUserById()
  }, [props.comment])

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const timeDifference = now - new Date(timestamp);

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
        return 'Just Now';
    } else if (minutes === 1) {
        return '1 min ago';
    } else if (minutes < 60) {
        return `${minutes} mins ago`;
    } else if (hours === 1) {
        return '1 hour ago';
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days === 1) {
        return '1 day ago';
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (weeks === 1) {
        return '1 week ago';
    } else if (weeks < 4) {
        return `${weeks} weeks ago`;
    } else if (months === 1) {
        return '1 month ago';
    } else if (months < 12) {
        return `${months} months ago`;
    } else if (years === 1) {
        return '1 year ago';
    } else {
        return `${years} years ago`;
    }
}

  return (
    <div className="w-full flex gap-2" >
      <img src={user?.profilePhoto} alt='dp' className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="flex flex-col gap-2">
        <span className="flex gap-2">
          <h2 className="text-sm font-Onest-SemiBold">@{user?.username ?? 'unknown'}</h2>
          <p className = {`${formatRelativeTime(props.comment?.updatedAt || props.comment?.createdAt) == 'Just Now' ? 'text-[#ffd383]' : 'text-gray-500'} text-xs self-center`} >
            {formatRelativeTime(props.comment?.updatedAt || props.comment?.createdAt) }
          </p>
        </span>
        <p className="text-sm">{props.comment?.content}</p>
        <FaThumbsUp />
      </div>
    </div>
  )
}

export default Comment