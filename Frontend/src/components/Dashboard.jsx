import { memo } from "react"

const Dashboard = () => {

    return (
        <>
            {/* {currentUser.userData.isAdmin
            ?   <>
                    {status === 'loading' && (
                        <div className="w-full h-[85%] flex items-center justify-center">
                            <Spinner size='xl' />
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="w-full h-[85%] flex items-center justify-center">
                            <Alert color='failure' icon={GoAlertFill} className="w-full px-10">
                                {error}
                            </Alert>
                        </div>
                    )}

                    {status === 'fulfilled' && (
                        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 ">
                            <Table hoverable className="shadow-md" >
                                <Table.Head >
                                    <Table.HeadCell className="w-1/5 whitespace-nowrap" >Date Updated</Table.HeadCell>
                                    <Table.HeadCell className="w-1/5 whitespace-nowrap">Post Image</Table.HeadCell>
                                    <Table.HeadCell className="w-1/5 whitespace-nowrap">Post Title</Table.HeadCell>
                                    <Table.HeadCell className="w-1/5 whitespace-nowrap">Category</Table.HeadCell>
                                    <Table.HeadCell className="w-1/5 whitespace-nowrap">Actions</Table.HeadCell>
                                </Table.Head>
                                {post.posts.map((p) => (
                                    <Table.Body key={p._id} className="divide-y" >
                                        <Table.Row className="w-full" >
                                            <Table.Cell className="w-1/5 whitespace-nowrap">
                                                {new Date(p.updatedAt).toLocaleDateString()}
                                            </Table.Cell>
                                            <Table.Cell className="w-1/5 whitespace-nowrap" >
                                                <div className="w-28 h-16 max-w-28 max-h-16 overflow-hidden border-none rounded-md">
                                                    <img src={p.image} alt={p.title} className="w-28 h-16 hover:scale-[1.1] transition-all ease-in-out duration-200 border-none object-center object-fill " />
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="w-1/5" > {p.title} </Table.Cell>
                                            <Table.Cell className="w-1/5 whitespace-nowrap" > {p.category} </Table.Cell>
                                            <Table.Cell className="w-1/5 whitespace-nowrap" > 
                                                <div className="flex gap-1 items-center" >
                                                    <div className="ActionButtonBG"> <FaRegEye size={15} className="cursor-pointer" /> </div>
                                                    <div className="ActionButtonBG"> <GoPencil size={15} className="cursor-pointer" /> </div>
                                                    <div className="ActionButtonBG"> <GoTrash size={15} color="red" className="cursor-pointer" /> </div>
                                                </div>    
                                             </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ))}
                            </Table>
                        </div>
                    )}
                </>  
            : <p className="mx-auto text-base">No posts found.</p>
            } */}
            <p className="text-center text-gray-500">You are not authorized to view this page.</p>
        </>
    )
}

const DashboardMemo = memo(Dashboard)
export default DashboardMemo
