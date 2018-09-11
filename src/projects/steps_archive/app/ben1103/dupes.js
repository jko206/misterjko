

$(document).ready(function(){
    $('#check').click(function(){
        let input = $('#content').val().split(/\s+/).sort();
        while(input[0] == ''){
            input.shift();
        }
        let dupes = [];
        let invalids = [];
        let uniqueCount = 0;
        let last = '';
        input.forEach(function(e,i,arr){
            let result = checkForm(e);
            if(e == last) dupes.push(e);
            if(!result) invalids.push(e);
            else if(e != last) uniqueCount++;
            last = e;
        });
        dupes = dupes.sort().join(', ');
        invalids = invalids.sort().join(', ');
        if(dupes) $('#dupes').text(`These are duplicates: ${dupes}`);
        if(invalids) $('#invalids').text(`These are invalid: ${invalids}`);
        $('#unique').text(`There are ${uniqueCount} unique valid items`);
    });
});

function checkForm(str){
    let pattern = /[0-2][0-2][0-2][A|B|C|D][A|B|C|D][A|B|C|D]/;
    str = str.split('').sort().join('');
    return pattern.test(str);
}