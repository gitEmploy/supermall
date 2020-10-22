export function debounce(fun,delay){
  // fun = this.$refs.scroll.refresh
  let timer = null
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() =>{
      fun.apply(this,args)
    },delay)
  }
}
