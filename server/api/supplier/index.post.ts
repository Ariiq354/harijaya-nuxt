import { z } from "zod";

const bodySchema = z.object({
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

export default defineEventHandler(async (event) => {
  protectFunction(event);

  const formData = await readValidatedBody(event, (body) =>
    bodySchema.parse(body)
  );

  if (formData.id) {
    await updateSupplier(formData.id, formData);
  } else {
    await createSupplier(formData);
  }

  return;
});
