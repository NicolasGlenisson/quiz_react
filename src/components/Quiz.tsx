import { useEffect, useState } from "react"
import Question from "./Question"
import { nanoid } from "nanoid"
import { AnswerType, QuestionType } from "../types/quiz"

export default function Quiz() {

    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [nbCorrectAnswer, setNbCorrectAnwser] = useState(0)
    const [isCheck, setIsCheck] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // get new questions from API
    async function getQuestions() {
        setIsLoading(true)
        const response = await fetch("https://opentdb.com/api.php?amount=5")
        const data = await response.json()
        const questions: QuestionType[] = data.results.map((question: any) => {
            // Format answers to have an AnswerType object
            // On transforme les réponses en objets avec id, text et un bool pour savoir si la question est séléctionnée
            const formatedCorrectAnswer: AnswerType = {
                id: nanoid(),
                text: question.correct_answer,
                isSelected: false,
                isCorrect: true,
                isWrong: false
            }
            const formatedIncorrectAnswer: AnswerType[] = question.incorrect_answers.map((answer: string) => {
                return {
                    id: nanoid(),
                    text: answer,
                    isSelected: false,
                    isCorrect: false,
                    isWrong: false
                }
            })

            // return new question object with QuestionType
            return {
                id: nanoid(),
                ...question,
                answers: [...formatedIncorrectAnswer, formatedCorrectAnswer].sort(() => Math.random() - 0.5)
            }
        })
        setIsLoading(false)
        setQuestions(questions)
    }
    useEffect(() => {
        getQuestions()
    }, [])

    // Select an answer and unselect the others
    function selectAnswer(questionId: string, answerId: string) {
        // If the game is over, you can't select an answer
        if(isCheck) {
            return
        }
        setQuestions((prevQuestions) => {

            return prevQuestions.map((question) => {
                if(question.id !== questionId) {
                    return question
                }
                const newAnswers = question.answers.map((answer) => {
                    const isSelected = answerId === answer.id ? true : false

                    return {...answer, isSelected: isSelected}
                })
                return {...question, answers: newAnswers}
            })
        })
    }

    // Check player's answer and display correct answer
    function checkAnswers() {

        setQuestions((prevQuestions) => {
            let tempNbCorrectAnswer = 0
            const newQuestions = prevQuestions.map((question) => {

                // check is answer is correct
                let isGoodAnswer = false;
                const newAnswers = question.answers.map((answer) => {
                    // wrong answer?
                    if(answer.isSelected && !answer.isCorrect) {
                        return {...answer, isWrong: true}
                    }
                    // good answer?
                    if(answer.isSelected && answer.isCorrect) {
                        isGoodAnswer = true;
                    }
                    return answer
                    

                })
                // Increment the count of correct answer
                if(isGoodAnswer) {
                    tempNbCorrectAnswer++
                }

                return {...question, answers: newAnswers}

            })
            setNbCorrectAnwser(tempNbCorrectAnswer)
            return newQuestions
        })

        setIsCheck(true)
        
    }

    // Restart the quiz with new questions
    function restartQuiz() {
        getQuestions()
        setIsCheck(false)
    }


    // Questions list
    const questionsComponents = questions.map((question) => {
        return (
            <Question 
            key={question.id}
            question={question}
            selectAnswer={selectAnswer}
            isCheck={isCheck}
            />
        )
    })

    // Class for special display when the quiz is over
    const extraClass = isCheck ? " quiz--grey" : ""

    // Display loading ring while fetching datas
    if(isLoading) {
        return (
            <div className="lds-dual-ring"></div>
        )
    // when data is ready, display the questions
    } else {
        return(
            
            <div className={"quiz"+extraClass}>
                {questionsComponents}
                {
                    !isCheck ?
                    <button className="check--button" onClick={checkAnswers}>Check answers</button> :
                    (
                        <div className="play-again--block">
                            <h4>You scored {nbCorrectAnswer}/5 correct answers</h4>
                            <button className="check--button" onClick={restartQuiz}>Play again</button>
                        </div>
                    )
                    
                }
            </div>
        )
    }
}