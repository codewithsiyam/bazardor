import { MongoClient } from "mongodb";

/**
 * Single shared MongoClient (Atlas). The client connects lazily on first use,
 * so importing this file never blocks a page. The connection string is read
 * from the environment only – it is never logged or sent to the browser.
 */

const BUILD_PLACEHOLDER = "mongodb://127.0.0.1:27017/bazardor-build-placeholder";

function resolveUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (uri) return uri;

  // `next build` imports route modules to collect page data without serving a
  // request. A placeholder keeps the build working; it is never used at runtime.
  if (process.env.NEXT_PHASE === "phase-production-build") return BUILD_PLACEHOLDER;

  throw new Error(
    "MONGODB_URI is not set. Copy .env.example to .env.local and add your MongoDB Atlas connection string.",
  );
}

const globalForMongo = globalThis as unknown as { __bazardorMongoClient?: MongoClient };

export const mongoClient: MongoClient =
  globalForMongo.__bazardorMongoClient ??
  new MongoClient(resolveUri(), {
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 10,
  });

// Re-use the client across hot reloads (dev) and warm serverless invocations.
globalForMongo.__bazardorMongoClient = mongoClient;

/** Uses MONGODB_DB_NAME when provided, otherwise the database named in the URI. */
export const mongoDb = mongoClient.db(process.env.MONGODB_DB_NAME?.trim() || undefined);
