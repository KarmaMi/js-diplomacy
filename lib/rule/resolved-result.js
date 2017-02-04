module.exports = class ResolvedResult {
  constructor (board, results, isFinished) {
    this.board = board
    this.results = new Set([...results])
    this.isFinished = isFinished
  }
}
