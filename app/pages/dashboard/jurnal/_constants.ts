import { z } from "zod";

export const columns = [
  {
    key: "kodeTransaksi",
    label: "Kode Transaksi",
    sortable: true,
  },
  {
    key: "tanggal",
    label: "Tanggal Transaksi",
    sortable: true,
  },
  {
    key: "namaAkun",
    label: "Nama Akun",
  },
  {
    key: "nominal",
    label: "Nominal",
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
  },
];

export const schema = z.object({
  id: z.number().optional(),
  kodeTransaksi: z.string(),
  tanggal: z.string(),
  noReferensi: z.string(),
  nominal: z.number(),
  deskripsi: z.string(),
  noAkun: z.string(),
});

export type Schema = z.output<typeof schema>;

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  kodeTransaksi: undefined,
  tanggal: undefined,
  noReferensi: undefined,
  nominal: undefined,
  deskripsi: "",
  noAkun: undefined,
});
