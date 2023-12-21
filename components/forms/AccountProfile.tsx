"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { userValidation } from "@/lib/validations/user";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadThing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

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



const AccountProfile = ({ user, btnTitle }: Props) => {
    const [file, setFile] = useState<File[]>()
    const { startUpload } = useUploadThing("media")
    const pathname = usePathname()
    const router = useRouter()


      // 1. Define your form.
    const form = useForm<z.infer<typeof userValidation>>({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user.username || "",
            bio: user?.bio || "",
        },
    })

    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault()

        const fileReader = new FileReader()

        if(e.target.files && e.target.files.length > 0){
            const file = e.target.files[0]

            setFile(Array.from(e.target.files))

            if(!file.type.includes("image")) return

            fileReader.onload = async (e) => {
                const imageDataUrl = e.target?.result?.toString() || ''
                
                console.log(imageDataUrl);
                
                fieldChange(imageDataUrl)
            }
            fileReader.readAsDataURL(file)
            
        }
    }
    
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof userValidation>) {
        const blob = values.profile_photo

        const hasImageChanged = isBase64Image(blob)

        if(hasImageChanged){
            if(!file) return
            const imgRes = await startUpload(file)

            if(imgRes && imgRes[0].url){
                values.profile_photo = imgRes[0].url
            }
        }

        await updateUser({
            userId: user.id,
            name: values.name,
            username: values.username,
            bio: values.bio,
            image: values.profile_photo,
            path: pathname
        })

        if(pathname === '/profile/edit'){
            router.back()
        } else {
            router.push('/')
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                        <FormLabel className="account-form_image-label relative">
                            {field.value ? (
                                <Image 
                                    src={field.value} 
                                    alt="profile-photo" 
                                    fill                          
                                    priority
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <Image 
                                    src="/assets/profile.svg" 
                                    alt="profile-photo"                              width={24}  
                                    height={24}
                                    className="object-contain"
                                />
                            )}
                        </FormLabel>
                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                            <Input 
                                type="file"
                                accept="image/*"
                                placeholder="Upload a photo"
                                className="account-form_image-input"
                                onChange={(e) => handleImage(e, field.onChange)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-1 w-full">
                        <FormLabel className="text-base-semibold text-light-2">
                            Name
                        </FormLabel>
                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                            <Input
                                type="text"
                                className="account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-1 w-full">
                        <FormLabel className="text-base-semibold text-light-2">
                            Username
                        </FormLabel>
                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                            <Input
                                type="text"
                                className="account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem className="flex flex-col items-start gap-1 w-full">
                        <FormLabel className="text-base-semibold text-light-2">
                            Bio
                        </FormLabel>
                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                            <Textarea 
                                rows={10}
                                className="account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

                <Button type="submit" className="bg-primary-500">{btnTitle}</Button>
            </form>
        </Form>
    )
}

export default AccountProfile
