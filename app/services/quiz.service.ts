import { Injectable } from 'angular2/core';
import { Question } from '../model/Question.ts';
import { Operator } from '../model/Operator.ts';

@Injectable()
export class QuizService {
  getQuestions() {
    var questions: Question[] = [],
        multiplication: Operator = new Operator('*');

    for (var i=0; i<32; i++) {
      questions.push(new Question(multiplication, i, i*2));
    }

    return questions;
  }
}
