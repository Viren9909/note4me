import { z } from "zod"

export const messageSchema = z.object({
    content: z.string()
        .min(1, "Message should not be empty")
        .max(300, "Message should not exceed 300 character")
})