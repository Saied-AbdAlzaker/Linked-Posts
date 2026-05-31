import { addToast, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { formatDate } from "../Helper/DateHelper";
import Avatar from "./Avatar";
import { EditDocumentIcon } from "./Icons/EditIcon";
import { DeleteDocumentIcon } from "./Icons/DeleteIcon";
import { cn } from "@heroui/styles";
import axios from "axios";
import { useContext, useState } from "react";
import { authContext } from "../Context/AuthContext";
import { queryClient } from "../App";

export default function Comment({ comment, getAllComments }) {
    const { token, userData } = useContext(authContext);
    const [isUpdate, setIsUpdate] = useState(false);
    const [commentContent, setCommentContent] = useState(comment.content);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLiked, setIsLiked] = useState(false);

    const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

    function deleteComment() {
        setIsLoading(true);
        axios.delete(`https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`, {
            headers: { token }
        }).then(() => {
            getAllComments();
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsLoading(false);
        })

    }

    function updateComment() {
        setIsLoading(true);
        axios.put(`https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}`, { content: commentContent }, {
            headers: { token }
        }).then(({ data }) => {
            getAllComments();
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsUpdate(false);
            setIsLoading(false);
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

    function likeUnlikeComment() {
        axios.put(`https://route-posts.routemisr.com/posts/${comment.post}/comments/${comment._id}/like`, {}, {
            headers: { token }
        }).then(({ data }) => {
            setIsLiked(data.data.liked);
            getAllComments();
        }).catch((error) => {
            addToast({
                title: "Error",
                description: error.reponse.data.message,
                color: "error",
            })
        })
    }

    return <>
        <div className='divide-y-2 divide-gray-200 p-3 flex justify-between'>
            {/* Comment */}
            <div>
                <div className="flex">
                    <Avatar src={comment?.commentCreator?.photo} alt={comment.commentCreator?.name} size="sm" />
                    <div>
                        <h3 className="text-md font-semibold ">{comment?.commentCreator?.name} </h3>
                        <p className="text-xs text-gray-500">{formatDate(comment?.createdAt)}</p>
                    </div>
                </div>
                {/* Update Comment with model */}
                {isUpdate ? <div className="w-full">
                    <Input isDisabled={isLoading} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} className={"mt-2"} />
                    <div className="flex gap-2 justify-end mt-2">
                        <Button onPress={() => setIsUpdate(false)}>Cancel</Button>
                        <Button isLoading={isLoading} onPress={updateComment} color="primary">Update</Button>
                    </div>
                </div> :
                    <>
                        <p className="mt-2">{comment?.content}</p>
                        <button onClick={likeUnlikeComment}>
                            {isLiked || comment.likes.length > 0 ?
                                <span className="ml-2 text-blue-500 font-semibold text-sm cursor-pointer">{comment.likes.length} Like</span>
                                :
                                <span className="ml-2 text-gray-500 text-sm cursor-pointer">{comment.likes.length} Like</span>
                            }
                        </button>
                    </>
                }
            </div>
            {/* Comment Actions */}
            {comment?.commentCreator?._id === userData?._id && <div>
                <Dropdown>
                    <DropdownTrigger>
                        <Button className="bg-secondary-50">
                            <svg className="w-16" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
                        <DropdownItem onPress={() => setIsUpdate(true)}
                            key="edit"
                            startContent={<EditDocumentIcon className={iconClasses} />}
                        >
                            Edit Comment
                        </DropdownItem>
                        <DropdownItem onPress={onOpen}
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                        >
                            Delete Comment
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>}
        </div>
        {/* Delete Model */}
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Comment</ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure delete comment <span className="text-blue-800">{comment?.content}</span>
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                            <Button isLoading={isLoading} color="primary" onPress={deleteComment}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}
