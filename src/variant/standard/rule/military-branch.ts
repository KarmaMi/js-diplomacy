import { Name } from "../../../board/module"

// TODO use enum
export class MilitaryBranch {
  private constructor(public name: Name) {}
  toString(): string {
    return this.name.toString()
  }
  static Army = new MilitaryBranch(new Name("Army", "A"))
  static Fleet = new MilitaryBranch(new Name("Fleet", "F"))
}
