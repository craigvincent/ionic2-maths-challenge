import {Page, Alert, NavController} from 'ionic-angular';
import {Question} from '../../model/Question';
import {Answer} from '../../model/Answer';
import {QuizType} from '../../model/QuizType';
import {Operator} from '../../model/Operator';
import {QuizService} from '../../services/quiz.service';

@Page({
  templateUrl: 'build/pages/quizmain/quizmain.html',
})
export class QuizMain {
  currentAnswer: Answer;
  answers: Answer[];

  constructor(private quizService: QuizService, public nav: NavController) {

  }

  ngOnInit() {
    this.answers = this.quizService.getQuiz();
    this.currentAnswer = this.answers[0];
  }

  recordAnswer(userAnswer) {
    this.currentAnswer.answer = userAnswer.value;
    userAnswer.value = null;
    this.nextQuestion();
  }

  nextQuestion() {
    var finalQuestion = this.answers[this.answers.length-1],
        currentQuestion = this.currentAnswer;

    if (finalQuestion != currentQuestion) {
      this.currentAnswer = this.answers[this.answers.indexOf(this.currentAnswer) + 1];
    } else {
      this.finish();
    }
  }

  finish() {
    this.quizService.stop();
    let alert = Alert.create({
      title: 'You\'re at the end!',
      message: 'You\'ve completed all of the questions. Good Work!',
      buttons: ['Cheers']
    });
    this.nav.present(alert);
  }
}
