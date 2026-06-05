import {
  formatBirthPlaceDate,
  formatDate,
  genderInitial,
} from "../../services/jemaatService";

export default function KkjPreview({ family, members, issuedDate = "2026-02-16" }) {
  return (
    <article className="kkj-print-area print-area mx-auto max-w-5xl rounded-2xl border border-violet-100 bg-white p-6 text-slate-950 shadow-sm md:p-10 print:max-w-none print:rounded-none print:border-0 print:p-0 print:text-[11px] print:shadow-none">
      <header className="border-b-2 border-slate-900 pb-4 text-center">
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row print:flex-row">
          <img
            src="/brand/gereja-amin-logo.svg"
            alt="Logo Gereja AMIN"
            className="h-20 w-auto object-contain print:h-16"
          />
          <div>
            <p className="text-lg font-bold uppercase tracking-wide">
              Gereja AMIN Jemaat Tangerang Raya
            </p>
            <p className="mt-1 text-[11px] leading-5">
              Jl. Persatuan, RT 002/RW 008, Ciater, Kec. Serpong, Kota Tangerang Selatan,
              Banten 15310
            </p>
            <p className="text-[11px] leading-5">
              Hp. +62 813-7036-5956; +62 877-7271-9168; +62 811-1694-446
            </p>
            <p className="text-[11px] leading-5">
              e-mail: gerejaamintangerangraya@gmail.com; website: www.gerejaamintr.com
            </p>
          </div>
        </div>
        <h2 className="mt-5 text-lg font-bold uppercase tracking-wide">
          Kartu Keluarga Jemaat (KKJ)
        </h2>
      </header>

      <section className="mt-8 grid gap-3 rounded-xl border border-slate-200 p-4 text-sm print:border-slate-400 print:p-3">
        <InfoRow label="No KK" value={family.noKk} />
        <InfoRow label="Nama Kepala Keluarga" value={family.kepalaKeluarga} />
        <InfoRow label="Nama Pasangan" value={family.pasangan || "-"} />
        <InfoRow label="Tgl. Pernikahan" value={formatDate(family.tanggalPernikahan)} />
        <InfoRow label="Sektor" value={family.sektor} />
        <InfoRow label="Status Keluarga" value={family.statusKeluarga} />
        <InfoRow label="Alamat" value={family.alamat} />
      </section>

      <section className="mt-7 break-inside-avoid">
        <p className="mb-3 text-sm font-semibold">Data Anggota Keluarga</p>
        <div className="overflow-x-auto print:overflow-visible">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-violet-50 print:bg-white">
                <th className="border border-slate-400 px-2 py-2 font-semibold">No.</th>
                <th className="border border-slate-400 px-2 py-2 font-semibold">
                  No. Induk
                </th>
                <th className="border border-slate-400 px-2 py-2 font-semibold">
                  Nama Lengkap
                </th>
                <th className="border border-slate-400 px-2 py-2 font-semibold">JK</th>
                <th className="border border-slate-400 px-2 py-2 font-semibold">
                  Tmp, Tgl. Lahir
                </th>
                <th className="border border-slate-400 px-2 py-2 font-semibold">
                  Gol. Darah
                </th>
                <th className="border border-slate-400 px-2 py-2 font-semibold">
                  Pekerjaan
                </th>
                <th className="border border-slate-400 px-2 py-2 font-semibold">
                  Hubungan
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={member.id}>
                  <td className="border border-slate-400 px-2 py-2 align-top">
                    {index + 1}
                  </td>
                  <td className="border border-slate-400 px-2 py-2 align-top font-medium">
                    {member.noInduk}
                  </td>
                  <td className="border border-slate-400 px-2 py-2 align-top">
                    {member.namaLengkap}
                  </td>
                  <td className="border border-slate-400 px-2 py-2 align-top">
                    {genderInitial(member.jenisKelamin)}
                  </td>
                  <td className="border border-slate-400 px-2 py-2 align-top">
                    {formatBirthPlaceDate(member)}
                  </td>
                  <td className="border border-slate-400 px-2 py-2 align-top">
                    {member.golDarah || "-"}
                  </td>
                  <td className="border border-slate-400 px-2 py-2 align-top">
                    {member.pekerjaan || "-"}
                  </td>
                  <td className="border border-slate-400 px-2 py-2 align-top">
                    {member.hubunganKeluarga || "-"}
                  </td>
                </tr>
              ))}
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="border border-slate-400 px-2 py-5 text-center">
                    Belum ada anggota keluarga yang tercatat.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 text-sm">
        <InfoRow label="Dikeluarkan Tanggal" value={formatDate(issuedDate)} />
      </section>

      <section className="mt-12 grid break-inside-avoid gap-8 text-center text-sm sm:grid-cols-2">
        <div>
          <p>Kepala Keluarga</p>
          <div className="h-24 print:h-20" />
          <p className="font-semibold">{members[0]?.namaLengkap || family.kepalaKeluarga}</p>
        </div>
        <div>
          <p className="font-semibold uppercase">Gereja AMIN Jemaat Tangerang Raya</p>
          <p>Badan Pekerja Harian Majelis Jemaat (BPHMJ)</p>
          <div className="h-20 print:h-16" />
          <p className="font-semibold">SNK. Kecitaan Harefa, S.Kom., M.Kom.</p>
          <p>Ketua I</p>
        </div>
      </section>
    </article>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[170px_1fr]">
      <p className="font-semibold">{label}</p>
      <p>
        <span className="hidden sm:inline">: </span>
        {value || "-"}
      </p>
    </div>
  );
}
