window.addEventListener('load',startBoard);
window.addEventListener('load',drawBoard);
window.addEventListener('load',pacmanMove);

class Ghost {
  constructor(startX, startY) {
    this.startX = startX
    this.startY = startY
    this.currentX = startX
    this.currentY = startY
    this.isFreeze = false
    this.goHome = false
    this.dir = "left";
  }
}
//Initialize four ghosts
ghosts = [
  new Ghost(13*20,14*20),
  new Ghost(13*20,15*20),
  new Ghost(14*20,14*20),
  new Ghost(14*20,15*20)
]
//Initialize pacman
pacmanPosition = {x: 13*20, y: 17*20, prevdir:"left" ,dir: "left"};

var c = document.getElementById("canvas");

var s = document.getElementById("score");

const ctx = c.getContext("2d");

var score = 0;

const width = 28;
//lives represents how many lives a player can have
var lives = 3;
//how many steps a player moves after switching direction
var lsteps = 0;
var rsteps = 0;
var tsteps = 0;
var dsteps = 0;

//initial matrix to set up the grids//
const layout = [

  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,

  1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,

  1,0,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,0,1,

  1,3,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,3,1,

  1,0,0,0,0,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,0,0,0,0,1,

  1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,

  1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,

  1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,

  0,0,0,0,0,0,0,3,1,1,0,0,0,1,1,0,0,0,1,1,3,0,0,0,0,0,0,0,

  1,0,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,

  1,0,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,0,1,1,0,1,

  1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,

  1,0,1,1,1,1,0,1,1,0,1,1,4,4,4,4,1,1,0,1,1,0,1,1,1,1,0,1,

  1,0,1,1,1,1,0,1,1,0,1,1,4,4,4,4,1,1,0,1,1,0,1,1,1,1,0,1,

  1,0,1,1,0,0,3,1,1,0,1,1,4,5,5,4,1,1,0,1,1,3,0,0,1,1,0,1,

  1,0,1,1,0,1,1,1,1,0,1,1,4,5,5,4,1,1,0,1,1,1,1,0,1,1,0,1,

  1,0,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,0,1,

  1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,

  1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,

  1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,

  1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,

  1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,

  1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,

  0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,

  1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,

  1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,

  1,0,0,0,1,1,0,1,1,3,0,0,0,0,0,0,0,0,3,1,1,0,1,1,0,0,0,1,

  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,

  1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,

  1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,

  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,

]

