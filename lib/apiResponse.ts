import { APIDetail } from '@/types/ApiDetail'

export function createApiResponse<Type extends string, Item, Extra = undefined>(
  type: Type,
  object: Item,
  extra?: Extra
): APIDetail<Type, Item, Extra> {
  return {
    type,
    object,
    ...(extra !== undefined && { extra })
  }
}