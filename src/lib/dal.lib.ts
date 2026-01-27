import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session.lib'
 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    redirect('/login')
  }
  console.log('token:',session.token)
  return { isAuth: true, userId: session.userId, token: session.token }
})