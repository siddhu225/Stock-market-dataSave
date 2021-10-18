// write a composition funtion to handle array of n async fns? 



// composition function = f(g(h(x)))
// compositeSqaureFn(2, sqaureAsyncArray) ==> prints 256 after 3seconds

// const sqaureAsync = (number) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(number * number)
//     }, 1000)  
//   })
// }

// const sqaureAsyncArray = [sqaureAsync, sqaureAsync, sqaureAsync]

// composition function = f(g(h(x)))


(async() => {
  const sqaureAsync = (number, cb) => {
    setTimeout(() => {
      return cb(number * number)
    }, 1000)
  }
  const sqaureAsyncArray = [sqaureAsync, sqaureAsync, sqaureAsync];
  compositeSqaureFn = async (value, array) => {
    let finalVal = value;
    for (let i=0; i< array.length; i+=1) {
      await array[i](finalVal, (res) => {
        finalVal = res;
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return finalVal;
  }
  let start = Date.now();
  console.log('time-in', Date.now())
  const output = await compositeSqaureFn(2, sqaureAsyncArray) // ==> prints 256 after 3seconds
  let end = Date.now();
  console.log('time-out', Date.now())
  console.log(`printing output after ${end-start} seconds`);
  console.log('output', output)

})();