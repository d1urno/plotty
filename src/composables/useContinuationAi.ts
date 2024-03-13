import { computed, ref, type Ref } from 'vue'
import useModal from '@/composables/useModal'
import useToast from '@/composables/useToast'
import { stopFetchGPT, streamGPT } from '@/functions/fetchGpt'
import { storeToRefs } from 'pinia'
import { createSharedComposable } from '@vueuse/core'
import type { Chapter, Story } from '@/types/local'
import { useStore } from '@/stores'
import { generateUniqueId } from '@/utils'
import useCharacterItemsByIds from '@/composables/useCharacterItemsByIds'
import buildContinuationPrompt from '@/functions/buildContinuationPrompt'
import type { GetCharacterItemsByIdsQueryVariables } from '@/types/generated'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { parse } from 'best-effort-json-parser'
import useStoryApi from '@/composables/useStoryApi'
import useChapterApi from '@/composables/useChapterApi'

function useContinuationAi(storyId?: Ref<string | undefined>) {
  const { stories, isPromptLoading, isAiLoading, apiKey, chaptersLoadingData } =
    storeToRefs(useStore())
  const { saveStory } = useStoryApi()
  const { saveChapter } = useChapterApi()
  const { showModal } = useModal()
  const { showToast, hideToast } = useToast()
  const { t } = useI18n()
  const route = useRoute()

  const story = computed(() => stories.value.find((s) => s.id === storyId?.value))

  const variables = ref<GetCharacterItemsByIdsQueryVariables>({ ids: [] })
  const { fetchOrRefetch } = useCharacterItemsByIds(variables)

  async function getContinuationPrompt(choiceIndex?: number, customChoice?: string) {
    if (typeof choiceIndex !== 'number' && typeof customChoice !== 'string')
      throw new Error('Choice index or custom choice is required')

    isPromptLoading.value = true
    try {
      if (!story.value) {
        showToast({
          content: t('useAi.errors.storyNotFoundText'),
          type: 'error',
          duration: 5000,
          closable: true
        })
        return null
      }
      variables.value.ids = [...story.value.mainCharacters, ...story.value.secondaryCharacters]
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

      const { nextChapterChoices } = story.value.chapters[story.value.chapters.length - 1]
      const continuationInstruction =
        typeof choiceIndex === 'number' && nextChapterChoices
          ? nextChapterChoices[choiceIndex]
          : String(customChoice)

      return buildContinuationPrompt({
        mainCharacters: characters.filter(
          (cd) => story.value && story.value.mainCharacters.includes(cd.id)
        ),
        secondaryCharacters: characters.filter(
          (cd) => story.value && story.value.secondaryCharacters.includes(cd.id)
        ),
        decisionMakers: characters.filter(
          (cd) => story.value && story.value.decisionMakers.includes(cd.id)
        ),
        story: story.value,
        continuationInstruction
      })
    } catch (e) {
      return null
    } finally {
      isPromptLoading.value = false
    }
  }

  async function generateContinuation(
    prompt: string,
    storyPath: string,
    choiceIndex?: number,
    customChoice?: string
  ) {
    if (!apiKey.value) throw new Error('API key not found')

    if (!story.value) {
      showToast({
        content: t('useAi.errors.storyNotFoundText'),
        type: 'error',
        duration: 5000,
        closable: true
      })
      return null
    }

    isAiLoading.value = true

    let toastId
    const toastTimeout = setTimeout(() => {
      toastId = showToast({
        content: t('useAi.generatingText'),
        type: 'loading',
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
      const updatedStory: Story = { ...story.value }

      // Save the choice made in the previous chapter
      if (typeof choiceIndex === 'number') {
        const previousChapter = { ...updatedStory.chapters[updatedStory.chapters.length - 1] }
        if (previousChapter) previousChapter.selectedChoiceIndex = choiceIndex
        updatedStory.chapters[updatedStory.chapters.length - 1] = { ...previousChapter }
      } else if (typeof customChoice === 'string') {
        const previousChapter = { ...updatedStory.chapters[updatedStory.chapters.length - 1] }
        if (previousChapter) previousChapter.customChoice = customChoice
        updatedStory.chapters[updatedStory.chapters.length - 1] = { ...previousChapter }
      }
      saveStory(updatedStory)

      const payload: Chapter = {
        id: generateUniqueId(),
        created: new Date().toISOString(),
        title: '',
        content: ''
      }
      saveChapter(payload, updatedStory)

      chaptersLoadingData.value.set(payload.id, {
        title: true,
        content: true,
        nextChapterChoices: true,
        decidingCharacterName: true
      })

      type PartialAiResult = {
        chapter?: Pick<Chapter, 'title' | 'content'>
        nextChapterSuggestions?: string[]
        nextChapterActionDecisions?: { characterName?: string; actions?: string[] }
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

        chaptersLoadingData.value.set(payload.id, {
          title: aiResult.chapter?.title !== payload.title,
          content: aiResult.chapter?.content !== payload.content,
          nextChapterChoices:
            (aiResult.nextChapterSuggestions ?? aiResult.nextChapterActionDecisions?.actions) !==
            payload.nextChapterChoices,
          decidingCharacterName:
            aiResult.nextChapterActionDecisions?.characterName !== payload.decidingCharacterName
        })

        payload.title = aiResult.chapter?.title ?? ''
        payload.content = aiResult.chapter?.content ?? ''
        payload.nextChapterChoices =
          aiResult.nextChapterSuggestions ?? aiResult.nextChapterActionDecisions?.actions
        payload.decidingCharacterName = aiResult.nextChapterActionDecisions?.characterName

        saveChapter(payload, updatedStory)
      })

      chaptersLoadingData.value.delete(payload.id)

      if (toastId) hideToast(toastId)

      if (storyPath !== route.path) {
        showModal({
          title: `<span class="text-blue-500">${t('useAi.continuationReady.title')}</span>`,
          content: t('useAi.continuationReady.content', { title: `<b>${updatedStory.title}</b>` }),
          buttons: [
            {
              label: t('useAi.continuationReady.buttons.readNow'),
              type: 'success',
              callbackOrLink: storyPath
            }
          ]
        })
      }
      return updatedStory
    } catch (e) {
      console.error(e)
      clearTimeout(toastTimeout)
      if (!(e instanceof Error)) return null
      if (e.message === 'Unauthorized') {
        showToast({
          content: t('useAi.errors.invalidKeyText'),
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
    getContinuationPrompt,
    generateContinuation,
    isPromptLoading,
    isAiLoading
  }
}

export default createSharedComposable(useContinuationAi)
