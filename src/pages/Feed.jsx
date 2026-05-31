import axios from "axios"
import { useContext } from "react"
import PostCard from "../components/PostCard"
import LoadingScreen from "../components/Loading/LoadingScreen"
import { authContext } from "../Context/AuthContext"
import CreatePost from "../components/CreatePost"
import { useQuery } from "@tanstack/react-query"
import LoadingSpinner from "../components/Loading/LoadingSpinner"

export default function Feed() {

  const { token } = useContext(authContext)

  const { data: posts = [], isLoading, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () => axios(`https://route-posts.routemisr.com/posts`, {
      headers: {
        token
      },
      params: { sort: "-createdAt" }
    }),
    // staleTime:10000,
    // refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
    // refetchOnMount: true,
    // refetchInterval: 10000,
    // retry: 3
    // retryDelay:5000,
    // retryOnMount: true,
    select: (data) => data.data.data.posts
  })

  return <div className="h-screen w-full flex flex-col px-3 lg:px-10 gap-10">
    {/* getAllPosts={getAllPosts} */}
    {isFetching && !isLoading && <LoadingSpinner />}
    <CreatePost />
    {isLoading ? <LoadingScreen /> : posts?.map((post) => {
      return <PostCard key={post._id} post={post} commentLimit={1} setIsLiked={post.likes}  />
    })}
  </div>
}
