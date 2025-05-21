'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TwoFactorSetup() {
  const [step, setStep] = useState<'setup' | 'verify' | 'success'>('setup')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [error, setError] = useState('')

  const setup2FA = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/2fa/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to setup 2FA')

      const data = await response.json()
      setQrCode(data.data.qrCode)
      setSecret(data.data.secret)
      setRecoveryCodes(data.data.recoveryCodes)
      setStep('verify')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup 2FA')
    }
  }

  const verify2FA = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      })

      if (!response.ok) throw new Error('Invalid token')

      // Show success message and recovery codes
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify 2FA')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Two-Factor Authentication</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'setup' && (
        <div className="space-y-4">
          <p>Enable two-factor authentication to add an extra layer of security to your account.</p>
          <Button onClick={setup2FA}>Setup 2FA</Button>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <img src={qrCode} alt="2FA QR Code" className="mb-4" />
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm font-mono break-all">{secret}</p>
          </div>

          <p className="text-sm">Scan the QR code or enter the secret key in your authenticator app.</p>

          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <Button onClick={verify2FA} className="w-full">
            Verify and Enable 2FA
          </Button>
        </div>
      )}

      {step === 'success' && (
        <div className="space-y-4">
          <Alert className="mb-4">
            <AlertDescription>2FA has been enabled successfully!</AlertDescription>
          </Alert>

          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Recovery Codes</h3>
            <p className="text-sm mb-2">Save these recovery codes in a secure place. You can use them to access your account if you lose your authenticator device.</p>
            {recoveryCodes.map((code, index) => (
              <div key={index} className="font-mono text-sm">{code}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}