//matrix to store objects on each grid//
var squares=[];
//prepard all the pictures for the pixels
var coin = new Image();
coin.src = "coin.png";
var wall = new Image();
wall.src = "wall.png"
var gaze = new Image();
gaze.src = "gaze.png";
var powerup = new Image();
powerup.src = "powerUp.png";
var pacmanup = new Image();
pacmanup.src = "pacmanup.png";
var pacmandown = new Image();
pacmandown.src = "pacmandown.png"
var pacmanleft = new Image();
pacmanleft.src = "pacmanleft.png";
var pacmanright = new Image();
pacmanright.src = "pacmanright.png";
var ghostup = new Image();
ghostup.src = "ghostup.png";
var ghostdown = new Image();
ghostdown.src = "ghostdown.png";
var ghostleft = new Image();
ghostleft.src = "ghostleft.png";
var ghostright = new Image();
ghostright.src = "ghostright.png";
var scaredup = new Image();
scaredup.src = "scaredup.png";
var scareddown = new Image();
scareddown.src = "scareddown.png";
var scaredleft = new Image();
scaredleft.src = "scaredleft.png";
var scaredright = new Image();
scaredright.src = "scaredright.png";
/**
* This is a function to draw the pixels based on the class of the div stored in squares matrix
*/
function drawBoard()
{
  //the player collect all the dots
  if(score==3430)
  {
    window.location = "win.html";
  }

  s.innerHTML=score;

  ctx.clearRect(0, 0, c.width, c.height);

  for(let i=0; i<squares.length; i++)
  {
    //convert the index of squares to the x,y coordinate of the pixel
    var y =  parseInt(i / 28) * 20;

    var x =  parseInt(i % 28) * 20;

    ctx.clearRect(x, y, 20, 20);

    if(squares[i].classList.contains('wall'))
    {
      ctx.drawImage(wall, x, y, 20, 20);

    }else if(squares[i].classList.contains('gaze'))
    {
        ctx.drawImage(gaze, x, y, 20, 20);

    }else if(squares[i].classList.contains('pac-man'))
    {
      if(pacmanPosition.dir=="left")
      {
        ctx.drawImage(pacmanleft, x, y, 20, 20);
      }
      if(pacmanPosition.dir=="right")
      {
        ctx.drawImage(pacmanright, x, y, 20, 20);
      }
      if(pacmanPosition.dir=="up")
      {
        ctx.drawImage(pacmanup, x, y, 20, 20);
      }
      if(pacmanPosition.dir=="down")
      {
        ctx.drawImage(pacmandown, x, y, 20, 20);
      }

    }else if(squares[i].classList.contains('ghost'))
    {
      if(squares[i].classList.contains('freeze'))
      {
        for(k = 0; k < ghosts.length; k++)
        {
          if(ghosts[k].dir=="left")
          {
            ctx.drawImage(scaredleft, x, y, 20, 20);
          }
          if(ghosts[k].dir=="right")
          {
            ctx.drawImage(scaredright, x, y, 20, 20);
          }
          if(ghosts[k].dir=="up")
          {
            ctx.drawImage(scaredup, x, y, 20, 20);
          }
          if(ghosts[k].dir=="down")
          {
            ctx.drawImage(scareddown, x, y, 20, 20);
          }
        }
      }
      else {
        for(j = 0; j < ghosts.length; j++)
        {
          if(ghosts[j].dir=="left")
          {
            ctx.drawImage(ghostleft, x, y, 20, 20);
          }
          if(ghosts[j].dir=="right")
          {
            ctx.drawImage(ghostright, x, y, 20, 20);
          }
          if(ghosts[j].dir=="up")
          {
            ctx.drawImage(ghostup, x, y, 20, 20);
          }
          if(ghosts[j].dir=="down")
          {
            ctx.drawImage(ghostdown, x, y, 20, 20);
          }
        }
      }
    }else if(squares[i].classList.contains('pac-dot'))
    {
      ctx.drawImage(coin, x, y, 20, 20);
    }
    else if(squares[i].classList.contains('super-dot'))
    {
      ctx.drawImage(powerup, x, y, 20, 20);

    }
    else {
      ctx.fillStyle = "#595959";
      ctx.fillRect(x, y, 20, 20);
    }
  }
}

/**
* This is a function to store the corresponding class in squares matrix based on the initial layout matrix
*/
function startBoard()
{
  for(let i=0; i<layout.length; i++)
  {

    const square = document.createElement('div');

    squares.push(square);

    if(layout[i]==0)
    {
      squares[i].classList.add('pac-dot');

    }else if(layout[i]==1)
    {
      squares[i].classList.add('wall');

    }else if(layout[i]==2)
    {
      squares[i].classList.add('pac-man');

    }else if(layout[i]==3)
    {
      squares[i].classList.add('super-dot');

    }else if(layout[i]==5)
    {
      squares[i].classList.add('ghost');
    }
  }
}

/**
* This is a function to initial the position of pacman and the ghosts when packman lost one life
*/

