<script setup lang="ts">
  import type { FormSubmitEvent } from "#ui/types";
  import {
    columns,
    getInitialFormData,
    schema,
    selectOptions,
    type Schema,
  } from "./_constants";
  import { json2Csv } from "~/utils";

  onMounted(() => {
    defineTopbarTitle("Daftar Akun");
  });

  const { data, status, refresh } = await useLazyFetch("/api/akun");

  const state = ref(getInitialFormData());

  const modalOpen = ref(false);
  const modalLoading = ref(false);
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    modalLoading.value = true;
    try {
      await $fetch("/api/akun", {
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
      await $fetch("/api/akun", {
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
    <Title>Daftar Akun</Title>
    <UModal v-model="modalOpen" prevent-close>
      <div class="px-4 py-5">
        <div class="mb-4 flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ state.id ? "Edit" : "Tambah" }} Akun
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
          <UFormGroup label="Kode Akun" name="kodeAkun">
            <UInput v-model="state.kodeAkun" :disabled="modalLoading" />
          </UFormGroup>

          <UFormGroup label="Nama Akun" name="namaAkun">
            <UInput v-model="state.namaAkun" :disabled="modalLoading" />
          </UFormGroup>

          <UFormGroup label="Kategori Akun" name="kategoriAkun">
            <USelectMenu
              v-model="state.kategoriAkun"
              :options="selectOptions"
              :disabled="modalLoading"
            />
          </UFormGroup>

          <UFormGroup label="Deskripsi" name="deskripsi">
            <UTextarea v-model="state.deskripsi" :disabled="modalLoading" />
          </UFormGroup>

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
        label="Kelola Akun"
        :loading="status === 'pending'"
        :data="data"
        :columns="columns"
        @edit-click="(e) => clickUpdate(e)"
      />
    </UCard>
  </main>
</template>
