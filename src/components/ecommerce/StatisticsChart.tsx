import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

export default function GraficoEstadisticas() {
  const [ventas, setVentas] = useState<number[]>([]);
  const [ingresos, setIngresos] = useState<number[]>([]);

  useEffect(() => {
    axiosInstance.get<{ data: number[] }>("/reservations/monthly-summary")
      .then(res => setVentas(res.data.data));

    axiosInstance.get<{ data: number[] }>("/reservations/monthly-income")
      .then(res => setIngresos(res.data.data));
  }, []);

  const opciones: ApexOptions = {
    legend: {
      show: false, 
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], 
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Tipo de gráfico: línea
      toolbar: {
        show: false, // Ocultar barra de herramientas
      },
    },
    stroke: {
      curve: "straight", // Estilo de línea (recta)
      width: [2, 2], // Ancho de las líneas
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0, // Tamaño de los puntos
      strokeColors: "#fff", // Color del borde de los puntos
      strokeWidth: 2,
      hover: {
        size: 6, // Tamaño al pasar el cursor
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Ocultar líneas del eje X
        },
      },
      yaxis: {
        lines: {
          show: true, // Mostrar líneas del eje Y
        },
      },
    },
    dataLabels: {
      enabled: false, // Desactivar etiquetas de datos
    },
    tooltip: {
      enabled: true, // Activar tooltip
      x: {
        format: "dd MMM yyyy", // Formato del tooltip en el eje X
      },
    },
    xaxis: {
      type: "category", // Eje X basado en categorías
      categories: [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
      ],
      axisBorder: {
        show: false, // Ocultar borde del eje X
      },
      axisTicks: {
        show: false, // Ocultar marcas del eje X
      },
      tooltip: {
        enabled: false, // Desactivar tooltip para puntos del eje X
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Tamaño de fuente del eje Y
          colors: ["#6B7280"], // Color de etiquetas del eje Y
        },
      },
      title: {
        text: "", // Sin título en eje Y
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Ventas",
      data: ventas,
    },
    {
      name: "Ingresos",
      data: ingresos,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Estadísticas
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Meta establecida para cada mes
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={opciones} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
