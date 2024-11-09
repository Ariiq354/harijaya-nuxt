import { z } from "zod";

export const columns = [
  {
    key: "name",
    label: "Nama Produk",
    sortable: true,
  },
  {
    key: "deskripsi",
    label: "Deskripsi",
  },
  {
    key: "satuan",
    label: "Satuan",
  },
  {
    key: "status",
    label: "Status",
  },
];

export const tipeOptions = [
  {
    name: "Bahan Mentah",
    value: 1,
  },
  {
    name: "Barang Jadi",
    value: 2,
  },
];

export const satuanOptions = ["kilogram", "gram", "liter", "pcs"];

export const schema = z.object({
  id: z.number().optional(),
  name: z.string(),
  deskripsi: z.string(),
  satuan: z.string(),
  status: z.boolean(),
  tipe: z.number(),
});

export type Schema = z.output<typeof schema>;

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  name: undefined,
  deskripsi: undefined,
  status: false,
  satuan: undefined,
  tipe: undefined,
});
