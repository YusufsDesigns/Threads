"use client"

import { fetchThreadById, likeThread, unlikeThread } from "@/lib/actions/thread.actions"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"


interface Props{
    id: {
        id: string
    }
    likes: {
        likes: string[]
    }
    userId: {
        userInfo: string
    }
}


const ThreadStats = ({ id, likes, userId }: Props) => {
    const [likeList, setLikeList] = useState<string[]>(likes.likes)
    const path = usePathname()

    // console.log(likes.likes);
    
    
    
    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()
        
        let newLikes = [...likeList]
        const hasLiked = likeList.includes(userId.userInfo)

        if(hasLiked){
            newLikes = newLikes.filter((id) => id !== userId.userInfo)
            unlikeThread({
                threadId: id.id,
                path,
                userId: userId.userInfo
            })
        } else {
            newLikes.push(userId.userInfo)
            likeThread({
                threadId: id.id,
                path,
                userId: userId.userInfo
            })
        }
        setLikeList(newLikes)
    }

    return (
        <div className="flex gap-3.5">
            <div className="flex gap-3.5">
                <div className="flex gap-[1px]">
                    <Image 
                            src={likeList.includes(userId.userInfo) ?
                                "/assets/heart-filled.svg" : 
                                "/assets/heart-gray.svg"} 
                            alt="heart" 
                            width={24} 
                            height={24} 
                            className="object-contain cursor-pointer" 
                            onClick={(e) => handleLikePost(e)}
                    />
                    <span className="text-light-4">{likeList.length > 0 ? likeList.length : ""}</span>
                </div>
                <Link href={`/thread/${id.id}`}>
                    <Image src="/assets/reply.svg" alt="heart" width={24} height={24} className="object-contain cursor-pointer" />
                </Link>
                <Image src="/assets/repost.svg" alt="heart" width={24} height={24} className="object-contain cursor-pointer" />
                <Image src="/assets/share.svg" alt="heart" width={24} height={24} className="object-contain cursor-pointer" />
            </div>
        </div>
    )
}

export default ThreadStats