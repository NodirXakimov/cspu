<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Search, OfficeBuilding } from '@element-plus/icons-vue'
import { Building2 } from 'lucide-vue-next'
import SectionCard from '@/core/components/SectionCard.vue'
import { useFaculties } from '../composables/useFaculties'
import type { Faculty, FacultyDraft } from '../types/faculties.types'

const { t } = useI18n()
const { items, loading, fetch, create, update, remove } = useFaculties()

/** Localized faculty name (fallback to the stored name). */
function facultyName(row: Faculty): string {
  const key = `faculties.names.${row.code}`
  const translated = t(key)
  return translated === key ? row.name : translated
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
            class="!w-56"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-button type="primary" @click="openCreate">
            <el-icon class="mr-1"><Plus /></el-icon>{{ $t('faculties.addFaculty') }}
          </el-button>
        </div>
      </template>

      <el-table :data="filtered" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="code" :label="$t('faculties.code')" width="90" />
        <el-table-column prop="name" :label="$t('common.name')" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-icon class="text-[var(--el-color-primary)]"><OfficeBuilding /></el-icon>
              <span>{{ facultyName(row as Faculty) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dean" :label="$t('faculties.dean')" min-width="140" />
        <el-table-column prop="studentsCount" :label="$t('faculties.students')" width="120" sortable />
        <el-table-column prop="staffCount" :label="$t('faculties.staff')" width="110" sortable />
        <el-table-column prop="established" :label="$t('faculties.established')" width="120" />
        <el-table-column :label="$t('common.actions')" width="130" fixed="right">
          <template #default="{ row }">
            <el-button size="small" text :icon="Edit" @click="openEdit(row as Faculty)" />
            <el-button size="small" text type="danger" :icon="Delete" @click="onDelete(row as Faculty)" />
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
      <el-form :model="form" label-width="130px">
        <el-form-item :label="$t('faculties.code')">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item :label="$t('common.name')">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item :label="$t('faculties.dean')">
          <el-input v-model="form.dean" />
        </el-form-item>
        <el-form-item :label="$t('faculties.students')">
          <el-input-number v-model="form.studentsCount" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('faculties.staff')">
          <el-input-number v-model="form.staffCount" :min="0" />
        </el-form-item>
        <el-form-item :label="$t('faculties.established')">
          <el-input-number v-model="form.established" :min="1900" :max="2100" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>
