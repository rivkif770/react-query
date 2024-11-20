"use server";
import { NextResponse } from "next/server";
import { connectDatabase, getAllDocuments, insertDocument} from "@/services/mongo";

export async function GET(request: Request) {
  const client = await connectDatabase();
  const cars = await getAllDocuments(client, "cars");

  const plainCars = cars.map((car:any) => ({
    _id: car._id.toString(),
    model_name: car.model_name,
    plate_number: car.plate_number,
    color: car.color,
  }));

  client.close();
  return NextResponse.json({
    data: plainCars,
  });
}

export async function POST(request: Request) {
  const client = await connectDatabase();
  const newCar = await request.json(); 
  const result = await insertDocument(client, "cars", newCar); 
  client.close();

  return NextResponse.json({
    message: "Car added successfully",
    data: result,
  });
}



