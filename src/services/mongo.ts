"use server";
import { Car } from "@/types";
import { MongoClient, ObjectId } from "mongodb";



export async function connectDatabase() {
   const dbConnection: any = process.env.PUBLIC_DB_CONNECTION;
   return await MongoClient.connect(dbConnection);
}


export async function insertDocument(client: any, collection: string, document: object) {
   const db = client.db('db01');
   const result = await db.collection(collection).insertOne(document);

   return result;
}


export async function getAllDocuments(client: any, collection: string) {
   const db = client.db('db01');
   const documents = await db.collection(collection).find().toArray();
   return documents;
}



export async function deleteDocument(client: MongoClient, collection: string, carId: string) {
   const db = client.db("db01");
   const result = await db.collection(collection).deleteOne({ _id: new ObjectId(carId) });
   return result;
}


export async function updateDocument(client: MongoClient, collection: string, id: string, update: Car) {
   const localCar = {
      model_name: update.model_name,
      plate_number: update.plate_number,
      color: update.color,
   }
   const db = client.db("db01");
   const result = await db.collection(collection).updateOne({ _id: new ObjectId(id) },
      { $set: localCar });
   return result;
}








