export class Operator {
  operator: String;

  constructor(operator: String) {
    this.operator = operator;
  }

  public actOn(a: Number, b: Number) {
    return eval([a, this.operator, b].join(' '));
  }
}
