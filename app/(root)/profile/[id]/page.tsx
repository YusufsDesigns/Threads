import ThreadCard from "@/components/cards/ThreadCard"
import ProfileHeader from "@/components/shared/ProfileHeader"
import ThreadsTab from "@/components/shared/ThreadsTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import { fetchReplies } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: { id: string }}){
    const user = await currentUser()

    if(!user) return null

    const userInfo = await fetchUser(params.id)

    if(!userInfo) redirect('/onboarding')

    const replies = await fetchReplies(userInfo._id)
    
    return (
        <section>
            <ProfileHeader 
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
            <Tabs defaultValue="threads" className="w-full">
                <TabsList className="tab">
                    {profileTabs.map(tab => (
                        <TabsTrigger key={tab.label} value={tab.value} className="tab">
                            <Image 
                                src={tab.icon}
                                alt={tab.value}
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                            <p className="max-sm:hidden">{tab.label}</p>
                            {tab.label === 'Threads' && (
                                <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {userInfo?.threads?.length}
                                </p>
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
                
                {profileTabs.map(tab => {
                    if(tab.value === "threads"){
                        return(
                            <TabsContent key={`content-${tab.label}`} value={tab.value}>
                                <ThreadsTab 
                                    currentUserId={user.id}
                                    accountId={userInfo.id}
                                    accountType="User"
                                />
                            </TabsContent>
                        )
                    } else if(tab.value === "replies"){
                        return(
                            <TabsContent key={`content-${tab.label}`} value={tab.value} className="flex flex-col gap-10 mt-9">
                                {replies.map((thread: any) => (
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
                                ))}
                            </TabsContent>
                        )
                    } else{
                        return(
                            <TabsContent key={`content-${tab.label}`} value={tab.value} className="flex flex-col gap-10 mt-9">
                                {userInfo.liked.map((thread: any) => (
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
                                ))}
                            </TabsContent>
                        )
                    }
                })}
            </Tabs>

            </div>
        </section>
    )
}