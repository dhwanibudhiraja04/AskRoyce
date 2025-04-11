import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
// import { Message, OpenAIStream, StreamData, StreamingTextResponse } from "ai";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Message, StreamData, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
// export const runtime = 'edge';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
});

const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY
});

// gemini-1.5-pro-latest
// gemini-1.5-pro-exp-0801
const textModel = google("models/gemini-1.5-pro-latest"); // ✅ for streamText
const embeddingModel = google("models/embedding-001"); // ✅ used only in utils

export async function POST(req: Request, res: Response) {
    const reqBody = await req.json();
    console.log(reqBody);

    const messages: Message[] = reqBody.messages;
    const userQuestion = `${messages[messages.length - 1].content}`;

    const reportData: string = reqBody.data.reportData;
   const query = `Represent this for searching relevant passages: Corporate document says: \n${reportData}. \n\n${userQuestion}`;

    const retrievals = await queryPineconeVectorStore(pinecone, 'index-two', "ns1", query);

    const finalPrompt = `Here is a summary of a corporate document and a user query. Additional contextual information is provided to enhance your understanding.
Review the document thoroughly and answer the user's query. Ensure your response is accurate, clear, and directly addresses the query based on the document provided. Before answering, you may enrich your knowledge by reviewing the provided contextual information.
The contextual information contains generic insights and might not be directly related to the document. Include only relevant information from the context if applicable.

**Corporate Document Summary:**\n${reportData}.\n**End of Corporate Document Summary**

**User Query:**\n${userQuestion}?\n**End of User Query**

**Additional Contextual Information:**\n${retrievals}.\n**End of Additional Contextual Information**

Provide thorough justification and reference key details from the document in your response.

**Answer:**
`;


    const data = new StreamData();
    data.append({
        retrievals: retrievals
    });

    const result = await streamText({
        model: textModel,
        prompt: finalPrompt,
        onFinish() {
            data.close();
        }
    });

    return result.toDataStreamResponse({ data });
}

