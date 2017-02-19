export interface ResultOrFail<Error, Result> {
  err: Error | null
  result: Result | null
}

export class Success<Error, Result> implements ResultOrFail<Error, Result> {
  err: null
  constructor (public result: Result) {}
}

export class Failure<Error, Result> implements ResultOrFail<Error, Result> {
  result: null
  constructor (public err: Error) {}
}
