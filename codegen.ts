import { type CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://rickandmortyapi.com/graphql',
  generates: {
    'schema.gql': {
      plugins: ['schema-ast'],
      config: { includeDirectives: true }
    },
    'src/types/generated.ts': {
      documents: ['src/**/*.graphql', 'src/**/*.gql', 'src/**/*.vue'],
      plugins: [
        { add: { content: '/* eslint-disable */' } },
        'typescript',
        'typescript-operations'
      ],
      hooks: { afterOneFileWrite: ['pnpm exec prettier --write src/types/generated.ts'] }
    },
    'src/graphql/operations.ts': {
      documents: ['src/**/*.graphql', 'src/**/*.gql', 'src/**/*.vue'],
      plugins: [
        {
          add: {
            content: ['/* eslint-disable */', "import * as Generated from '@/types/generated';"]
          }
        },
        'typescript-vue-apollo'
      ],
      config: {
        withCompositionFunctions: true,
        vueCompositionApiImportFrom: 'vue',
        importOperationTypesFrom: 'Generated'
      },
      hooks: { afterOneFileWrite: ['pnpm exec prettier --write src/graphql/operations.ts'] }
    }
  }
}

export default config