function initializeBoard(){
//pacman's current index in the squares matrix
var pos = (pacmanPosition.y/20)*28+pacmanPosition.x/20;
//remove pacman from the current index in squares
squares[pos].classList.remove('pac-man');
//restore the initial position of pacman
pacmanPosition = {x: 13*20, y: 17*20, prevdir:"left" ,dir: "left"};
//the corresponding index of pacman in the squares matrix
pos = (pacmanPosition.y/20)*28+pacmanPosition.x/20;
//add pacman to the current index in squares
squares[pos].classList.add('pac-man');
//restore each ghost's initial position and remove the "ghost" class attribute from
//the old index and add it to the new index
for(var i=0;i<ghosts.length;i++)
{
  var pos = (ghosts[i].currentY/20)*28+ghosts[i].currentX/20;
  squares[pos].classList.remove('ghost');
  if(ghosts[i].isFreeze)
  {
    squares[pos].classList.remove('freeze');
    ghosts[i].isFreeze=false;
  }
  if(ghosts[i].goHome)
  {
    squares[pos].classList.remove('gaze');
    ghosts[i].goHome=false;
  }
  ghosts[i].currentX=ghosts[i].startX;
  ghosts[i].currentY=ghosts[i].startY;
  pos = (ghosts[i].currentY/20)*28+ghosts[i].currentX/20;
  squares[pos].classList.add('ghost');
}
}

/**
* This is a function to change direction of the pacman's movement
* @parem {Event} e: the event to be triggered(arrow key press)
*/

document.onkeydown = function(e){
  //record the previous direction of pacman's movement in the case that the move pacman makes hit the wall
  pacmanPosition.prevdir=pacmanPosition.dir;
  lsteps=0;
  rsteps=0;
  usteps=0;
  dsteps=0;
  switch(e.keyCode) {
    //move left
    case 37:
    pacmanPosition.dir="left";
    break
    //move down
    case 40:
    pacmanPosition.dir="down";
    break
    //move right
    case 39:
    pacmanPosition.dir="right";
    break
    //move up
    case 38:
    pacmanPosition.dir="up";
    break
  }

}
/**
* This is a function to update the squares matrix, the x,y coordinate of pacman, and the score when pacman moves left
*/
function moveLeft(){
var pos = (pacmanPosition.y/20)*28+pacmanPosition.x/20;
//these two positions are on leftest of the board, going left would let the pacman come back from the right
if(pos === 224 || pos === 644){
    if(!squares[pos+27].classList.contains('ghost')){
      if(!squares[pos+27].classList.contains('wall')){
        if(squares[pos+27].classList.contains('pac-dot')){
            squares[pos+27].classList.remove('pac-dot');
            score+=10;
        }
        if(squares[pos+27].classList.contains('super-dot'))
        {
          squares[pos+27].classList.remove('super-dot');
          score+=50;
          //a function to update the status of the ghosts to freeze
          goFreeze(ghosts);
        }
        pacmanPosition.x+=540;
        squares[pos+27].classList.add('pac-man');
        squares[pos].classList.remove('pac-man');
        lsteps++;
    }
    else {
      //if lsteps==0, it means pacman can't advance at all, so it must be hitting the wall
      //so it should move in the original direction
      if(lsteps==0)
      {
        pacmanPosition.dir=pacmanPosition.prevdir;
      }
    }
  } else {
    //if it runs into a ghost
      var stop=false;
      for(i = 0; i < ghosts.length; i++)
      {
        //find the corresponding ghost pacman runs into
        if(ghosts[i].currentX==pacmanPosition.x+540 && ghosts[i].currentY==pacmanPosition.y)
        {
          if(!stop){
          if(ghosts[i].isFreeze)
          {
            if(squares[pos+27].classList.contains('pac-dot')){
                squares[pos+27].classList.remove('pac-dot');
                score+=10;
            }
            if(squares[pos+27].classList.contains('super-dot'))
            {
              squares[pos+27].classList.remove('super-dot');
              score+=50;
              goFreeze(ghosts);
            }
            squares[pos+27].classList.add('pac-man');
            squares[pos].classList.remove('pac-man');
            lsteps++;
            pacmanPosition.x+=540;
            squares[pos+27].classList.remove('ghost');
            squares[pos+27].classList.remove('freeze');
            //this is a function to send the ghost back to the base
            goHome(ghosts[i]);
            stop=true;
          }
          else if(!ghosts[i].goHome){
            //pacman runs into a unfreeze ghost, it loses one life
            var num = "heart"+lives;
            var myobj = document.getElementById(num);
            myobj.remove();
            lives--;
            //if pacman has no life, game is over
            if(lives==0)
            {
              gameover();
            }
            initializeBoard();
            drawBoard();
            stop=true;
          }
        }
       }
      }
    }
}
else {
  if(!squares[pos-1].classList.contains('ghost'))
  {
     if(!squares[pos-1].classList.contains('wall')){
      //take away the pac-dot when pacman steps on that grid//
      if(squares[pos-1].classList.contains('pac-dot'))
      {
        squares[pos-1].classList.remove('pac-dot');
        score+=10;
      }
      if(squares[pos-1].classList.contains('super-dot'))
      {
        squares[pos-1].classList.remove('super-dot');
        score+=50;
        goFreeze(ghosts);
      }
      squares[pos-1].classList.add('pac-man');
      squares[pos].classList.remove('pac-man');
      lsteps++;
      pacmanPosition.x-=20;
    }
    else{
      if(lsteps==0)
      {
        pacmanPosition.dir=pacmanPosition.prevdir;
      }
    }
  }else {
      var stop=false;
      for(var i=0;i<ghosts.length;i++)
      {
        if(!stop){
        if(ghosts[i].currentX==pacmanPosition.x-20 && ghosts[i].currentY==pacmanPosition.y)
        {
          if(ghosts[i].isFreeze)
          {
            if(squares[pos-1].classList.contains('pac-dot')){
                squares[pos-1].classList.remove('pac-dot');
                score+=10;
            }
            if(squares[pos-1].classList.contains('super-dot'))
            {
              squares[pos-1].classList.remove('super-dot');
              score+=50;
              goFreeze(ghosts);
            }
            squares[pos-1].classList.add('pac-man');
            squares[pos].classList.remove('pac-man');
            pacmanPosition.x-=20;
            squares[pos-1].classList.remove('ghost');
            squares[pos-1].classList.remove('freeze');
            goHome(ghosts[i]);
            stop=true;
          }
          else if(!ghosts[i].goHome){
            var num = "heart"+lives;
            var myobj = document.getElementById(num);
            myobj.remove();
            lives--;
            if(lives==0)
            {
              gameover();
            }
            initializeBoard();
            drawBoard();
            stop=true;
          }
        }
      }
    }
  }
}
}

