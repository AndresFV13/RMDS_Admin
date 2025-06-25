import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";

export default function GraficoEstadisticas() {
  const opciones: ApexOptions = {
    legend: {
      show: false, // Ocultar leyenda
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"], // Colores de las líneas
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
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Ingresos",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
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
