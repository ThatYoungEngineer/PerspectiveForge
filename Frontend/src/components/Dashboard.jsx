import { memo, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaUsers } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
import { Spinner } from "flowbite-react"
import { SiGooglemessages } from "react-icons/si"
import { MdComment } from "react-icons/md"
import { getPosts } from "../store/postSlice"

const Dashboard = () => {
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state=>state.user)
    const { post } = useSelector(state=>state.post)
    const [ data, setData ] = useState(null)
    const [ loading, setLoading ] = useState(false)
    
    useEffect(() => {
        const getUserData = async () => {
            try {
                setLoading(true)
                if(!post || post.length === 0) {
                    dispatch( getPosts() )
                }          
                if (data == null) {
                    const res = await fetch('/api/user/getUsersData', {
                        method: 'GET',
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        setData(data);
                        setLoading(false)
                    } else {
                        console.error('Failed to fetch user data:', res.status);
                        setLoading(false)
                    }
                } 
            }
            catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        if (!post || post.length === 0 || data == null) getUserData()
    }, [post]);

    return (
        <>
            {currentUser.userData.isAdmin
            ?
                loading
                ? <div className='w-full h-[90vh] FlexCenter'>
                    <Spinner size='xl' />
                </div>
                : 
                <section className="w-full h-screen flex flex-col px-10 md:px-20 py-10 gap-10">
                    <h1 className="text-center text-4xl font-semibold dark:text-[#D3FFFF] text-[#0fa2a2]">Dashboard at your glance!</h1>
                    <div className="flex justify-between gap-7 flex-wrap"> 
                        <div className="flex-1 shadow-md flex flex-col gap-10 p-3 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
                            <div className="flex justify-between gap-16 h-fit">
                                <div className="space-y-2">
                                    <h2 className="capitalize text-lg text-gray-500">total users</h2>
                                    <h2 className="text-lg">{data?.totalUsers || 'NULL'}</h2>
                                </div>
                                <div className="h-14 w-14 rounded-full bg-teal-500 p-2 FlexCenter shadow-md">
                                    <FaUsers size='30' color='white'/>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex gap-1">
                                    <FaArrowTrendUp className="text-green-400" />
                                    <p className="text-green-400">{data?.lastMonthUsers || 'NULL'}</p>
                                </div>
                                <h3 className="text-gray-500">Last Month</h3>
                            </div>
                        </div>
                        <div className="flex-1 shadow-md flex flex-col gap-10 p-3 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
                            <div className="flex justify-between gap-16 h-fit">
                                <div className="space-y-2">
                                    <h2 className="capitalize text-gray-500 text-lg">total posts</h2>
                                    <h2 className="text-lg">{post[1]?.totalPosts}</h2>
                                </div>
                                <div className="h-14 w-14 FlexCenter rounded-full bg-yellow-400 p-2 shadow-md">
                                    <SiGooglemessages size='30' color='white' />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex gap-1">
                                    <FaArrowTrendUp className="text-green-400" />
                                    <p className="text-green-400">{post[1]?.lastMonthPosts || "NULL"}</p>
                                </div>
                                <h3 className="text-gray-500">Last Month</h3>
                            </div>
                        </div>
                        <div className="flex-1 shadow-md flex flex-col gap-10 p-3 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
                            <div className="flex justify-between gap-16 h-fit">
                                <div className="space-y-2">
                                    <h2 className="capitalize text-lg text-gray-500">total comments</h2>
                                    <h2 className="text-lg">0</h2>
                                </div>
                                <div className="h-14 w-14 FlexCenter rounded-full bg-green-500 p-2 shadow-md">
                                    <MdComment size='30' color='white' />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex gap-1">
                                    <FaArrowTrendDown className="text-red-500" />
                                    <p className="text-red-500">0</p>
                                </div>
                                <h3 className="text-gray-500">Last Month</h3>
                            </div>
                        </div>
                    </div>
                </section>
                
            :
                <p className="text-center text-gray-500">You are not authorized to view this page.</p>
            }
        </>
    )
}

const DashboardMemo = memo(Dashboard)
export default DashboardMemo
