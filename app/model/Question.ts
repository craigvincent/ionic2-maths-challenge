import {Operator} from './Operator';

export class Question {
  a: Number;
  b: Number;
  operator: Operator;

  constructor(operator: Operator, a: Number, b: Number) {
    this.a = a;
    this.b = b;
    this.operator = operator;
  }

  public getAnswer(): Number {
    return this.operator.actOn(this.a, this.b);
  }

}
