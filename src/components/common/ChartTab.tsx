import { useState } from "react";

const PestanaGrafico: React.FC = () => {
  const [seleccionado, setSeleccionado] = useState<
    "opcionUno" | "opcionDos" | "opcionTres"
  >("opcionUno");

  const obtenerClaseBoton = (
    opcion: "opcionUno" | "opcionDos" | "opcionTres"
  ) =>
    seleccionado === opcion
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => setSeleccionado("opcionUno")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${obtenerClaseBoton(
          "opcionUno"
        )}`}
      >
        Mensual
      </button>

      <button
        onClick={() => setSeleccionado("opcionDos")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${obtenerClaseBoton(
          "opcionDos"
        )}`}
      >
        Trimestral
      </button>

      <button
        onClick={() => setSeleccionado("opcionTres")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${obtenerClaseBoton(
          "opcionTres"
        )}`}
      >
        Anual
      </button>
    </div>
  );
};

export default PestanaGrafico;
