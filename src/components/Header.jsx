import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, addToast, cn, useDisclosure } from '@heroui/react'
import { formatDate } from '../Helper/DateHelper'
import Avatar from './Avatar'
import { EditDocumentIcon } from './Icons/EditIcon';
import { DeleteDocumentIcon } from './Icons/DeleteIcon';
import { useContext, useState } from 'react';
import { authContext } from '../Context/AuthContext';
import axios from 'axios';
import { queryClient } from '../App';

export default function Header({ post, setIsUpdating }) {
    const { userData, token } = useContext(authContext);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

    function deletePost() {
        setIsLoading(true);
        axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
            headers: {
                token
            }
        }).then(({ data }) => {
            setIsLoading(false);
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

    return <div className="w-full h-16 flex items-center justify-between">
        <div className="flex">
            <Avatar src={post.user.photo} alt={post.user.name} />
            <div>
                <h3 className="text-md font-semibold ">{post.user.name}</h3>
                <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
        </div>

        {post.user._id === userData._id &&
            <Dropdown>
                <DropdownTrigger>
                    <Button variant="bordered">
                        <svg className="w-16" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dropdown menu with icons" variant="faded">
                    <DropdownItem
                        onPress={() => setIsUpdating(true)}
                        key="edit"
                        startContent={<EditDocumentIcon className={iconClasses} />}
                    >
                        Edit Post
                    </DropdownItem>
                    <DropdownItem onPress={onOpen}
                        key="delete"
                        className="text-danger"
                        color="danger"
                        startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                    >
                        Delete Post
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        }

        {/* Delete Model Post */}
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Delete Post</ModalHeader>
                        <ModalBody>
                            <p>
                                Are you sure delete post <span className='text-blue-700'>{post?.body}</span>
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onPress={onClose}>
                                Close
                            </Button>
                            <Button isLoading={isLoading} color="primary" onPress={deletePost}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>

    </div>
}
