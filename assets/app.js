const wrapper = document.querySelector(".wrapper");
const stack = new Array();
const timeTaken = document.querySelector(".time-taken");
const movesCounter = document.querySelector(".moves");
const stars = document.querySelector(".stars");
const modal = document.querySelector(".modal");


class Clock{
  time;
  interval;
  constructor(){
    this.time=0;
  }

  start(){
    this.interval = setInterval(() => {
      this.time++;
      timeTaken.innerText=this.time;
    }, 1000);
  }

  reset(){
    this.time=0;
    timeTaken.innerText=this.time;
  }

  pause(){
    clearInterval(this.interval);
    return this.time;
  }
}

let clock = new Clock();
let moves=0;
let matches=0;

restart();
modal.addEventListener("click", e=>{
  if(e.target===e.currentTarget){
    e.currentTarget.style.display="none";
    restart();
  }

})
function compare(item1, item2) {
  return item1.className===item2.className;
}

function unflip(element) {
  element.classList.remove("flip");
}

function matched(element) {
  element.classList.add("flipped");
}

function toggleFlips(time, ...funcs) {
  setTimeout(()=>{//settimeouted
    while(stack[0]){
      for(let i =0; i<funcs.length; i++)
        funcs[i](stack[0]);
      stack.shift();//clearing
    }
  }, time);
}

function restart() {
  moves=0;
  matches=0;
  movesCounter.innerText=parseInt(moves/2);//updates moves
  clock.pause();
  clock.reset();

  stars.innerHTML='<i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>';
  
  let cellsContent = ["university", "car", "bell", "coffee", "bug", "tree", "leaf", "tint"];
  cellsContent=[...cellsContent,...cellsContent];

  for (let i = 0; i < cellsContent.length; i++) {
    let value = cellsContent[i];
    let element = document.createElement("div");
    element.classList.add("fa", "fa-"+value, "item");
    cellsContent[i] = element;
  }

  cellsContent = cellsContent.sort(randomSortOrder);

  let domFrag = document.createElement("article");
  domFrag.classList.add("container");

  let container = domFrag;
  for(let i=0; i<cellsContent.length; i++){
    domFrag.appendChild(cellsContent[i]);
  };

  document.querySelector("main").remove();
  wrapper.appendChild(document.createElement("main"));
  document.querySelector("main").appendChild(container);

  container.addEventListener("click", e=>{
    let self = e.target;
    if(self.classList.contains("item")){
      
      //if already exists
      if(self.classList.contains("flip") || self.classList.contains("flipped")) return;
  
      //if room in stack then push
      if(stack.length<2){
        //incement moves
        moves++;
        //start timer
        if(moves===1) 
          clock.start();
        movesCounter.innerText=parseInt(moves/2);//updates moves
        
        //remove star
        if(moves%36===0) 
          if(document.querySelector(".fa-star"))
            document.querySelector(".fa-star").remove();

        stack.push(self);
        self.classList.add("flip");
      }
  
      //if stack full
      if(stack.length===2){
        //compare items of stack and it matches
        if(compare(stack[0], stack[1])){
          toggleFlips(0, matched, unflip);
          matches++;
        }
        else{
          toggleFlips(500, unflip);
        }
      }
  
      if(matches===8) {
        modal.querySelector(".result-time-taken").innerHTML = clock.pause();
        modal.querySelector(".result-stars").innerHTML = stars.innerHTML;
        modal.querySelector(".result-moves").innerText = parseInt(moves/2);
        modal.style.display="flex";
      }
    }
    else
      console.log("container");
  });

}

function randomSortOrder() {
  let one = Math.floor(Math.random()*10)%2;
  let two = Math.floor(Math.random()*10)%2;
  if(one)
    return two;
  else
    return two*-1;
}