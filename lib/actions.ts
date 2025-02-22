import { Query } from "node-appwrite";
import { database } from "./appwrite.config";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function GetCandidates(team: string){
    try{
        const response = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.CANDIDATE_COLLECTION_ID!,
            [Query.equal("team", [team])]
        );

        if(response.documents.length>0)
            return response.documents;
        else
        return []
    }catch(error){
        console.error("Failed to fetch the candidates: ", error);
        throw new Error("Failed to fetch the candidates")
    }
}

export async function Vote(selectedCandidate: Candidate){
    try{

        const response = await database.getDocument(
            process.env.DATABASE_ID!,
            process.env.CANDIDATE_COLLECTION_ID!,
            selectedCandidate.$id
        );
        await database.updateDocument(
            process.env.DATABASE_ID!,
            process.env.CANDIDATE_COLLECTION_ID!,
            selectedCandidate.$id,
            {
                votes: response.votes + 1
            }
        );
    }catch(error){
        console.error("Failed to fetch the candidates: ", error);
        throw new Error("Failed to fetch the candidates")
    }
}

export async function Log(){
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (session?.user?.email)
    try{
        await database.createDocument(
            process.env.DATABASE_ID!,
            process.env.LOG_COLLECTION_ID!,
            'unique()',
            {
                email
            }
        );

        return true;
    }catch(error){
        console.error("Failed to fetch the candidates: ", error);
        throw new Error("Failed to fetch the candidates")
    }
    else
    return null;
}



export async function CheckLog(email: string){
    const session = await getServerSession(authOptions);
    if (session?.user?.email)
    try{
        const response = await database.listDocuments(
            process.env.DATABASE_ID!,
            process.env.LOG_COLLECTION_ID!,
            [Query.equal("email", [email])]
        );

        if(response.documents.length>0)
        return true;
    else
    return false;
    }catch(error){
        console.error("Failed to fetch the candidates: ", error);
        throw new Error("Failed to fetch the candidates")
    }
    else
    return null;
}


