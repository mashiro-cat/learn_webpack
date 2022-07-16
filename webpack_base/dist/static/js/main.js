/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/flytree.js
class FlyTree {
  constructor(){
    this.number = 10086
  }

  total(...args){
    args.reduce(( a, b ) => {
      return a + b;
    })
  }
}
;// CONCATENATED MODULE: ./src/main.js






const flytree = new FlyTree();
console.log(flytree.number);
console.log(flytree.total(1, 2, 3, 4));
/******/ })()
;
//# sourceMappingURL=main.js.map