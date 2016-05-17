import {Page} from 'ionic-angular';
import {NgFor} from 'angular2/common';
import {Operator} from '../../model/Operator';
import {Question} from '../../model/Question';
import {Answer} from '../../model/Answer';
import {QuizService} from '../../services/quiz.service';

@Page({
  templateUrl: 'build/pages/quizconfig/quizconfig.html',
})
export class QuizConfig {
  quizService: QuizService;
  questionCounts: Array<number> = [32, 64, 128];
  questions: Question[] = [];

  constructor(quizService: QuizService) {
    this.quizService = quizService;
  }

  getQuestions() {
    this.questions = this.quizService.getQuestions();
  }
}
