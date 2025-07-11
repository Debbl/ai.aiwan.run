import { dao } from '../dao'
import { auth } from '../orpc'

export const getCredits = auth.handler(async ({ context }) => {
  const { userId } = context

  const user = await dao.user.getCreditsByUserId({ userId })

  return user
})
