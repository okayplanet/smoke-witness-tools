const wls = require("wlsjs");
wls.api.setOptions({ url: 'wss://rpc.smoke.io' });

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

getWitnessVotes = function(witness, results) {
  results.reverse()
  votes = []
  unvotes = []
  for(var i = 0; i < results.length; i++) {
    let op = results[i][1]['op']
    if(op[0] == 'account_witness_vote') {
      if(op[1]['witness'] == witness) {
        voter = op[1]['account']
        if(op[1]['approve']) {
          if(unvotes.includes(voter)) {
            unvotes = unvotes.filter(e => e !== voter);
          }
          votes.push(voter)
        } else {
          if(votes.includes(voter)) {
            votes = votes.filter(e => e !== voter);
          }
          unvotes.push(voter)
        }
      }
    }
  }
  console.log("Witness: [%s](https://smoke.io/@%s)\n", witness, witness)
  console.log("Total votes: %d, from users:", votes.length)
  for(var i = 0; i < votes.length; i++) {
    console.log(" - %s", votes[i]);
  }
  console.log("\nTotal unvotes: %d, from users:", unvotes.length)
  for(var i = 0; i < unvotes.length; i++) {
    console.log(" - %s", unvotes[i]);
  }
  console.log("\n--------------\n")
}

recursiveHistory = function(account, start = -1, step = 1, ret = []) {
  wls.api.getAccountHistory(account, start, step, function(err, result) {
    step = 10000
    init = false
    finished = false
    if(ret.length == 0) {
      init = true
      startPage = 0
      start = result[0][0]
    } else {
      startPage = step
    }

    if(eval(start - startPage) <= step) {
      step = start - startPage
    }

    if(eval(start - startPage) <= 0) {
      finished = true
    }

    result.reverse()
    for(var i = 0; i < result.length; i++) {
      //console.log(result[i][0])
      ret.push(result[i])
    }

    if(!finished && result.length >= step || init) {
      recursiveHistory(account, eval(start - startPage), step, ret)
    } else {
      getWitnessVotes(account, ret);
    }
  });
}

//recursiveHistory('emeraldtreasury')


wls.api.getActiveWitnesses(function(err, result) {
  for(var i = 0; i < result.length; i++) {
    recursiveHistory(result[i])
    //console.log(result[i])
  }
});
