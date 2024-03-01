import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import getPaginationPolicy from '@/functions/getPaginationPolicy'
import type { AppModule } from '@/types/local'
import { DefaultApolloClient } from '@vue/apollo-composable'

const httpLink = new HttpLink({ uri: 'https://rickandmortyapi.com/graphql' })

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        characters: getPaginationPolicy(['filter', ['name', 'gender', 'species', 'status']]),
        character: (_, { args, toReference, canRead }) => {
          const ref = toReference({ __typename: 'Character', id: args?.id })
          return canRead(ref) ? ref : undefined
        },
        charactersByIds: (_, { args, toReference, canRead }) => {
          const results = args?.ids.map((id: number) => {
            const ref = toReference({ __typename: 'Character', id })
            return canRead(ref) ? ref : undefined
          })
          return results.every(Boolean) ? results : undefined
        }
      }
    }
  }
})

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      // So that we can know when we are fetching for more data on paginated lists
      notifyOnNetworkStatusChange: true
    }
  }
})

export const install: AppModule = ({ app }) => {
  app.provide(DefaultApolloClient, apolloClient)
}

export default install