function moveDown(){
var pos = (pacmanPosition.y/20)*28+pacmanPosition.x/20;
if(pos!=320 && pos!=321 && pos!=322 && pos!=323){
if(!squares[pos+width].classList.contains('ghost'))
{
  if(!squares[pos+width].classList.contains('wall')){
    if(squares[pos+width].classList.contains('pac-dot'))
    {
      squares[pos+width].classList.remove('pac-dot');
      score+=10;
    }
    if(squares[pos+width].classList.contains('super-dot'))
    {
      squares[pos+width].classList.remove('super-dot');
      score+=50;
      goFreeze(ghosts);
    }
    squares[pos+width].classList.add('pac-man');
    squares[pos].classList.remove('pac-man');
    dsteps++;
    pacmanPosition.y+=20;
  }
  else{
    if(dsteps==0)
    {
      pacmanPosition.dir=pacmanPosition.prevdir;
    }
  }
}
else {
    var stop=false;
    for(var i=0;i<ghosts.length;i++)
    {
      if(!stop){
      if(ghosts[i].currentY==pacmanPosition.y+20 && ghosts[i].currentX==pacmanPosition.x)
      {
        if(ghosts[i].isFreeze)
        {
          if(squares[pos+width].classList.contains('pac-dot')){
              squares[pos+width].classList.remove('pac-dot');
              score+=10;
          }
          if(squares[pos+width].classList.contains('super-dot'))
          {
            squares[pos+width].classList.remove('super-dot');
            score+=50;
            goFreeze(ghosts);
          }
          squares[pos+width].classList.add('pac-man');
          squares[pos].classList.remove('pac-man');
          dsteps++;
          pacmanPosition.y+=20;
          squares[pos+width].classList.remove('ghost');
          squares[pos+width].classList.remove('freeze');
          goHome(ghosts[i]);
          stop=true;
      }
      else if(!ghosts[i].goHome){
        var num = "heart"+lives;
        var myobj = document.getElementById(num);
        myobj.remove();
        lives--;
        if(lives==0)
        {
          gameover();
        }
        initializeBoard();
        drawBoard();
        stop=true;
        }
       }
      }
     }
    }
   }
  }

