export class Email {
  static validate (email: string | null): boolean {
    if (!email) {
      return false
    }
    return true
  }
}
