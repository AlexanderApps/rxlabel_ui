<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div
        v-for="(stat, idx) in labelStats"
        :key="idx"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
      >
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide"
          >
            {{ stat.label }}
          </h3>
          <div
            :class="stat.color"
            class="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
          >
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="stat.iconPath"
              />
            </svg>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800 dark:text-slate-100">{{ stat.value }}</p>
      </div>
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">Label Templates</h3>
        <button
          class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
        >
          Create Template
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="template in templates"
          :key="template.id"
          class="border-2 border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:shadow-lg cursor-pointer group"
        >
          <div class="flex items-start justify-between mb-3">
            <h4
              class="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
            >
              {{ template.name }}
            </h4>
            <span :class="template.typeColor" class="px-2 py-1 rounded-lg text-xs font-bold">
              {{ template.type }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">{{ template.description }}</p>
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{{ template.uses }} uses</span>
            <span>{{ template.lastModified }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const labelStats = [
  {
    label: 'Templates',
    value: '24',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconPath:
      'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z'
  },
  {
    label: 'Printed Today',
    value: '156',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    iconPath:
      'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
  },
  {
    label: 'In Queue',
    value: '8',
    color: 'bg-gradient-to-br from-amber-500 to-orange-600',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  }
]

const templates = [
  {
    id: 1,
    name: 'Standard Prescription',
    type: 'Rx',
    typeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    description: 'Default prescription label format',
    uses: 2847,
    lastModified: '2 days ago'
  },
  {
    id: 2,
    name: 'Refrigeration Required',
    type: 'Special',
    typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'For temperature-sensitive medications',
    uses: 342,
    lastModified: '1 week ago'
  },
  {
    id: 3,
    name: 'Controlled Substance',
    type: 'CII-V',
    typeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    description: 'Controlled medication labeling',
    uses: 523,
    lastModified: '3 days ago'
  },
  {
    id: 4,
    name: 'Pediatric Dosing',
    type: 'Peds',
    typeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    description: 'Child-specific instructions',
    uses: 189,
    lastModified: '5 days ago'
  },
  {
    id: 5,
    name: 'Compounded Medicine',
    type: 'Custom',
    typeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    description: 'Custom compounded medications',
    uses: 76,
    lastModified: '1 week ago'
  },
  {
    id: 6,
    name: 'Multi-Language',
    type: 'i18n',
    typeColor: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    description: 'Bilingual label support',
    uses: 412,
    lastModified: '4 days ago'
  }
]
</script>
