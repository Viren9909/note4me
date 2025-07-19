'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifySchema } from '@/schemas/verifySchema'
import { useParams, useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const page = () => {

	const params = useParams<{ username: string }>()
	const router = useRouter()
	const form = useForm<z.infer<typeof verifySchema>>(
		{
			resolver: zodResolver(verifySchema)
		}
	)

	const onSubmit = async (data: z.infer<typeof verifySchema>) => {
		try {
			const response = await axios.post('/api/verify-code', {
				username: params.username,
				code: data.code
			})
			if (response.data.success) {
				toast.success("Email Verify Successfully.", {
					duration: 3000,
					description: response.data.message,
					position: "bottom-right"
				})
				router.replace('/sign-in')
			}
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse>
			let errorMessage = axiosError.response?.data.message
			toast.warning("Error", {
				description: errorMessage,
				duration: 3000,
				position: "bottom-right"
			})
		}
	}

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='w-full max-w-md p-8 space-y-8 shadow-md'>
				<div className='text-center'>
					<h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify Your Account</h1>
					<p className='mb-4'>Enter the verification code sent to your email.</p>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						<FormField
							control={form.control}
							name='code'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Verification Code</FormLabel>
									<FormControl>

										<Input placeholder='******' {...field} />

									</FormControl>
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full font-bold'>Submit</Button>
					</form>
				</Form >

			</div>
		</div>
	)
}

export default page
