import { QdrantClient } from "@qdrant/js-client-rest";
import axios from "axios";

const client = new QdrantClient({ host: "localhost", port: 6333 });
export async function addData() {
  const operationInfo = await client.upsert("test_collection", {
    wait: true,

    points: [
      { id: 1, vector: [0.05, 0.61, 0.76, 0.74], payload: { city: "Berlin" } },
      { id: 2, vector: [0.19, 0.81, 0.75, 0.11], payload: { city: "London" } },
      { id: 3, vector: [0.36, 0.55, 0.47, 0.94], payload: { city: "Moscow" } },
      { id: 4, vector: [0.18, 0.01, 0.85, 0.8], payload: { city: "New York" } },
      { id: 5, vector: [0.24, 0.18, 0.22, 0.44], payload: { city: "Beijing" } },
      { id: 6, vector: [0.35, 0.08, 0.11, 0.44], payload: { city: "Mumbai" } },
    ],
  });

  return operationInfo;
}

export async function createCol() {
  const result = await client.recreateCollection("test_collection", {
    vectors: { size: 4, distance: "Dot" },
  });

  return result;
}

// export async function getCollectionInfo() {
//   const collectionInfo = await client.getCollection("test_collection1");
//   console.log(collectionInfo);

//   return collectionInfo;
// }

export async function getCollectionInfo(collectionName: string) {
  try {
    const result = await axios.get(
      `http://localhost:6333/collections/test_collection1`
    );
    console.log("resutl === ", result);
    return result.data;
  } catch (error) {
    console.log(error);
  }
}
