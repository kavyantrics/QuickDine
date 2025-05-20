import { authenticator } from 'otplib'
import qrcode from 'qrcode'

export class TOTPService {
  private static readonly issuer = 'QuickDine'

  static generateSecret(): string {
    return authenticator.generateSecret()
  }

  static generateQRCode(email: string, secret: string): Promise<string> {
    const otpauth = authenticator.keyuri(email, this.issuer, secret)
    return qrcode.toDataURL(otpauth)
  }

  static verifyToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret })
  }

  static generateRecoveryCodes(): string[] {
    return Array.from({ length: 10 }, () =>
      Buffer.from(crypto.getRandomValues(new Uint8Array(10))).toString('hex')
    )
  }
}