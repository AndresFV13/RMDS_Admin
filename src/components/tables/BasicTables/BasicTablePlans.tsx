import { useEffect, useState } from "react";
import PlanModal from "../../modals/PlanModal";
import api from "../../../services/api";
import Button from "../../ui/button/Button";

interface PlaceOption {
  id: number;
  name: string;
}

interface Plan {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  additional: string[];
  places: PlaceOption[];
}

export default function BasicTablePlans() {
  const [isOpen, setIsOpen] = useState(false);
  const [placesOptions, setPlacesOptions] = useState<PlaceOption[]>([]);
  const [editData, setEditData] = useState<Plan | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setEditData(null);
  };

  const fetchPlans = async () => {
    try {
      const response = await api.get<Plan[]>("/plans");
      setPlans(response.data);
    } catch (err) {
      console.error("Error al cargar planes", err);
    }
  };

  const handleSuccess = () => {
    setIsOpen(false);
    fetchPlans();
  };

  const handleEdit = (plan: Plan) => {
    setEditData(plan);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este plan?")) return;
    try {
      await api.delete(`/plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error("Error al eliminar plan", err);
    }
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await api.get<PlaceOption[]>("/places");
        setPlacesOptions(response.data);
      } catch (err) {
        console.error("Error al cargar lugares", err);
      }
    };
    fetchPlaces();
    fetchPlans();
  }, []);

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button onClick={handleOpen}>Crear nuevo plan</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-xl border bg-white shadow-md overflow-hidden">
            {plan.image && (
              <img
                src={plan.image}
                alt={plan.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">{plan.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{plan.description}</p>
              <p className="text-sm font-medium text-brand-600">Precio: ${plan.price}</p>
              <p className="text-sm text-gray-500">
                <strong>Lugares:</strong> {plan.places.map((p) => p.name).join(', ')}
              </p>
              {plan.additional?.length > 0 && (
                <p className="text-sm text-gray-500">
                  <strong>Extras:</strong> {plan.additional.join(', ')}
                </p>
              )}
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => handleEdit(plan)}>Editar</Button>
                <Button variant="outline" onClick={() => handleDelete(plan.id)}>Eliminar</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PlanModal
        isOpen={isOpen}
        onClose={handleClose}
        onSubmitSuccess={handleSuccess}
        editData={editData}
        placesOptions={placesOptions}
      />
    </div>
  );
}
