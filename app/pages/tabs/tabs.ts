import {Page} from 'ionic-angular';
import {QuizConfig} from '../quizconfig/quizconfig';
import {QuizMain} from '../quizmain/quizmain';
import {Page3} from '../page3/page3';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab2Root: any = QuizConfig;
  tab1Root: any = QuizMain;
  tab3Root: any = Page3;
}
