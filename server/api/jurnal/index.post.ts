import { z } from "zod";

const bodySchema = z.object({
  id: z.number().optional(),
  kodeTransaksi: z.string(),
  tanggal: z.string(),
  noReferensi: z.string(),
  nominal: z.number(),
  deskripsi: z.string(),
  noAkun: z.string(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  if (formData.id) {
    await updateJurnal(formData.id, formData);
  } else {
    await createJurnal(formData);
  }

  return;
});
