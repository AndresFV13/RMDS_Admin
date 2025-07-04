// PlanModal.tsx
import { FC, useEffect, useState, ChangeEvent } from 'react';
import axiosInstance from '../../services/api';
import { Modal } from '../ui/modal';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  editData?: any;
  placesOptions: { id: number; name: string }[];
}

const PlanModal: FC<PlanModalProps> = ({ isOpen, onClose, onSubmitSuccess, editData, placesOptions }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [placeIds, setPlaceIds] = useState<number[]>([]);
  const [additional, setAdditional] = useState<string>('');

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setDescription(editData.description || '');
      setPrice(editData.price || 0);
      setPlaceIds(editData.places?.map((p: any) => p.id) || []);
      setAdditional(editData.additional?.join(', ') || '');
    } else {
      //Limpiar formulario en modo crear
      setTitle('');
      setDescription('');
      setPrice(0);
      setPlaceIds([]);
      setAdditional('');
      setImage(null);
    }
  }, [editData]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('placeIds', JSON.stringify(placeIds));
    formData.append('additional', additional);

    if (image) {
      formData.append('image', image);
    } 

    try {
      if (editData) {
        await axiosInstance.patch(`/plans/${editData.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axiosInstance.post('/plans', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Error al guardar el plan:', error);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setPlaceIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='space-y-6 p-4 sm:p-6 max-w-3xl w-full mx-auto'>
      <div className="space-y-6 p-4 sm:p-6 max-w-xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Precio"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
          <Input
            type="text"
            placeholder="Extras (separados por coma)"
            value={additional}
            onChange={(e) => setAdditional(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Imagen del plan
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
          />
        </div>

        <div>
          <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Selecciona los lugares:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {placesOptions.map((place) => (
              <label
                key={place.id}
                className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.03] dark:border-gray-700"
              >
                <input
                  type="checkbox"
                  checked={placeIds.includes(place.id)}
                  onChange={() => handleCheckboxChange(place.id)}
                  className="accent-blue-500"
                />
                <span className="text-sm text-gray-800 dark:text-gray-200">{place.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {editData ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PlanModal;
