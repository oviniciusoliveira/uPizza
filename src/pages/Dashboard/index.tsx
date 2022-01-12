import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

import { Header } from "../../components/Header";
import { api } from "../../services/api";
import { Food, FoodType } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

export type NewFood = {
  image: string;
  name: string;
  price: string;
  description: string;
};

export type EditFood = {
  name?: string;
  description?: string;
  price?: string;
  image?: string;
  available?: boolean;
};

export function Dashboard() {
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType);
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [isEditFoodModalOpen, setIsEditFoodModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods() {
      try {
        const response = await api.get("/foods");
        setFoods(response.data);
      } catch (err) {
        console.error(`[loadFoods] ${err}`);
      }
    }
    loadFoods();
  }, []);

  async function toggleAvailable(id: number) {
    const foodToToggle = foods.find((food) => food.id === id);
    if (!foodToToggle) return;

    try {
      const response: AxiosResponse = await api.put(`/foods/${id}`, {
        ...foodToToggle,
        available: !foodToToggle.available,
      });

      const foodToggled: FoodType = response.data;

      const foodsUpdated = foods.map((food) => {
        if (food.id !== id) return food;
        return foodToggled;
      });

      setFoods(foodsUpdated);
    } catch (err) {
      console.error(`[toggleAvailable]: ${err}`);
    }
  }

  async function handleAddFood(food: NewFood) {
    const newFood = {
      ...food,
      available: true,
    };

    try {
      const response: AxiosResponse = await api.post("/foods", newFood);
      const data: FoodType = response.data;

      setFoods((prevState) => [...prevState, data]);
    } catch (err) {
      console.error(`[handleAddFood]: ${err}`);
    }
  }

  async function handleUpdateFood(food: EditFood) {
    const foodUpdate = {
      ...editingFood,
      ...food,
    };

    try {
      const response = await api.put(`/foods/${editingFood.id}`, foodUpdate);

      const foodUpdated: FoodType = response.data;

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.id ? f : foodUpdated
      );
      setFoods(foodsUpdated);
    } catch (err) {
      console.error(`[handleUpdateFood]: ${err}`);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);
      const foodsFiltered = foods.filter((food) => food.id !== id);
      setFoods(foodsFiltered);
    } catch (err) {
      console.error(`[handleDeleteFood]: ${err}`);
    }
  }

  function toggleAddFoodModal(isOpen?: boolean) {
    if (isOpen === undefined) {
      setIsAddFoodModalOpen((prevState) => !prevState);
    } else {
      setIsAddFoodModalOpen(isOpen);
    }
  }

  function toggleEditFoodModal(isOpen?: boolean) {
    if (isOpen === undefined) {
      setIsEditFoodModalOpen((prevState) => !prevState);
    } else {
      setIsEditFoodModalOpen(isOpen);
    }
  }

  function handleEditFood(food: FoodType) {
    setEditingFood(food);
    setIsEditFoodModalOpen(true);
  }

  return (
    <>
      <Header openModal={() => toggleAddFoodModal(true)} />
      <ModalAddFood
        isOpen={isAddFoodModalOpen}
        onClose={() => toggleAddFoodModal(false)}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditFoodModalOpen}
        onClose={() => toggleEditFoodModal(false)}
        handleUpdateFood={handleUpdateFood}
        editingFood={editingFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              toggleAvailable={toggleAvailable}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
