let myQuestions = [{
        question: "What is 10/2?",
        answers: {
            a: '3',
            b: '5',
            c: '115'
        },
        correctAnswer: 'b'
    },
    {
        question: "What is 30/3?",
        answers: {
            a: '3',
            b: '5',
            c: '10'
        },
        correctAnswer: 'c'
    }
];

function getRndQuestionNumber() {
    return Math.floor(Math.random() * ((myQuestions.length) - 0) + 0);
}

function getRndUniqueQuestion(used_list) {
    used = true
    if (!(used_list.includes(0))) {
        console.log("You did it")
        document.location.href = "../quiz_pages/end_of_section.html";
        return 1
    }
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

let quizContainer = document.getElementById('quiz');
let submitButton = document.getElementById('submit');
let resultsContainer = document.getElementById('reveal');
let nextButton = document.getElementById('next');
let score = []
let questionUsed = new Array(myQuestions.length);
for (let i = 0; i < myQuestions.length; ++i) questionUsed[i] = 0;


generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton, questionUsed);

function generateQuiz(questions, quizContainer, resultsContainer, submitButton) {

    function showQuestion(quizContainer) {
        // we'll need a place to store the output and the answer choices
        let output = [];
        let answers;


        // first reset the list of answers
        answers = [];

        question_and_used_list = getRndUniqueQuestion(questionUsed)
        let question = myQuestions[question_and_used_list[1]]
        console.log(question)
        questionUsed = question_and_used_list[0]

        // for each available answer...
        for (letter in question['answers']) {

            console.log(letter)

            // ...add an html radio button
            answers.push(
                '<label>' +
                '<input type="radio" name="question" value="' + letter + '">' +
                letter + ': ' +
                question['answers'][letter] +
                '</label>'
            );
        }

        console.log(quizContainer)

        // add this question and its answers to the output
        output.push(
            '<div class="question">' + question['question'] + '</div>' +
            '<div class="answers">' + answers.join('') + '</div>'
        );

        // finally combine our output list into one string of html and put it on the page
        quizContainer.innerHTML = output.join('');

        console.log(quizContainer.innerHTML)

        return [question, questionUsed]
    }


    function showResults(question, quizContainer, resultsContainer) {

        // gather answer containers from our quiz
        let answerContainers = quizContainer.querySelector('.answers');

        // keep track of user's answers
        let userAnswer = '';
        let numCorrect = 0;


        // find selected answer
        userAnswer = (answerContainers.querySelector('input[name=question]:checked') || {}).value;

        console.log(userAnswer)

        // if answer is correct
        if (userAnswer === question['correctAnswer']) {
            // add to the number of correct answers
            numCorrect++;

            // color the answers green
            answerContainers.style.color = 'lightgreen';
        }
        // if answer is wrong or blank
        else {
            // color the answers red
            answerContainers.style.color = 'red';
        }

        // show number of correct answers out of total and reveal next button
        resultsContainer.innerHTML = numCorrect + ' out of 1';
        nextButton.removeAttribute("hidden")

    }

    // show questions right away
    let question_and_used = showQuestion(quizContainer);

    // on submit, show results
    submitButton.onclick = function() {
        showResults(question_and_used[0], quizContainer, resultsContainer);
    }

    // on next, move to new question
    nextButton.onclick = function() {
        generateQuiz(myQuestions, quizContainer, resultsContainer, submitButton, question_and_used[1]);
    }

}