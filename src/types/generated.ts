/* eslint-disable */
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any }
}

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Character = {
  __typename?: 'Character'
  /** Time at which the character was created in the database. */
  created: Scalars['String']['output']
  /** Episodes in which this character appeared. */
  episode: Array<Episode>
  /** The gender of the character ('Female', 'Male', 'Genderless' or 'unknown'). */
  gender: Scalars['String']['output']
  /** The id of the character. */
  id: Scalars['ID']['output']
  /**
   * Link to the character's image.
   * All images are 300x300px and most are medium shots or portraits since they are intended to be used as avatars.
   */
  image: Scalars['String']['output']
  /** The character's last known location */
  location: Location
  /** The name of the character. */
  name: Scalars['String']['output']
  /** The character's origin location */
  origin: Location
  /** The species of the character. */
  species: Scalars['String']['output']
  /** The status of the character ('Alive', 'Dead' or 'unknown'). */
  status: Scalars['String']['output']
  /** The type or subspecies of the character. */
  type: Scalars['String']['output']
}

export type Characters = {
  __typename?: 'Characters'
  info: Info
  results: Array<Character>
}

export type Episode = {
  __typename?: 'Episode'
  /** The air date of the episode. */
  air_date?: Maybe<Scalars['String']['output']>
  /** List of characters who have been seen in the episode. */
  characters: Array<Maybe<Character>>
  /** Time at which the episode was created in the database. */
  created?: Maybe<Scalars['String']['output']>
  /** The code of the episode. */
  episode?: Maybe<Scalars['String']['output']>
  /** The id of the episode. */
  id: Scalars['ID']['output']
  /** The name of the episode. */
  name?: Maybe<Scalars['String']['output']>
}

export type Episodes = {
  __typename?: 'Episodes'
  info?: Maybe<Info>
  results?: Maybe<Array<Maybe<Episode>>>
}

export type FilterCharacter = {
  gender?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  species?: InputMaybe<Scalars['String']['input']>
  status?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
}

export type FilterEpisode = {
  episode?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
}

export type FilterLocation = {
  dimension?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  type?: InputMaybe<Scalars['String']['input']>
}

export type Info = {
  __typename?: 'Info'
  /** The length of the response. */
  count?: Maybe<Scalars['Int']['output']>
  /** Number of the next page (if it exists) */
  next?: Maybe<Scalars['Int']['output']>
  /** The amount of pages. */
  pages?: Maybe<Scalars['Int']['output']>
  /** Number of the previous page (if it exists) */
  prev?: Maybe<Scalars['Int']['output']>
}

export type Location = {
  __typename?: 'Location'
  /** Time at which the location was created in the database. */
  created?: Maybe<Scalars['String']['output']>
  /** The dimension in which the location is located. */
  dimension?: Maybe<Scalars['String']['output']>
  /** The id of the location. */
  id: Scalars['ID']['output']
  /** The name of the location. */
  name?: Maybe<Scalars['String']['output']>
  /** List of characters who have been last seen in the location. */
  residents: Array<Maybe<Character>>
  /** The type of the location. */
  type?: Maybe<Scalars['String']['output']>
}

export type Locations = {
  __typename?: 'Locations'
  info?: Maybe<Info>
  results?: Maybe<Array<Maybe<Location>>>
}

export type Query = {
  __typename?: 'Query'
  /** Get a specific character by ID */
  character: Character
  /** Get the list of all characters */
  characters: Characters
  /** Get a list of characters selected by ids */
  charactersByIds: Array<Character>
  /** Get a specific episode by ID */
  episode?: Maybe<Episode>
  /** Get the list of all episodes */
  episodes?: Maybe<Episodes>
  /** Get a list of episodes selected by ids */
  episodesByIds?: Maybe<Array<Maybe<Episode>>>
  /** Get a specific locations by ID */
  location?: Maybe<Location>
  /** Get the list of all locations */
  locations?: Maybe<Locations>
  /** Get a list of locations selected by ids */
  locationsByIds?: Maybe<Array<Maybe<Location>>>
}

export type QueryCharacterArgs = {
  id: Scalars['ID']['input']
}

export type QueryCharactersArgs = {
  filter?: InputMaybe<FilterCharacter>
  page?: InputMaybe<Scalars['Int']['input']>
}

export type QueryCharactersByIdsArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type QueryEpisodeArgs = {
  id: Scalars['ID']['input']
}

export type QueryEpisodesArgs = {
  filter?: InputMaybe<FilterEpisode>
  page?: InputMaybe<Scalars['Int']['input']>
}

export type QueryEpisodesByIdsArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type QueryLocationArgs = {
  id: Scalars['ID']['input']
}

export type QueryLocationsArgs = {
  filter?: InputMaybe<FilterLocation>
  page?: InputMaybe<Scalars['Int']['input']>
}

export type QueryLocationsByIdsArgs = {
  ids: Array<Scalars['ID']['input']>
}

export type CharacterItemFragment = {
  __typename?: 'Character'
  status: string
  created: string
  gender: string
  id: string
  name: string
  image: string
  species: string
  location: { __typename?: 'Location'; id: string; name?: string | null }
}

export type CharacterListFragment = {
  __typename?: 'Character'
  id: string
  name: string
  image: string
  species: string
}

export type GetCharacterItemQueryVariables = Exact<{
  id: Scalars['ID']['input']
}>

export type GetCharacterItemQuery = {
  __typename?: 'Query'
  character: {
    __typename?: 'Character'
    status: string
    created: string
    gender: string
    id: string
    name: string
    image: string
    species: string
    location: { __typename?: 'Location'; id: string; name?: string | null }
  }
}

export type GetCharacterItemsByIdsQueryVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type GetCharacterItemsByIdsQuery = {
  __typename?: 'Query'
  charactersByIds: Array<{
    __typename?: 'Character'
    status: string
    created: string
    gender: string
    id: string
    name: string
    image: string
    species: string
    location: { __typename?: 'Location'; id: string; name?: string | null }
  }>
}

export type GetCharacterListQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>
  filter?: InputMaybe<FilterCharacter>
}>

export type GetCharacterListQuery = {
  __typename?: 'Query'
  characters: {
    __typename?: 'Characters'
    info: {
      __typename?: 'Info'
      count?: number | null
      pages?: number | null
      next?: number | null
      prev?: number | null
    }
    results: Array<{
      __typename?: 'Character'
      id: string
      created: string
      name: string
      image: string
      species: string
    }>
  }
}

export type GetCharacterListByIdsQueryVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input']
}>

export type GetCharacterListByIdsQuery = {
  __typename?: 'Query'
  charactersByIds: Array<{
    __typename?: 'Character'
    id: string
    created: string
    name: string
    image: string
    species: string
  }>
}
