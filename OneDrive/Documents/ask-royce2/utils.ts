import { Pinecone } from "@pinecone-database/pinecone";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN!);

export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  query: string
): Promise<string> {
  // ✅ Use a 384-d embedding model
  const apiOutput = await hf.featureExtraction({
    model: "sentence-transformers/paraphrase-MiniLM-L6-v2", // ⬅️ Change here
    inputs: query,
  });

  console.log("🔢 Embedding length:", apiOutput.length); // Should be 384

  const queryEmbedding = Array.from(apiOutput);

  const index = client.Index(indexName);
  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding,
    includeMetadata: true,
    includeValues: false,
  });

  if (queryResponse.matches.length > 0) {
    const concatenatedRetrievals = queryResponse.matches
      .map((match, index) => `\n Document Finding ${index + 1}:\n${match.metadata?.chunk}`)
      .join(". \n\n");
    return concatenatedRetrievals;
  } else {
    return "<nomatches>";
  }
}
