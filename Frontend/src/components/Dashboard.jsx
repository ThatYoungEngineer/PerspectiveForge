import { useDispatch, useSelector } from "react-redux"
import { getPosts } from "../store/postSlice"
import { useEffect, useState, memo } from "react"
import { Spinner, Alert } from "flowbite-react"
import { GoAlertFill } from "react-icons/go"

const Dashboard = () => {
    const dispatch = useDispatch()
    const { post, status } = useSelector(state => state.post)

    const [error, setError] = useState(null)

    useEffect(() => {
        if (!post || post.length === 0) {
            dispatch(getPosts())
            .then((data) => {
                if (data?.error) setError(data.error.message)
            })
        }
    }, [dispatch, post])

    return (
        <>  
            {status === 'loading' && (
                <div className="w-full h-full flex items-center justify-center">
                    <Spinner size='xl' />
                </div>
            )}

            {status === 'error' && (
                <div className="w-full h-full flex items-center justify-center">
                    <Alert color='failure' icon={GoAlertFill}>
                        {error}
                    </Alert>
                </div>
            )}

            {status === 'fulfilled' && (
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Posts</h2>
                    {(!post || post.posts.length === 0) && (
                        <p className="text-lg text-gray-500">No posts found.</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                        {post.posts.map((p) => (
                            <div key={p._id} className="border p-5 rounded-md shadow-md">
                                <h3 className="text-xl font-semibold">{p.title}</h3>
                                <img src={p.image} alt="" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

const DashboardMemo = memo(Dashboard)
export default DashboardMemo
