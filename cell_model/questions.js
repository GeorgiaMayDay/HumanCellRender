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

const sprite = ["Nucleolus", "Rough Endoplasmic Recticulum", "Golgi Body", "Centrioles", "Mitochondria", "Smooth Endoplasmic Recticulum", "Lysosome", "Membrane", "Nucleus", "Ribosome", "Cytsol", "Nuclear Envelope"]

let sprite_question_list = [];

const question_list = [
    new Question("Click on where the DNA is stored in the cell", "Nucleus", "Click", "No, this is a {}", "Correct! This is the nucleus and it's where genetic information is contained"),
    new Question("Click on one of the organelles that make up the Endoplasmic Recticulum", ["Smooth Endoplasmic Recticulum", "Rough Endoplasmic Recticulum"], "Click", "No, this is a {}. <br> Hint: Think about 'Smooth' and 'Rough'", "Correct! This is the {}."),
    new Question("Click on the organelle that produces energy for the cell", "Mitochondria", "Click", "No, this is a {}", "Correct! This is the {}."),
    new Question("Click on an organelle that has a membrane or functions as a membrane", ["Mitochondria", "Golgi Body", "Nucleus", "Nucleolus", "Nuclear Envelope", "Smooth Endoplasmic Recticulum", "Rough Endoplasmic Recticulum", "Lysosome"], "Click", "No, this is a {}, which has no membrane", "Correct! This is the {}, which has a membrane."),
    new Question("Click on an organelle that handles proteins or is involves in protein synthesis", ["Golgi Body", "Rough Endoplasmic Recticulum", "Smooth Endoplasmic Recticulum", "Nucleus", "Ribosome"], "Click", "No, the {} aren't involved in protein synthesis", "Correct! {} is part of protein synthesis."),
    new Question("Click on the biggest organelle in the cell", ["Nucleus"], "Click", "No", "Correct! The Endoplasmic Reticulum is the largest organelle in the cell.")
];

for (let p of sprite) {
    let sprite_question = new Question("Click on where the " + p + " is", p, "Click", "Not a " + p + ", that is a {}", "Correct! This is a " + p);
    if (p == "Ribosome") {
        sprite_question = new Question("Click on where the Ribosome is", "Ribosome", "Click", "Not a ribosome, that is a {}", "Correct! This is an unattached ribosome");
    }
    sprite_question_list.push(sprite_question);
}

const total_q_list = question_list.concat(sprite_question_list);

export class Quiz {
    constructor() {
        this.question_list = total_q_list.slice();
        this.score = 0;
        this.quiz_length = 5;
        this.questions_total = 16;
        this.question_so_far = 1;
        this.current_question = "";
    }

    generateNewQuestion() {
        let question_number = Math.floor(Math.random() * ((this.questions_total) - 1) + 0);
        this.current_question = this.question_list[question_number];
        this.question_list.splice(question_number, 1);
        this.questions_total--;
        console.log(this.question_list);
        return this.current_question;
    }

    getScore() {
        return this.score;
    }

    getCurrentQuestion() {
        return this.current_question;
    }

    checkAnswerAndIncreaseScore(answer) {
        this.question_so_far++;
        if (this.current_question.checkAnswer(answer)) {
            this.score++;
            return this.current_question.getBlurb(true, answer);
        } else {
            return this.current_question.getBlurb(false, answer);
        }
    }

    checkAnswer(answer) {
        return this.current_question.checkAnswer(answer);
    }

    checkIfQuizOver() {
        if (this.question_so_far <= this.quiz_length) {
            return true;
        }
        return false;
    }
}