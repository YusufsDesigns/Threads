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

import { usePathname, useRouter } from "next/navigation";
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
    const router = useRouter()

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
            userId: JSON.parse(currentUserId), 
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
                    <FormItem className="flex items-center gap-1 w-full">
                        <FormLabel>
                            <Image 
                                src={currentUserImg}
                                alt="User Image"
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                            />
                        </FormLabel>
                        <FormControl className="border-none bg-transparent">
                        <Input
                            placeholder="Comment..."
                            className="no-focus text-light-1 outline-none"
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