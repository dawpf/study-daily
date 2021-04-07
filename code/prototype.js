function Person() {
  this.name;
}
Person.prototype.say = function () {
  console.log("hello");
}

var person = new Person();

console.log(Person.__proto__);
console.log(Function.prototype);

console.log(Person.prototype.__proto__);
console.log(Object.prototype);

console.log(person.__proto__);
console.log(Person.prototype);

console.log(Person.prototype.constructor);
console.log(Person);