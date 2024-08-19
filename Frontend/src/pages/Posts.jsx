import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {getPosts} from "../store/postSlice"

const Posts = () => {
    const { post } = useSelector(state=>state.post)
    useEffect(() => {
        if(!post) {
            dispatch( getPosts() )
        }
    }, [post, post[0]])
  return (
    <div className="FlexCenter h-screen w-screen">
        <h2>Heloo All posts</h2>
        <section className="grid grid-cols-6 gap-5 ">
            {post[0]?.map((p, index) => (
                <div key={index} className="flex flex-col justify-center items-center p-4 w-full border-2 border-teal-300">
                    <h1>{p.title}</h1>
                    <p>{p.body}</p>
                </div>
            ))}

        </section>
    </div>
  )
}

export default Posts