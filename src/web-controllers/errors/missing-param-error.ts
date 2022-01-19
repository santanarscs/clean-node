export class MissingParamError extends Error {
  public readonly name = 'MissingParamError'
  constructor (param: string) {
    super(`Missing name parameter from request: ${param}.`)
  }
}
