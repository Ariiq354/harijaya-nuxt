<script setup lang="ts">
  type itemProp = {
    title: string;
    icon?: string;
    link?: string;
    children?: itemProp[];
  };

  const route = useRoute();

  const props = defineProps<{
    linkItemProp: itemProp[];
    depth: number;
  }>();

  const sidebarState = useSidebarToggle();

  const tabPadding = computed(() => {
    if (props.depth > 0) {
      return {
        paddingLeft: `${1.75 * props.depth}rem`,
      };
    } else {
      return {};
    }
  });
</script>

<template>
  <div v-for="(linkItem, linkIndex) in linkItemProp" :key="linkIndex">
    <NuxtLink
      v-if="!linkItem.children"
      class="flex w-full items-center gap-2 px-8 py-3 text-base transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      :to="linkItem.link"
      @click="sidebarState = true"
    >
      <UIcon
        v-if="depth === 0"
        :name="linkItem.icon ? linkItem.icon : ''"
        class="text-primary h-5 w-5"
      />
      <p
        :class="{
          'font-bold': route.fullPath === linkItem.link,
          'text-sm': depth > 0,
        }"
        class="text-black dark:text-white"
        :style="tabPadding"
      >
        {{ linkItem.title }}
      </p>
    </NuxtLink>
    <UAccordion
      v-else
      :items="[
        {
          label: linkItem.title,
          icon: linkItem.icon,
          slot: 'accordion-slot',
        },
      ]"
      class="text-black dark:text-white"
      :ui="{
        item: {
          padding: 'pt-0 pb-0',
        },
      }"
    >
      <template #default="{ item, open }">
        <div
          class="flex w-full items-center gap-2 px-8 py-3 text-base transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <UIcon
            v-if="depth === 0"
            :name="linkItem.icon ? linkItem.icon : ''"
            class="text-primary h-5 w-5"
          />
          <span
            class="truncate"
            :class="{ 'text-sm': depth > 0 }"
            :style="tabPadding"
          >
            {{ item.label }}
          </span>
          <UIcon
            name="i-heroicons-chevron-right-20-solid"
            class="ms-auto h-5 w-5 transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </div>
      </template>
      <template #accordion-slot>
        <AppSidebarItem
          :link-item-prop="linkItem.children"
          :depth="depth + 1"
        />
      </template>
    </UAccordion>
  </div>
</template>
