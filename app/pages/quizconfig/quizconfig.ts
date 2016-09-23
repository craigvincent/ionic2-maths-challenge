import {Page, NavController, Tabs} from 'ionic-angular';
import {NgFor, NgIf} from 'angular2/common';
import {Operator} from '../../model/Operator';
import {QuizType} from '../../model/QuizType';
import {OperatorService} from '../../services/operator.service';
import {QuizTypeService} from '../../services/quiztype.service';
import {QuizService} from '../../services/quiz.service';

@Page({
  templateUrl: 'build/pages/quizconfig/quizconfig.html',
  directives: [NgFor, NgIf]
})
export class QuizConfig {
  quizTypes: QuizType[] = [];
  operators: Operator[] = [];
  selectedOperator: Operator;
  selectedQuizType: QuizType;

  private quizTypeService: QuizTypeService;
  private quizService: QuizService;
  private operatorService: OperatorService;
  private navController: NavController;

  constructor(operatorService: OperatorService, quizTypeService: QuizTypeService, quizService: QuizService, navController: NavController) {
    this.quizTypeService = quizTypeService;
    this.operatorService = operatorService;
    this.quizService = quizService;
    this.navController = navController;
  }

  ngOnInit() {
    this.getOperators();
    this.getQuizTypes();
  }

  selectOperator(o: Operator) {
    this.selectedOperator = o;
    this.quizService.setOperator(o);
  }

  selectQuizType(qt: QuizType) {
    this.selectedQuizType = qt;
    this.quizService.setQuizType(qt);
  }

  startQuiz() {
    var t: Tabs = this.navController.parent;
    this.quizService.prepareQuiz(this.selectedQuizType, this.selectedOperator);
    this.quizService.start();
    t.select(1);
  }

  private getOperators() {
    this.operators = this.operatorService.getAll();
  }

  private getQuizTypes() {
    this.quizTypes = this.quizTypeService.getAll();
  }
}
