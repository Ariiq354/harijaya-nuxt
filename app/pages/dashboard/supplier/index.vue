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
    defineTopbarTitle("Daftar Supplier");
  });

  const { data, status, refresh } = await useLazyFetch("/api/supplier");

  const state = ref(getInitialFormData());

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    modalLoading.value = true;
    try {
      await $fetch("/api/supplier", {
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

  function clickAdd() {
    state.value = getInitialFormData();
    modalOpen.value = true;
  }

  const selected = ref<ExtractObjectType<typeof data.value>[]>([]);
  async function clickDelete() {
    async function onDelete() {
      const idArray = selected.value.map((item) => item.id);
      await $fetch("/api/supplier", {
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
    <Title>Daftar Supplier</Title>
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
            {{ state.id ? "Edit" : "Tambah" }} Supplier
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
            <UFormGroup label="Nama Supplier" name="name">
              <UInput v-model="state.name" :disabled="modalLoading" />
            </UFormGroup>
            <UFormGroup label="NPWP" name="npwp">
              <UInput v-model="state.npwp" :disabled="modalLoading" />
            </UFormGroup>

            <UFormGroup label="Email" name="email">
              <UInput
                v-model="state.email"
                type="email"
                :disabled="modalLoading"
              />
            </UFormGroup>

            <UFormGroup label="No. Telepon" name="phone">
              <UInput v-model="state.phone" :disabled="modalLoading" />
            </UFormGroup>

            <UFormGroup label="Alamat" name="address">
              <UTextarea v-model="state.address" :disabled="modalLoading" />
            </UFormGroup>

            <UFormGroup label="No. Rekening" name="noRekening">
              <UInput v-model="state.noRekening" :disabled="modalLoading" />
            </UFormGroup>

            <UFormGroup label="Nama Bank" name="namaBank">
              <UInput v-model="state.namaBank" :disabled="modalLoading" />
            </UFormGroup>

            <UFormGroup label="Nama Rekening" name="namaRekening">
              <UInput v-model="state.namaRekening" :disabled="modalLoading" />
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
        label="Kelola Supplier"
        :loading="status === 'pending'"
        :data="data"
        :columns="columns"
        @edit-click="(e) => clickUpdate(e)"
      >
        <template #namaBank-data="{ row }">
          {{ row.namaBank + " - " + row.noRekening }}
        </template>
        <template #address-data="{ row }">
          <div class="whitespace-normal">
            {{ row.address }}
          </div>
        </template>
        <template #name-data="{ row }">
          <div class="whitespace-normal">
            {{ row.name }}
          </div>
        </template>
        <template #phone-data="{ row }">
          {{ formatPhoneNumber(row.phone) }}
        </template>
      </AppTable>
    </UCard>
  </main>
</template>
