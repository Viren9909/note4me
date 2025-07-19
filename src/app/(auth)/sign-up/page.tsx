"use client"
import * as z from 'zod';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from "lucide-react"

const page = () => {

    const [username, setUsername] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [userNameMessage, setUserNameMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debounced = useDebounceCallback(setUsername, 500);

    const router = useRouter();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {

            const response = await axios.post('/api/sign-up', data)
            console.log(response.data)
            if (response.data.success) {
                toast.success("Success", {
                    description: response.data.message,
                    duration: 3000,
                    position: "bottom-right"
                })
                router.replace(`/verify/${username}`)
            } else {
                toast.error("Failed to Signup", {
                    description: response.data.message,
                    duration: 3000,
                    position: "bottom-right",
                })
            }

        } catch (error) {
            console.error("Frontend: Error while Submitting data for signup", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (!username) {
            setIsUsernameAvailable(false);
            setUserNameMessage(null);
            return;
        }
        const checkUsernameUniquness = async () => {
            setIsCheckingUsername(true)
            setUserNameMessage('')
            try {
                if (username) {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)

                    if (response.data.success) {
                        setUsername(username)
                        setIsUsernameAvailable(true)
                    } else {
                        setIsUsernameAvailable(false)
                    }
                    setUserNameMessage(response.data.message)
                }

            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                setUserNameMessage(axiosError.response?.data.message ?? "Error while chicking username")
                setIsUsernameAvailable(false)
            } finally {
                setIsCheckingUsername(false)
            }
        }
        checkUsernameUniquness()
    }, [username])


    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='w-full max-w-md p-8 space-y-8 shadow-md'>
                <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Note4Me</h1>
                    <p className='mb-4'>Signup to start your anonymous Adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>

                                    {userNameMessage && (
                                        <div className='flex items-center gap-2 mt-1'>
                                            {isCheckingUsername && <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />}
                                            <p className={`text-sm ${isUsernameAvailable ? 'text-green-500' : 'text-red-600'}`}>
                                                {userNameMessage}
                                            </p>
                                        </div>
                                    )}

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type='email' placeholder="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
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
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type='submit' disabled={isSubmitting} className='w-full font-bold'>
                            {
                                isSubmitting ? (
                                    <>
                                        <Loader2 className='h-4 w-4 animate-spin' />
                                    </>
                                ) : ("Signup")
                            }
                        </Button>
                    </form>
                </Form>
                <div>
                    Already Member?{"  "}
                    <Link href='/sign-in' className='text-primary hover:text-yellow-600 hover:underline'>
                        Signin
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default page
