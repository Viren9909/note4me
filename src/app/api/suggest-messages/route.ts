import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        const stream = await streamText({
            model: openai('gpt-3.5-turbo'),
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
        });
        console.log(stream)
        return await stream.toDataStreamResponse()

    } catch (error: any) {
        console.error('Error while generating suggestions:', error);

        if (error?.name === 'APIError') {
            return Response.json(
                {
                    success: false,
                    error: {
                        name: error.name,
                        message: error.message,
                        status: error.status,
                    },
                },
                { status: error.status || 500 }
            );
        }

        return Response.json(
            { success: false, message: 'Unexpected error occurred.' },
            { status: 500 }
        );
    }
}
