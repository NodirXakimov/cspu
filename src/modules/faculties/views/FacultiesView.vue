<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { Building2, Tag, UserRound, Search, X, Check, Pencil, Trash2 } from 'lucide-vue-next'
import SectionCard from '@/core/components/SectionCard.vue'
import { useFaculties } from '../composables/useFaculties'
import type { Faculty, FacultyDraft } from '../types/faculties.types'

const { t, te } = useI18n()
const { items, loading, fetch, create, update, remove } = useFaculties()

/** Localized faculty name (fallback to the stored name). */
function facultyName(row: Faculty): string {
  if (!row?.code) return row?.name ?? ''
  const key = `faculties.names.${row.code}`
  return te(key) ? t(key) : row.name
}

const search = ref('')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.code.toLowerCase().includes(q) ||
      f.dean.toLowerCase().includes(q),
  )
})

const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<FacultyDraft>({
  code: '',
  name: '',
  dean: '',
  studentsCount: 0,
  staffCount: 0,
  established: new Date().getFullYear(),
})

function resetForm() {
  Object.assign(form, {
    code: '',
    name: '',
    dean: '',
    studentsCount: 0,
    staffCount: 0,
    established: new Date().getFullYear(),
  })
}

function openCreate() {
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

function openEdit(row: Faculty) {
  editingId.value = row.id
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

async function submit() {
  if (editingId.value === null) {
    await create({ ...form })
    ElMessage.success(t('common.save'))
  } else {
    await update(editingId.value, { ...form })
    ElMessage.success(t('common.save'))
  }
  dialogVisible.value = false
}

async function onDelete(row: Faculty) {
  await ElMessageBox.confirm(t('faculties.deleteConfirm'), t('common.confirm'), {
    type: 'warning',
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
  })
  await remove(row.id)
  ElMessage.success(t('common.delete'))
}

onMounted(fetch)
</script>

<template>
  <div class="space-y-4">
    <SectionCard :icon="Building2" :title="$t('faculties.title')">
      <template #actions>
        <div class="flex items-center gap-3">
          <el-input
            v-model="search"
            :placeholder="$t('common.search')"
            clearable
            size="large"
            class="!w-60"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-button type="primary" size="large" @click="openCreate">
            <el-icon class="mr-1"><Plus /></el-icon>{{ $t('faculties.addFaculty') }}
          </el-button>
        </div>
      </template>

      <el-table :data="filtered" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="code" :label="$t('faculties.code')" width="90" />
        <el-table-column prop="name" :label="$t('common.name')" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-2.5">
              <span class="cell-badge"><Building2 :size="16" /></span>
              <span class="font-medium">{{ facultyName(row as Faculty) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dean" :label="$t('faculties.dean')" min-width="140" />
        <el-table-column prop="studentsCount" :label="$t('faculties.students')" width="120" sortable />
        <el-table-column prop="staffCount" :label="$t('faculties.staff')" width="110" sortable />
        <el-table-column prop="established" :label="$t('faculties.established')" width="120" />
        <el-table-column :label="$t('common.actions')" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <div class="flex items-center justify-center gap-2">
              <button class="tbl-action tbl-action--edit" @click="openEdit(row as Faculty)">
                <Pencil :size="16" />
              </button>
              <button class="tbl-action tbl-action--del" @click="onDelete(row as Faculty)">
                <Trash2 :size="16" />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </SectionCard>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId === null ? $t('faculties.addFaculty') : $t('faculties.editFaculty')"
      width="480px"
      align-center
      append-to-body
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-4">
        <el-input v-model="form.code" size="large" :placeholder="$t('faculties.code')">
          <template #prefix><el-icon><Tag /></el-icon></template>
        </el-input>
        <el-input v-model="form.dean" size="large" :placeholder="$t('faculties.dean')">
          <template #prefix><el-icon><UserRound /></el-icon></template>
        </el-input>
        <el-input
          v-model="form.name"
          size="large"
          class="col-span-2"
          :placeholder="$t('common.name')"
        >
          <template #prefix><el-icon><Building2 /></el-icon></template>
        </el-input>
        <div>
          <label class="field-label">{{ $t('faculties.students') }}</label>
          <el-input-number
            v-model="form.studentsCount"
            :min="0"
            size="large"
            controls-position="right"
            class="!w-full"
          />
        </div>
        <div>
          <label class="field-label">{{ $t('faculties.staff') }}</label>
          <el-input-number
            v-model="form.staffCount"
            :min="0"
            size="large"
            controls-position="right"
            class="!w-full"
          />
        </div>
        <div class="col-span-1">
          <label class="field-label">{{ $t('faculties.established') }}</label>
          <el-input-number
            v-model="form.established"
            :min="1900"
            :max="2100"
            size="large"
            controls-position="right"
            class="!w-full"
          />
        </div>
      </div>
      <template #footer>
        <el-button size="large" @click="dialogVisible = false">
          <el-icon class="mr-1"><X /></el-icon>{{ $t('common.cancel') }}
        </el-button>
        <el-button type="primary" size="large" @click="submit">
          <el-icon class="mr-1"><Check /></el-icon>{{ $t('common.save') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.field-label {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
}
</style>
