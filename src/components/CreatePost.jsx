import { useContext, useRef, useState } from "react"
import { authContext } from "../Context/AuthContext";
import axios from "axios";
import { addToast, Textarea } from "@heroui/react";
import LoadingSpinner from './Loading/LoadingSpinner';
import { queryClient } from "../App";

export default function CreatePost() {
    const [isLoading, setIsLoading] = useState(false);
    const [body, setBody] = useState("");
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [imageName, setImageName] = useState("");
    const { userData, token } = useContext(authContext)
    const imageInput = useRef()

    function changeImage(e) {
        setFile(e?.target.files[0]);
        setImageName(e?.target.files[0].name);
        setImage(e && URL.createObjectURL(e.target.files[0]));
        if (e) {
            e.target.value = "";
        }
    }

    function removeImage() {
        setImage(null);
        setFile(null);
        // document.querySelector("#imageInput").value = "";
        imageInput.current.value = ""
    }

    function SubmitPostForm(e) {
        e.preventDefault();
        // formData
        const form = new FormData();
        body && form.append('body', body);
        file && form.append('image', file);

        axios.post(`https://route-posts.routemisr.com/posts`, form, {
            headers: { token }
        }).then(({ data }) => {
            setIsLoading(true);
            if (data.message == "post created successfully") {
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
            setBody("");
            setImage(null);
            setImageName("")
        })
    }

    return <div className="w-1/2 mx-auto">
        {isLoading ? <LoadingSpinner /> :
            <form onSubmit={SubmitPostForm} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 font-sans flex flex-col dark:bg-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <img src={userData.photo} alt={userData.name} className="w-10 h-10 rounded-full object-cover shrink-0 bg-slate-100 border border-slate-50" />
                    <span className="text-[15px] font-bold text-slate-900 leading-tight">{userData.name}</span>
                </div>
                <div className="mb-4">
                    <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What's on your mind...?" ></Textarea>
                </div>
                <hr className="border-t border-slate-800 mb-4" />

                {image && <div className="relative">
                    <img src={image} alt={imageName} className="w-full h-75 object-cover my-2" />
                    <button onClick={removeImage}
                        className="absolute top-4 inset-e-4 cursor-pointer text-red-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>}

                <div className="flex items-center justify-between">
                    <input
                        //  id="imageInput"
                        ref={imageInput}
                        onChange={changeImage} type="file" id="file" className="hidden" />
                    <label htmlFor="file" className="flex cursor-pointer items-center gap-2 text-slate-600 hover:bg-slate-50 px-2 py-1.5 rounded-lg transition-colors group">
                        <i className="fa-regular fa-image text-[#22c55e] text-[1.1rem] group-hover:scale-110 transition-transform" />
                        <span className="text-[14px] font-semibold text-slate-600">Photo/video</span>
                    </label>
                    <div className="flex justify-end">
                        <button type="submit" disabled={!(body || image)} className="cursor-pointer bg-blue-500 text-white px-5 py-2 rounded-lg font-bold text-[14px] flex items-center gap-2 focus:ring-4 focus:ring-blue-200 outline-none">
                            Post
                            <i className="fa-regular fa-paper-plane text-sm" />
                        </button>
                    </div>
                </div>
            </form>
        }
    </div >
}


