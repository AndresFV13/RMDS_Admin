import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableReservations from "../../components/tables/BasicTables/BasicTableReservation";

export default function BasicTablesBlog() {
  return (
    <>
      <PageMeta
        title="Reservaciones"
        description="Panel de gestión de las reservas"
      />
      <PageBreadcrumb pageTitle="Gestión de planes" />
      <div className="space-y-6">
        <ComponentCard title="Gestión de planes">
          <BasicTableReservations/>
        </ComponentCard>
      </div>
    </>
  );
}
