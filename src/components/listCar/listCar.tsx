"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fetchCars, addCar, deleteCar, updateCar } from "@/services/http";
import { Car } from "@/types";
import './CarList.css';

function CarList() {
    const queryClient = useQueryClient();
    const [idCar, setIdCar] = useState<string | null>(null);
    const { data: cars, isLoading, isFetching } = useQuery({ queryKey: ['cars'], queryFn: fetchCars, staleTime: 10000 })

    const createCarMutation = useMutation({ mutationFn: addCar, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['cars'] }) }, })
    const deleteCarMutation = useMutation({ mutationFn: deleteCar, onMutate: async (id: string) => {
        await queryClient.cancelQueries({ queryKey: ["cars"] });
        const previousCars = queryClient.getQueryData<Car[]>(["cars"]);
        queryClient.setQueryData<Car[]>(["cars"], (oldCars) =>
          oldCars ? oldCars.filter((car) => car._id !== id) : []
        );
        return { previousCars };
      },
      onError: (_error, _deletedUserId, context) => {
        queryClient.setQueryData(["cars"], context?.previousCars); 
      }, });
    const updateCarMutation = useMutation({ mutationFn: updateCar,  onMutate: async (data) => {
        await queryClient.cancelQueries({ queryKey: ["cars"] });
        const previousCars = queryClient.getQueryData<Car[]>(["cars"]);
        queryClient.setQueryData<Car[]>(["cars"], (oldCars) =>
          oldCars
            ? oldCars.map((car) =>
              car._id === data._id ? { ...car, ...data } : car
            )
            : []);
        return { previousCars };
      },
      onError: (_error, _deletedUserId, context) => {
        queryClient.setQueryData(["cars"], context?.previousCars); 
      },});

    const [carData, setCarData] = useState<Car>({
        model_name: "",
        plate_number: "",
        color: "",
    });

    if (isLoading) return <div>Loading cars...</div>;

    const handleAddCar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        if (idCar) {
            updateCarMutation.mutate(carData);
            setIdCar(null);
            setCarData({
                model_name: "",
                color: "",
                plate_number: "",
            });
        }
        else {
            const car = {
                model_name: (form[0] as HTMLInputElement).value,
                color: (form[1] as HTMLInputElement).value,
                plate_number: (form[2] as HTMLInputElement).value,
            }
            createCarMutation.mutate(car);
            setIdCar(null);
            setCarData({
                model_name: "",
                color: "",
                plate_number: "",
            });
        }
    };

    const UpdateCar = (car: Car) => {
        setIdCar(car._id);
        setCarData(car);
    };

    return (
        <div>
            <h1>Car List</h1>
            {cars?.length === 0 ? (
                <p>No cars available. Add a new car below.</p>
            ) : (
                <ul>
                    {cars?.map((car) => (
                        <li key={car._id}>
                            <strong>Model Name:</strong> {car.model_name} <br />
                            <strong>Plate Number:</strong> {car.plate_number} <br />
                            <strong>Color:</strong> {car.color} <br />
                            <button onClick={() => deleteCarMutation.mutate(car._id)}>Delete </button>
                            <br />
                            <button onClick={() => UpdateCar(car)}>Update</button>
                            <br />
                            <br />
                        </li>
                    ))}
                </ul>
            )}

            <h2>{idCar ? 'Update Car' : 'Add Car'}</h2>
            <form onSubmit={handleAddCar} className='form-layout'>
                <input type="text" name="model_name" placeholder={"model"}
                    value={carData.model_name} onChange={(e) => setCarData({ ...carData, model_name: e.target.value })} />
                <input type="text" name="color" placeholder={"color"}
                    value={carData.color} onChange={(e) => setCarData({ ...carData, color: e.target.value })} />
                <input type="text" name="plate_number" placeholder={"plate_number"}
                    value={carData.plate_number} onChange={(e) => setCarData({ ...carData, plate_number: e.target.value })} />
                <button type="submit">{idCar ? 'Update Car' : 'Add Car'}</button>
            </form>
        </div>
    );
}

export default CarList;
