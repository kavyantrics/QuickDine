import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser } from '@/store/auth/AuthThunks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useLogin() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap()
      toast.success('Login successful!')
      router.push('/admin/dashboard')
    } catch (error) {
      toast.error('Login failed. Please try again.')
      throw error
    }
  }

  return {
    login,
    isLoading,
    error,
  }
} 