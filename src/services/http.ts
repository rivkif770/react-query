import { ObjectId } from "mongodb";
import api from "./axios";
import { Car } from "@/types";

export async function fetchCars(): Promise<Car[]> {
  const response = await api.get("/cars");

  return response.data.data.map((car: any) => ({
    _id: car._id,
    model_name: car.model_name,
    plate_number: car.plate_number,
    color: car.color,
  }));
}

export async function addCar(newCar: Car): Promise<Car> {
  const response = await api.post("/cars", newCar);
  return response.data;
}
export async function deleteCar(carId: any): Promise<void> {
  await api.delete(`/cars/${carId}`);
}

export async function updateCar(car: Car): Promise<Car> {
  const response = await api.patch(`/cars/${car._id}`, car);
  return response.data;
}
