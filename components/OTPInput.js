"use client";
const OTPInput = ({ id, previousId, nextId, value, onValueChange, handleSubmit }) => {
    //This callback function only runs when a key is released
    const handleKeyUp = (e) => {
        //check if key is backspace or arrowleft
        if (e.keyCode === 8 || e.keyCode === 37) {
            //find the previous element
            const prev = document.getElementById(previousId);
            if (prev) {
                //select the previous element
                prev.select();
            }
        } else if (
            (e.keyCode >= 48 && e.keyCode <= 57) || //check if key is numeric keys 0 to 9
            (e.keyCode >= 65 && e.keyCode <= 90) || //check if key is alphabetical keys A to Z
            (e.keyCode >= 96 && e.keyCode <= 105) || //check if key is numeric keypad keys 0 to 9
            e.keyCode === 39 //check if key is right arrow key
        ) {
            //find the next element
            const next = document.getElementById(nextId);
            if (next) {
                //select the next element
                next.select();
            } else {
                //check if inputGroup has autoSubmit enabled
                const inputGroup = document.getElementById('OTPInputGroup');
                if (inputGroup && inputGroup.dataset['autosubmit']) {
                    //submit the form
                    handleSubmit();
                }
            }
        }
    }
    return (
        <input
            id={id}
            name={id}
            type="text"
            className={Styles.DigitInput}
            value={value}
            maxLength="1"
            onChange={(e) => onValueChange(id, e.target.value)}
            onKeyUp={handleKeyUp}
        />
    );
};