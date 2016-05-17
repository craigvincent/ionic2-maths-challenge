import {Page} from 'ionic-angular';
import {NgFor, NgIf} from 'angular2/common';
import {Operator} from '../../model/Operator';
import {Question} from '../../model/Question';
import {Answer} from '../../model/Answer';
import {QuizService} from '../../services/quiz.service';
import {OperatorService} from '../../services/operator.service';

@Page({
  templateUrl: 'build/pages/quizconfig/quizconfig.html',
  directives: [NgFor, NgIf]
})
export class QuizConfig {
  questionCounts: Array<number> = [32, 64, 128];
  questions: Question[] = [];
  operators: Operator[] = [];
  selectedOperator: Operator;
  questionCount: Number;

  private quizService: QuizService;
  private operatorService: OperatorService;

  constructor(quizService: QuizService, operatorService: OperatorService) {
    this.quizService = quizService;
    this.operatorService = operatorService;
  }

  ngOnInit() {
    this.getOperators();
  }

  selectOperator(o: Operator) {
    this.selectedOperator = o;
  }

  selectQuestionCount(c: Number) {
    this.questionCount = c;
  }

  private getOperators() {
    this.operators = this.operatorService.getAll();
  }

  private getQuestions() {
    this.questions = this.quizService.getQuestions();
  }
}
