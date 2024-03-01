/* eslint-disable */
import * as Generated from '@/types/generated'
import gql from 'graphql-tag'
import * as VueApolloComposable from '@vue/apollo-composable'
import * as VueCompositionApi from 'vue'
export type ReactiveFunction<TParam> = () => TParam
export const CharacterListFragmentDoc = gql`
  fragment CharacterList on Character {
    id
    created
    name
    image
    species
  }
`
export const CharacterItemFragmentDoc = gql`
  fragment CharacterItem on Character {
    ...CharacterList
    status
    created
    gender
    location {
      id
      name
    }
  }
  ${CharacterListFragmentDoc}
`
export const GetCharacterItemDocument = gql`
  query GetCharacterItem($id: ID!) {
    character(id: $id) {
      ...CharacterItem
    }
  }
  ${CharacterItemFragmentDoc}
`

/**
 * __useGetCharacterItemQuery__
 *
 * To run a query within a Vue component, call `useGetCharacterItemQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCharacterItemQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetCharacterItemQuery({
 *   id: // value for 'id'
 * });
 */
export function useGetCharacterItemQuery(
  variables:
    | Generated.GetCharacterItemQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterItemQueryVariables>
    | ReactiveFunction<Generated.GetCharacterItemQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterItemQuery,
        Generated.GetCharacterItemQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemQuery,
          Generated.GetCharacterItemQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemQuery,
          Generated.GetCharacterItemQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useQuery<
    Generated.GetCharacterItemQuery,
    Generated.GetCharacterItemQueryVariables
  >(GetCharacterItemDocument, variables, options)
}
export function useGetCharacterItemLazyQuery(
  variables?:
    | Generated.GetCharacterItemQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterItemQueryVariables>
    | ReactiveFunction<Generated.GetCharacterItemQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterItemQuery,
        Generated.GetCharacterItemQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemQuery,
          Generated.GetCharacterItemQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemQuery,
          Generated.GetCharacterItemQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useLazyQuery<
    Generated.GetCharacterItemQuery,
    Generated.GetCharacterItemQueryVariables
  >(GetCharacterItemDocument, variables, options)
}
export type GetCharacterItemQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
  Generated.GetCharacterItemQuery,
  Generated.GetCharacterItemQueryVariables
>
export const GetCharacterItemsByIdsDocument = gql`
  query GetCharacterItemsByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      ...CharacterItem
    }
  }
  ${CharacterItemFragmentDoc}
`

/**
 * __useGetCharacterItemsByIdsQuery__
 *
 * To run a query within a Vue component, call `useGetCharacterItemsByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCharacterItemsByIdsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetCharacterItemsByIdsQuery({
 *   ids: // value for 'ids'
 * });
 */
export function useGetCharacterItemsByIdsQuery(
  variables:
    | Generated.GetCharacterItemsByIdsQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterItemsByIdsQueryVariables>
    | ReactiveFunction<Generated.GetCharacterItemsByIdsQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterItemsByIdsQuery,
        Generated.GetCharacterItemsByIdsQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemsByIdsQuery,
          Generated.GetCharacterItemsByIdsQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemsByIdsQuery,
          Generated.GetCharacterItemsByIdsQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useQuery<
    Generated.GetCharacterItemsByIdsQuery,
    Generated.GetCharacterItemsByIdsQueryVariables
  >(GetCharacterItemsByIdsDocument, variables, options)
}
export function useGetCharacterItemsByIdsLazyQuery(
  variables?:
    | Generated.GetCharacterItemsByIdsQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterItemsByIdsQueryVariables>
    | ReactiveFunction<Generated.GetCharacterItemsByIdsQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterItemsByIdsQuery,
        Generated.GetCharacterItemsByIdsQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemsByIdsQuery,
          Generated.GetCharacterItemsByIdsQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterItemsByIdsQuery,
          Generated.GetCharacterItemsByIdsQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useLazyQuery<
    Generated.GetCharacterItemsByIdsQuery,
    Generated.GetCharacterItemsByIdsQueryVariables
  >(GetCharacterItemsByIdsDocument, variables, options)
}
export type GetCharacterItemsByIdsQueryCompositionFunctionResult =
  VueApolloComposable.UseQueryReturn<
    Generated.GetCharacterItemsByIdsQuery,
    Generated.GetCharacterItemsByIdsQueryVariables
  >
