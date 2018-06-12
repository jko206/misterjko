
// Queen's attack.js
const print = console.log;

function queensAttack(n, k, r_q, c_q, obstacles) {
    
    /*      Directions
          1  2  3
          0  Q  4
          7  6  5
          elem is an object with two property:
          -distance from queen
          -the square
    */
    const closestObstacles = [
        {distance: Infinity, sq: [0, c_q]},
        {
            distance: Infinity, 
            sq: (_=>{
                let r = r_q;
                let c = c_q;
                while(r > 0 && c > 0){
                    r++;
                    c--;
                }
                return [r, c];
            })()
        },
        {distance: Infinity, sq: [r_q, k+1]},
        {
            distance: Infinity, 
            sq: (_=>{
                let r = r_q;
                let c = c_q;
                while(r < k+1 && c < k+1){
                    r++;
                    c++;
                }
                return [r, c];
            })()
        },
        {distance: Infinity, sq: [,k+1]},
        {distance: Infinity, sq: []},
        {distance: Infinity, sq: []},
        {distance: Infinity, sq: []},
        
    ];
    
    function updateClosest(dir, sq){
        function distanceToQueen(r, c){
            let d_r = r - r_q;
            let d_c = c - c_q;
            let sumOfSq = d_r**2 + d_c**2;
            return sumOfSq**0.5;
        }
        let [r, c] = sq;
        const d = distanceToQueen(r, c);
        const currClosest = closestObstacles[dir].distance;
        print(`r: ${r}, c: ${c}, dir: ${dir}, d: ${d}, currClosest: ${currClosest}`);
        if(d < currClosest){
            closestObstacles[dir] = {
                distance: d,
                square: sq,
            }
        }
    }
    
    obstacles.forEach(function(e){
        let [r, c] = e;        
        let dir;
        if(r === r_q && c !== c_q){
            if(c < c_q) dir = 0;
            else dir = 4;
        } else if(c === c_q && r !== r_q){
            if(r < r_q) dir = 2;
            else dir = 6;
        } else if(r + c === r_q + c_q){
            if(c < c_q) dir = 1;
            else dir = 5;
        } else if(r - c === r_q - c_q){
            if(c < c_q) dir = 7;
            else dir = 3;
        }
        updateClosest(dir, e);
        print('here');    
    });
    let attackables = 0;
    closestObstacles.forEach(function(e, i){
        let [r, c] = e.square;
        let diff;
        if(i == 2 || i == 8){
            //compare r and r_q to get attackables
            diff = Math.abs(r - r_q) - 1;
        } else {
            diff = Math.abs(c - c_q) - 1;
        }
        attackables += diff;
    });
    return attackables;
}

(function(){
    
    // solution 9
    let test1 = {
        n: 4, 
        k: 0, 
        r_q: 4, 
        r_c: 4, 
        obstacles: [] // no obstacles
    };
    //solution 10
    let test2 = {
        n: 5, 
        k: 3, 
        r_q: 4, 
        r_c: 3, 
        obstacles: [
            [5,5],
            [4,2],
            [2,3]
        ]
    };
    // solution: 0
    let test3 = {
        n: 1, 
        k: 0, 
        r_q: 2, 
        r_c: 2, 
        obstacles: []
    };
    let testNum = process.argv[2] >> 0;
    let toTest = testNum === 1 ? test1
        : testNum === 2 ? test2
        : testNum === 3 ? test3
        : false;
    if(toTest){
        let {n, k, r_q, r_c, obstacles} = toTest;
        let result = queensAttack(n, k, r_q, r_c, obstacles);
        // print(result);
    }
}());
