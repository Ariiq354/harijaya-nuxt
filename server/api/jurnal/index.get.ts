export default defineEventHandler(async (event) => {
  protectFunction(event);

  const res = await getAllJurnal();

  const data = res.map((item) => {
    return {
      id: item.id,
      kodeTransaksi: item.kodeTransaksi,
      noAkun: item.noAkun,
      deskripsi: item.deskripsi,
      noReferensi: item.noReferensi,
      nominal: item.nominal,
      tanggal: item.tanggal,
      namaAkun: item.akun.kodeAkun + " - " + item.akun.namaAkun,
    };
  });

  return data;
});
