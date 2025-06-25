import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import BasicTableBlog from "../../components/tables/BasicTables/BasicTableBlog";

export default function BasicTablesBlog() {
  return (
    <>
      <PageMeta
        title="Blog"
        description="Panel de gestión del blog"
      />
      <PageBreadcrumb pageTitle="Gestión de planes" />
      <div className="space-y-6">
        <ComponentCard title="Gestión de planes">
          <BasicTableBlog/>
        </ComponentCard>
      </div>
    </>
  );
}
