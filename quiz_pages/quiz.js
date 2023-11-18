let myQuestions = [{
        question: "What is 10/2?",
        answers: {
            a: '3',
            b: '5',
            c: '115',
            d: '8'
        },
        correctAnswer: 'b'
    },
    {
        question: "What is 30/3?",
        answers: {
            a: '3',
            b: '5',
            c: '10',
            d: '17'
        },
        correctAnswer: 'c'
    }
];

function getRndQuestionNumber() {
    return Math.floor(Math.random() * ((myQuestions.length) - 0) + 0);
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
        question_number = getRndQuestionNumber()
        if (!(used_list[question_number] == 1)) {
            used = false
            console.log(question_number)
            used_list[question_number] = 1
            return [used_list, question_number]
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
let questionUsed = new Array(myQuestions.length);
for (let i = 0; i < myQuestions.length; ++i) questionUsed[i] = 0;


generateQuiz(myQuestions, questionContainer, resultsContainer, submitButton, answerContainer);

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
        let columns = Object.keys(question['answers']).length;
        let column_divide = Math.ceil(columns / 2);
        console.log(columns);
        count_answer = 0;

        for (letter in question['answers']) {

            if (count_answer == 0 || count_answer == column_divide) {
                answers.push('<div class="col p-1" >')
            }

            count_answer++

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

        // // gather answer containers from our quiz
        // let answerContainer = quizContainer.querySelector('.answers');

        // keep track of user's answers
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
        else {

        }

        // show number of correct answers out of total and reveal next button
        resultsContainer.innerHTML = '<h6>' + numCorrect + ' out of 1 </h6>';
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