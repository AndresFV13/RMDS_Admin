import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTablePlans from "../../components/tables/BasicTables/BasicTablePlans";

export default function BasicTablesPlans() {
  return (
    <>
      <PageMeta
        title="Planes"
        description="Panel de gestión de planes"
      />
      <PageBreadcrumb pageTitle="Gestión de planes" />
      <div className="space-y-6">
        <ComponentCard title="Gestión de planes">
          <BasicTablePlans />
        </ComponentCard>
      </div>
    </>
  );
}
