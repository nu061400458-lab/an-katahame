/*
=====================================
  かたちはめゲーム

  script.js

  機能
  ・SVG図形生成
  ・ドラッグ操作
  ・型はめ判定
  ・完成状態表示
  ・効果音

=====================================
*/


/*
=====================================
  効果音

  soundsフォルダ
  ├ correct.mp3
  └ wrong.mp3

=====================================
*/


const correctSound =
  new Audio(
    "sounds/correct.mp3"
  );


const wrongSound =
  new Audio(
    "sounds/wrong.mp3"
  );







/*
=====================================
  図形データ
=====================================
*/


const shapes = [

  {
    id: "circle",
    color: "#74c0fc",
    name: "まる"
  },


  {
    id: "triangle",
    color: "#ffd43b",
    name: "さんかく"
  },


  {
    id: "square",
    color: "#ff8787",
    name: "しかく"
  }

];







/*
=====================================
  HTML取得
=====================================
*/


const targetArea =
  document.getElementById(
    "targetArea"
  );


const pieceArea =
  document.getElementById(
    "pieceArea"
  );


const message =
  document.getElementById(
    "message"
  );


const resetButton =
  document.getElementById(
    "resetButton"
  );







/*
=====================================
  状態管理
=====================================
*/


let selectedPiece = null;



let offset = {

  x:0,

  y:0

};



let completeCount = 0;







/*
=====================================
  ゲーム開始
=====================================
*/


function startGame(){


  targetArea.innerHTML = "";


  pieceArea.innerHTML = "";



  message.textContent = "";



  selectedPiece = null;



  completeCount = 0;



  createTargets();


  createPieces();


}







/*
=====================================
  型枠作成
=====================================
*/


function createTargets(){


  shapes.forEach(shape=>{


    const target =
      document.createElement(
        "div"
      );


    target.classList.add(
      "target"
    );


    target.dataset.type =
      shape.id;



    const svg =
      createShapeSVG(
        shape,
        true
      );



    target.appendChild(
      svg
    );



    targetArea.appendChild(
      target
    );


  });


}







/*
=====================================
  ピース作成
=====================================
*/


function createPieces(){


  const shuffledShapes =
    [...shapes]
      .sort(
        ()=>Math.random()-0.5
      );



  shuffledShapes.forEach(shape=>{


    const piece =
      createShapeSVG(
        shape,
        false
      );



    piece.dataset.type =
      shape.id;



    piece.classList.add(
      "piece"
    );



    addDragEvents(
      piece
    );



    pieceArea.appendChild(
      piece
    );


  });


}







/*
=====================================
  SVG図形生成
=====================================
*/


function createShapeSVG(
  shape,
  isTarget
){


  const svg =
    document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );



  svg.setAttribute(
    "viewBox",
    "0 0 100 100"
  );



  svg.classList.add(
    "shape-svg"
  );



  let element;



  if(shape.id==="circle"){


    element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );


    element.setAttribute(
      "cx",
      "50"
    );


    element.setAttribute(
      "cy",
      "50"
    );


    element.setAttribute(
      "r",
      "40"
    );


  }



  if(shape.id==="square"){


    element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );


    element.setAttribute(
      "x",
      "10"
    );


    element.setAttribute(
      "y",
      "10"
    );


    element.setAttribute(
      "width",
      "80"
    );


    element.setAttribute(
      "height",
      "80"
    );


    element.setAttribute(
      "rx",
      "10"
    );


  }



  if(shape.id==="triangle"){


    element =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );


    element.setAttribute(
      "points",
      "50,10 90,85 10,85"
    );


  }





  if(isTarget){


    element.setAttribute(
      "fill",
      "transparent"
    );


    element.setAttribute(
      "stroke",
      shape.color
    );


    element.setAttribute(
      "stroke-width",
      "8"
    );


  }
  else{


    element.setAttribute(
      "fill",
      shape.color
    );


  }



  svg.appendChild(
    element
  );


  return svg;


}

/*
=====================================
  ドラッグイベント設定
=====================================
*/


