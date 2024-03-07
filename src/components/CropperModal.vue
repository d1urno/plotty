<script setup lang="ts">
import GenericModal from '@/components/GenericModal.vue'
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

const props = defineProps<{
  src: string
}>()

const model = defineModel<{ visible: boolean }>()
const cropModel = ref<string>(props.src)

const emit = defineEmits<{
  crop: [string]
}>()

const cropperRef = ref<InstanceType<typeof Cropper> | null>(null)

function onCropChange(value: { canvas: HTMLCanvasElement }) {
  cropModel.value = value.canvas.toDataURL('image/jpeg')
}

function onDone(close: () => void) {
  emit('crop', cropModel.value)
  close()
}
</script>

<template>
  <GenericModal
    v-if="model"
    v-model="model.visible"
    max-width-class="max-w-xl"
    @close="model = undefined"
  >
    <template #title>{{ $t('CropperModal.title') }}</template>
    <div class="flex h-full flex-col items-center justify-center">
      <Cropper
        ref="cropperRef"
        height="600px"
        width="600px"
        :stencil-props="{ aspectRatio: 4 / 4 }"
        :max-width="600"
        :max-height="600"
        class="example-cropper"
        :src="src"
        @change="onCropChange"
      />
    </div>

    <template #footer="{ close }">
      <div class="flex justify-end gap-4">
        <button
          type="button"
          class="rounded-md bg-gray-200 px-10 py-2 font-bold text-gray-400"
          @click="close"
        >
          {{ $t('CropperModal.buttons.cancel') }}
        </button>
        <button
          type="button"
          class="rounded-md bg-blue-500 px-10 py-2 font-bold text-white"
          @click="onDone(close)"
        >
          {{ $t('CropperModal.buttons.done') }}
        </button>
      </div>
    </template>
  </GenericModal>
</template>
