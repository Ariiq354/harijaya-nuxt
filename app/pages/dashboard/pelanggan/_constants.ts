import { z } from "zod";

export const columns = [
  {
    key: "name",
    label: "Nama Pelanggan",
    sortable: true,
  },
  {
    key: "address",
    label: "Alamat",
  },
  {
    key: "namaBank",
    label: "Bank",
  },
  {
    key: "phone",
    label: "No. Telepon",
  },
];

export const schema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  npwp: z.string(),
  phone: z.string(),
  address: z.string(),
  namaBank: z.string(),
  namaRekening: z.string(),
  noRekening: z.string(),
});

export type Schema = z.output<typeof schema>;

export const getInitialFormData = (): Partial<Schema> => ({
  id: undefined,
  name: undefined,
  email: undefined,
  npwp: undefined,
  phone: undefined,
  address: undefined,
  namaBank: undefined,
  namaRekening: undefined,
  noRekening: undefined,
});
