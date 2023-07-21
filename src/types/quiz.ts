export type QuestionType = {
    id: string,
    category: string,
    difficulty: string,
    question: string,
    type: string,
    answers: AnswerType[]
}

export type AnswerType = {
    id: string,
    text: string,
    isSelected: boolean,
    isCorrect: boolean,
    isWrong: boolean
}