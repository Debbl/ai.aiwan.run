import { createNextHandler } from '@ts-rest/serverless/next'
import { contract } from '~/server/contract'
import { router } from '~/server/routes'

const handler = createNextHandler(contract, router, {
  basePath: '/api',
  handlerType: 'app-router',
})

export { handler as DELETE, handler as GET, handler as OPTIONS, handler as PATCH, handler as POST, handler as PUT }
