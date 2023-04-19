const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];

document
  .querySelector("#submit-xml-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const fileInput = document.getElementById("file-inp");
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (event) {
      const xmlString = event.target.result;

      document.getElementById("result").innerText = readDoc(xmlString);

      
    };

    reader.readAsText(file);
  });

function readDoc(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const piecesXML = xmlDoc.getElementsByTagName("p")
  const pieces = []

  for (let g = 0; g < piecesXML.length; g++) {
    el = piecesXML[g]
    let color = 0

    if (el.getAttribute("color") === "black") {
      color = 1
    }

    const pos = el.getAttribute("pos")


    const i =  8 - parseInt(el.getAttribute("pos")[1]) 
    const j =  LETTERS.indexOf(pos[0]) 

    pieces.push({type: el.innerHTML, player:color, i,j })
    
  }

  console.log(pieces)


  const width = parseInt(xmlDoc.getElementsByTagName("w")[0].innerHTML)
  const height = parseInt(xmlDoc.getElementsByTagName("h")[0].innerHTML)

  console.log(width, height)

  const board = []
  let boardPart = [];

  for (let j = 0; j < width; j++) {
    boardPart.push(null)
  }

  for (let i = 0; i < height; i++) {
    board.push(boardPart)
  }

  pieces.forEach(el => {
    board[el.i][el.j] = {type:el.type, player:el.player}
  })

  console.log(board)

  

  return board;
}



function downloadDoc(xmlString) {
  const xmlBlob = new Blob([xmlString], { type: "text/xml" });
  const url = URL.createObjectURL(xmlBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "board.xml";
  document.body.appendChild(link);

  link.click();
}

function createDoc(b) {
  const board = b.board;

  const xmlDoc = document.implementation.createDocument(null, "board", null);

  const root = xmlDoc.documentElement;
  //xmlDoc.appendChild(root); 

  const widthObj = xmlDoc.createElement("w");
  widthObj.textContent = b.width
  root.appendChild(widthObj)

  const heightObj = xmlDoc.createElement("h");
  heightObj.textContent = b.height
  root.appendChild(heightObj)

  const moveObj = xmlDoc.createElement("move"); //I didn't find it in ChessModel
  moveObj.textContent = "white"
  root.appendChild(moveObj);

 

  const moveCountObj = xmlDoc.createElement("moveCount"); // this isn't in ChessModel, but we can add
   moveCountObj.textContent = "8"
  root.appendChild(moveCountObj);

  const pieces = xmlDoc.createElement("pieces"); //I didn't find it in ChessModel
  pieces.textContent = " "
  root.appendChild(pieces);

  
  for (let i = 0; i < board.length; i++) {
    const coordNum = 8 - i;
    

    for (let j = 0; j < board[i].length; j++) {
      const el = board[i][j];

      if (el === null) {
        continue; 
      }

      const coords = LETTERS[j] + coordNum;


      const pieceObj = xmlDoc.createElement("p");
      pieceObj.setAttribute("pos", coords);
     
      pieceObj.textContent = el.type;

      if (el.player === 1) {
        pieceObj.setAttribute("color", "black");
      } else {
        pieceObj.setAttribute("color", "white");
      }

      pieces.appendChild(pieceObj);
    }
  }

  

  const xmlString = new XMLSerializer().serializeToString(xmlDoc);
  


  downloadDoc(xmlString);
}
