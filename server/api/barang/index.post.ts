import { z } from "zod";

const bodySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  deskripsi: z.string(),
  satuan: z.string(),
  status: z.boolean(),
  tipe: z.number(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  if (formData.id) {
    await updateBarang(formData.id, formData);
  } else {
    await createBarang(formData);
  }

  return;
});
