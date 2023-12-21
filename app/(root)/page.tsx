import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreads } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs"
import { Suspense } from "react"


export default async function Home() {
  const threads = await fetchThreads(1, 20)
  const user = await currentUser()

  if(!user) return null
  
  return (
    <div>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {threads.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ): (
          <>
            {threads.posts.map(thread => (
              <Suspense fallback={<p className="text-white">Loading feed...</p>}
              key={thread._id}>
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
                />
              </Suspense>
            ))}
          </>
        )}
      </section>
    </div>
  )
}