function moveRight(){
var pos = (pacmanPosition.y/20)*28+pacmanPosition.x/20;
if(pos === 251 || pos === 671){
    if(!squares[pos-27].classList.contains('ghost')){
      if(!squares[pos-27].classList.contains('wall')){
        if(squares[pos-27].classList.contains('pac-dot')){
            squares[pos-27].classList.remove('pac-dot');
            score+=10;
        }
        if(squares[pos-27].classList.contains('super-pac')){
            squares[pos-27].classList.remove('super-pac');
            score+=50;
            goFreeze(ghosts);
        }
        squares[pos-27].classList.add('pac-man');
        squares[pos].classList.remove('pac-man');
        rsteps++;
        pacmanPosition.x-=540;
    }
    else{
      if(rsteps==0)
      {
      pacmanPosition.dir=pacmanPosition.prevdir;
      }
    }
  }
  else {
      var stop = false;
      for(var i=0;i<ghosts.length;i++)
      {
        if(!stop){
        if(ghost[i].currentX==pacmanPosition.x-540 && ghost[i].currentY==pacmanPosition.y)
        {
          if(ghost[i].isFreeze)
          {
            if(squares[pos-27].classList.contains('pac-dot')){
                squares[pos-27].classList.remove('pac-dot');
            }
            if(squares[pos-27].classList.contains('super-dot'))
            {
              squares[pos-27].classList.remove('super-dot');
              goFreeze(ghosts);
            }
            squares[pos-27].classList.add('pac-man');
            squares[pos].classList.remove('pac-man');
            rsteps++;
            pacmanPosition.x-=540;
            squares[pos-27].classList.remove('ghost');
            squares[pos-27].classList.remove('freeze');
            goHome(ghosts[i]);
            stop=true;
          }
          else if(!ghosts[i].goHome){
            var num = "heart"+lives;
            var myobj = document.getElementById(num);
            myobj.remove();
            lives--;
            if(lives==0)
            {
              gameover();
            }
            initializeBoard();
            drawBoard();
            stop=true;
          }
        }
      }
     }
    }
  }
else {
  if(!squares[pos+1].classList.contains('ghost'))
  {
      if(!squares[pos+1].classList.contains('wall')){
      if(squares[pos+1].classList.contains('pac-dot'))
      {
        squares[pos+1].classList.remove('pac-dot');
        score+=10;
      }
      if(squares[pos+1].classList.contains('super-dot'))
      {
        squares[pos+1].classList.remove('super-dot');
        score+=50;
        goFreeze(ghosts);
      }
      squares[pos+1].classList.add('pac-man');
      squares[pos].classList.remove('pac-man');
      rsteps++;
      pacmanPosition.x+=20;
    }else {
      if(rsteps==0)
      {
        pacmanPosition.dir=pacmanPosition.prevdir;
      }
    }
  }
  else {
    var stop = false;
    for(var i=0;i<ghosts.length;i++)
    {
      if(!stop){
      if(ghosts[i].currentX==pacmanPosition.x+20 && ghosts[i].currentY==pacmanPosition.y)
      {
        if(ghosts[i].isFreeze)
        {
          if(squares[pos+1].classList.contains('pac-dot')){
              squares[pos+1].classList.remove('pac-dot');
          }
          if(squares[pos+1].classList.contains('super-dot'))
          {
            squares[pos+1].classList.remove('super-dot');
            goFreeze(ghosts);
          }
          squares[pos+1].classList.add('pac-man');
          squares[pos].classList.remove('pac-man');
          rsteps++;
          pacmanPosition.x+=20;
          squares[pos+1].classList.remove('ghost');
          squares[pos+1].classList.remove('freeze');
          goHome(ghosts[i]);
          stop=true;
        }
        else if(!ghosts[i].goHome){
          var num = "heart"+lives;
          var myobj = document.getElementById(num);
          myobj.remove();
          lives--;
          if(lives==0)
          {
            gameover();
          }
          initializeBoard();
          drawBoard();
          stop=true;
        }
      }
    }
   }
  }
}
}

