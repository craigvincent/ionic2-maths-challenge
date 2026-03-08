import { describe, expect, it } from 'vitest';
import { AnswerRecord, QuizService } from './quiz.ts';

describe('AnswerRecord', () => {
  it('reports whether an answer is correct', () => {
    const entry = new AnswerRecord({
      left: 4,
      right: 3,
      operator: {
        id: 'multiplication',
        name: 'Multiplication',
        verb: 'Multiply',
        symbol: '×',
      },
      expectedAnswer: 12,
    });

    entry.answer = 12;
    expect(entry.isCorrect()).toBe(true);

    entry.answer = 9;
    expect(entry.isCorrect()).toBe(false);
  });
});

describe('QuizService', () => {
  it('creates the requested number of questions', () => {
    const quizService = new QuizService();

    quizService.startQuiz('multiplication', 'quickie');

    expect(quizService.getProgress()).toEqual({ completed: 0, total: 30 });
  });

  it('builds division questions with whole-number answers', () => {
    const quizService = new QuizService();

    quizService.startQuiz('division', 'quickie');
    const currentQuestion = quizService.getCurrentQuestion();

    expect(currentQuestion).not.toBeNull();
    if (!currentQuestion) {
      throw new Error('Expected a current division question.');
    }

    expect(currentQuestion.question.left % currentQuestion.question.right).toBe(0);
  });

  it('marks the quiz as finished after the final answer', () => {
    const quizService = new QuizService();

    quizService.startQuiz('multiplication', 'quickie');

    for (let index = 0; index < 30; index += 1) {
      const currentQuestion = quizService.getCurrentQuestion();
      expect(currentQuestion).not.toBeNull();
      quizService.submitAnswer(currentQuestion!.question.expectedAnswer);
    }

    expect(quizService.isFinished()).toBe(true);
    expect(quizService.getResults().incorrect).toBe(0);
  });
});
