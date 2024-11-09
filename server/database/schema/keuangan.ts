import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./common";
import { fakturPembelianTable } from "./pembelian";
import { fakturPenjualanTable } from "./penjualan";

export const akunTable = sqliteTable("akun", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeAkun: text().notNull().unique(),
  namaAkun: text().notNull().unique(),
  kategoriAkun: text().notNull(),
  deskripsi: text().notNull(),
  ...timestamp,
});

export const jurnalTable = sqliteTable("jurnal", {
  id: int().primaryKey({ autoIncrement: true }),
  kodeTransaksi: text().notNull(),
  tanggal: text().notNull(),
  noReferensi: text().notNull(),
  nominal: int().notNull(),
  deskripsi: text().notNull(),
  noAkun: text()
    .notNull()
    .references(() => akunTable.kodeAkun, { onDelete: "set default" })
    .default(""),
  ...timestamp,
});

export const utangTable = sqliteTable("utang", {
  id: int().primaryKey({ autoIncrement: true }),
  noFaktur: text()
    .notNull()
    .references(() => fakturPembelianTable.noFaktur, { onDelete: "cascade" }),
  nilai: int().notNull(),
  sisa: int().notNull(),
  ...timestamp,
});

export const pembayaranUtangTable = sqliteTable("pembayaran_utang", {
  id: int().primaryKey({ autoIncrement: true }),
  noPembayaran: text().notNull().unique(),
  totalNilai: int().notNull(),
  tanggal: text().notNull(),
  ...timestamp,
});

export const pembayaranUtangItemTable = sqliteTable("pembayaran_utang_item", {
  id: int().primaryKey({ autoIncrement: true }),
  noPembayaran: text()
    .notNull()
    .references(() => pembayaranUtangTable.id, { onDelete: "cascade" }),
  noFaktur: text()
    .notNull()
    .references(() => fakturPembelianTable.noFaktur, {
      onDelete: "set default",
    })
    .default(""),
  nilai: int().notNull(),
  ...timestamp,
});

export const piutangTable = sqliteTable("piutang", {
  id: int().primaryKey({ autoIncrement: true }),
  noFaktur: text()
    .notNull()
    .references(() => fakturPenjualanTable.noFaktur, { onDelete: "cascade" }),
  nilai: int().notNull(),
  sisa: int().notNull(),
  ...timestamp,
});

export const pembayaranPiutangTable = sqliteTable("pembayaran_piutang", {
  id: int().primaryKey({ autoIncrement: true }),
  noPembayaran: text().notNull().unique(),
  totalNilai: int().notNull(),
  tanggal: text().notNull(),
  ...timestamp,
});

export const pembayaranPiutangItemTable = sqliteTable(
  "pembayaran_piutang_item",
  {
    id: int().primaryKey({ autoIncrement: true }),
    noPembayaran: text()
      .notNull()
      .references(() => pembayaranPiutangTable.noPembayaran, {
        onDelete: "cascade",
      }),
    noFaktur: text()
      .notNull()
      .references(() => fakturPenjualanTable.noFaktur, {
        onDelete: "set default",
      })
      .default(""),
    nilai: int().notNull(),
    ...timestamp,
  }
);

export const jurnalRelations = relations(jurnalTable, ({ one }) => ({
  akun: one(akunTable, {
    fields: [jurnalTable.noAkun],
    references: [akunTable.kodeAkun],
  }),
}));

export const utangRelations = relations(utangTable, ({ one }) => ({
  fakturPembelian: one(fakturPembelianTable, {
    fields: [utangTable.noFaktur],
    references: [fakturPembelianTable.noFaktur],
  }),
}));

export const pembayaranUtangRelations = relations(
  pembayaranUtangTable,
  ({ many }) => ({
    utangItem: many(pembayaranUtangItemTable),
  })
);

export const pembayaranUtangItemRelations = relations(
  pembayaranUtangItemTable,
  ({ one }) => ({
    pembayaran: one(pembayaranUtangTable, {
      fields: [pembayaranUtangItemTable.noPembayaran],
      references: [pembayaranUtangTable.noPembayaran],
    }),
    faktur: one(fakturPembelianTable, {
      fields: [pembayaranUtangItemTable.noFaktur],
      references: [fakturPembelianTable.noFaktur],
    }),
  })
);

export const piutangRelations = relations(piutangTable, ({ one }) => ({
  fakturPembelian: one(fakturPenjualanTable, {
    fields: [piutangTable.noFaktur],
    references: [fakturPenjualanTable.noFaktur],
  }),
}));

export const pembayaranPiutangRelations = relations(
  pembayaranPiutangTable,
  ({ many }) => ({
    piutangItem: many(pembayaranPiutangItemTable),
  })
);

export const pembayaranPiutangItemRelations = relations(
  pembayaranPiutangItemTable,
  ({ one }) => ({
    pembayaran: one(pembayaranPiutangTable, {
      fields: [pembayaranPiutangItemTable.noPembayaran],
      references: [pembayaranPiutangTable.noPembayaran],
    }),
    faktur: one(fakturPenjualanTable, {
      fields: [pembayaranPiutangItemTable.noFaktur],
      references: [fakturPenjualanTable.noFaktur],
    }),
  })
);

export type Akun = typeof akunTable.$inferSelect;
export type NewAkun = typeof akunTable.$inferInsert;

export type Jurnal = typeof jurnalTable.$inferSelect;
export type NewJurnal = typeof jurnalTable.$inferInsert;

export type Utang = typeof utangTable.$inferSelect;
export type NewUtang = typeof utangTable.$inferInsert;

export type Piutang = typeof piutangTable.$inferSelect;
export type NewPiutang = typeof piutangTable.$inferInsert;

export type PembayaranUtang = typeof pembayaranUtangTable.$inferSelect;
export type NewPembayaranUtang = typeof pembayaranUtangTable.$inferInsert;

export type PembayaranPiutang = typeof pembayaranPiutangTable.$inferSelect;
export type NewPembayaranPiutang = typeof pembayaranPiutangTable.$inferInsert;