function moveUp(){
var pos = (pacmanPosition.y/20)*28+pacmanPosition.x/20;
if(!squares[pos-width].classList.contains('ghost'))
{
  if(!squares[pos-width].classList.contains('wall')){
    if(squares[pos-width].classList.contains('pac-dot'))
    {
      squares[pos-width].classList.remove('pac-dot');
      score+=10;
    }
    if(squares[pos-width].classList.contains('super-dot'))
    {
      squares[pos-width].classList.remove('super-dot');
      score+=50;
      goFreeze(ghosts);
    }
    squares[pos-width].classList.add('pac-man');
    squares[pos].classList.remove('pac-man');
    usteps++;
    pacmanPosition.y-=20;
  }else {
   if(usteps==0)
   {
     pacmanPosition.dir=pacmanPosition.prevdir;
   }
  }
}
else {
  var stop = false;
  for(var i=0;i<ghosts.length;i++)
  {
    if(!stop){
    if(ghosts[i].currentY==pacmanPosition.y-20 && ghosts[i].currentX==pacmanPosition.x)
    {
      if(ghosts[i].isFreeze)
      {
        if(squares[pos-width].classList.contains('pac-dot')){
            squares[pos-width].classList.remove('pac-dot');
        }
        if(squares[pos-width].classList.contains('super-dot'))
        {
          squares[pos-width].classList.remove('super-dot');
          goFreeze(ghosts);
        }
        squares[pos-width].classList.add('pac-man');
        squares[pos].classList.remove('pac-man');
        usteps++;
        pacmanPosition.y-=20;
        squares[pos-width].classList.remove('ghost');
        squares[pos-width].classList.remove('freeze');
        goHome(ghosts[i]);
        stop=true;
      }
      else if(!ghosts[i].goHome){
        var num = "heart"+lives;
        var myobj = document.getElementById(num);
        myobj.remove();
        lives--;
        if(lives==0)
        {
          gameover();
        }
        initializeBoard();
        drawBoard();
        stop=true;
      }
     }
    }
  }
}
}
/**
* This is a function to handle the situation when the game ends
*/
function gameover()
{
  //we use local storage to keep track of current score and the highest score
  var highscore = window.localStorage.getItem("highscore");
  if(highscore !== null){
    if (score > highscore) {
        window.localStorage.setItem("highscore", score);
    }
  }
  else{
      window.localStorage.setItem("highscore", score);
  }

  window.localStorage.setItem("score", score);
  //redirect to the gameover page
  window.location = "gameover.html";
}

/**
* This is a function to trigger pacman's movement
*/

function pacmanMove()
{
    setInterval(function()
    {
      if(pacmanPosition.dir=="left")
      {
        moveLeft();
      }
      if(pacmanPosition.dir=="right")
      {
        moveRight();
      }
      if(pacmanPosition.dir=="up")
      {
        moveUp();
      }
      if(pacmanPosition.dir=="down")
      {
        moveDown();
      }
      drawBoard();
    },250);
}

/**
* This is a function to update the indices of squares matrix related the ghosts
* @parem {Ghost[]} ghosts: the array of all the ghosts
*
*/

