import { z } from "zod";

export const columns = [
  {
    key: "name",
    label: "Nama Supplier",
    sortable: true,
  },
  {
    key: "alamat",
    label: "Nama Akun",
    sortable: true,
  },
  {
    key: "kategoriAkun",
    label: "Kategori Akun",
    sortable: true,
  },
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
