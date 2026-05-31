import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PostCard from './../components/PostCard';
import LoadingSpinner from "../components/Loading/LoadingSpinner";
import { authContext } from "../Context/AuthContext";

export default function PostDetails() {
  const { id: postId } = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const { token, setUserData, setToken } = useContext(authContext)

  function getPostDetails() {
    axios(`https://route-posts.routemisr.com/posts/${postId}`, {
      headers: {
        token
      }
    }).then(({ data }) => {
      setPostDetails(data.data.post);
    }).catch((err) => {
      if (err.status == 401) {
        setUserData(null)
        setToken(null)
      }
    })
  }

  useEffect(() => {
    getPostDetails();
  }, [])

  return <>
    {postDetails ? <PostCard key={postDetails._id} post={postDetails} /> : <LoadingSpinner />}
  </>
}
