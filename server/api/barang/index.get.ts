export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllBarang();

  const data = res.map((item) => {
    return {
      id: item.id,
      name: item.name,
      deskripsi: item.deskripsi,
      satuan: item.satuan,
      status: item.status,
      tipe: item.tipe,
    };
  });

  return data;
});
