import {Page, NavController, Tabs} from 'ionic-angular';
import {NgFor, NgIf} from 'angular2/common';
import {Operator} from '../../model/Operator';
import {QuizType} from '../../model/QuizType';
import {OperatorService} from '../../services/operator.service';
import {QuizTypeService} from '../../services/quiztype.service';
import {QuizService} from '../../services/quiz.service';
import {QuizConfigService} from '../../services/quizconfig.service';

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
  private quizConfigService: QuizConfigService;
  private navController: NavController;

  constructor(quizTypeService: QuizTypeService, operatorService: OperatorService, quizConfigService: QuizConfigService, quizService: QuizService, navController: NavController) {
    this.quizTypeService = quizTypeService;
    this.operatorService = operatorService;
    this.quizConfigService = quizConfigService;
    this.quizService = quizService;
    this.navController = navController;
  }

  ngOnInit() {
    this.getOperators();
    this.getQuizTypes();
  }

  selectOperator(o: Operator) {
    this.selectedOperator = o;
    this.quizConfigService.setOperator(o);
  }

  selectQuizType(qt: QuizType) {
    this.selectedQuizType = qt;
    this.quizConfigService.setQuizType(qt);
  }

  startQuiz() {
    var t: Tabs = this.navController.parent;
    this.quizService.prepareQuiz(this.selectedQuizType, this.selectedOperator);
    t.select(1);
  }

  private getOperators() {
    this.operators = this.operatorService.getAll();
  }

  private getQuizTypes() {
    this.quizTypes = this.quizTypeService.getAll();
  }
}
