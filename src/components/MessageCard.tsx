'use client';
import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";

type MessageCardProps = {
    message?: Message
    onDelete?: (messageId: string) => void;
};

const MessageCard = ({ message, onDelete }: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message?._id}`);
            if (response.data.success && onDelete) {
                onDelete(message?.id || message?._id);
                toast.success("Message deleted successfully", {
                    description: response.data.message || "Message deleted successfully",
                    duration: 3000,
                    position: "bottom-right",
                    style: {
                        backgroundColor: "oklch(0.795 0.184 86.047)",
                        color: 'oklch(0.421 0.095 57.708)',
                    }
                });
            }
        } catch (error) {
            console.error(error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Error deleting message", {
                description: axiosError.response?.data.message || "An error occurred while deleting the message.",
                duration: 3000,
                position: "bottom-right",
                style: {
                    backgroundColor: "red",
                    color: 'white',
                }
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{message?.content}</CardTitle>
                <CardDescription>
                    <div className="text-sm text-muted-foreground">
                        {new Date(message?.createdAt || 0).toLocaleString()}
                    </div>
                </CardDescription>
                <CardAction>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. It will permanently delete your Message.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel> <X /> Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}> <Trash2 /> Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardAction>
            </CardHeader>
        </Card>
    )
}

export default MessageCard
