import * as sdk from 'node-appwrite';

export const {
    PROJECT_ID, API_KEY, DATABASE_ID, CANDIDATE_COLLECTION_ID, USERS_COLLECTION_ID, BUCKET_ID, NEXt_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

const client = new sdk.Client();

client
    .setEndpoint(ENDPOINT!) // Your API Endpoint
    .setProject(PROJECT_ID!) // Your project ID
    .setKey(API_KEY!); // Your secret API key

export const database = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const users = new sdk.Users(client);