import { Navigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import ActionButton from "../../../components/admin/ActionButton";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import DataSourceNotice from "../../../components/admin/DataSourceNotice";
import KkjPreview from "../../../components/jemaat/KkjPreview";
import {
  findFamilyByIdFrom,
  getFamilyMembersFrom,
} from "../../../services/jemaatService";
import useJemaatData from "../../../hooks/useJemaatData";

export default function FamilyKkjPreviewPage() {
  const { familyId } = useParams();
  const {
    error: dataError,
    families: localFamilies,
    individuals: localIndividuals,
    loading: dataLoading,
  } = useJemaatData();
  const family = findFamilyByIdFrom(localFamilies, familyId);

  if (!family) {
    return <Navigate to="/admin/jemaat/keluarga" replace />;
  }

  const members = getFamilyMembersFrom(localIndividuals, family.id);

  return (
    <div className="space-y-8">
      <div className="print:hidden">
        <AdminPageHeader
          eyebrow="Preview / Cetak KKJ"
          title={`KKJ ${family.noKk}`}
          description="Preview laporan keluarga mengikuti format Kartu Keluarga Jemaat, termasuk data anggota, tanggal dikeluarkan, dan area pengesahan."
          actions={
            <>
              <ActionButton
                to={`/admin/jemaat/keluarga/${family.id}`}
                icon={ArrowLeft}
              >
                Detail Keluarga
              </ActionButton>
              <ActionButton
                onClick={() => window.print()}
                variant="primary"
                icon={Printer}
              >
                Cetak KKJ
              </ActionButton>
            </>
          }
        />
      </div>

      <div className="print:hidden">
        <DataSourceNotice
          error={dataError}
          label="preview KKJ"
          loading={dataLoading}
        />
      </div>

      <KkjPreview family={family} members={members} />
    </div>
  );
}
