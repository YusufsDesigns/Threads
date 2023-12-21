"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

interface CreateThreadProps{
    text: string
    author: string
    communityId: string | null
    path: string
}

interface AddCommentToThreadProps{
    threadId: string,
    commentText: string,
    userId: string,
    path: string
}

export async function createThread({ text, author, communityId, path }: CreateThreadProps){

    try {
        connectToDB()
    
        const createThread = await Thread.create({
            text,
            author,
            community: null,
        })
    
        await User.findByIdAndUpdate(author, {
            $push: { threads: createThread._id }
        })
    
        revalidatePath(path)
        
    } catch (error) {
        throw new Error(`Error creating thread: ${error}`)
    }
}

export async function fetchThreads(pageNumber: 1, pageSize = 20){
    connectToDB()

    const skipAmount = (pageNumber - 1) * pageSize

    const postQuery = Thread.find({ parentId: { $in: [null, undefined] }})
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: User })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: "_id name parentId image"
            }
        })

        const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

        const posts = await postQuery.exec()

        const isNext = totalPostsCount > skipAmount + posts.length

        return { posts, isNext }
}

export async function fetchThreadById(id: string){
    connectToDB()

    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id name parentId image"
                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec()

            return thread
    } catch (error: any) {
        throw new Error(`Error fetching thread ${error.message}`)
    }
}

export async function addCommentToThread({ threadId, commentText, userId, path }: AddCommentToThreadProps){
    connectToDB()

    try {
        // Find original thread by ID
        const originalThread = await Thread.findById(threadId)

        if(!originalThread) throw new Error('Thread not found')

        // Create new thread with comment text
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        // Save comment thread
        const savedCommentThread = await commentThread.save()

        // Update original thread to include comment
        originalThread.children.push(savedCommentThread._id)

        // Save original thread
        originalThread.save()

        revalidatePath(path)
    } catch (error) {
        
    }
}