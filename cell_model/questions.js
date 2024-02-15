export class Question {
    constructor(question, answer, type, incorrect_blurb, correct_blurb) {
        this.question = question;
        this.answer = answer;
        this.type = type;
        this.incorrect_blurb = incorrect_blurb;
        this.correct_blurb = correct_blurb;
    }
    getQuestion() {
        return this.question;
    }
    getAnswer() {
        return this.answer;
    }
    checkAnswer(entered_answer) {
        console.log(entered_answer);
        console.log(this.answer);
        if (typeof this.answer == "string") {
            if (entered_answer == this.answer) {
                return true;
            }
            return false
        }
        if (this.answer.includes(entered_answer)) {
            return true;
        }
        return false;
    }
    getName() {
        return this.type;
    }
    getBlurb(mark, entered_answer) {
        let blurb = "Error";
        if (mark) {
            blurb = this.correct_blurb;
        } else {
            blurb = this.incorrect_blurb
        }
        const regex = /{([^}]*)}/g;
        let modifiedblurb = blurb.replace(regex, entered_answer);
        return modifiedblurb;
    }
}

export const question_list = [
    new Question("Click on where the Ribosome is", "Ribosome", "Click", "Not a ribosome, that is a {}", "Correct! This is an unattached rib "),
    new Question("Click on where the DNA is stored in the cell", "Nucleus", "Click", "No, this is a {}", "Correct! This is the nucleus and it's where genetic information is contained"),
    new Question("Click on one of the organelles that make up the Endoplasmic Recticulum", ["Smooth Endoplasmic Recticulum", "Rough Endoplasmic Recticulum"], "Click", "No, this is a {}. <br> Hint: Think about 'Smooth' and 'Rough'", "Correct! This is the {}."),
    new Question("Click on the organelle that produces energy for the cell", "Mitochondria", "Click", "No, this is a {}", "Correct! This is the {}."),
    new Question("Click on an organelle that has a membrane", ["Mitochondria", "Golgi Body", "Nucleus", "Nucleolus", "Nuclear Envelope", "Smooth Endoplasmic Recticulum", "Rough Endoplasmic Recticulum", "Lysosome"], "Click", "No, this is a {}, which has no membrane", "Correct! This is the {}, which has a membrane.")
];

export class Quiz {
    constructor() {
        this.question_list = question_list;
        this.score = 0;
        this.quiz_length = 5;
        this.current_question = "";
    }

    generateNewQuestion() {
        let question_number = Math.floor(Math.random() * ((this.quiz_length)) + 0);
        this.current_question = question_list[question_number];
        return this.current_question;
    }

    getScore() {
        return this.score;
    }

    getCurrentQuestion() {
        return this.current_question;
    }

    checkAnswerAndIncreaseScore(answer) {
        if (this.current_question.checkAnswer(answer)) {
            this.score++;
            return this.current_question.getBlurb(true, answer);
        } else {
            return this.current_question.getBlurb(false, answer);
        }
    }
}