import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment"

export default async function Page({ params }: { params: { id: string }}){
    if(!params.id) return null

    const user = await currentUser()
    if(!user) return null

    const userInfo = await fetchUser(user.id)
    if(!userInfo.onboarded) redirect('/onboarding')

    const thread = await fetchThreadById(params.id)

    console.log(params.id);
    
    

    return(
        <section className="relative">
            <div>
            <ThreadCard 
                key={thread._id}
                id={thread._id}
                currentUserId={user.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
                likes={thread.likedBy}
            />
            </div>

            <div className="mt-7">
                <Comment 
                    threadId={params.id}
                    currentUserId={userInfo._id}
                    currentUserImg={userInfo.image}
                />
            </div>

            <div className="mt-10">
                {thread.children.map((childItem: any) => (
                    <ThreadCard 
                        key={childItem._id}
                        id={childItem._id}
                        currentUserId={user.id}
                        parentId={childItem.parentId}
                        content={childItem.text}
                        author={childItem.author}
                        community={childItem.community}
                        createdAt={childItem.createdAt}
                        comments={childItem.children}
                        likes={childItem.likedBy}
                        isComment
                    />
                ))}
            </div>
        </section>
    )
}