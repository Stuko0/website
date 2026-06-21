import PocketBase from 'pocketbase'

const pb = new PocketBase('http://localhost:8090')

export default pb

export const isAuthenticated = () => pb.authStore.isValid

export const currentUser = () => pb.authStore.record

export const userRole = () => {
  const user = currentUser()
  return user?.role || 'customer'
}

export const isAdmin = () => userRole() === 'admin'

export const logout = () => {
  pb.authStore.clear()
  if (typeof window !== 'undefined') {
    window.location.href = '/'
  }
}

export const login = async (email: string, password: string) => {
  const authData = await pb.collection('users').authWithPassword(email, password)
  return authData
}

export const register = async (email: string, password: string, passwordConfirm: string, name?: string) => {
  const data = {
    email,
    password,
    passwordConfirm,
    name: name || email.split('@')[0],
    role: 'customer'
  }
  
  const record = await pb.collection('users').create(data)
  await login(email, password)
  return record
}

export const onAuthStateChange = (callback: (isValid: boolean, record: any) => void) => {
  return pb.authStore.onChange(callback, true)
}
