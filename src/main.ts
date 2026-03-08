import '@ionic/core/css/ionic.bundle.css';
import { defineCustomElements } from '@ionic/core/loader';
import './style.css';
import {
  OPERATORS,
  QUIZ_TYPES,
  QuizService,
  type OperatorId,
  type QuizTypeId,
} from './quiz.ts';

defineCustomElements(window);

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) {
  throw new Error('Missing #app root element.');
}

const appElement = appRoot;

const quizService = new QuizService();

const state: {
  selectedOperatorId: OperatorId;
  selectedQuizTypeId: QuizTypeId;
  quizDeadline: number | null;
  now: number;
} = {
  selectedOperatorId: OPERATORS[0].id,
  selectedQuizTypeId: QUIZ_TYPES[0].id,
  quizDeadline: null,
  now: Date.now(),
};

let countdownId: number | null = null;

function startQuiz(): void {
  quizService.startQuiz(state.selectedOperatorId, state.selectedQuizTypeId);
  const quizType = quizService.getQuizType();
  state.quizDeadline = quizType ? Date.now() + quizType.seconds * 1000 : null;
  state.now = Date.now();
  ensureCountdown();
  render();
  focusAnswerInput();
}

function restartQuiz(): void {
  stopCountdown();
  state.quizDeadline = null;
  quizService.reset();
  render();
}

function ensureCountdown(): void {
  stopCountdown();
  countdownId = window.setInterval(() => {
    state.now = Date.now();

    if (state.quizDeadline !== null && state.now >= state.quizDeadline) {
      quizService.finishQuiz();
      stopCountdown();
    }

    render();
  }, 1000);
}

function stopCountdown(): void {
  if (countdownId !== null) {
    window.clearInterval(countdownId);
    countdownId = null;
  }
}

function submitAnswer(): void {
  const answerInput = document.querySelector<HTMLInputElement>('#answer-input');
  if (!answerInput) {
    return;
  }

  const trimmed = answerInput.value.trim();
  if (trimmed.length === 0) {
    answerInput.focus();
    return;
  }

  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) {
    answerInput.select();
    return;
  }

  quizService.submitAnswer(parsed);
  answerInput.value = '';

  if (quizService.isFinished()) {
    stopCountdown();
  }

  render();
  focusAnswerInput();
}

function focusAnswerInput(): void {
  window.requestAnimationFrame(() => {
    const answerInput = document.querySelector<HTMLInputElement>('#answer-input');
    answerInput?.focus();
  });
}

