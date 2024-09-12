import { Button } from "flowbite-react"

const PostCard = (props) => {

  const formatDateWithSuffix = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const ordinalSuffix = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });
    const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric' });

    const month = monthFormatter.format(date);
    const year = yearFormatter.format(date);

    return `${day}${ordinalSuffix(day)} ${month}, ${year}`
  }

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
    <div className="h-full border border-teal-300 rounded-lg group/postCard blur-sm" id="postCard" >
      <div className="w-full h-44 max-h-44 rounded-t-lg overflow-hidden">
        <img src={props.image} alt="post image"
          className="w-full h-44 bg-slate-300 object-cover scale-125 rounded-t-lg group-hover/postCard:scale-100
          transition-all ease-in-out duration-200"
        />
      </div>
      <div className="w-full h-40 p-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="text-[.70rem] italic flex justify-between">
            <p>{formatDateWithSuffix(props.updatedAt)}</p>
            <p className={`${formatRelativeTime(props.updatedAt) === 'Just Now' ? 'text-[#ffd383]' : ''}`}>
              {formatRelativeTime(props.updatedAt)}
            </p>
          </div>
          <h2 className="font-Onest-Medium text-xl line-clamp-2">{props.title}</h2>
        </div>
        <div className="w-full FlexCenter">
          <Button pill className="text-sm italic text-center" size='xs' color='gray'>
            {props.category}
          </Button>
        </div>
      </div>
  </div>
  )
}

export default PostCard