function addDragEvents(piece){


  piece.addEventListener(
    "pointerdown",
    startDrag
  );


  piece.addEventListener(
    "pointermove",
    moveDrag
  );


  piece.addEventListener(
    "pointerup",
    endDrag
  );


}








/*
=====================================
  ドラッグ開始

  元位置を保持してから
  fixed配置へ変更

  ※中央へ飛ばない対策

=====================================
*/


function startDrag(event){


  selectedPiece =
    event.currentTarget;



  const rect =
    selectedPiece.getBoundingClientRect();




  /*
    指で押した位置との差
  */

  offset.x =
    event.clientX -
    rect.left;


  offset.y =
    event.clientY -
    rect.top;




  /*
    元位置を保存
  */

  selectedPiece.style.width =
    rect.width + "px";


  selectedPiece.style.height =
    rect.height + "px";



  selectedPiece.style.position =
    "fixed";



  selectedPiece.style.left =
    rect.left + "px";


  selectedPiece.style.top =
    rect.top + "px";



  selectedPiece.classList.add(
    "dragging"
  );



  selectedPiece.setPointerCapture(
    event.pointerId
  );


}









/*
=====================================
  ドラッグ移動
=====================================
*/


function moveDrag(event){


  if(!selectedPiece){

    return;

  }



  selectedPiece.style.left =
    event.clientX -
    offset.x +
    "px";



  selectedPiece.style.top =
    event.clientY -
    offset.y +
    "px";


}









/*
=====================================
  ドラッグ終了
=====================================
*/


function endDrag(){


  if(!selectedPiece){

    return;

  }



  selectedPiece.classList.remove(
    "dragging"
  );



  const pieceRect =
    selectedPiece
      .getBoundingClientRect();



  const centerX =
    pieceRect.left +
    pieceRect.width / 2;



  const centerY =
    pieceRect.top +
    pieceRect.height / 2;





  const targets =
    document.querySelectorAll(
      ".target"
    );



  let success = false;





  targets.forEach(target=>{


    const rect =
      target.getBoundingClientRect();




    /*
      図形の中心が
      枠内に入っているか判定

    */


    if(

      centerX > rect.left &&

      centerX < rect.right &&

      centerY > rect.top &&

      centerY < rect.bottom &&


      selectedPiece.dataset.type
      ===
      target.dataset.type

    ){


      placePiece(
        selectedPiece,
        target
      );


      success = true;


    }


  });







  /*
    不正解

  */

  if(!success){


    wrongSound.currentTime = 0;


    wrongSound.play();



    selectedPiece.style.position =
      "";


    selectedPiece.style.left =
      "";


    selectedPiece.style.top =
      "";


    selectedPiece.style.width =
      "";


    selectedPiece.style.height =
      "";


  }



  selectedPiece = null;


}









/*
=====================================
  正解処理

=====================================
*/


function placePiece(
  piece,
  target
){



  /*
    正解音

  */


  correctSound.currentTime = 0;


  correctSound.play();






  /*
    ピース色取得

  */


  const pieceShape =
    piece.querySelector(
      "circle, rect, polygon"
    );



  const color =
    pieceShape.getAttribute(
      "fill"
    );







  /*
    枠を着色

  */


  const targetShape =
    target.querySelector(
      "circle, rect, polygon"
    );



  targetShape.setAttribute(
    "fill",
    color
  );



  targetShape.setAttribute(
    "stroke",
    "none"
  );








  /*
    元ピース削除

  */


  piece.remove();







  /*
    完成演出

  */


  target.classList.add(
    "placed"
  );



  completeCount++;






  /*
    メッセージ

  */


  message.textContent =
    "せいかい！🎉";






  /*
    全問終了

  */


  if(
    completeCount === shapes.length
  ){


    message.textContent =
      "ぜんぶできた！🎉";


  }



}









/*
=====================================
  リセット
=====================================
*/


resetButton.addEventListener(
  "click",
  startGame
);







/*
=====================================
  ゲーム開始
=====================================
*/


startGame();