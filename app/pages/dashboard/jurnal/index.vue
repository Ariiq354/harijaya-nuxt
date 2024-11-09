<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    type Schema,
  } from "./_constants";
  import { json2Csv } from "~/utils";

  onMounted(() => {
    defineTopbarTitle("Daftar Jurnal");
  });

  const { data, status, refresh } = await useLazyFetch("/api/jurnal");
  const { data: dataAkun } = await useLazyFetch("/api/akun");
  const { data: KodeTrx, refresh: refreshTrx } = await useFetch(
    "/api/jurnal/kode",
    {
      immediate: false,
    }
  );

  const state = ref(getInitialFormData());

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    modalLoading.value = true;
    try {
      await $fetch("/api/jurnal", {
        method: "POST",
        body: event.data,
      });
      modalOpen.value = false;
      await refresh();
    } catch (error: any) {
      useToastError(String(error.statusCode), error.data.message);
    } finally {
      modalLoading.value = false;
    }
  }

  async function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
    await refreshTrx();
    state.value.kodeTransaksi = KodeTrx.value;
  }

  const selected = ref<ExtractObjectType<typeof data.value>[]>([]);
  async function clickDelete() {
    async function onDelete() {
      const idArray = selected.value.map((item) => item.id);
      await $fetch("/api/jurnal", {
        method: "DELETE",
        body: {
          id: idArray,
        },
      });
      if (selected.value) {
        selected.value = [];
      }
      await refresh();
    }

    openConfirmModal(onDelete);
  }

  async function clickUpdate(itemData: ExtractObjectType<typeof data.value>) {
    modalOpen.value = true;
    state.value = itemData;
  }
</script>

<template>
  <main>
    <Title>Daftar Jurnal</Title>
    <UModal
      v-model="modalOpen"
      prevent-close
      :ui="{
        width: 'sm:max-w-2xl',
      }"
    >
      <div class="px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ state.id ? "Edit" : "Tambah" }} User
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1 rounded-full"
            :disabled="status === 'pending'"
            @click="modalOpen = false"
          />
        </div>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UFormGroup label="Kode transaksi" name="kodeTransaksi">
              <UInput v-model="state.kodeTransaksi" disabled />
            </UFormGroup>

            <UFormGroup label="Nominal" name="nominal">
              <UInput
                v-model="state.nominal"
                type="number"
                :disabled="modalLoading"
              />
            </UFormGroup>

            <UFormGroup label="Akun" name="noAkun">
              <USelectMenu
                v-model="state.noAkun"
                :options="dataAkun"
                :disabled="modalLoading"
                option-attribute="namaAkun"
                value-attribute="kodeAkun"
              />
            </UFormGroup>

            <UFormGroup label="Tanggal Transaksi" name="tanggal">
              <UInput
                v-model="state.tanggal"
                type="date"
                :disabled="modalLoading"
              />
            </UFormGroup>
            <UFormGroup label="No Referensi" name="noReferensi">
              <UInput v-model="state.noReferensi" :disabled="modalLoading" />
            </UFormGroup>
            <UFormGroup label="Deskripsi" name="deskripsi">
              <UInput v-model="state.deskripsi" :disabled="modalLoading" />
            </UFormGroup>
          </div>

          <div class="flex w-full justify-end gap-2">
            <UButton
              icon="i-heroicons-x-mark-16-solid"
              variant="ghost"
              :disabled="modalLoading"
              @click="modalOpen = false"
            >
              Batal
            </UButton>
            <UButton
              type="submit"
              icon="i-heroicons-check-16-solid"
              :loading="modalLoading"
            >
              Simpan
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
    <UCard
      :ui="{
        body: {
          padding: 'sm:p-8',
        },
      }"
    >
      <div
        class="mb-6 flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
      >
        <div class="flex gap-2">
          <UButton
            icon="i-heroicons-plus"
            variant="soft"
            class="gap-2 text-xs text-black md:text-base dark:text-white"
            @click="clickAdd"
          >
            Tambah
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            variant="soft"
            class="gap-2 text-xs text-black disabled:opacity-50 md:text-base dark:text-white"
            :disabled="selected.length === 0"
            @click="clickDelete"
          >
            Hapus
          </UButton>
        </div>
        <UButton
          icon="i-heroicons-arrow-up-tray"
          variant="soft"
          class="gap-2 text-xs text-black disabled:opacity-50 md:text-base dark:text-white"
          :disabled="!(data && data.length > 0)"
          @click="json2Csv(data!)"
        >
          Ekspor
        </UButton>
      </div>
      <AppTable
        v-model="selected"
        label="Kelola Jurnal"
        :loading="status === 'pending'"
        :data="data"
        :columns="columns"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #nominal-data="{ row }">
          <div class="text-right">
            {{ row.nominal.toLocaleString("id-ID") }}
          </div>
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
