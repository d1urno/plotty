import { ref } from 'vue'
import useModal from '@/composables/useModal'
import useToast from '@/composables/useToast'
import buildStoryPrompt from '@/functions/buildStoryPrompt'
import { fetchGPT, stopFetchGPT } from '@/functions/fetchGpt'
import { storeToRefs } from 'pinia'
import { createSharedComposable } from '@vueuse/core'
import type { Chapter, Story } from '@/types/local'
import { useStore } from '@/stores'
import { generateUniqueId } from '@/utils'
import useCharacterItemsByIds from '@/composables/useCharacterItemsByIds'
import type { GetCharacterItemsByIdsQueryVariables } from '@/types/generated'
import useStoryForm from '@/composables/useStoryForm'
import type { StoryGenre } from '@/constants/rules'
import { useI18n } from 'vue-i18n'
import getLanguageFromLocale from '@/functions/getLanguageFromLocale'

function useStoryAi() {
  const { stories, isPromptLoading, isAiLoading, apiKey } = storeToRefs(useStore())
  const { formData: storyFormData } = useStoryForm()
  const { showModal } = useModal()
  const { t, locale } = useI18n()
  const { showToast, hideToast } = useToast()

  const variables = ref<GetCharacterItemsByIdsQueryVariables>({ ids: [] })
  const { fetchOrRefetch } = useCharacterItemsByIds(variables)

  async function getStoryPrompt() {
    isPromptLoading.value = true
    variables.value.ids = [
      ...storyFormData.value.mainCharacters,
      ...storyFormData.value.secondaryCharacters
    ]
    try {
      const characters = await fetchOrRefetch()
      if (!characters) {
        showToast({
          content: t('useAi.errors.errorFetchingCharactersText'),
          type: 'error',
          duration: 5000,
          closable: true
        })
        return null
      }

      return buildStoryPrompt({
        mainCharacters: characters.filter((cd) =>
          storyFormData.value.mainCharacters.includes(cd.id)
        ),
        secondaryCharacters: characters.filter((cd) =>
          storyFormData.value.secondaryCharacters.includes(cd.id)
        ),
        decisionMakers: characters.filter((cd) =>
          storyFormData.value.decisionMakers.includes(cd.id)
        ),
        totalChapters: storyFormData.value.totalChapters,
        storyLength: storyFormData.value.storyLength,
        storyMode: storyFormData.value.storyMode,
        storyStyle: storyFormData.value.storyStyle,
        storyGenres: storyFormData.value.storyGenres,
        specialInstructions: storyFormData.value.customInstructions,
        storyStructure: storyFormData.value.storyStructure,
        storyLanguage: getLanguageFromLocale(locale.value),
        storyAudience: storyFormData.value.storyAudience
      })
    } catch (e) {
      console.error(e)
      return null
    } finally {
      isPromptLoading.value = false
    }
  }

  async function generateStory(prompt: string) {
    if (!apiKey.value) throw new Error('API key not found')

    isAiLoading.value = true

    let toastId
    const toastTimeout = setTimeout(() => {
      toastId = showToast({
        content: t('useAi.generatingText'),
        type: 'info',
        duration: 0,
        buttons: [
          {
            label: t('useAi.buttons.cancel.label'),
            callbackOrLink: (closeToast) => {
              showModal({
                title: t('useAi.buttons.cancel.title'),
                content: t('useAi.buttons.cancel.content'),
                buttons: [
                  {
                    label: t('useAi.buttons.cancel.confirm'),
                    type: 'info',
                    callbackOrLink: (closeModal) => {
                      stopFetchGPT()
                      closeModal()
                      closeToast()
                    }
                  }
                ]
              })
            }
          }
        ]
      })
    }, 2000) // Fired with time out to avoid flickering on api key error

    const payload: Story = {
      ...storyFormData.value,
      id: generateUniqueId(),
      created: new Date().toISOString(),
      storyLanguage: getLanguageFromLocale(locale.value),
      title: ''
    }

    try {
      const result = await fetchGPT(prompt, apiKey.value)
      const aiResult: {
        title: string
        content?: string
        chapters?: { title: string; content: string }[]
        nextChapterSuggestions?: string[]
        nextChapterActionDecisions?: { characterName: string; actions: string[] }
        genre?: StoryGenre
      } = JSON.parse(result.choices[0].message.content)

      const chapters: Chapter[] = aiResult.chapters?.map((c) => ({
        id: generateUniqueId(),
        created: new Date().toISOString(),
        title: c.title,
        content: c.content,
        decidingCharacterName: aiResult.nextChapterActionDecisions?.characterName,
        nextChapterChoices:
          aiResult.nextChapterSuggestions ?? aiResult.nextChapterActionDecisions?.actions
      })) ?? [
        {
          id: generateUniqueId(),
          created: new Date().toISOString(),
          title: aiResult.title,
          content: aiResult.content ?? ''
        }
      ]

      const newStory: Story = { ...payload, title: aiResult.title, chapters }
      if (aiResult.genre) newStory.storyGenres = [aiResult.genre]
      stories.value = [newStory, ...stories.value]
      if (toastId) hideToast(toastId)

      showModal({
        title: `<span class="text-blue-500">${t('useAi.ready.title')}</span>`,
        content: t('useAi.ready.content', { title: `<b>${newStory.title}</b>` }),
        buttons: [
          {
            label: t('useAi.ready.buttons.readNow'),
            type: 'success',
            callbackOrLink: `/story/${newStory.id}`
          }
        ]
      })
      return newStory
    } catch (e) {
      console.error(e)
      if (!(e instanceof Error)) return null
      if (e.message === 'Unauthorized') {
        clearTimeout(toastTimeout)
        showToast({
          content: t('useAi.errors.unauthorizedText'),
          type: 'error',
          duration: 5000,
          closable: true
        })
      } else if (e.message !== 'The user aborted a request.') {
        showToast({
          content: t('useAi.errors.errorGeneratingText'),
          type: 'error',
          closable: true
        })
      }
      return null
    } finally {
      if (toastId) hideToast(toastId)
      isAiLoading.value = false
    }
  }

  return {
    getStoryPrompt,
    generateStory,
    isPromptLoading,
    isAiLoading
  }
}

export default createSharedComposable(useStoryAi)
