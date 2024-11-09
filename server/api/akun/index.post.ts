import { z } from "zod";

const bodySchema = z.object({
  id: z.number().optional(),
  kodeAkun: z.string(),
  namaAkun: z.string(),
  deskripsi: z.string(),
  kategoriAkun: z.string(),
});

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  if (formData.id) {
    await updateAkun(formData.id, formData);
  } else {
    await createAkun(formData);
  }

  return;
});
