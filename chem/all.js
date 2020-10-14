// Hello curious traveler!
// I swear my code normally isn't this bad

const quantumNumbersToAtomic = function(inN, inL, m, s) {

    // count up until the same quantum state is reached
    // this will never return for bogus inputs, make sure they are checked!
    let nmaster = 1, lmaster = 0, electrons = 0;

    while(true) {
        
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

// see quantum to atomic - same code
const atomicToQuantum = function(atomic) {

    let nmaster = 1, lmaster = 0;

    let electronsRemaining = atomic;
    while(true) {
        let n = nmaster, l = lmaster;
        do {
            if(2 * (l * 2 + 1) < electronsRemaining) {
                console.log(`Full-filling n=${n}, l=${l}`);
                electronsRemaining -= 2 * (l * 2 + 1);
            } else {

                // hunds rule but in reverse
                // somehow even more annoying
                let s;
                if(electronsRemaining > l * 2 + 1) {
                    s = 0;
                    electronsRemaining -= l * 2 + 1;    
                } else {
                    s = 1;
                }

                return {
                    n: n,
                    l: l,
                    m: electronsRemaining - l - 1,
                    s: s
                }

            }
            l--;
            n++;
        } while(l >= 0);
        if(lmaster + 1 == nmaster)
            nmaster++;
        else
            lmaster++;
    }


};

const atomicToConfig = function(atomic) {



};