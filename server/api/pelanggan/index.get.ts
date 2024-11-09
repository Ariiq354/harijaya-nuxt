export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllPelanggan();

  const data = res.map((item) => {
    return {
      id: item.id,
      address: item.address,
      email: item.email,
      namaBank: item.namaBank,
      namaRekening: item.namaRekening,
      name: item.name,
      noRekening: item.noRekening,
      npwp: item.npwp,
      phone: item.phone,
    };
  });

  return data;
});
