import { Injectable } from 'angular2/core';
import { QuizType } from '../model/QuizType.ts';

@Injectable()
export class QuizTypeService {
  private quizTypes: QuizType[] = [
    { questionCount: 5, seconds: 10, title: 'Lightning!' },
    { questionCount: 30, seconds: 90, title: 'Quickie' },
    { questionCount: 60, seconds: 300, title: 'Typical'  }
  ];

  getByQuestionCount(count: Number) {
    return this.quizTypes.filter(qt => qt.questionCount == count)[0];
  }

  getAll() {
    return this.quizTypes;
  }
}
