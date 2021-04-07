
Promise.resolve()
  .then(() => {
    console.log('A-1');
    return Promise.resolve('A-2')
  })
  // .then(res => { console.log(typeof (res)); })
  .then(res => { console.log(res); })


Promise.resolve()
  .then(() => { console.log('B-1'); })
  .then(() => { console.log('B-2'); })
  .then(() => { console.log('B-3'); })
  .then(() => { console.log('B-4'); })
  .then(() => { console.log('B-5'); })
  .then(() => { console.log('B-6'); })

// Promise.resolve('----').then(res => {
//   console.log(res);
//   return Promise.resolve('1111')
// })
//   .then(res => { console.log(res); })

// Promise.resolve()
//   .then(() => {
//     console.log(1);
//   })
//   .then(() => {
//     console.log(2);
//   })
//   .then(() => {
//     console.log(3);
//   })
//   .then(() => {
//     console.log(4);
//   })


console.dir(Promise.resolve('1111'));


// 123
//  1
// 234
//  2
//  3
//  5
//  4
