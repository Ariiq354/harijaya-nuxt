export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllAkun();

  const data = res.map((item) => {
    return {
      id: item.id,
      namaAkun: item.namaAkun,
      deskripsi: item.deskripsi,
      kategoriAkun: item.kategoriAkun,
      kodeAkun: item.kodeAkun,
    };
  });

  return data;
});