function goFreeze(ghosts){

  for(var i=0;i<ghosts.length;i++)
  {
    //update each ghost's isFreeze attribute and add the 'freeze' class attribute to the div the ghost is on
    var pos = (ghosts[i].currentY/20)*28+ghosts[i].currentX/20;
    ghosts[i].isFreeze=true;
    squares[pos].classList.add('freeze');
  }
  //after 7 seconds, set the attributes back to the original
  setTimeout(function(){ for(var i=0;i<ghosts.length;i++)
  {
    var pos = (ghosts[i].currentY/20)*28+ghosts[i].currentX/20;
    ghosts[i].isFreeze=false;
    squares[pos].classList.remove('freeze');
  } }, 7000);
}

ghosts.forEach(ghost => moveGhost(ghost))

/**
* This is a function to find out a short path for a ghost to go
* back to its base with the help of the findPath function
* @parem {Ghost} ghost: the ghost needed to go back to the base
*
*/

function goHome(ghost)
{
  ghost.goHome=true;
  //the ghost is no longer freeze after it is eaten by pacman
  ghost.isFreeze=false;
  //the position it is eaten
  var start = (ghost.currentY/20)*28+ghost.currentX/20;
  //its original position when the game starts
  var destination = (ghost.startY/20)*28+ghost.startX/20;
  var res=Array();
  res.push(destination);
  //findPath would return the parent node of the path from start and destination exclusing the destination node
  var parents=findPath(start,destination);
  //when the parent of a node is -1, it reaches the start node
  while(parents[destination]!=-1)
  {
      res.push(parents[destination]);
      destination=parents[destination];
  }
  res.push(start);
  //we need to reverse the array, so it starts at the the position it is eaten
  res.reverse();
  var i=1;
  //advance the ghost from destination to start every 1s
  var fun = setInterval(function() {
    if(!ghost.goHome)
    {
      squares[res[i-1]].classList.remove('gaze');
      clearInterval(fun);
    }else{
      var pos = (ghost.startY/20)*28+ghost.startX/20;
      if(i<res.length)
      {
        var y =  parseInt(res[i] / 28) * 20;
        var x =  parseInt(res[i] % 28) * 20;
        if(i!=1)
        {
          squares[res[i-1]].classList.remove('gaze');
          squares[res[i-1]].classList.remove('ghost');
        }
        squares[res[i]].classList.add('gaze');
        squares[res[i]].classList.add('ghost');
        if(i==res.length-1)
        {
          ghost.goHome = false;
          squares[res[i]].classList.remove('gaze');
        }
        ghost.currentY=y;
        ghost.currentX=x;
        drawBoard();i++;
      }
  }
  },100);
}

/**
* This is a function to find out the parent node of each node on the current shortest
* path from the start node to itself using Dijkstra's algorithm, since we
* have too many nodes, the function returns as soon as we add the target node to the
* set of added node, so it only gives an optimized path but not the most optimized path
*
* @parem {Ghost} ghost: the ghost needed to go back to the base
* @returns {int[]} parents: the array stores the parent node of each node on the current shortest
* path from the start node to the itself
*/

