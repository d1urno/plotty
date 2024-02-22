import useQueryEditor from '@/composables/useQueryEditor'
import useToast from '@/composables/useToast'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import type { Character } from '@/types/generated'
import useStore from '@/stores'
import { MAIN_ROLES_LIMIT, SECONDARY_ROLES_LIMIT } from '@/constants/rules'

export default function useCharacterSelectionActions() {
  const { replaceQuery } = useQueryEditor()
  const { showToast } = useToast()
  const { storyFormData } = storeToRefs(useStore())

  const selectedIds = computed(() => [
    ...storyFormData.value.mainCharacters,
    ...storyFormData.value.secondaryCharacters
  ])

  function isMainRoleFull() {
    return storyFormData.value.mainCharacters.length >= MAIN_ROLES_LIMIT
  }

  function isSecondaryRoleFull() {
    return storyFormData.value.secondaryCharacters.length >= SECONDARY_ROLES_LIMIT
  }

  function isRoleFull(role: 'main' | 'secondary') {
    return role === 'main' ? isMainRoleFull() : isSecondaryRoleFull()
  }

  async function onMainRoleAdd(id: string) {
    if (selectedIds.value.find((sId) => sId === id)) {
      showToast({
        content: 'Character is already selected for a role',
        closable: true,
        type: 'info'
      })
      return false
    }
    return !!(await replaceQuery({ mainIds: storyFormData.value.mainCharacters.concat(id) }))
  }

  async function onSecondaryRoleAdd(id: string) {
    if (selectedIds.value.find((sId) => sId === id)) {
      showToast({
        content: 'Character is already selected for a role',
        closable: true,
        type: 'info'
      })
      return false
    }
    return !!(await replaceQuery({
      secondaryIds: storyFormData.value.secondaryCharacters.concat(id)
    }))
  }

  async function onMainRoleRemove(id: string) {
    if (storyFormData.value.decisionMakers.includes(id)) {
      showToast({
        content: 'That character is selected to make decisions in your story and cannot be removed',
        closable: true,
        type: 'info'
      })
      return false
    }
    return !!(await replaceQuery({
      mainIds: storyFormData.value.mainCharacters.filter((mId) => mId !== id)
    }))
  }

  async function onSecondaryRoleRemove(id: string) {
    return !!(await replaceQuery({
      secondaryIds: storyFormData.value.secondaryCharacters.filter((sId) => sId !== id)
    }))
  }

  async function onRoleSwap(from: string, id: string) {
    if (from === 'secondary-characters') {
      const index = storyFormData.value.secondaryCharacters.findIndex((sId) => sId === id)
      return !!(await replaceQuery({
        mainIds: storyFormData.value.mainCharacters.concat(id),
        secondaryIds: storyFormData.value.secondaryCharacters
          .slice(0, index)
          .concat(storyFormData.value.secondaryCharacters.slice(index + 1))
      }))
    }
    if (from === 'main-characters') {
      const index = storyFormData.value.mainCharacters.findIndex((mId) => mId === id)
      return !!(await replaceQuery({
        secondaryIds: storyFormData.value.secondaryCharacters.concat(id),
        mainIds: storyFormData.value.mainCharacters
          .slice(0, index)
          .concat(storyFormData.value.mainCharacters.slice(index + 1))
      }))
    }
    return false
  }

  async function onMainRoleDrop(payload: { item: unknown; from?: string }) {
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

  async function onSecondaryRoleDrop(payload: { item: unknown; from?: string }) {
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

  async function onRoleAdd(id: string, role: 'main' | 'secondary') {
    if (role === 'main') return onMainRoleAdd(id)
    return onSecondaryRoleAdd(id)
  }

  async function onRoleRemove(id: string, role: 'main' | 'secondary') {
    if (role === 'main') return onMainRoleRemove(id)
    return onSecondaryRoleRemove(id)
  }

  async function onRoleDrop(payload: { item: unknown; from?: string }, role: 'main' | 'secondary') {
    if (role === 'main') return onMainRoleDrop(payload)
    return onSecondaryRoleDrop(payload)
  }

  async function onResetRoles() {
    return !!(await replaceQuery({ mainIds: [], secondaryIds: [] }))
  }

  return {
    onRoleAdd,
    onRoleDrop,
    onRoleRemove,
    isRoleFull,
    onResetRoles
  }
}
