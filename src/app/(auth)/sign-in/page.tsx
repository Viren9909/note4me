"use client"
import * as z from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema'
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"
import { signIn } from 'next-auth/react';

const page = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true)
        const response = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        console.log(response);
        if (response?.error) {
            if (response.error === "CredentialsSignin") {
                toast.warning("Signin Error", {
                    duration: 3000,
                    position: "bottom-right",
                    description: response.error
                })
            } else {
                toast.error("Signin Error", {
                    duration: 3000,
                    position: "bottom-right",
                    description: "An unexpected error occurred. Please try again later."
                })
            }
        }
        else {
            toast.success("Signin Successful", {
                duration: 3000,
                position: "bottom-right",
                description: "You have successfully signed in."
            })
            router.replace('/dashboard')
        }

        setIsSubmitting(false)
    }


    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='w-full max-w-md p-8 space-y-8 shadow-md'>
                <div className='text-center'>
                    <div className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
                        <div>Welcome Back</div>
                    </div>
                    <p className='mb-4'>Signin to start your Anonymous Adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email / Username</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="email / username" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type='password' placeholder="password" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting} className='w-full font-bold'>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                        <span className='ml-2'>Signing in...</span>
                                    </>
                                ) : ("Signin")
                            }
                        </Button>
                    </form>
                </Form>
                <div>
                    <p className='text-sm text-center mt-4'>
                        Don't have an account?
                        <Link href="/sign-up" className='text-primary hover:underline ml-1'>
                            Sign Up
                        </Link>
                    </p>
                </div>
                <div className='text-center mt-4'>
                    <Link href="/forgot-password" className='text-primary hover:underline'>
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default page
