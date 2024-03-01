import axios from "axios";
import { samplePointsData } from "./fake-data";
import { PointVetorType } from "./types";

export async function addPointsToCollection(
  collectionName: string,
  payload?: PointVetorType[]
) {
  try {
    if (!(await getCollectionInfo(collectionName))) {
      await createCollection(collectionName);
    }

    let config = {
      method: "put",
      url: `http://localhost:6333/collections/${collectionName}/points?wait=true`,
      headers: {
        "content-type": "application/json",
      },
      data: { points: payload },
      // create with sample data
      // data: samplePointsData,
    };

    const result = await axios.request(config);

    console.log(result.data);
    return result.data;
  } catch (error: any) {
    console.log(error?.response?.data ?? error.message ?? "error");
    throw error?.message || "Error getting a list of collections in Qdrant";
  }
}

export async function createCollection(
  collectionName: string,
  options?: any,
  size?: number
) {
  try {
    let data = options || {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    };

    let config = {
      method: "put",
      url: `http://localhost:6333/collections/${collectionName}`,
      headers: {
        "content-type": "application/json",
      },
      data: data,
    };

    const result = await axios.request(config);
    console.log("collection created");
    return result.data;
  } catch (error: any) {
    console.log(error?.message || "Error creating a new collection in Qdrant");
  }
}

export async function getCollectionInfo(collectionName: string) {
  try {
    await axios.get(`http://localhost:6333/collections/${collectionName}`);
    console.log("found the collection");
    return true;
  } catch (error) {
    console.log("Error: No collection found with name " + collectionName);
    return false;
  }
}
