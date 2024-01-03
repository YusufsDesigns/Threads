import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThreadStats from "../shared/ThreadStats";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";


interface Props{
    id: string;
    currentUserId: string;
    parentId: string | null
    content: string;
    author: {
        name: string
        image: string
        id: string
    }
    community: {
        id: string
        name: string
        image: string
    } | null
    createdAt: string
    comments: {
        author: {
            image: string
        }
    }[]
    isComment?: boolean
    likes: string[]
}

async function ThreadCard({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
    likes
}: Props) {
    const userInfo = await fetchUser(currentUserId)

    return (
        <article className={`flex w-full flex-col rounded-xl  ${isComment ? 'px-0 xs:px-7 mb-5' : 'bg-dark-2 p-7'}`}>
            <div className="flex flex-col items-start justify-between">
                <div className="flex flex-row flex-1 w-full gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image  
                                src={author.image}
                                alt="Profile Image"
                                fill
                                className="object-cover rounded-full cursor-pointer"
                            />
                        </Link>
                        <div className="thread-card_bar"></div>
                        <div className="flex">
                            {comments.map((comment, index) => (
                                <div className="relative w-5 h-5">
                                    <Image
                                        key={index}
                                        src={comment.author.image}
                                        alt={`user_${index}`}
                                        fill
                                        className={`${
                                        index !== 0 && "-ml-2"
                                        } rounded-full object-cover mt-1`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col w-full">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>

                        <p className="mt-2 whitespace-pre-wrap text-small-regular text-light-2">{content}</p>

                        <div className="flex flex-col gap-3 mt-5">
                            <ThreadStats id={{ id }} likes={{ likes }} userId={{ userInfo: userInfo._id }} />

                            {comments.length > 0 && (
                                <Link href={`/thread/${id}`}>
                                    <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} {comments.length > 1 ? 'replies' : 'reply'}</p>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                {!isComment && community && (
                    <Link href={`/communities/${community.id}`} className="flex items-center mt-5">
                        <p className="text-subtle-medium text-gray-1">
                            {formatDateString(createdAt)}
                            {" "}- {community.name} Community
                        </p>
                        <div className="relative w-3 h-3 ml-1">
                            <Image 
                                src={community.image}
                                alt={community.name}
                                fill
                                className="object-cover rounded-full"
                            />
                        </div>
                    </Link>
                )}
            </div>
        </article>
    )
}

export default ThreadCard