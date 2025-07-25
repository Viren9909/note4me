'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    content: z.string().min(1, "Message content is required"),
});

const ProfilePage = () => {
    const { data: session } = useSession();
    const { username } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        if (username === session?.user?.username) {
            toast.error("You cannot send a message to yourself.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post('/api/send-message', {
                username,
                content: data.content
            });

            if (response.data.success) {
                toast.success("Message sent successfully!", {
                    description: response.data.message,
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        backgroundColor: "oklch(0.795 0.184 86.047)",
                        color: 'oklch(0.421 0.095 57.708)',
                    },
                });
                form.reset();
            }
            else {
                toast.error("Failed to send message.", {
                    description: response.data.message,
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        backgroundColor: "red",
                        color: 'white',
                    },
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Failed to send message.", {
                description: axiosError.response?.data.message || "Unknown error",
                duration: 3000,
                position: 'bottom-right',
                style: {
                    backgroundColor: "red",
                    color: 'white',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!session) {
            toast.error(
                "You must be logged in to send messages.",
                {
                    duration: 3000,
                    position: 'bottom-right',
                    style: {
                        backgroundColor: "red",
                        color: 'white',
                    },
                }
            );
        }
    }, [session]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">

            <Card className="w-full max-w-md shadow-lg p-5">
                <CardHeader className='text-center'>
                    <CardTitle className='text-2xl font-semibold'>Send message to @{username}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="content" className="block font-medium text-gray-700 text-xl">
                                            Message :
                                        </Label>
                                        <Textarea
                                            id="content"
                                            {...field}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                                            rows={4}
                                        />
                                        {form.formState.errors.content && (
                                            <p className="mt-2 text-sm text-red-600">
                                                Message content is required.
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 w-full mt-4"
                            >
                                {isLoading ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
