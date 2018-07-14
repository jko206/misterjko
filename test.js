function zigzag(a) {
    let last = a[0];
    let cons = 1;
    let maxCons = 1;
    let testHigh = 1;
    for(let i = 1; i < a.length; i++){
        let curr = a[i];
        let countUp = (_=>{
            if(testHigh === 1) return curr > last;
            else return curr < last;
            
        })();
        if(countUp) cons++;
        else {
            maxCons = cons > maxCons ? cons : maxCons;
            cons = 1;
        }
        testHigh *= -1;
        last = curr;
    }
    
    testHigh = -1;
    for(let i = 1; i < a.length; i++){
        let curr = a[i];
        let countUp = (_=>{
            if(testHigh === 1) return curr > last;
            else return curr < last;
            
        })();
        if(countUp) cons++;
        else {
            maxCons = cons > maxCons ? cons : maxCons;
            cons = 1;
        }
        testHigh *= -1;
        last = curr;
    }
    
    return maxCons;
}