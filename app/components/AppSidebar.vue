<script setup lang="ts">
  const sidebarState = useSidebarToggle();

  const sidebarItems = [
    {
      title: "Dashboard",
      items: [
        {
          label: "Home Dashboard",
          link: "/dashboard",
          icon: "i-heroicons-home",
        },
        {
          label: "Daftar User",
          link: "/dashboard/user",
          icon: "i-heroicons-user",
        },
      ],
    },
    {
      title: "Menu Utama",
      items: [
        {
          label: "Keuangan",
          icon: "i-heroicons-banknotes",
          children: [
            {
              label: "Daftar Akun",
              link: "/dashboard/akun",
            },
            {
              label: "Input Jurnal",
              link: "/dashboard/jurnal",
            },
            {
              label: "Utang",
              children: [
                {
                  label: "Daftar Utang",
                },
                {
                  label: "Daftar Pembayaran",
                },
              ],
            },
            {
              label: "Piutang",
              children: [
                {
                  label: "Daftar Piutang",
                },
                {
                  label: "Daftar Pembayaran",
                },
              ],
            },
          ],
        },
        {
          label: "Pembelian",
          icon: "i-heroicons-shopping-cart",
          children: [
            {
              label: "Daftar Supplier",
              link: "/dashboard/supplier",
            },
            {
              label: "Faktur Pembelian",
            },
          ],
        },
        {
          label: "Penjualan",
          icon: "i-heroicons-shopping-bag",
          children: [
            {
              label: "Daftar Barang",
            },
            {
              label: "Daftar Pelanggan",
            },
            {
              label: "Faktur Penjualan",
            },
          ],
        },
        {
          label: "Inventory",
          icon: "i-heroicons-archive-box",
          children: [
            {
              label: "Stok Bahan Mentah",
            },
            {
              label: "Stok Bahan Jadi",
            },
            {
              label: "Proses Produksi",
            },
            {
              label: "Stok Fisik",
            },
          ],
        },
        {
          label: "Laporan",
          icon: "i-heroicons-document-chart-bar",
          children: [
            {
              label: "Buku Besar",
            },
            {
              label: "Daftar Transaksi",
            },
            {
              label: "Neraca",
            },
            {
              label: "Laba Rugi",
            },
          ],
        },
      ],
    },
  ];
</script>

<template>
  <aside
    class="fixed top-0 z-20 h-full w-72 overflow-hidden border-r border-gray-200 bg-white shadow-xl transition-all duration-200 dark:border-gray-700 dark:bg-gray-900"
    :class="sidebarState ? '-left-72 md:left-0' : 'left-0 md:-left-72'"
  >
    <div class="text-primary flex items-center justify-center pb-8 pt-10">
      <div class="flex items-center gap-2 text-2xl tracking-widest">
        <NuxtImg src="/logo.webp" width="30" height="30" alt="logo" />
        <span>HARIJAYA</span>
      </div>
    </div>
    <div v-for="(firstItem, firstIndex) in sidebarItems" :key="firstIndex">
      <h1 class="text-primary px-8 py-4 text-sm font-bold uppercase">
        {{ firstItem.title }}
      </h1>
      <nav :aria-label="firstItem.title + ' navigation'">
        <AppSidebarItem :link-item-prop="firstItem.items" :depth="0" />
      </nav>
    </div>
  </aside>
  <div
    v-if="!sidebarState"
    class="fixed left-0 top-0 z-10 h-full w-full bg-black/20 md:hidden"
    @click="sidebarState = true"
  />
</template>
