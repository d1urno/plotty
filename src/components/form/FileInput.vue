<script setup lang="ts">
import { slugify } from '@/utils'
import { computed, ref } from 'vue'
import XMarkIcon from '@/components/icons/XMarkIcon.vue'
import CameraIcon from '@/components/icons/CameraIcon.vue'
import CropperModal from '@/components/CropperModal.vue'

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

const props = withDefaults(
  defineProps<{
    label: string
    shape?: 'square' | 'circle' | 'rectangle'
    crop?: boolean
    showLabel?: boolean
    progress?: number
  }>(),
  { shape: 'square', theme: 'none', progress: 0 }
)

const model = defineModel<string>()
const cropModel = ref<string>('')

const emit = defineEmits<{
  invalidImage: []
  invalidSize: []
}>()

const slugLabel = computed(() => slugify(props.label))

const cropperModal = ref<{ visible: boolean }>()

async function createFile(file?: File) {
  if (!file || !file.type.match(/image.(jpg|jpeg|png|webp)/i)) {
    emit('invalidImage')
    return false
  }
  if (file.size / 1024 / 1024 > 4) {
    emit('invalidSize')
    return false
  }
  const reader: FileReader = new FileReader()
  return new Promise((resolve) => {
    reader.onload = () => {
      if (!props.crop) model.value = reader.result as string
      else {
        cropModel.value = reader.result as string
        cropperModal.value = { visible: true }
      }
      resolve(reader.result as string)
    }
    reader.readAsDataURL(file)
  })
}

function onDrop(e: DragEvent) {
  e.stopPropagation()
  e.preventDefault()

  if (!e.dataTransfer) return
  const { files } = e.dataTransfer
  createFile(files[0])
}

function onChange(e: Event) {
  const { files } = e.target as HTMLInputEvent['target']
  if (files) createFile(files[0])
}

function removeFile() {
  model.value = ''
}
</script>

<template>
  <div class="relative mx-auto w-full max-w-xs text-left">
    <label :for="`${slugLabel}-file-input`">
      <span v-if="showLabel" class="mb-2 block text-xs font-semibold">
        <slot name="label">{{ label }}</slot>
      </span>

      <div class="relative mt-1 w-full py-[50%]" @dragover.prevent @drop="onDrop">
        <!-- Progress -->
        <transition
          mode="out-in"
          enter-active-class="transition duration-200"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-200"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <span
            v-if="progress > 0 && progress < 100"
            class="absolute inset-0 z-10 flex h-full w-full items-center justify-center"
          >
            <span
              class="flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-600"
            >
              {{ progress }}%
            </span>
          </span>
        </transition>
        <!-- End: Progress -->

        <!-- Instructions -->
        <transition
          appear
          enter-from-class="opacity-0 transform scale-90"
          leave-to-class="opacity-0 transform scale-90"
          leave-active-class="absolute transition duration-300 cubic"
          enter-active-class="transition duration-300 cubic"
        >
          <label
            v-if="!model"
            :for="`${slugLabel}-input-file-button`"
            class="absolute inset-0 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-4"
            :class="{ 'rounded-md': shape === 'square', 'rounded-full': shape === 'circle' }"
          >
            <CameraIcon class="mb-1 w-16 text-gray-500 transition" draggable="false" />
            <span class="max-w-xs select-none text-center text-sm transition">{{ label }}</span>
            <input
              :id="`${slugLabel}-input-file-button`"
              type="file"
              name="image"
              class="invisible absolute z-0"
              @change="onChange"
            />
          </label>
          <!-- End: Instructions -->

          <!-- Dropped image -->
          <div v-else-if="model" class="absolute inset-0">
            <div
              class="h-full overflow-hidden"
              :class="{ 'rounded-md': shape === 'square', 'rounded-full': shape === 'circle' }"
            >
              <img :src="model" alt="" class="h-full w-full object-cover" />
            </div>
            <!-- Remove image button -->
            <button
              type="button"
              class="absolute right-0 top-0 flex h-8 w-8 transform items-center justify-center rounded-full bg-gray-500 text-white shadow transition duration-500 ease-out active:scale-90 lg:hover:scale-105 lg:active:scale-100"
              @mousedown="removeFile"
              @keydown.enter="removeFile"
              @keyup.space="removeFile"
            >
              <XMarkIcon draggable="false" />
            </button>
            <!-- End: Remove image button -->
          </div>
        </transition>
        <!-- End: Dropped image -->
      </div>
    </label>

    <CropperModal
      v-if="cropperModal"
      v-model="cropperModal"
      :src="cropModel"
      @crop="model = $event"
    />
  </div>
</template>
