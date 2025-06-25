import { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";

const API_URL = "http://localhost:3000/places";

interface Place {
  id: number;
  name: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function BasicTableOne() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchPlaces = async () => {
    const res = await axios.get<Place[]>(API_URL);
    setPlaces(res.data);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const openNewModal = () => {
    setFormData({ name: "", description: "" });
    setSelectedFile(null);
    setEditingPlace(null);
    setModalOpen(true);
  };

  const openEditModal = (place: Place) => {
    setFormData({ name: place.name, description: place.description || "" });
    setEditingPlace(place);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (selectedFile) data.append("image", selectedFile);

    if (editingPlace) {
      await axios.patch(`${API_URL}/${editingPlace.id}`, data);
    } else {
      await axios.post(API_URL, data);
    }
    setModalOpen(false);
    fetchPlaces();
  };

  const deletePlace = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este lugar?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchPlaces();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Gestión de Lugares</h2>
        <Button onClick={openNewModal}>+ Nuevo Lugar</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <div key={place.id} className="border p-4 rounded-xl shadow-sm">
            {place.image && (
              <img src={place.image} alt={place.name} className="w-full h-40 object-cover rounded-md mb-3" />
            )}
            <h3 className="text-lg font-bold">{place.name}</h3>
            <p className="text-sm text-gray-600">{place.description}</p>
            <div className="mt-3 flex justify-between">
              <Button size="sm" onClick={() => openEditModal(place)}>Editar</Button>
              <Button size="sm" variant="outline" onClick={() => deletePlace(place.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} className="max-w-xl">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <h3 className="text-xl font-semibold mb-2">{editingPlace ? "Editar Lugar" : "Nuevo Lugar"}</h3>
          <div>
            <Label>Nombre</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label>Descripción</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md dark:bg-gray-800"
              rows={3}
            />
          </div>
          <div>
            <Label>Imagen</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
