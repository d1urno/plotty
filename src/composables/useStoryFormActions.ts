import useToast from '@/composables/useToast'
import { computed } from 'vue'
import type { Character } from '@/types/generated'
import {
  MAIN_ROLES_LIMIT,
  MAX_GENRES,
  SECONDARY_ROLES_LIMIT,
  StoryGenre,
  StoryMode,
  StoryStructure
} from '@/constants/rules'
import useStoryForm from '@/composables/useStoryForm'
import defaultStoryFormData from '@/constants/defaultStoryFormData'

export default function useStoryFormActions() {
  const { showToast } = useToast()
  const { formData: storyFormData } = useStoryForm()

  const selectedIds = computed(() => [
    ...storyFormData.value.mainCharacters,
    ...storyFormData.value.secondaryCharacters
  ])

  // Character selection actions

  function isMainRoleFull() {
    return storyFormData.value.mainCharacters.length >= MAIN_ROLES_LIMIT
  }

  function isSecondaryRoleFull() {
    return storyFormData.value.secondaryCharacters.length >= SECONDARY_ROLES_LIMIT
  }

  function isRoleFull(role: 'main' | 'secondary') {
    return role === 'main' ? isMainRoleFull() : isSecondaryRoleFull()
  }

  function onMainRoleAdd(id: string) {
    if (selectedIds.value.find((sId) => sId === id)) {
      showToast({
        content: 'Character is already selected for a role',
        closable: true,
        type: 'info'
      })
      return false
    }
    storyFormData.value.mainCharacters = [...storyFormData.value.mainCharacters, id] // Can't use push here
    return true
  }

  function onSecondaryRoleAdd(id: string) {
    if (selectedIds.value.find((sId) => sId === id)) {
      showToast({
        content: 'Character is already selected for a role',
        closable: true,
        type: 'info'
      })
      return false
    }
    storyFormData.value.secondaryCharacters = [...storyFormData.value.secondaryCharacters, id] // Can't use push here
    return true
  }

  function onMainRoleRemove(id: string) {
    if (storyFormData.value.decisionMakers.includes(id)) {
      showToast({
        content: 'That character is selected to make decisions in your story and cannot be removed',
        closable: true,
        type: 'info'
      })
      return false
    }
    storyFormData.value.mainCharacters = storyFormData.value.mainCharacters.filter(
      (mId) => mId !== id
    )
    return true
  }

  function onSecondaryRoleRemove(id: string) {
    storyFormData.value.secondaryCharacters = storyFormData.value.secondaryCharacters.filter(
      (sId) => sId !== id
    )
    return true
  }

  function onRoleSwap(from: string, id: string) {
    if (from === 'secondary-characters') {
      const index = storyFormData.value.secondaryCharacters.findIndex((sId) => sId === id)
      const newObj: Partial<typeof storyFormData.value> = {
        mainCharacters: storyFormData.value.mainCharacters.concat(id),
        secondaryCharacters: storyFormData.value.secondaryCharacters
          .slice(0, index)
          .concat(storyFormData.value.secondaryCharacters.slice(index + 1))
      }
      storyFormData.value = { ...storyFormData.value, ...newObj }
      return true
    }
    if (from === 'main-characters') {
      const index = storyFormData.value.mainCharacters.findIndex((mId) => mId === id)
      const newObj: Partial<typeof storyFormData.value> = {
        mainCharacters: storyFormData.value.mainCharacters.slice(0, index),
        secondaryCharacters: storyFormData.value.secondaryCharacters.concat(id)
      }
      storyFormData.value = { ...storyFormData.value, ...newObj }
    }
    return false
  }

  function onMainRoleDrop(payload: { item: unknown; from?: string }) {
    if (payload.from === 'main-characters') return false // No need to show a toast if it's from the same list
    const { id } = payload.item as Character

    if (isRoleFull('main')) {
      showToast({
        content: `You can only have up to ${MAIN_ROLES_LIMIT} main characters`,
        closable: true,
        type: 'info'
      })
      return false
    }

    if (payload.from === 'secondary-characters') {
      return onRoleSwap(payload.from, id)
    }

    return onMainRoleAdd(id)
  }

  function onSecondaryRoleDrop(payload: { item: unknown; from?: string }) {
    if (payload.from === 'secondary-characters') return false // No need to show a toast if it's from the same list
    const { id } = payload.item as Character

    if (isRoleFull('secondary')) {
      showToast({
        content: `You can only have up to ${SECONDARY_ROLES_LIMIT} secondary characters`,
        closable: true,
        type: 'info'
      })
      return false
    }

    if (payload.from === 'main-characters') {
      return onRoleSwap(payload.from, id)
    }

    return onSecondaryRoleAdd(id)
  }

  function onRoleAdd(id: string, role: 'main' | 'secondary') {
    if (role === 'main') return onMainRoleAdd(id)
    return onSecondaryRoleAdd(id)
  }

  function onRoleRemove(id: string, role: 'main' | 'secondary') {
    if (role === 'main') return onMainRoleRemove(id)
    return onSecondaryRoleRemove(id)
  }

  function onRoleDrop(payload: { item: unknown; from?: string }, role: 'main' | 'secondary') {
    if (role === 'main') return onMainRoleDrop(payload)
    return onSecondaryRoleDrop(payload)
  }

  function onResetRoles() {
    const newObj: Partial<typeof storyFormData.value> = {
      mainCharacters: defaultStoryFormData.mainCharacters,
      secondaryCharacters: defaultStoryFormData.secondaryCharacters
    }
    storyFormData.value = { ...storyFormData.value, ...newObj }
    return true
  }

  function onDecisionMakersSelect(id: string) {
    if (
      storyFormData.value.decisionMakers.length === 1 &&
      storyFormData.value.decisionMakers[0] === id
    )
      return false
    const index = storyFormData.value.decisionMakers.indexOf(id)
    storyFormData.value.decisionMakers =
      index === -1
        ? [...storyFormData.value.decisionMakers, id]
        : storyFormData.value.decisionMakers.filter((_, i) => i !== index)
    return true
  }

  // Story actions

  function onStoryStructureSelect(storyStructure: StoryStructure) {
    const newObj: Partial<typeof storyFormData.value> = { storyStructure }
    if (storyStructure !== StoryStructure.MULTI_CHAPTER)
      newObj.totalChapters = defaultStoryFormData.totalChapters
    if (storyStructure === StoryStructure.SIMPLE) {
      newObj.storyMode = defaultStoryFormData.storyMode
      newObj.decisionMakers = defaultStoryFormData.decisionMakers
    }
    storyFormData.value = { ...storyFormData.value, ...newObj }
    return true
  }

  function onStoryModeSelect(storyMode: StoryMode) {
    const newObj: Partial<typeof storyFormData.value> = { storyMode }
    if (storyMode === StoryMode.DECISION_MAKING)
      newObj.decisionMakers = [storyFormData.value.mainCharacters[0]]
    else newObj.decisionMakers = defaultStoryFormData.decisionMakers
    storyFormData.value = { ...storyFormData.value, ...newObj }
    return true
  }

  function onMultipleGenreSelect(genre: StoryGenre[]) {
    if (!genre.length) {
      storyFormData.value.storyGenres = [StoryGenre.AI] // Reset to Let AI decide
      return true
    }
    storyFormData.value.storyGenres = genre.reduce(
      (acc, curr) => (curr !== StoryGenre.AI ? [...acc, curr] : acc),
      [] as StoryGenre[]
    )
    return true
  }

  function onGenreSelect(genre: StoryGenre | StoryGenre[]) {
    if (Array.isArray(genre)) return onMultipleGenreSelect(genre)
    if (storyFormData.value.storyGenres.includes(genre)) {
      if (storyFormData.value.storyGenres.length === 1)
        storyFormData.value.storyGenres = [StoryGenre.AI]
      else
        storyFormData.value.storyGenres = storyFormData.value.storyGenres.filter((g) => g !== genre)
    } else {
      storyFormData.value.storyGenres = [
        ...storyFormData.value.storyGenres.filter((g) => g !== StoryGenre.AI),
        genre
      ]
    }
    return true
  }

  function isGenreDisabled(genre: StoryGenre) {
    if (
      storyFormData.value.storyGenres.length === MAX_GENRES &&
      !storyFormData.value.storyGenres.includes(genre)
    )
      return true
    switch (genre) {
      case StoryGenre.FANTASY:
        return storyFormData.value.storyGenres.includes(StoryGenre.SCI_FI)
      case StoryGenre.SCI_FI:
        return storyFormData.value.storyGenres.includes(StoryGenre.FANTASY)
      case StoryGenre.HISTORICAL:
        return storyFormData.value.storyGenres.includes(StoryGenre.FUTURISTIC)
      case StoryGenre.FUTURISTIC:
        return storyFormData.value.storyGenres.includes(StoryGenre.HISTORICAL)
      default:
        return false
    }
  }

  return {
    // Character selection actions
    onRoleAdd,
    onRoleDrop,
    onRoleRemove,
    isRoleFull,
    onResetRoles,
    onDecisionMakersSelect,

    // Story actions
    onStoryStructureSelect,
    onStoryModeSelect,
    isGenreDisabled,
    onGenreSelect
  }
}
