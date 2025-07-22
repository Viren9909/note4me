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
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Trash2, X } from "lucide-react";

type MessageCardProps = {
    message?: Message
    onDelete?: (messageId: string) => void;
};

const MessageCard = ({ message, onDelete }: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message?.id}`);
        if (response.data.success && onDelete) {
            onDelete(message?.id);
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
