export default function Button(props) {

    const blueText = ["Mod", "x²", "√x", "÷", "×", "-", "+", "="]

    const blueTextStyle = {
        color: "#5ACFFD"
    }

    function setColor() {
        if (blueText.includes(props.value)) {
            return blueTextStyle
        }
    }

    return (
        <button className="button" id={(props.value === "x²") ? "square" : null} style={setColor()} onClick={props.onClick}>{props.value}</button>
    )
}

