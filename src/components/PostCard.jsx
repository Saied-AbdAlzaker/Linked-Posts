import { Link } from 'react-router-dom';
import Comment from './Comment';
import Header from './Header';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { authContext } from '../Context/AuthContext';
import { addToast, Input, Textarea } from '@heroui/react';
import { Button } from '@heroui/react';
import { queryClient } from '../App';

export default function PostCard({ post, commentLimit }) {
    const { token } = useContext(authContext)
    const [commentPost, setCommentPost] = useState([])
    const [commentContent, setCommentContent] = useState("");
    const [isCommentLoading, setisCommentLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [postBody, setPostBody] = useState(post.body);
    const [imageFile, setImageFile] = useState(post.image);
    const [imageInputUpdate, setImageInputUpdate] = useState('');
    const [imageName, setImageName] = useState('');
    const imageInputFile = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    function changeImage(e) {
        const file = e?.target.files[0];
        setImageFile(file);
        setImageInputUpdate(e && URL.createObjectURL(file));
        setImageName(file?.name || "");

        if (e) {
            e.target.value = "";
        }
    }

    function removeImage() {
        setImageInputUpdate("");
        setImageFile("");
        imageInputFile.current.value = ""
    }


    function getAllComments() {
        axios(`https://route-posts.routemisr.com/posts/${post._id}/comments`, {
            headers: { token }
        }).then(({ data }) => {
            setCommentPost(data.data);
            // addToast({
            //     title: "Success",
            //     description: data.message,
            //     color: "success",
            // })
        }).catch((error) => {
            addToast({
                title: "Error",
                description: error.reponse.data.message,
                color: "error",
            })
        })
    }

    function createComment() {
        setisCommentLoading(true);
        axios.post(`https://route-posts.routemisr.com/posts/${post._id}/comments`, {
            content: commentContent
        }, {
            headers: { token }
        }).then(({ data }) => {
            setisCommentLoading(false);
            setCommentContent("")
            getAllComments()
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            addToast({
                title: "Success",
                description: data.message,
                color: "success",
            })
        }).catch((error) => {
            addToast({
                title: "Error",
                description: error.reponse.data.message,
                color: "error",
            })
        })
    }

    function updatePostForm(e) {
        e.preventDefault()
        // formData
        const form = new FormData();
        form.append('body', postBody);
        form.append('image', imageFile);

        axios.put(`https://route-posts.routemisr.com/posts/${post._id}`, form, {
            headers: { token }
        }).then(({ data }) => {
            setIsLoading(true);
            if (data.message === "post updated successfully") {
                setIsUpdating(false)
                queryClient.invalidateQueries({ queryKey: ['posts'] });
                addToast({
                    title: "Success",
                    description: data.message,
                    color: "success",
                })
            }
        }).catch((error) => {
            addToast({
                title: "Error",
                description: error.reponse.data.message,
                color: "error",
            })
        }).finally(() => {
            setIsLoading(false);
            setPostBody("");
            setImageFile("");
            setImageName("")
        })
    }

    function likeUnlikePost() {
        axios.put(`https://route-posts.routemisr.com/posts/${post._id}/like`, {}, {
            headers: { token }
        }).then(({ data }) => {
            setIsLiked(data.data.liked);
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        }).catch((error) => {
            addToast({
                title: "Error",
                description: error.reponse.data.message,
                color: "error",
            })
        })
    }

    useEffect(() => {
        getAllComments()
    }, [])

    return <>
        {<div className="mx-auto md:w-1/2 shadow-xl p-3 rounded-2xl bg-secondary-50">
            {/* Posts */}
            <div>
                {/* Header */}
                <Header post={post} setIsUpdating={setIsUpdating} />
                {/* Content */}
                {/* Update Post */}
                {isUpdating ? <div className="w-full">
                    <form onSubmit={updatePostForm} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 font-sans flex flex-col">
                        <div className="mb-4">
                            <Textarea value={postBody} onChange={(e) => setPostBody(e.target.value)} ></Textarea>
                        </div>
                        <hr className="border-t border-slate-800 mb-4" />

                        {imageInputUpdate && <div className="relative">
                            <img src={imageInputUpdate} alt={imageName} className="w-full h-75 object-cover my-2" />
                            <button onClick={removeImage}
                                className="absolute top-4 inset-e-4 cursor-pointer text-red-900">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>}

                        <div className="flex items-center justify-between">
                            <input
                                ref={imageInputFile} onChange={changeImage}
                                type="file" id={post._id} className="hidden" />
                            <label htmlFor={post._id} className="flex cursor-pointer items-center gap-2 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors group">
                                <i className="fa-regular fa-image text-[#22c55e] text-[1.1rem] group-hover:scale-110 transition-transform" />
                                <span className="text-[14px] font-semibold text-slate-600">Photo/video</span>
                            </label>
                            <div className="flex justify-end">
                                <div className="flex gap-2 justify-end mt-2">
                                    <Button type="button" onPress={() => setIsUpdating(false)}>Cancel</Button>
                                    <Button type='submit' color="primary" isLoading={isLoading}>Update</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div> :
                    <Link to={`/post-details/${post._id}`} className='cursor-pointer'>
                        {post.body && <p>{post.body}</p>}
                        {post.image && <img src={post.image} alt={post.body} className="h-80 w-full object-cover" />}
                    </Link>
                }

                {/* Actions */}
                <div className="w-full h-8 flex items-center px-3 my-3 border-b-1">
                    <div className="bg-blue-500 z-10 w-5 h-5 rounded-full flex items-center justify-center ">
                        <svg className="w-3 h-3 fill-current text-white" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                    </div>
                    <div className="bg-red-500 w-5 h-5 rounded-full flex items-center justify-center -ml-1">
                        <svg className="w-3 h-3 fill-current stroke-current text-white" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    </div>
                    <div className="w-full flex justify-between">
                        <button onClick={likeUnlikePost}>
                            {isLiked || post.likes.length > 0 ?
                                <span className="ml-2 text-blue-500 font-semibold cursor-pointer">{post.likesCount} Like</span>
                                :
                                <span className="ml-2 text-gray-500 cursor-pointer">{post.likesCount} Like</span>
                            }
                        </button>
                        <p className="ml-3 text-gray-500 cursor-pointer">{post.commentsCount} Comment</p>
                        <p className="ml-3 text-gray-500 cursor-pointer">{post.sharesCount} Share</p>
                    </div>
                </div>
            </div>

            {/* Create Comment */}
            <div className="mt-4 divide-y-2 divide-gray-100">
                <div className="flex relative border-b-0">
                    <Input value={commentContent} onChange={(e) => setCommentContent(e.target.value)} className="pe-20" placeholder="Comment..." />
                    <Button isDisabled={commentContent.trim().length < 2} isLoading={isCommentLoading} onPress={createComment} className="absolute top-0 inset-e-0 bottom-0">Comment</Button>
                </div>
            </div>

            {/* Comments */}
            {commentPost?.comments && commentPost?.comments?.toReversed().slice(0, commentLimit)?.map((comment) => {
                return <Comment key={comment._id} comment={comment} getAllComments={getAllComments} />
            })}

        </div>}
    </>
}
