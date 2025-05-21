import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { signupRestaurant } from '@/store/auth/AuthThunks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useSignupRestaurant() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const signup = async (data: {
    name: string
    email: string
    password: string
    restaurant: {
      name: string
      address: string
      phone: string
    }
  }) => {
    try {
      await dispatch(signupRestaurant(data)).unwrap()
      toast.success('Restaurant account created successfully!')
      router.push('/login')
    } catch (error) {
      toast.error('Failed to create restaurant account.')
      throw error
    }
  }

  return {
    signup,
    isLoading,
    error,
  }
} 