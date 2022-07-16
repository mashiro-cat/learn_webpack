export default class FlyTree {
  constructor(){
    this.number = 10086
  }

  total(...args){
    args.reduce(( a, b ) => {
      return a + b;
    })
  }
}