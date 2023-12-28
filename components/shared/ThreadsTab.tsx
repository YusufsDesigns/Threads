import { fetchUserThreads } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import ThreadCard from "../cards/ThreadCard"
import { fetchCommunityPosts } from "@/lib/actions/community.actions"

interface Props{
    currentUserId: string
    accountId: string
    accountType: string
}

const ThreadsTab = async ({currentUserId, accountId, accountType}: Props) => {
    let result = accountType === 'User' ? 
                await fetchUserThreads(accountId) : 
                await fetchCommunityPosts(accountId)

    console.log(result.threads);
    

    if(!result) redirect('/')

    return (
        <section className="flex flex-col gap-10 mt-9">
            {result.threads.map((thread: any) => (
                <ThreadCard 
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                    likes={thread.likedBy}
                />
            ))}
        </section>
    )
}

export default ThreadsTab