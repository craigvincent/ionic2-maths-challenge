import { Injectable } from 'angular2/core';
import { Operator } from '../model/Operator.ts';
import { QuizType } from '../model/QuizType.ts';

@Injectable()
export class QuizConfigService {
  private operator: Operator;
  private quizType: QuizType;

  setOperator(o: Operator) {
    this.operator = o;
  }

  getOperator(): Operator {
    return this.operator;
  }

  setQuizType(qt: QuizType) {
    this.quizType = qt;
  }

  getQuizType(): QuizType {
    return this.quizType;
  }
}
