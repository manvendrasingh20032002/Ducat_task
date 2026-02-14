import { useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../api/axios"
import useAuth from "../hooks/useAuth"

export default function PostDetails(){
  const { id } = useParams()
  const [post,setPost]=useState(null)
  const [comment,setComment]=useState("")
  const { user } = useAuth()

  useEffect(()=>{
    axios.get(`/posts/${id}`).then(res=>setPost(res.data))
  },[id])

  const addComment = async ()=>{
    const res = await axios.post(`/comments/${id}`,{content:comment})
    setPost({...post,comments:[...post.comments,res.data]})
    setComment("")
  }

  const addAdminReply = async ()=>{
    const res = await axios.post(`/comments/admin/${id}`,{content:comment})
    setPost({...post,comments:[...post.comments,res.data]})
    setComment("")
  }

  if(!post) return null

  return(
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>

      <div>
        {post.comments.map(c=>(
          <div key={c._id} style={{border:c.isAdminReply?"2px solid red":"1px solid gray"}}>
            <p>{c.author.name}: {c.content}</p>
          </div>
        ))}
      </div>

      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} />
      <button onClick={addComment}>Comment</button>

      {user?.role==="admin" && (
        <button onClick={addAdminReply}>Admin Reply</button>
      )}
    </div>
  )
}