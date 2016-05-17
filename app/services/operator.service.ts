import { Injectable } from 'angular2/core';
import { Operator } from '../model/Operator.ts';

@Injectable()
export class OperatorService {
  private operators: Operator[] = [
    { symbol: '*', verb: 'Multiply', name: 'Multiplication' },
    { symbol: '/', verb: 'Divide', name: 'Division' }
  ];

  getBySymbol(symbol: String) {
    return this.operators.filter(o => o.symbol == symbol)[0];
  }

  getAll() {
    return this.operators;
  }
}
