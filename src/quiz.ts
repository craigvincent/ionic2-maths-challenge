export type OperatorId = 'multiplication' | 'division';
export type QuizTypeId = 'quickie' | 'typical';

export interface OperatorDefinition {
  id: OperatorId;
  name: string;
  verb: string;
  symbol: '×' | '÷';
}

export interface QuizTypeDefinition {
  id: QuizTypeId;
  title: string;
  questionCount: number;
  seconds: number;
  description: string;
}

export interface Question {
  left: number;
  right: number;
  operator: OperatorDefinition;
  expectedAnswer: number;
}

export class AnswerRecord {
  constructor(
    public readonly question: Question,
    public answer: number | null = null,
  ) {}

  isCorrect(): boolean {
    return this.answer === this.question.expectedAnswer;
  }
}

export const OPERATORS: readonly OperatorDefinition[] = [
  {
    id: 'multiplication',
    name: 'Multiplication',
    verb: 'Multiply',
    symbol: '×',
  },
  {
    id: 'division',
    name: 'Division',
    verb: 'Divide',
    symbol: '÷',
  },
] as const;

export const QUIZ_TYPES: readonly QuizTypeDefinition[] = [
  {
    id: 'quickie',
    title: 'Quickie',
    questionCount: 30,
    seconds: 90,
    description: 'A short sprint with 30 questions in 90 seconds.',
  },
  {
    id: 'typical',
    title: 'Typical',
    questionCount: 60,
    seconds: 300,
    description: 'A longer challenge with 60 questions in 5 minutes.',
  },
] as const;

interface QuizSession {
  operator: OperatorDefinition;
  quizType: QuizTypeDefinition;
  answers: AnswerRecord[];
  currentIndex: number;
  finished: boolean;
}

export class QuizService {
  private session: QuizSession | null = null;

  startQuiz(operatorId: OperatorId, quizTypeId: QuizTypeId): void {
    const operator = this.requireOperator(operatorId);
    const quizType = this.requireQuizType(quizTypeId);

    this.session = {
      operator,
      quizType,
      answers: Array.from({ length: quizType.questionCount }, () => new AnswerRecord(this.buildQuestion(operator))),
      currentIndex: 0,
      finished: false,
    };
  }

  reset(): void {
    this.session = null;
  }

  hasActiveQuiz(): boolean {
    return this.session !== null;
  }

  getQuizType(): QuizTypeDefinition | null {
    return this.session?.quizType ?? null;
  }

  getOperator(): OperatorDefinition | null {
    return this.session?.operator ?? null;
  }

  getCurrentQuestion(): AnswerRecord | null {
    if (!this.session || this.session.finished) {
      return null;
    }

    return this.session.answers[this.session.currentIndex] ?? null;
  }

  submitAnswer(answer: number): void {
    if (!Number.isFinite(answer)) {
      throw new Error('Answer must be a finite number.');
    }

    const current = this.getCurrentQuestion();
    if (!current || !this.session) {
      throw new Error('There is no active question to answer.');
    }

    current.answer = answer;

    if (this.session.currentIndex >= this.session.answers.length - 1) {
      this.session.finished = true;
      return;
    }

    this.session.currentIndex += 1;
  }

  finishQuiz(): void {
    if (this.session) {
      this.session.finished = true;
    }
  }

  isFinished(): boolean {
    return this.session?.finished ?? false;
  }

  getProgress(): { completed: number; total: number } {
    if (!this.session) {
      return { completed: 0, total: 0 };
    }

    return {
      completed: this.session.answers.filter((entry) => entry.answer !== null).length,
      total: this.session.answers.length,
    };
  }

  getResults(): {
    correct: number;
    incorrect: number;
    total: number;
    answers: AnswerRecord[];
  } {
    if (!this.session) {
      return { correct: 0, incorrect: 0, total: 0, answers: [] };
    }

    const correct = this.session.answers.filter((entry) => entry.isCorrect()).length;
    const total = this.session.answers.length;

    return {
      correct,
      incorrect: total - correct,
      total,
      answers: this.session.answers,
    };
  }

  private requireOperator(operatorId: OperatorId): OperatorDefinition {
    const operator = OPERATORS.find((candidate) => candidate.id === operatorId);
    if (!operator) {
      throw new Error(`Unknown operator: ${operatorId}`);
    }
    return operator;
  }

  private requireQuizType(quizTypeId: QuizTypeId): QuizTypeDefinition {
    const quizType = QUIZ_TYPES.find((candidate) => candidate.id === quizTypeId);
    if (!quizType) {
      throw new Error(`Unknown quiz type: ${quizTypeId}`);
    }
    return quizType;
  }

  private buildQuestion(operator: OperatorDefinition): Question {
    if (operator.id === 'division') {
      const right = this.randomInt(1, 12);
      const expectedAnswer = this.randomInt(0, 12);
      return {
        left: right * expectedAnswer,
        right,
        operator,
        expectedAnswer,
      };
    }

    const left = this.randomInt(0, 12);
    const right = this.randomInt(0, 12);

    return {
      left,
      right,
      operator,
      expectedAnswer: left * right,
    };
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