export const GetCharacterListDocument = gql`
  query GetCharacterList($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      info {
        count
        pages
        next
        prev
      }
      results {
        ...CharacterList
      }
    }
  }
  ${CharacterListFragmentDoc}
`

/**
 * __useGetCharacterListQuery__
 *
 * To run a query within a Vue component, call `useGetCharacterListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCharacterListQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetCharacterListQuery({
 *   page: // value for 'page'
 *   filter: // value for 'filter'
 * });
 */
export function useGetCharacterListQuery(
  variables:
    | Generated.GetCharacterListQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterListQueryVariables>
    | ReactiveFunction<Generated.GetCharacterListQueryVariables> = {},
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterListQuery,
        Generated.GetCharacterListQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListQuery,
          Generated.GetCharacterListQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListQuery,
          Generated.GetCharacterListQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useQuery<
    Generated.GetCharacterListQuery,
    Generated.GetCharacterListQueryVariables
  >(GetCharacterListDocument, variables, options)
}
export function useGetCharacterListLazyQuery(
  variables:
    | Generated.GetCharacterListQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterListQueryVariables>
    | ReactiveFunction<Generated.GetCharacterListQueryVariables> = {},
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterListQuery,
        Generated.GetCharacterListQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListQuery,
          Generated.GetCharacterListQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListQuery,
          Generated.GetCharacterListQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useLazyQuery<
    Generated.GetCharacterListQuery,
    Generated.GetCharacterListQueryVariables
  >(GetCharacterListDocument, variables, options)
}
export type GetCharacterListQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<
  Generated.GetCharacterListQuery,
  Generated.GetCharacterListQueryVariables
>
export const GetCharacterListByIdsDocument = gql`
  query GetCharacterListByIds($ids: [ID!]!) {
    charactersByIds(ids: $ids) {
      ...CharacterList
    }
  }
  ${CharacterListFragmentDoc}
`

/**
 * __useGetCharacterListByIdsQuery__
 *
 * To run a query within a Vue component, call `useGetCharacterListByIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCharacterListByIdsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetCharacterListByIdsQuery({
 *   ids: // value for 'ids'
 * });
 */
export function useGetCharacterListByIdsQuery(
  variables:
    | Generated.GetCharacterListByIdsQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterListByIdsQueryVariables>
    | ReactiveFunction<Generated.GetCharacterListByIdsQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterListByIdsQuery,
        Generated.GetCharacterListByIdsQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListByIdsQuery,
          Generated.GetCharacterListByIdsQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListByIdsQuery,
          Generated.GetCharacterListByIdsQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useQuery<
    Generated.GetCharacterListByIdsQuery,
    Generated.GetCharacterListByIdsQueryVariables
  >(GetCharacterListByIdsDocument, variables, options)
}
export function useGetCharacterListByIdsLazyQuery(
  variables?:
    | Generated.GetCharacterListByIdsQueryVariables
    | VueCompositionApi.Ref<Generated.GetCharacterListByIdsQueryVariables>
    | ReactiveFunction<Generated.GetCharacterListByIdsQueryVariables>,
  options:
    | VueApolloComposable.UseQueryOptions<
        Generated.GetCharacterListByIdsQuery,
        Generated.GetCharacterListByIdsQueryVariables
      >
    | VueCompositionApi.Ref<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListByIdsQuery,
          Generated.GetCharacterListByIdsQueryVariables
        >
      >
    | ReactiveFunction<
        VueApolloComposable.UseQueryOptions<
          Generated.GetCharacterListByIdsQuery,
          Generated.GetCharacterListByIdsQueryVariables
        >
      > = {}
) {
  return VueApolloComposable.useLazyQuery<
    Generated.GetCharacterListByIdsQuery,
    Generated.GetCharacterListByIdsQueryVariables
  >(GetCharacterListByIdsDocument, variables, options)
}
export type GetCharacterListByIdsQueryCompositionFunctionResult =
  VueApolloComposable.UseQueryReturn<
    Generated.GetCharacterListByIdsQuery,
    Generated.GetCharacterListByIdsQueryVariables
  >
