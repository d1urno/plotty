import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'
import type { AppModule } from '@/types/local'
import { DefaultApolloClient } from '@vue/apollo-composable'

const httpLink = new HttpLink({ uri: 'https://rickandmortyapi.com/graphql' })

const cache = new InMemoryCache()

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
