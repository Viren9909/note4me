'use client'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MessageCard from '@/components/MessageCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AcceptMessageSchema } from '@/schemas/acceptingMessageSchema';
import { Message } from '@/model/User';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CopyIcon, Loader2, RefreshCcw } from 'lucide-react';

const page = () => {
	const router = useRouter();
	const { data: session, status } = useSession();

	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isSwitchLoading, setIsSwitchLoading] = useState(false);

	const handleDeleteMessage = (messageId: string) => {
		setMessages(messages.filter((message) => message._id !== messageId));
	}

	const form = useForm({
		resolver: zodResolver(AcceptMessageSchema),
	})

	const { register, watch, setValue } = form
	const acceptMessages = watch('acceptMessage')

	const fetchAcceptMessage = useCallback(async () => {
		setIsSwitchLoading(true);
		try {
			const response = await axios.get<ApiResponse>('/api/accept-messages');
			if (response.data.success) {
				setValue("acceptMessage", response.data?.isAcceptingMessage as boolean);
			}
		} catch (error) {
			console.error(error);
			const axiosError = error as AxiosError<ApiResponse>
			toast.error("Error", {
				description: axiosError.response?.data.message || "An error occurred while fetching message settings.",
				duration: 3000,
				position: "bottom-right",
			});

		} finally {
			setIsSwitchLoading(false);
		}
	}, [setValue]);

	const fetchMessages = useCallback(async (refresh: boolean = false) => {
		setIsLoading(true)
		setIsSwitchLoading(false);
		if (refresh) {
			setMessages([]);
		}
		try {
			const response = await axios.get<ApiResponse>('/api/get-messages');
			if (response.data.success) {
				setMessages(response.data?.messages || []);
				if (refresh) {
					toast.success("Messages", {
						description: "Messages have been refreshed successfully.",
						duration: 3000,
						position: "bottom-right",
					});
				}
			}

		} catch (error) {
			console.error(error);
			const axiosError = error as AxiosError<ApiResponse>
			toast.error("Error", {
				description: axiosError.response?.data.message || "An error occurred while fetching messages.",
				duration: 3000,
				position: "bottom-right",
			});
		} finally {
			setIsLoading(false);
			setIsSwitchLoading(false);
		}
	}, [setMessages, setIsLoading]);

	useEffect(() => {
		if (!session || !session.user) {
			return;
		}
		fetchAcceptMessage();
		fetchMessages();
	}, [session, setValue, fetchAcceptMessage, fetchMessages])

	const handleSwitchChange = async () => {
		setIsSwitchLoading(true)
		try {

			const response = await axios.post<ApiResponse>('/api/accept-messages', {
				acceptMessage: !acceptMessages,
			});
			if (response.data.success) {
				setValue("acceptMessage", !acceptMessages);
				toast.success("Success", {
					description: `Message acceptance has been ${!acceptMessages ? "enabled" : "disabled"} successfully.`,
					duration: 3000,
					position: "bottom-right",
				});
			}
			fetchMessages(true);

		} catch (error) {
			console.error(error);
			const axiosError = error as AxiosError<ApiResponse>
			toast.error("Error", {
				description: axiosError.response?.data.message || "An error occurred while updating message settings.",
				duration: 3000,
				position: "bottom-right",
			});

		} finally {
			setIsSwitchLoading(false);
		}
	}

	if (status === 'loading') {
		return (
			<div className='flex items-center justify-center h-screen'>
				<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
			</div>
		);

	}
	if (!session || !session.user) {
		router.push('/sign-in');
		return null;
	}

	const { username } = session.user;

	const baseUrl = `${window.location.protocol}//${window.location.host}`;
	const profileUrl = `${baseUrl}/profile/${username}`;

	const handleCopyProfileUrl = () => {
		navigator.clipboard.writeText(profileUrl);
		toast.success("Profile URL Copied", {
			description: "Profile URL has been copied to the clipboard.",
			duration: 3000,
			position: "bottom-right",
		});
	}

	return (
		<div className='p-8'>
			<div className='3min-h-screen'>
				<h1 className='text-4xl font-bold'>User Dashboard</h1>
			</div>
			<Label className='text-xl font-semibold mt-4'>Your unique profile URL:</Label>
			<div className='flex items-center gap-2 mt-1'>
				<Input
					type='text'
					value={profileUrl}
					readOnly
					className='border border-gray-300 rounded-md p-2 md:w-1/2 w-full'
				/>
				<Button onClick={handleCopyProfileUrl}> <CopyIcon /> Copy</Button>
			</div>
			<div className='mt-4 flex items-center gap-2'>
				<Label className='ml-2 text-xl font-semibold'>Accept Messages</Label>
				<Switch
					{...register('acceptMessage')}
					checked={acceptMessages}
					onCheckedChange={handleSwitchChange}
					disabled={isSwitchLoading}
					style={{
						height: '20px',
					}}
				/>
			</div>

			<Separator className='my-4' />

			<div className='flex gap-4'>
				<h1 className='text-2xl font-bold mb-2'>Messages</h1>
				<Button
					onClick={(e) => {
						e.preventDefault();
						fetchMessages(true);
					}}
					disabled={isLoading}
					className='mb-4'
					size={'icon'}
				>
					{isLoading ? (
						<Loader2 className='animate-spin h-4 w-4' />
					) : (
						<RefreshCcw className='h-4 w-4' />
					)}
				</Button>
			</div>

			{
				messages.length > 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						{messages.map((message, index) => (
							<MessageCard key={index} message={message} onDelete={handleDeleteMessage} />
						))}
					</div>
				) : (
					<div className='flex items-center justify-center text-3xl h-32'>No messages to display.</div>
				)
			}

		</div>
	)
}

export default page
