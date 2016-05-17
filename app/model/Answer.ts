import {Question} from './Question';

export class Answer {
  question: Question;
  answer: Number;

  constructor(question: Question) {
    this.question = question;
  }

  isCorrect() {
    this.question.getAnswer() == this.answer;
  }

}
