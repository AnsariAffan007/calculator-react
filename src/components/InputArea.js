export default function InputArea(props) {

    return (
        <div className="input-area">
            <div className="input expression">{props.expression.map((element) => {
                return element + " ";
            })}</div>
            <div className="input term-input">{props.term}</div>
        </div>
    )

}