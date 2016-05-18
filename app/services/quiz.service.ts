import { Injectable } from 'angular2/core';
import { QuizType } from '../model/QuizType';
import { Question } from '../model/Question.ts';
import { Answer } from '../model/Answer.ts';
import { Operator } from '../model/Operator.ts';

@Injectable()
export class QuizService {
  answers: Answer[];

  prepareQuiz(quizType: QuizType, operator: Operator) {
    this.answers = [];
    for (var i=0; i<quizType.questionCount; i++) {
      var a = Math.floor(Math.random()*10),
          b = Math.floor(Math.random()*10);
      this.answers.push(new Answer(new Question(operator, a, b)));
    }
  }

  getQuiz() {
    return this.answers;
  }

  getCompletedCount(): Number {
    return this.answers.filter(a => a.answer != null).length;
  }

  isCompleted(): Boolean {
    return this.answers.length == this.getCompletedCount();
  }
}
