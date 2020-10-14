// Hello curious traveler!
// I swear my code normally isn't this bad

const quantumNumbersToAtomic = function(inN, inL, m, s) {

    // count up until the same quantum state is reached
    // this will never return for bogus inputs, make sure they are checked!
    let nmaster = 1, lmaster = 0, electrons = 0;

    let i = 0;
    while(i < 10) {
        
        // do the staircase descend thing
        let n = nmaster, l = lmaster;
        do {
            if(inN == n && inL == l) {
                return electrons + (s == 0 ? (l * 2 + 1) : 0) + (m + l + 1);
            } else {
                electrons += 2 * (l * 2 + 1);
            }
            l--;
            n++;
        } while(l >= 0);

        if(lmaster + 1 == nmaster) {
            nmaster++;
        } else {
            lmaster++;
        }

    }

};

// this function is really "lazy": it does very little validation
// it assumes the user's configuration is correct and sums up the electrons
const configToAtomic = function(configString) {

    // regex is disgustingly elegant
    let electrons = 0;
    for(let token of configString.split(/\s+/)) {
       electrons += Number(token.split(/[a-zA-Z]/)[1]); 
    }

    return electrons;

};