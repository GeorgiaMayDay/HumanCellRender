async function access_question_bank() {
    let aarr = window.location.href.split('?');
    let study_type = "advanced";
    if (aarr.length > 1) {
        study_type = aarr[aarr.length - 1];
    }
    const response = await fetch("quiz_pages/question_bank_" + study_type + ".json");
    console.log(response);
    const question = await response.json();
    return JSON.parse(JSON.stringify(question));
}

function checkIfSectionDone(question_used) {
    if (!(question_used.includes(0)) || num_of_question_done >= quiz_length) {
        console.log("You did it")
        return true
    }
    return false

}

function getRndUniqueQuestion() {
    let questionPool;
    if (num_of_question_done <= 3) {
        questionPool = rememberQuestions;
    } else if (num_of_question_done <= 4) {
        questionPool = comprehensionQuestions;
    } else if (num_of_question_done <= 5) {
        questionPool = applicationQuestions;
    }
    question_number = getRndQuestionNumber(questionPool.length)
    question = questionPool[question_number];
    questionPool.splice(question_number, 1);
    console.log(questionPool);
    console.log(question);
    return question;
}


let questionContainer = document.getElementById('question');
let answerContainer = document.getElementById('answers');
let submitButton = document.getElementById('submit');
let resultsContainer = document.getElementById('reveal');
let nextButton = document.getElementById('next');
let restartButton = document.getElementById('restart');
let score = 0
let quiz_length = 6;
let num_of_question_done = 0;
let myQuestions;
let rememberQuestions = [];
let comprehensionQuestions = [];
let applicationQuestions = [];
let questionUsed;

function getRndQuestionNumber(total_num_of_question) {
    return Math.floor(Math.random() * ((total_num_of_question) - 0) + 0);
}

function sortQuestions(all_questions) {
    console.log(all_questions);
    for (let question of all_questions) {
        if (question["tag"] == "Remembering") {
            rememberQuestions.push(question);
        } else if (question["tag"] == "Comprehension") {
            comprehensionQuestions.push(question);
        } else if (question["tag"] == "Application") {
            applicationQuestions.push(question);
        } else {
            console.log(question);
            throw new Error("The tag for this question is not correct");
        }
    }
}

access_question_bank().then(questions => {
    myQuestions = questions;
    sortQuestions(myQuestions);
    questionUsed = new Array(myQuestions.length);
    for (let i = 0; i < myQuestions.length; ++i) questionUsed[i] = 0;
    generateQuiz();
}).catch(err => {
    console.log(err)
    myQuestions = "Help"
})

function add_diagram(image_link) {
    let diagramContainer = document.getElementById('diagrams');
    diagramContainer.innerHTML = "<img src='images/" + image_link + "' id='diagram'>";
}

function clear_diagram() {
    let diagramContainer = document.getElementById('diagrams');
    diagramContainer.innerHTML = "";
}

function generateQuiz() {
    submitButton.style.display = "block";
    nextButton.style.display = "none";

    // on submit, show results
    submitButton.onclick = function() {
        showResults(question);
    }

    //on restart, reload and regenerate Quiz
    restartButton.onclick = function() {
        location.reload();
    }

    // on next, move to new question
    nextButton.onclick = function() {
        generateQuiz();
    }

    function showQuestion() {
        let output = [];
        let answers;

        //reset
        answers = [];
        resultsContainer.innerHTML = ""

        let done = checkIfSectionDone(questionUsed)
        if (done) {
            return false
        }
        let question = getRndUniqueQuestion();
        let columns = Object.keys(question['answers']).length;
        let column_divide = Math.ceil(columns / 2);
        count_answer = 0;

        for (letter in question['answers']) {

            if (count_answer == 0 || count_answer == column_divide) {
                answers.push('<div class="row justify-content-center p-1" >')
            }
            count_answer++

            if ("image" in question) {
                add_diagram(question["image"]);
            } else {
                clear_diagram();
            }

            // add an answer
            answers.push(
                '<input type="radio" class="ansbutton" name="options" value="' + letter + '" id="' + letter + '">' +
                '<label class="btn btn-primary btn-xl" for="' + letter + '" id="label-' + letter + '">' +
                letter + ': ' +
                question['answers'][letter] + "</label>"
            );

            if (count_answer == 0 || count_answer == column_divide) {
                answers.push('</div>')
            }
        }

        questionContainer.innerHTML = question['question']

        // add this question and its answers to the output
        output.push(
            answers.join('')
        );

        // finally combine our output list into one string of html and put it on the page
        answerContainer.innerHTML = output.join('');

        return question
    }


    function showResults(question) {

        let userAnswer = '';
        let correct = false;
        num_of_question_done++;

        // find selected answer
        userAnswer = (answerContainer.querySelector('input[name=options]:checked') || {}).value;
        btns = answerContainer.querySelectorAll('input[name=options]')
        let correctAnswerBtn = document.getElementById(question['correctAnswer']);

        //Disable the buttons
        btns.forEach((answer_btns) => {
            answer_btns.disabled = true;

        });
        if (userAnswer === question['correctAnswer']) {
            correct = true;
        }

        // if correct, and colour correct button and reveal next button
        if (correct) {
            resultsContainer.innerHTML = 'Correct';
            resultsContainer.style.backgroundColor = '0EB70E';
            score++;
        } else {
            resultsContainer.innerHTML = 'Incorrect';
            resultsContainer.style.backgroundColor = '8b0000';
            correctAnswerBtn.id = "correct";
            console.log(correctAnswerBtn);
        }
        nextButton.style.display = "block";
        submitButton.style.display = "none";

    }

    function displayResults() {
        let control_container = document.getElementById("control-col");
        control_container.style.display = "none";
        questionContainer.innerHTML = '<div class="success"> You did it </div>';
        answerContainer.innerHTML = '';
        resultsContainer.innerHTML = "<h4> You got " + score + "/" + quiz_length + "</h4>";
        if ((score / quiz_length) >= 0.7) {
            resultsContainer.style.backgroundColor = '#0EB70E';
            add_diagram("ribecca_happy.png");
        } else if ((score / quiz_length) >= 0.4) {
            resultsContainer.style.backgroundColor = '#FFC87F';
            add_diagram("ribecca_neutral_right.png");
        } else {
            resultsContainer.style.backgroundColor = '#8b0000';
            add_diagram("ribecca_sad.png");
        }
    }

    // core loop
    showQuestion();
    if (quiz_length == num_of_question_done) {
        displayResults()
    }
}