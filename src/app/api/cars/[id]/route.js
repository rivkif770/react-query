"use server";
import { NextResponse } from "next/server";
import { connectDatabase, deleteDocument, updateDocument } from "@/services/mongo";

export async function DELETE(request,{params}) {
    const client = await connectDatabase();
    const car = await deleteDocument(client, 'cars', params.id);
    client.close();
    return NextResponse.json(car);
}

export async function PATCH(request,{params}) {
    const client = await connectDatabase();
    const updatedCar = await request.json();
    await updateDocument(client, 'cars', params.id, updatedCar);
    client.close();

    return NextResponse.json({ message: "Car updated successfully" });
}