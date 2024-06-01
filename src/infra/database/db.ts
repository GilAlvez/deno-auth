import { MongoClient } from "mongodb";
import { env } from "../../env.ts";

const url = env.MONGO_URL;
const dbName = env.MONGO_DB_NAME;
if (!url) throw new Error("Missing `MONGO_URL` environment variable");

const client = new MongoClient(url);
await client.connect();

export const db = client.db(dbName)