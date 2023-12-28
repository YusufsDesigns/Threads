"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"

import { usePathname } from "next/navigation";
import { commentValidation } from "@/lib/validations/thread";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props{
    threadId: string
    currentUserImg: string
    currentUserId: string
}

const Comment = ({threadId, currentUserId, currentUserImg}: Props) => {
    const pathname = usePathname()

    console.log(pathname);
    


      // 1. Define your form.
    const form = useForm<z.infer<typeof commentValidation>>({
        resolver: zodResolver(commentValidation),
        defaultValues: {
            thread: ''
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof commentValidation>) {
        await addCommentToThread({
            threadId,
            commentText: values.thread,
            userId: currentUserId,
            path: pathname
        })

        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex items-center w-full gap-1">
                        <FormLabel className="relative w-12 h-12">
                            <Image 
                                src={currentUserImg}
                                alt="User Image"
                                fill
                                className="object-cover rounded-full"
                            />
                        </FormLabel>
                        <FormControl className="bg-transparent border-none">
                        <Input
                            placeholder="Comment..."
                            className="outline-none no-focus text-light-1"
                            {...field}
                            />
                        </FormControl>
                    </FormItem>
                )}
                />
                <Button type="submit" className="comment-form_btn">Reply</Button>
            </form>
        </Form>
    )
}

export default Comment