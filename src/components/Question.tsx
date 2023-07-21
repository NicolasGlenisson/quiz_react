import he from "he"
import { QuestionType } from "../types/quiz"


export default function Question(props: {question: QuestionType, selectAnswer: (questionId: string, answerId: string) => void, isCheck: boolean}) {

    const answers = props.question.answers.map((answer) => {
        let extraClass = answer.isSelected ? " answer--selected" : ""
        extraClass += answer.isWrong ? " answer--wrong" : ""
        extraClass += props.isCheck && answer.isCorrect ? " answer--correct" : ""

        return (
            <div 
            key={answer.id}
            className={'answer'+extraClass}
            onClick={() => props.selectAnswer(props.question.id, answer.id)}
            >
                {he.decode(answer.text)}
            </div>
        )
    })
    return(
        <div>
            <h4 className="question--question">{he.decode(props.question.question)}</h4>
            <div className="answers">
                {answers}
            </div>
            <hr className="question--divider"/>
        </div>
    )
}