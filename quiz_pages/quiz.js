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
    if (!(question_used.includes(0))) {
        console.log("You did it")
        return true
    }
    return false

}

function getRndUniqueQuestion(used_list) {
    used = true
    while (used) {
        question_number = getRndQuestionNumber(used_list.length)
        if (!(used_list[question_number] == 1)) {
            used = false;
            used_list[question_number] = 1;
            return [used_list, question_number];
        }
    }
}


let questionContainer = document.getElementById('question');
let answerContainer = document.getElementById('answers');
let submitButton = document.getElementById('submit');
let resultsContainer = document.getElementById('reveal');
let nextButton = document.getElementById('next');
let restartButton = document.getElementById('restart');
let score = 0
let myQuestions;
let questionUsed;

function getRndQuestionNumber(total_num_of_question) {
    return Math.floor(Math.random() * ((total_num_of_question) - 0) + 0);
}

access_question_bank().then(questions => {
    myQuestions = questions
    questionUsed = new Array(myQuestions.length);
    for (let i = 0; i < myQuestions.length; ++i) questionUsed[i] = 0;
    generateQuiz(myQuestions, questionContainer, resultsContainer, submitButton, answerContainer);
}).catch(err => {
    console.log(err)
    myQuestions = "Help"
})

function add_diagram(image_link) {
    let diagramContainer = document.getElementById('diagrams');
    diagramContainer.innerHTML = "<img src=" + image_link + " id='diagram'>";
}

function clear_diagram() {
    let diagramContainer = document.getElementById('diagrams');
    diagramContainer.innerHTML = "";
}

function generateQuiz(questions, questionContainer, resultsContainer, submitButton, answerContainer) {
    submitButton.style.display = "block";
    nextButton.style.display = "none";

    function showQuestion(quizContainer, resultsContainer) {
        let output = [];
        let answers;

        //reset
        answers = [];
        resultsContainer.innerHTML = ""

        let done = checkIfSectionDone(questionUsed)
        if (done) {
            return false
        }
        question_and_used_list = getRndUniqueQuestion(questionUsed);
        let question = myQuestions[question_and_used_list[1]];
        questionUsed = question_and_used_list[0];
        console.log(questionUsed);
        console.log(question);
        let columns = Object.keys(question['answers']).length;
        let column_divide = Math.ceil(columns / 2);
        console.log(columns);
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

            // add an html radio button
            answers.push(
                '<input type="radio" class="ansbutton" name="options" value="' + letter + '" id="' + letter + '">' +
                '<label class="btn btn-primary btn-xl" for="' + letter + '">' +
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

        return [question, questionUsed]
    }


    function showResults(question, answerContainer, resultsContainer) {

        let userAnswer = '';
        let numCorrect = 0;


        // find selected answer
        userAnswer = (answerContainer.querySelector('input[name=options]:checked') || {}).value;

        console.log(userAnswer)

        btns = answerContainer.querySelectorAll('input[name=options]')

        //Disable the buttons for changing
        btns.forEach((answer_btns) => {
            answer_btns.disabled = true;

        });

        // if answer is correct
        if (userAnswer === question['correctAnswer']) {
            // add to the number of correct answers
            numCorrect++;

        }
        // if answer is wrong or blank
        else {}

        // show number of correct answers out of total and reveal next button
        if (numCorrect > 0) {
            resultsContainer.innerHTML = 'Correct';
            resultsContainer.style.backgroundColor = '0EB70E';
        } else {
            resultsContainer.innerHTML = 'Incorrect';
            resultsContainer.style.backgroundColor = '8b0000';
        }

        score += numCorrect;
        nextButton.style.display = "block";
        submitButton.style.display = "none";

    }

    function displayResults(questionContainer, answerContainer, resultsContainer) {
        questionContainer.innerHTML = '<div class="success"> You did it </div>';
        answerContainer.innerHTML = '';
        resultsContainer.innerHTML = "<h4> You got " + score + "/" + myQuestions.length + "</h4>";
    }

    // show questions right away
    let question_and_used = showQuestion(questionContainer, resultsContainer);
    if (!(question_and_used)) {
        submitButton.style.display = "none";
        nextButton.style.display = "none";
        displayResults(questionContainer, answerContainer, resultsContainer)
    }

    // on submit, show results
    submitButton.onclick = function() {
        showResults(question_and_used[0], answerContainer, resultsContainer);
    }

    //on restart, regenerate Quiz
    restartButton.onclick = function() {
        score = 0;
        for (let i = 0; i < myQuestions.length; ++i) questionUsed[i] = 0;
        generateQuiz(myQuestions, questionContainer, resultsContainer, submitButton, answerContainer);
    }


    // on next, move to new question
    nextButton.onclick = function() {
        generateQuiz(myQuestions, questionContainer, resultsContainer, submitButton, answerContainer);
    }

}