function findPath(start,destination)
{
  //make a 2d-matrix of length of all the pixels
  var adj=Array(28*31);
  for(var i=0;i<28*31;i++)
  {
    adj[i]=Array(28*31);
  }
  //set up the adjacency matrix such that for each non-wall pixel i, adj[i][j]=1 if
  //j is also non-wall and it's adjacent to i
  for (var i = 0; i < 28*31; i++) {
    for (var j = 0; j < 28*31; j++) {
        if(j==i+1 || j==i-1 || j==i-28 || j==i+28)
        {
          if(!squares[i].classList.contains('wall')&&!squares[j].classList.contains('wall'))
          {
            adj[i][j]=1;
          }
          else {
            adj[i][j]=0;
          }
        }
        else {
          adj[i][j]=0;
        }
    }
  }
  var nVertices = 28*31;
  //this array records the current shortest distance from the start node and each node
  var shortestDistances = Array(nVertices);
  //sets of vertices being added to the constructed graph s.t for each node in the graph
  //the distance from the start node to itself is the shortest
  var added = Array(nVertices);
  //initialize all the distances to be infinite
  for (var vertexIndex = 0; vertexIndex < nVertices; vertexIndex++) {
    shortestDistances[vertexIndex] = Number.MAX_VALUE;
    added[vertexIndex] = false;
  }
  //the distance from itself is 0
  shortestDistances[start] = 0;
  var parents = Array(nVertices);
  //there is no parent node for the start node
  parents[start] = -1;

  for (var i = 1; i < nVertices; i++) {
      var nearestVertex = -1;
      var shortestDistance = Number.MAX_VALUE;
      //find a node from all the nodes in the constructed graph with the smallest distance from
      //start node to itself to advance
      for (var vertexIndex = 0; vertexIndex < nVertices; vertexIndex++) {
          if (!added[vertexIndex] && shortestDistances[vertexIndex] < shortestDistance)
          {
              nearestVertex = vertexIndex;
              shortestDistance = shortestDistances[vertexIndex];
          }
      }
      //add that node to the set of added nodes
      added[nearestVertex] = true;

      for (var vertexIndex = 0; vertexIndex < nVertices; vertexIndex++)  {

          var edgeDistance = adj[nearestVertex][vertexIndex];
           //if the neighbor node has shorter distance from the start node to itself by going through the nearestVertex
          if (edgeDistance > 0 && ((shortestDistance + edgeDistance) < shortestDistances[vertexIndex])) {
              parents[vertexIndex] = nearestVertex;
              shortestDistances[vertexIndex] = shortestDistance + edgeDistance;
              //if we find the target, we return
              if(vertexIndex==destination)
              {
                  return parents;
              }
          }
      }
    }
}

/**
* This is a function to trigger the ghost to move and update the corresponding entry in squares
* and x,y coordinate of the ghost
*
* @parem {Ghost} ghost: the ghost needed to move
*
*/

function moveGhost(ghost) {

  const directions =  [-1, +1, width, -width]
   //generate a random direction//
  var direction = directions[Math.floor(Math.random() * directions.length)];

  setInterval(function() {
    var pos = (ghost.currentY/20)*28+ghost.currentX/20;
    if(!ghost.goHome)
    {
      if(squares[pos + direction].classList.contains('pac-man')){
        if(!ghost.isFreeze)
        {
          //it can eat the pacman and pacman loses one life
          var num = "heart"+lives;
          var myobj = document.getElementById(num);
          myobj.remove();
          lives--;
          initializeBoard();
          drawBoard();
          if(lives==0)
          {
            gameover();
          }
        }else {
          //if it is going to hit pacman, generate another direction
          direction = directions[Math.floor(Math.random() * directions.length)];
        }
      }else
      {
        if (!squares[pos + direction].classList.contains('ghost') &&
        !squares[pos + direction].classList.contains('wall') ) {
          squares[pos + direction].classList.add('ghost');
          if(ghost.isFreeze)
          {
            squares[pos+direction].classList.add('freeze');
            squares[pos].classList.remove('freeze');
          }
          squares[pos].classList.remove('ghost');
          if(direction == 1)
          {
            ghost.currentX+=20;
            ghost.dir="right";

          }else if(direction == -1)
          {
            ghost.currentX-=20;
            ghost.dir="left";

          }else if(direction == width)
          {
            ghost.currentY+=20;
            ghost.dir="down";

          }else
          {
            ghost.currentY-=20;
            ghost.dir="up";
          }
          drawBoard();
      }else{
        //generate another direction if ghost would run into another ghost or wall//
            direction = directions[Math.floor(Math.random() * directions.length)];
          }
        }
      }
  }, 300);
}
