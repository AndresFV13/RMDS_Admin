import { useEffect, useState } from "react";
import axiosInstance from "../../../services/api";

interface Reservation {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reservationDate: string;
  confirmed: boolean;
  planId: number;
  planPrice: number;
  adults: number;
  status: "active" | "cancelled" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

export default function ViewOnlyReservationsTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get<Reservation[]>("/reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Error al cargar las reservaciones", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Listado de Reservaciones</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Teléfono</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Adultos</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="border-t">
                <td className="px-4 py-2">{res.firstName} {res.lastName}</td>
                <td className="px-4 py-2">{res.email}</td>
                <td className="px-4 py-2">{res.phone}</td>
                <td className="px-4 py-2">
                  {new Date(res.reservationDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{res.adults}</td>
                <td className="px-4 py-2">${res.planPrice}</td>
                <td className="px-4 py-2 capitalize">
                  <span className={`px-2 py-1 rounded text-white text-xs ${
                    res.status === "active"
                      ? "bg-green-500"
                      : res.status === "cancelled"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}>
                    {res.status}
                  </span>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No hay reservaciones disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
