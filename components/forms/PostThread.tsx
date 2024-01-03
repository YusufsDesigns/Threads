"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { userValidation } from "@/lib/validations/user";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Textarea } from "../ui/textarea";

import { usePathname, useRouter } from "next/navigation";
import { threadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import BtnLoader from "../Loader";
import { useOrganization } from "@clerk/nextjs";

interface Props{
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    }
    btnTitle: string;
}



    

function PostThread({ userId }: { userId: string }) {
    const pathname = usePathname()
    const router = useRouter()
    const { organization } = useOrganization()


      // 1. Define your form.
    const form = useForm<z.infer<typeof threadValidation>>({
        resolver: zodResolver(threadValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof threadValidation>) {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: organization ? organization.id : null,
            path: pathname
        })

        router.push("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                    <FormItem className="flex flex-col items-start w-full gap-1">
                        <FormControl className="border no-focus border-dark-4 bg-dark-3 text-light-1">
                        <Textarea 
                                rows={15}
                                className="whitespace-pre-wrap account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                <BtnLoader />
            </form>
        </Form>
    )
}

export default PostThread