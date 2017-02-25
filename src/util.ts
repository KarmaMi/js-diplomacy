export namespace util {
  export declare type ResultOrFail<Error, Result> = Failure<Error> | Success<Result>

  export class Success<Result> {
    err: null
    constructor (public result: Result) {}
  }

  export class Failure<Error> {
    result: null
    constructor (public err: Error) {}
  }
}
