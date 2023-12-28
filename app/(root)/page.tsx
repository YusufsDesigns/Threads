import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreads } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs"


export default async function Home() {
  const threads = await fetchThreads(1, 20)
  const user = await currentUser()

  if(!user) return null
  
  return (
    <div>
      <h1 className="text-left head-text">Home</h1>

      <section className="flex flex-col gap-10 mt-9">
        {threads.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ): (
          <>
            {threads.posts.map(thread => (
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
          </>
        )}
      </section>
    </div>
  )
}
