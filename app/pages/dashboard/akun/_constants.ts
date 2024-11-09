import { z } from "zod";

export const columns = [
  {
    key: "kodeAkun",
    label: "Kode Akun",
    sortable: true,
  },
  {
    key: "namaAkun",
    label: "Nama Akun",
    sortable: true,
  },
  {
    key: "kategoriAkun",
    label: "Kategori Akun",
    sortable: true,
  },
];

export const selectOptions = [
  "Kas & setara kas",
  "Piutang usaha",
  "Persediaan barang",
  "Aktiva tetap",
  "Aktiva lainnya",
  "Utang usaha",
  "Utang lainnya",
  "Modal usaha",
  "Pendapatan usaha",
  "Pendapatan lainnya",
  "Biaya usaha",
  "Biaya lainnya",
];

export const schema = z.object({
  id: z.number().optional(),
  kodeAkun: z.string(),
  namaAkun: z.string(),
  deskripsi: z.string(),
  kategoriAkun: z.string(),
});

export type Schema = z.output<typeof schema>;

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  kodeAkun: undefined,
  namaAkun: undefined,
  deskripsi: "",
  kategoriAkun: undefined,
});