function formatSeconds(seconds: number): string {
  const safeSeconds = Math.max(seconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

function getSecondsRemaining(): number | null {
  if (state.quizDeadline === null) {
    return null;
  }

  return Math.max(0, Math.ceil((state.quizDeadline - state.now) / 1000));
}

function renderSetupView(): string {
  return `
    <ion-grid class="layout-grid">
      <ion-row>
        <ion-col size="12" sizeLg="8" offsetLg="2">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Choose your challenge</ion-card-title>
              <ion-card-subtitle>Modernized and ready for new maths drills.</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <div class="option-group">
                <h2>Operator</h2>
                <div class="button-row">
                  ${OPERATORS.map(
                    (operator) => `
                      <ion-button
                        class="choice-button"
                        data-operator-id="${operator.id}"
                        fill="${state.selectedOperatorId === operator.id ? 'solid' : 'outline'}"
                      >
                        ${operator.name}
                      </ion-button>
                    `,
                  ).join('')}
                </div>
              </div>
              <div class="option-group">
                <h2>Challenge length</h2>
                <div class="quiz-type-list">
                  ${QUIZ_TYPES.map(
                    (quizType) => `
                      <button
                        type="button"
                        class="quiz-type-card ${state.selectedQuizTypeId === quizType.id ? 'selected' : ''}"
                        data-quiz-type-id="${quizType.id}"
                      >
                        <strong>${quizType.title}</strong>
                        <span>${quizType.description}</span>
                      </button>
                    `,
                  ).join('')}
                </div>
              </div>
              <ion-button id="start-quiz" expand="block" size="large">Start quiz</ion-button>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  `;
}

function renderQuizView(): string {
  const current = quizService.getCurrentQuestion();
  const progress = quizService.getProgress();
  const operator = quizService.getOperator();
  const quizType = quizService.getQuizType();
  const secondsRemaining = getSecondsRemaining();

  if (!current || !operator || !quizType) {
    return renderSetupView();
  }

  return `
    <ion-grid class="layout-grid">
      <ion-row>
        <ion-col size="12" sizeLg="8" offsetLg="2">
          <ion-card>
            <ion-card-header>
              <ion-card-title>${operator.verb} challenge</ion-card-title>
              <ion-card-subtitle>${quizType.title} · ${progress.completed + 1} of ${progress.total}</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <div class="stats-row">
                <div>
                  <span class="label">Time left</span>
                  <strong>${secondsRemaining === null ? '—' : formatSeconds(secondsRemaining)}</strong>
                </div>
                <div>
                  <span class="label">Completed</span>
                  <strong>${progress.completed}/${progress.total}</strong>
                </div>
              </div>
              <div class="question-panel">
                <span>${current.question.left}</span>
                <span>${current.question.operator.symbol}</span>
                <span>${current.question.right}</span>
                <span>=</span>
              </div>
              <label class="answer-label" for="answer-input">Your answer</label>
              <input id="answer-input" class="answer-input" type="number" inputmode="numeric" autocomplete="off" />
              <div class="button-row button-row--stacked">
                <ion-button id="submit-answer">Submit answer</ion-button>
                <ion-button id="finish-quiz" fill="outline">Finish early</ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  `;
}

function renderResultsView(): string {
  const results = quizService.getResults();
  const percentage = results.total === 0 ? 0 : Math.round((results.correct / results.total) * 100);

  return `
    <ion-grid class="layout-grid">
      <ion-row>
        <ion-col size="12" sizeLg="10" offsetLg="1">
          <ion-card>
            <ion-card-header>
              <ion-card-title>Results</ion-card-title>
              <ion-card-subtitle>${results.correct} correct out of ${results.total} · ${percentage}%</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <div class="stats-row">
                <div>
                  <span class="label">Correct</span>
                  <strong>${results.correct}</strong>
                </div>
                <div>
                  <span class="label">Incorrect</span>
                  <strong>${results.incorrect}</strong>
                </div>
              </div>
              <ion-list inset>
                ${results.answers
                  .map(
                    (entry, index) => `
                      <ion-item>
                        <ion-label>
                          <h3>Q${index + 1}: ${entry.question.left} ${entry.question.operator.symbol} ${entry.question.right} = ${entry.question.expectedAnswer}</h3>
                          <p>Your answer: ${entry.answer ?? 'Not answered'}</p>
                        </ion-label>
                        <ion-badge color="${entry.isCorrect() ? 'success' : 'danger'}">
                          ${entry.isCorrect() ? 'Correct' : 'Review'}
                        </ion-badge>
                      </ion-item>
                    `,
                  )
                  .join('')}
              </ion-list>
              <ion-button id="restart-quiz" expand="block">Try another challenge</ion-button>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  `;
}

function render(): void {
  const shouldShowResults = quizService.isFinished();
  const markup = shouldShowResults
    ? renderResultsView()
    : quizService.hasActiveQuiz()
      ? renderQuizView()
      : renderSetupView();

  appElement.innerHTML = `
    <ion-app>
      <ion-header translucent="true">
        <ion-toolbar>
          <ion-title>Maths Challenge</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content fullscreen="true">
        ${markup}
      </ion-content>
    </ion-app>
  `;

  bindEvents();
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>('[data-operator-id]').forEach((element) => {
    element.addEventListener('click', () => {
      const operatorId = element.dataset.operatorId as OperatorId | undefined;
      if (operatorId) {
        state.selectedOperatorId = operatorId;
        render();
      }
    });
  });

  document.querySelectorAll<HTMLElement>('[data-quiz-type-id]').forEach((element) => {
    element.addEventListener('click', () => {
      const quizTypeId = element.dataset.quizTypeId as QuizTypeId | undefined;
      if (quizTypeId) {
        state.selectedQuizTypeId = quizTypeId;
        render();
      }
    });
  });

  document.querySelector<HTMLElement>('#start-quiz')?.addEventListener('click', startQuiz);
  document.querySelector<HTMLElement>('#restart-quiz')?.addEventListener('click', restartQuiz);
  document.querySelector<HTMLElement>('#submit-answer')?.addEventListener('click', submitAnswer);
  document.querySelector<HTMLElement>('#finish-quiz')?.addEventListener('click', () => {
    quizService.finishQuiz();
    stopCountdown();
    render();
  });
  document.querySelector<HTMLInputElement>('#answer-input')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitAnswer();
    }
  });
}

render();
