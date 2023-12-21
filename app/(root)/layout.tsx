import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import { ClerkProvider, currentUser } from '@clerk/nextjs'
import BottomBar from '@/components/shared/BottomBar'
import LeftSideBar from '@/components/shared/LeftSideBar'
import RightSideBar from '@/components/shared/RightSideBar'
import TopBar from '@/components/shared/TopBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata:Metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if(!user) return null
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar />
          
          <main className='flex'>
            <LeftSideBar userId={user.id} />
            
            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

            <RightSideBar />
          </main>

          <BottomBar userId={user.id} />
        </body>
      </html>
    </ClerkProvider>
  )
}
