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


(() => {
  const squareAsync = (number, cb) => {
    setTimeout(()=> {
      return cb(number*number);
    },1000);
  }
  
  const squareAsyncArray = [squareAsync, squareAsync, squareAsync];
  
  const mymap = (number, index, asyncArray) => {
    if(index >= asyncArray.length) return console.log(number);
    asyncArray[index](number, (number)=> mymap(number, index + 1, asyncArray));
  }
  
  const compositeSquareFn = (number, asyncArray) => {
    return mymap(number, 0, asyncArray)
  }
  compositeSquareFn(2, squareAsyncArray) // ==> prints 256 after 3seconds

})();