import {ChromaClient} from "chromadb";
const client = new ChromaClient();

const collection = await client.createCollection({
  name: "my_collection",
});