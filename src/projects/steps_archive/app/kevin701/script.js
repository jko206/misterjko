let primes = [7841, 7853, 7867, 7873, 7877, 7879, 7883, 7901, 7907, 7919
, 7927, 7933, 7937, 7949, 7951, 7963, 7993, 8009, 8011, 8017
, 8039, 8053, 8059, 8069, 8081, 8087, 8089, 8093, 8101, 8111
, 8117, 8123, 8147, 8161, 8167, 8171, 8179, 8191, 8209, 8219
, 8221, 8231, 8233, 8237, 8243, 8263, 8269, 8273, 8287, 8291
, 8293, 8297, 8311, 8317, 8329, 8353, 8363, 8369, 8377, 8387
, 8389, 8419, 8423, 8429, 8431, 8443, 8447, 8461, 8467, 8501
, 8513, 8521, 8527, 8537, 8539, 8543, 8563, 8573, 8581, 8597
, 8599, 8609, 8623, 8627, 8629, 8641, 8647, 8663, 8669, 8677
, 8681, 8689, 8693, 8699, 8707, 8713, 8719, 8731, 8737, 8741
, 8747, 8753, 8761, 8779, 8783, 8803, 8807, 8819, 8821, 8831
, 8837, 8839, 8849, 8861, 8863, 8867, 8887, 8893, 8923, 8929
, 8933, 8941, 8951, 8963, 8969, 8971, 8999, 9001, 9007, 9011
, 9013, 9029, 9041, 9043, 9049, 9059, 9067, 9091, 9103, 9109
, 9127, 9133, 9137, 9151, 9157, 9161, 9173, 9181, 9187, 9199
, 9203, 9209, 9221, 9227, 9239, 9241, 9257, 9277, 9281, 9283
, 9293, 9311, 9319, 9323, 9337, 9341, 9343, 9349, 9371, 9377
, 9391, 9397, 9403, 9413, 9419, 9421, 9431, 9433, 9437, 9439
, 9461, 9463, 9467, 9473, 9479, 9491, 9497, 9511, 9521, 9533
, 9539, 9547, 9551, 9587, 9601, 9613, 9619, 9623, 9629, 9631
, 9643, 9649, 9661, 9677, 9679, 9689, 9697, 9719, 9721, 9733
, 9739, 9743, 9749, 9767, 9769, 9781, 9787, 9791, 9803, 9811
, 9817, 9829, 9833, 9839, 9851, 9857, 9859, 9871, 9883, 9887
, 9901, 9907, 9923, 9929, 9931, 9941, 9949, 9967, 9973, 10007]

let answer;
let total = 0;
let correct = 0;

$(document).ready(function(){
    newQuestion();
    $('.button').click(function(){
        let resp = $(this).hasClass('resp-true');
        
        correct += resp == answer ? 1 : 0;
        updateStatUI();
        markQuestion(resp);
        newQuestion();
    });
});

let multipliers = [
    [2, 3],
    [3, 4],
    [5, 6],
    [6, 7],
    [9, 8],
    [10, 11]
];

function newQuestion(){
    total++;
    let clone = $('#template').clone(true).attr('id', 'curr-question');
    let r1 = Math.floor(Math.random() * primes.length);
    let prime = primes[r1];
    let r2 = Math.floor(Math.random() * multipliers.length);
    let multiplier = multipliers[r2];
    let factor = multiplier[0];
    let decoy = multiplier[1];
    
    let r3 = Math.floor(Math.random() * 2);
    answer = r3 === 0;
    
    let number = answer ? prime * factor : prime * decoy;
    
    let r4 = Math.floor(Math.random() * 2);
    number = prime != 2 && r4 === 0 ? number * 2 : number;
    
    clone.find('.number').text(number);
    clone.find('.divisor').text(factor);
    
    $('#mainContent').append(clone);
}

function markQuestion(resp){
    let css = resp == answer ? 'correct' : 'incorrect';
    let q = $('#curr-question');
    q.addClass(css).removeAttr('id');
    q.find('.button').remove();
}

function updateStatUI(){
    let percent = correct / total;
    percent = Math.floor(percent * 10000) / 100;
    $('#count-total').text(total);
    $('#count-correct').text(correct);
    $('#count-percent').text(percent + '%');
}
