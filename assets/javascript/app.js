const timePerQuestion = 10;
const timePerQuestionResult = 4;
let timer;
let time = 0;

const questions = [
    {
        question: 'How many hearts do octopuses have?',
        choices: [1, 2, 3, 4],
        correctIndex: 2,
    },
    {
        question: 'On which planet is the largest mountain in the solar system found?',
        choices: ['Earth', 'Mars', 'Venus', 'Jupiter'],
        correctIndex: 1,
    },
    {
        question: 'What is dihydrogen monoxide?',
        choices: ['Oil', 'Yeast', 'Sugar', 'Water'],
        correctIndex: 3,
    },
    {
        question: 'What is the heaviest organ in the human body?',
        choices: ['lungs', 'Heart', 'Brain', 'Liver'],
        correctIndex: 3,
    },
    {
        question: 'Who discovered penicillin',
        choices: ['Alexander Fleming', 'Alexandar Hamilton', 'Leonardo Da vinci', 'Leonardo Dicaprio'],
        correctIndex: 0,
    },
    {
        question: 'How many Hydrogen atoms are in one molecule of water?',
        choices: ['One', 'Two', 'Three', 'Four'],
        correctIndex: 1,
    },

    {
        question: 'Which of these is not found in the nucleus?',
        choices: ['Proton', 'Neutron', 'Electron'],
        correctIndex: 2,
    },
    {
        question: 'What is the chemical symbol for potassium?',
        choices: ['Pt', 'K', 'P', 'Po'],
        correctIndex: 1,
    },
];

const game = {
    currentQuestionIndex: 0,
    chosenAnswerIndex: -1,
    correctAnswers: 0,
    incorrectAnswers: 0,
    unanswered: 0,

    resetGame() {
        this.currentQuestionIndex = 0;
        this.chosenAnswerIndex = -1;
        this.correctAnswers = 0;
        this.incorrectAnswers = 0;
        this.unanswered = 0;
    }
}

function secondsToMiliseconds(seconds) {
    return 1000 * seconds
}

$(document).ready(function () {

    function startQuestionTimer() {
        time = timePerQuestion;
        timer = setInterval(showTime, secondsToMiliseconds(1));
    }

    // Post question result timer
    function startQuestionResultTimer() {
        time = timePerQuestionResult;
        timer = setInterval(function () {
            time--;
            if (time === 0) {
                stopTimer();
                if (game.currentQuestionIndex === questions.length) {
                    endGame();
                } else {
                    showQuestion();
                }
            }
            $('#time-remaining').text(time);
        }, secondsToMiliseconds(1));
    }

    function stopTimer() {
        clearTimeout(timer);
    }

    function showTime() {
        time--;
        if (time === 0) {
            stopTimer();
            showResult();
        }
        $('#time-remaining').text(time);
    }

    function showQuestion() {
        let index = 0;
        clearHtml();
        const question = questions[game.currentQuestionIndex];
        $('#question').html(question.question);

        // Show choices per question
        question.choices.forEach(item => {
            const choice = $('<div>').addClass('form-check');
            const input = $('<input>')
                .addClass('form-check-input')
                .attr('type', 'radio')
                .attr('name', 'choice')
                .attr('value', index)
            const label = $('<label>').addClass('form-check-label').text(item);

            choice.append(input).append(label)
            $('#choices').append(choice);
            index++;
        });
        startQuestionTimer();
        $('#submit-choice').show()
    }

    function clearHtml() {
        $('#result').empty();
        $('#question').empty();
        $('#choices').empty();
        $('#submit-choice').hide();
    }

    function showResult() {
        stopTimer();
        $('#time-remaining').text(timePerQuestionResult);
        clearHtml();

        const messageElement = $('<h2>');
        const correctAnswerElement = $('<h2>');

        const currentQuestionIndex = game.currentQuestionIndex;
        const question = questions[currentQuestionIndex];
        const correctAnswerIndex = question.correctIndex
        const correctAnswer = question.choices[correctAnswerIndex]
        const chosenAnswerIndex = game.chosenAnswerIndex

        if (time === 0) { // Time ran out, no answer submitted
            messageElement.text('Out of time!');
            game.unanswered++;
        } else { // Answer submitted
            if (correctAnswerIndex === chosenAnswerIndex) { // Answer is correct
                messageElement.text("Nice job!")
                game.correctAnswers++;
            } else { // Answer is incorrect
                messageElement.text('Wrong!');
                game.incorrectAnswers++;
            }
        }
        correctAnswerElement.text("The correct answer is: " + correctAnswer);
        $('#result').append(messageElement).append(correctAnswerElement);
        game.chosenAnswerIndex = -1;
        game.currentQuestionIndex++;
        startQuestionResultTimer();
    }

    // End of game results
    function endGame() {
        clearHtml();
        $('#restart').show();
        let correctAnswerElement = $('<p>')
        let incorrectAnswerElement = $('<p>')
        let unansweredElement = $('<p>')

        correctAnswerElement.text('Correct answers: ' + game.correctAnswers)
        incorrectAnswerElement.text('Incorrect answers: ' + game.incorrectAnswers)
        unansweredElement.text('Unanswered questions: ' + game.unanswered)

        $('#result')
            .append('<h2>End of game score!</h2>')
            .append(correctAnswerElement)
            .append(incorrectAnswerElement)
            .append(unansweredElement);
    }

    $('#submit-choice').click(function () {
        const index = $("input[name='choice']:checked").val(); // Extracts value of radio button chosen
        if (!index) { // No choice selected
            if (!$('#warn').length) {
                let warningDiv = $('<div id="warn" class="alert alert-warning" role="alert">You must make a selection before submitting!</div>');
                $('#result').append(warningDiv);
            }
        } else {
            $('#warn').remove();
            game.chosenAnswerIndex = parseInt(index);
            stopTimer();
            showResult();
        }
    });

    // Functionality for start button
    $('#start').click(function () {
        $('#start').hide();
        $('#time').show()
        showQuestion();
    });

    // Functionality for restart game button
    $('#restart').click(function () {
        $('#restart').hide();
        game.resetGame();
        showQuestion();
    });

    function main() {
        $('#submit-choice').hide();
        $('#time').hide();
        $('#restart').hide();
    }
    main();
});

