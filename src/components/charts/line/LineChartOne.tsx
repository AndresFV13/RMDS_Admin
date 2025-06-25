import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function GraficoLineaUno() {
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
        show: false, // Ocultar barra de herramientas del gráfico
      },
    },
    stroke: {
      curve: "straight", // Estilo de línea: recta
      width: [2, 2], // Ancho de cada línea
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
        size: 6, // Tamaño al pasar el mouse
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Ocultar líneas de cuadrícula del eje X
        },
      },
      yaxis: {
        lines: {
          show: true, // Mostrar líneas de cuadrícula del eje Y
        },
      },
    },
    dataLabels: {
      enabled: false, // Desactivar etiquetas de datos
    },
    tooltip: {
      enabled: true, // Activar tooltip
      x: {
        format: "dd MMM yyyy", // Formato del tooltip del eje X
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
        enabled: false, // Desactivar tooltip de puntos en eje X
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Tamaño de fuente para etiquetas del eje Y
          colors: ["#6B7280"], // Color de etiquetas
        },
      },
      title: {
        text: "", // Título vacío para eje Y
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
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="graficoOcho" className="min-w-[1000px]">
        <Chart options={opciones} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
