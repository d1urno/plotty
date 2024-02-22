import { computed, ref, type Ref } from 'vue'
import useModal from '@/composables/useModal'
import useToast from '@/composables/useToast'
import { fetchGPT, stopFetchGPT } from '@/functions/fetchGpt'
import { storeToRefs } from 'pinia'
import { createSharedComposable } from '@vueuse/core'
import type { Chapter, Story } from '@/types/local'
import useStore from '@/stores'
import { generateUniqueId } from '@/utils'
import useCharacterItemsByIds from '@/composables/useCharacterItemsByIds'
import buildContinuationPrompt from '@/functions/buildContinuationPrompt'
import type { GetCharacterItemsByIdsQueryVariables } from '@/types/generated'
import { useRoute } from 'vue-router'

function useContinuationAi(storyId?: Ref<string | undefined>) {
  const { stories, isPromptLoading, isAiLoading, apiKey } = storeToRefs(useStore())
  const { showModal } = useModal()
  const { showToast, hideToast } = useToast()
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
          content: 'Story not found. Please try again later.',
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
          content: 'An error occurred while fetching the characters. Please try again later.',
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
    customChoice?: string,
    callback?: (story: Story) => Promise<void>
  ) {
    if (!apiKey.value) throw new Error('API key not found')

    if (!story.value) {
      showToast({
        content: 'Story not found. Please try again later.',
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
        content: `Generating a continuation, please do not close or refresh the page...`,
        type: 'info',
        duration: 0,
        buttons: [
          {
            label: 'Cancel',
            callback: (closeToast) => {
              showModal({
                title: 'Are you sure?',
                content: `If you cancel now, the continuation will not be generated.`,
                buttons: [
                  {
                    label: 'Yes, cancel',
                    type: 'info',
                    callback: (closeModal) => {
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
      const result = await fetchGPT(prompt, apiKey.value)
      const aiResult: {
        chapter: Chapter
        nextChapterSuggestions?: string[]
        nextChapterActionDecisions?: { characterName: string; actions: string[] }
      } = JSON.parse(result.choices[0].message.content)

      // Have the result, so we can save the choice made in the previous chapter
      if (typeof choiceIndex === 'number') {
        const previousChapter = story.value.chapters[story.value.chapters.length - 1]
        if (previousChapter) previousChapter.selectedChoiceIndex = choiceIndex
        story.value.chapters[story.value.chapters.length - 1] = previousChapter
      } else if (typeof customChoice === 'string') {
        const previousChapter = story.value.chapters[story.value.chapters.length - 1]
        if (previousChapter) previousChapter.customChoice = customChoice
        story.value.chapters[story.value.chapters.length - 1] = previousChapter
      }

      // And then save the new chapter
      const updatedStory: Story = {
        ...story.value,
        chapters: story.value.chapters.concat({
          id: generateUniqueId(),
          created: new Date().toISOString(),
          title: aiResult.chapter.title,
          content: aiResult.chapter.content,
          decidingCharacterName: aiResult.nextChapterActionDecisions?.characterName,
          nextChapterChoices:
            aiResult.nextChapterSuggestions || aiResult.nextChapterActionDecisions?.actions
        })
      }
      // Persist both
      stories.value = stories.value.map((s) => (s.id === updatedStory.id ? updatedStory : s))

      if (toastId) hideToast(toastId)

      if (storyPath !== route.path) {
        showModal({
          title: `<span class="text-blue-500">Your continuation is ready!</span>`,
          content: `The continuation for <b>${updatedStory.title}</b> is ready`,
          buttons: [
            {
              label: 'Read it now!',
              type: 'success',
              callback: async (close) => {
                await callback?.(updatedStory)
                close()
              }
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
          content: 'Invalid API key. Please check your API key and try again.',
          type: 'error',
          duration: 5000,
          closable: true
        })
      } else if (e.message !== 'The user aborted a request.') {
        showToast({
          content: `An error occurred while generating the continuation. Please try again later.`,
          type: 'error',
          closable: true
        })
      }
      return null
    } finally {
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
