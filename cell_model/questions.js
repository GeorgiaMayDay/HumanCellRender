export class question {
    constructor(question, answer, type, incorrect_blurb, correct_blurb) {
        this.question = question;
        this.answer = answer;
        this.type = type;
        this.incorrect_blurb = incorrect_blurb;
        this.correct_blurb = correct_blurb;

        sprite.scale.set(15, 15, 1);
        sprite.position.set(position[0], position[1], position[2]);
    }

    getQuestion() {
        return this.question;
    }
    getAnswer() {
        return this.answer;
    }
    checkAnswer(entered_answer) {
        if (entered_answer == this.answer) {
            return true;
        }
        return false;
    }
    getName() {
        return this.type;
    }
    getBlurb(mark, entered_answer) {
        if (mark) {
            return this.correct_blurb;
        }
        const regex = /{([^}]*)}/g;
        let modifiedblurb = this.incorrect_blurb.replace(regex, entered_answer);
        return modifiedblurb;
    }
}

export const question_list = [
    new question("Click on where the Ribosome is", "Ribosome", "Click", "Not a ribosome, that is a {}", "Correct! Ribsomes "),
    new question("Click on where the DNA is stored in the cell ", "Nucleus", "Click", "No, this is the {}, and ")
];