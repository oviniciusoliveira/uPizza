import { useRef } from "react";
import { FiCheckSquare } from "react-icons/fi";

import { Form } from "./styles";
import { Modal } from "../Modal";
import { Input } from "../Input";
import { FormHandles } from "@unform/core";
import { EditFood } from "../../pages/Dashboard";
import { FoodType } from "../Food";

type FormData = {};

type ModalEditFoodProps = {
  isOpen: boolean;
  editingFood: FoodType;
  handleUpdateFood: (data: EditFood) => Promise<void>;
  onClose: () => void;
};

export function ModalEditFood({
  isOpen,
  editingFood,
  handleUpdateFood,
  onClose,
}: ModalEditFoodProps) {
  const formRef = useRef<FormHandles>(null);

  const initialData = {
    ...editingFood,
    price: Number(editingFood.price),
  };

  async function handleSubmit(data: FormData) {
    await handleUpdateFood(data);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={initialData}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
}
