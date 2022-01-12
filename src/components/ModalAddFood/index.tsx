import { useRef } from "react";
import { FiCheckSquare } from "react-icons/fi";

import { Form } from "./styles";
import { Modal } from "../Modal";
import { Input } from "../Input";
import { NewFood } from "../../pages/Dashboard";
import { FormHandles } from "@unform/core";

type ModalAddFoodProps = {
  isOpen: boolean;
  handleAddFood: (food: NewFood) => Promise<void>;
  onClose: () => void;
};

type FormData = {
  image: string;
  name: string;
  price: number;
  description: string;
};

export function ModalAddFood({
  isOpen,
  handleAddFood,
  onClose,
}: ModalAddFoodProps) {
  const formRef = useRef<FormHandles>(null);

  async function handleSubmit(data: FormData) {
    const newFood = {
      ...data,
      price: String(data.price),
    };

    await handleAddFood(newFood);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" type="text" placeholder="Cole o link aqui" />

        <Input name="name" type="text" placeholder="Ex: Moda Italiana" />
        <Input name="price" type="number" step={0.1} placeholder="Ex: 19.90" />

        <Input name="description" type="text" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}
