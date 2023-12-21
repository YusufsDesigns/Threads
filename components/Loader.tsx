"use client"

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"

const BtnLoader = () => {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="bg-primary-500">{pending ? 'Posting...' : 'Post'}</Button>
    )
}

export default BtnLoader