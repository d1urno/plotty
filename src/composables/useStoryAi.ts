import { ref } from 'vue'
import useModal from '@/composables/useModal'
import useToast from '@/composables/useToast'
import buildStoryPrompt from '@/functions/buildStoryPrompt'
import { stopFetchGPT, streamGPT } from '@/functions/fetchGpt'
import { storeToRefs } from 'pinia'
import { createSharedComposable } from '@vueuse/core'
import type { Story } from '@/types/local'
import { useStore } from '@/stores'
import { generateUniqueId, isDeepEqual, slugify } from '@/utils'
import useCharacterItemsByIds from '@/composables/useCharacterItemsByIds'
import type { GetCharacterItemsByIdsQueryVariables } from '@/types/generated'
import useStoryForm from '@/composables/useStoryForm'
import type { StoryGenre } from '@/constants/rules'
import { StoryStructure } from '@/constants/rules'
import { useI18n } from 'vue-i18n'
import getLanguageFromLocale from '@/functions/getLanguageFromLocale'
import { useRoute, useRouter } from 'vue-router'
import { parse } from 'best-effort-json-parser'
import useStoryApi from '@/composables/useStoryApi'

function useStoryAi() {
  const router = useRouter()
  const route = useRoute()
  const { isPromptLoading, isAiLoading, apiKey, chaptersLoadingData } = storeToRefs(useStore())
  const { formData: storyFormData } = useStoryForm()
  const { saveStory } = useStoryApi()
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

    try {
      const payload: Story = {
        ...storyFormData.value,
        slug: storyFormData.value.id,
        created: new Date().toISOString(),
        storyLanguage: getLanguageFromLocale(locale.value),
        title: '',
        chapters: [
          { id: generateUniqueId(), created: new Date().toISOString(), title: '', content: '' }
        ]
      }

      saveStory(payload)

      chaptersLoadingData.value.set(payload.chapters[0].id, {
        title: true,
        content: true,
        nextChapterChoices: true,
        decidingCharacterName: true
      })

      await router.push(`/story/${payload.slug}`)

      type PartialAiResult = {
        title?: string
        content?: string
        chapters?: { title?: string; content?: string }[]
        nextChapterSuggestions?: string[]
        nextChapterActionDecisions?: { characterName?: string; actions?: string[] }
        genre?: StoryGenre
      }

      let aiResult: PartialAiResult = {}
      let partial = ''
      await streamGPT(prompt, apiKey.value, async (res) => {
        if (res === '[DONE]') return

        if (res.choices[0].delta.content) {
          partial += res.choices[0].delta.content
          try {
            aiResult = parse(partial)
          } catch (e) {
            return
          }
        }

        chaptersLoadingData.value.set(payload.chapters[0].id, {
          title: aiResult.chapters?.[0]?.title !== payload.chapters[0].title,
          content: aiResult.chapters?.[0]?.content !== payload.chapters[0].content,
          nextChapterChoices: !isDeepEqual(
            aiResult.nextChapterSuggestions ?? aiResult.nextChapterActionDecisions?.actions,
            payload.chapters[0].nextChapterChoices
          ),
          decidingCharacterName:
            aiResult.nextChapterActionDecisions?.characterName !==
            payload.chapters[0].decidingCharacterName
        })

        payload.title = aiResult.title ?? ''
        if (aiResult.genre) payload.storyGenres = [aiResult.genre]
        if (payload.storyStructure === StoryStructure.SIMPLE) {
          payload.chapters[0].title = aiResult.title ?? ''
          payload.chapters[0].content = aiResult.content ?? ''
        } else {
          payload.chapters[0].title = aiResult.chapters?.[0]?.title ?? ''
          payload.chapters[0].content = aiResult.chapters?.[0]?.content ?? ''
          payload.chapters[0].nextChapterChoices =
            aiResult.nextChapterSuggestions ?? aiResult.nextChapterActionDecisions?.actions
          payload.chapters[0].decidingCharacterName =
            aiResult.nextChapterActionDecisions?.characterName
        }

        saveStory(payload)
      })

      if (`/story/${payload.slug}` === route.path) {
        payload.slug = slugify(payload.title)
        saveStory(payload)
        await router.replace(`/story/${payload.slug}`)
      } else {
        payload.slug = slugify(payload.title)
        saveStory(payload)
      }

      chaptersLoadingData.value.delete(payload.chapters[0].id)

      if (toastId) hideToast(toastId)

      if (`/story/${payload.slug}` !== route.path) {
        showModal({
          title: `<span class="text-blue-500">${t('useAi.ready.title')}</span>`,
          content: t('useAi.ready.content', { title: `<b>${payload.title}</b>` }),
          buttons: [
            {
              label: t('useAi.ready.buttons.readNow'),
              type: 'success',
              callbackOrLink: `/story/${payload.slug}`
            }
          ]
        })
      }
      return payload
    } catch (e) {
      console.error(e)
      if (!(e instanceof Error)) return null
      clearTimeout(toastTimeout)
      if (e.message === 'Unauthorized') {
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
