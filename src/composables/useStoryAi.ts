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

function useStoryAi() {
  const { stories, isPromptLoading, isAiLoading, apiKey, storyFormData } = storeToRefs(useStore())
  const { showModal } = useModal()
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
          content: 'An error occurred while fetching the characters. Please try again later.',
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
        storyStructure: storyFormData.value.storyStructure
      })
    } catch (e) {
      console.error(e)
      return null
    } finally {
      isPromptLoading.value = false
    }
  }

  async function generateStory(prompt: string, callback?: (story: Story) => Promise<void>) {
    if (!apiKey.value) throw new Error('API key not found')

    isAiLoading.value = true

    let toastId
    const toastTimeout = setTimeout(() => {
      toastId = showToast({
        content: `Generating a story, please do not close or refresh the page...`,
        type: 'info',
        duration: 0,
        buttons: [
          {
            label: 'Cancel',
            callback: (closeToast) => {
              showModal({
                title: 'Are you sure?',
                content: `If you cancel now, the story will not be generated.`,
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

    const payload: Story = {
      ...storyFormData.value,
      id: generateUniqueId(),
      created: new Date().toISOString(),
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
      stories.value = [newStory, ...stories.value]
      if (toastId) hideToast(toastId)

      showModal({
        title: `<span class="text-blue-500">Your new story is ready! 🥳</span>`,
        content: `The story <b>${newStory.title}</b> has been generated successfully, you can find it in the stories list.`,
        buttons: [
          {
            label: 'Read it now!',
            type: 'success',
            callback: async (close) => {
              await callback?.(newStory)
              close()
            }
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
          content: 'Invalid API key. Please check your API key and try again.',
          type: 'error',
          duration: 5000,
          closable: true
        })
      } else if (e.message !== 'The user aborted a request.') {
        showToast({
          content: `An error occurred while generating the story. Please try again later.`,
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
    getStoryPrompt,
    generateStory,
    isPromptLoading,
    isAiLoading
  }
}

export default createSharedComposable(useStoryAi)
