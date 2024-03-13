<script setup lang="ts">
import { ref } from 'vue'
import { fetchGPTSpeech } from '@/functions/fetchGpt'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import indexedDBOperations from '@/functions/indexedDBOperations'
import PlayCircleIcon from '@/components/icons/PlayCircleIcon.vue'
import { PRESET_AUDIOS } from '@/constants/rules'

const props = withDefaults(
  defineProps<{
    items: { id: string; text: string }[]
    label?: string
    size?: 'small' | 'large'
    lang: string
  }>(),
  {
    size: 'small',
    label: undefined,
    lang: 'en'
  }
)

const emit = defineEmits<{
  keyNotFound: []
}>()

const { apiKey } = storeToRefs(useStore())
const { readItem, storeItem } = indexedDBOperations('arrayBuffer')

const audioPlayer = ref<HTMLAudioElement | null>(null)
const audioSrc = ref<string>()
const audioBuffer = ref<ArrayBuffer[]>([])
const isLoading = ref(false)

async function loadBuffer() {
  const promises = props.items.reduce(
    async (acc, { id, text }) => {
      try {
        return [...(await acc), await readItem(id)]
      } catch (e) {
        if (e instanceof Error && e.message.includes('not found')) {
          let newBuffer: ArrayBuffer
          // If the audio is a predefined link, fetch it directly, otherwise use GPT to generate the audio
          if (PRESET_AUDIOS[id]) {
            newBuffer = await fetch(PRESET_AUDIOS[id]).then((res) => res.arrayBuffer())
          } else {
            if (!apiKey.value) {
              emit('keyNotFound')
              return acc
            }
            newBuffer = await fetchGPTSpeech(text, apiKey.value)
          }
          await storeItem(newBuffer, id)
          return [...(await acc), newBuffer]
        }
        console.error(e)
      }
      return acc
    },
    Promise.resolve([] as ArrayBuffer[])
  )
  audioBuffer.value = await promises
}

async function loadAudio() {
  isLoading.value = true
  await loadBuffer()

  // Convert the MP3 buffer to a Blob
  const blob = new Blob(audioBuffer.value, { type: 'audio/mp3' })
  // Create an object URL from the Blob
  audioSrc.value = URL.createObjectURL(blob)

  // Load the audio source and play it
  if (audioPlayer.value) {
    audioPlayer.value.addEventListener(
      'canplaythrough',
      () => {
        audioPlayer.value?.play()
      },
      false
    )
    audioPlayer.value.load()
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex h-10 max-w-full items-center">
    <button
      v-if="!audioSrc"
      type="button"
      class="flex w-max items-center gap-2 rounded-full bg-blue-500 font-semibold text-white"
      :class="{ 'h-8 px-3 text-xs': size === 'small', 'h-10 px-4': size === 'large' }"
      @click="loadAudio"
    >
      <PlayCircleIcon :class="{ 'h-5 w-5': size === 'small', 'h-7 w-7': size === 'large' }" />
      {{ label ?? $t('AudioPlayer.label') }}
      <LoadingSpinner v-if="isLoading" class="*:bg-white" />
    </button>
    <div
      v-show="audioSrc"
      class="flex h-full w-96 flex-col items-center justify-center rounded-full bg-gray-100 shadow-md"
    >
      <audio ref="audioPlayer" :src="audioSrc" class="w-full" controls>
        <track kind="captions" :src="audioSrc" :srclang="lang" />
      </audio>
    </div>
  </div>
</template>
