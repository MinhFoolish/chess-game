const cellItems = document.querySelectorAll('.cell');

/* Mục tham chiếu giá trị màu. */
const whiteBackground = '#FFF2D8';
const blackBackground = '#186F65';


/* Chèn ảnh tự động vào bàn cờ. */
function autoInsertPieces() {
  document.querySelectorAll('.cell').forEach(item => {
    const content = item.innerText;
    if (content != "") {
      // Nếu nội dung bên trong ô cờ đó không rỗng thì ta lấy nội dung của ô cờ này.
      let color = content.charAt(0);  // Lấy được màu quân cờ.
      const pieceName = content.substring(1); // Lấy được tên quân cờ.
      if (color === 'B')
        color = 'black';
      else if (color === 'W')
        color = 'white';
      const sourceImage = `./images/${color}-${pieceName}.svg`; // Đường dẫn tới ảnh.

      if (pieceName === "pawn") {
        item.innerHTML = `
          ${item.innerText} <img class="all-img pawn" src="${sourceImage}">
        `
      } else {
        item.innerHTML = `
          ${item.innerText} <img class="all-img" src="${sourceImage}">
        `;
      }
    }
  })
}

function autoColoring() {
  document.querySelectorAll('.cell').forEach(item => {
    if (handleValueCell(item)) { // Nếu là tổng chẵn thì là màu nền đen.
      item.style.backgroundColor = `${blackBackground}`;
    } else {
      item.style.backgroundColor = `${whiteBackground}`;
    }
  })
}

function handleValueCell(item) {
  const content = item.id;
  const sum = Number.parseInt(content.charAt(1)) + Number.parseInt(content.charAt(3));
  if (sum % 2 == 0)  // nếu là tổng chẵn thì trả về true.
    return true;
  return false; // Là tổng lẽ thì trả về false.
  // Giá trị true hay false này không có ý nghĩa gì nhiều, chỉ là giá trị giúp xác định màu nền cho vị trí đó.
}

autoColoring();
autoInsertPieces();

/* Tạo biến lưu lượt chơi của mỗi bên. Giả sử bên trắng đánh trước thì khi đó nếu turn lẻ thì bên trắng được quyền đánh. */
function generateID(sum, deltaRow, deltaCol) {  // DeltaRow, DeltaCol là độ chênh lệch dòng, cột hiện tại.
  return `c${sum + deltaRow + deltaCol}`;
}

function removeBeforeSelectedItemsAndSetSelectedForCurrent(element) {
  document.querySelectorAll('.selected').forEach(item => {
    if(item.classList.contains('selected'))
      item.classList.remove('selected');
  })
  element.classList.add('selected');
}

function genereatePathForPawn(pawn, turn, indexRow, indexCol, sum) {
  if (pawn.innerText.includes('Wpawn') && turn % 2 != 0) {
    // Nếu là quân tốt trắng.
    /* Nếu quân cờ mình chọn là quân trắng và lượt lúc đó cũng là lượt của quân trắng thì thực hiện tìm đường. */
    removeBeforeSelectedItemsAndSetSelectedForCurrent(pawn);
    if (indexRow == 200 && document.getElementById(generateID(sum, 100, 0)).innerText.length == 0) {
      document.getElementById(generateID(sum, 100, 0)).classList.add('path');
      if (document.getElementById(generateID(sum, 200, 0)).innerText.length == 0) {
        document.getElementById(generateID(sum, 200, 0)).classList.add('path');
      }
    }
    if (indexRow != 200 && document.getElementById(generateID(sum, 100, 0)).innerText.length == 0) {
      document.getElementById(generateID(sum, 100, 0)).classList.add('path');
    }
    if (indexCol < 8 && indexRow < 800 && document.getElementById(generateID(sum, 100, 1)).innerText.includes('B')) {
      document.getElementById(generateID(sum, 100, 1)).classList.add('path');
    }
    if (indexCol > 1 && indexRow < 800 && document.getElementById(generateID(sum, 100, -1)).innerText.includes('B')) {
      document.getElementById(generateID(sum, 100, -1)).classList.add('path');
    }
  } else if (pawn.innerText.includes('Bpawn') && turn % 2 == 0) {
    /* Xét trường hợp là quân tốt đen. */
    removeBeforeSelectedItemsAndSetSelectedForCurrent(pawn);
    if (indexRow == 700 && document.getElementById(generateID(sum, -100, 0)).innerText.length == 0) {
      document.getElementById(generateID(sum, -100, 0)).classList.add('path');
      if (document.getElementById(generateID(sum, -200, 0)).innerText.length == 0) {
        document.getElementById(generateID(sum, -200, 0)).classList.add('path');
      }
    }
    if (indexRow != 700 && document.getElementById(generateID(sum, -100, 0)).innerText.length == 0) {
      document.getElementById(generateID(sum, -100, 0)).classList.add('path');
    }
    if (indexCol < 8 && indexRow > 100 && document.getElementById(generateID(sum, -100, 1)).innerText.includes('W')) {
      document.getElementById(generateID(sum, -100, 1)).classList.add('path');
    }
    if (indexCol > 1 && indexRow > 100 && document.getElementById(generateID(sum, -100, -1)).innerText.includes('W')) {
      document.getElementById(generateID(sum, -100, -1)).classList.add('path');
    }
  }
}

/* Hàm tìm đường đi cho King. */
function generatePathForKing(king, turn, indexRow, indexCol, sum) {
  const row = indexRow / 100;
  const col = indexCol;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      /* Ta xác định từ vị trí một trong khu vực có thể di chuyển của quân vua, nếu vị trí nào trống ta có thể đi vào
      vị trí đó và ngược lại. */
      let id = `c${i * 100 + j}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (id != king.id) {
          if (king.innerText.includes('Wking') && turn % 2 != 0) {
            removeBeforeSelectedItemsAndSetSelectedForCurrent(king);
            /* Xét trường hợp là vua trắng. */
            if (document.getElementById(`${id}`).innerHTML == '' || document.getElementById(`${id}`).innerHTML.includes('B')) {
              /* Nếu vị trí tại đó trống thì hiện màu nền có thể di chuyển cho vua */
              document.getElementById(`${id}`).classList.add('path');
            }
          } else if (king.innerText.includes('Bking') && turn % 2 == 0) {
            removeBeforeSelectedItemsAndSetSelectedForCurrent(king);
            if (document.getElementById(`${id}`).innerHTML == '' || document.getElementById(`${id}`).innerHTML.includes('W')) {
              /* Nếu vị trí tại đó trống thì hiện màu nền có thể di chuyển cho vua */
              document.getElementById(`${id}`).classList.add('path');
            }
          }
        }
      }
    }
  }
}

/* Hàm tìm đường đi cho queen. */
function generatePathForQueen(queen, turn, indexRow, indexCol, sum) {
  /* Vì queen có thể đi theo đường chéo và theo hướng dọc và ngang nên ta chia nhỏ theo từng trường hợp này. */
  const row = indexRow / 100; // Chỉ số  theo dòng.
  const col = indexCol; // Chỉ số theo cột.
  /* Xét theo cột hiện tại. */
  if (queen.innerText.includes('W') && turn % 2 != 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(queen);
    // Xét trường hợp là hậu trắng.
    /* Xét theo cột hiện tại. */
    console.log(row + "->" + sum);
    for (let i = row + 1; i <= 8; i++) {
      const id = `c${i * 100 + col}`;
      console.log(id);
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W'))
          break;
      }
    }
    for (let i = row - 1; i >= 1; i--) {
      const id = `c${i * 100 + col}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W'))
          break;
      }
    }

    /* Xét theo hàng hiện tại. */
    for (let i = col - 1; i >= 1; i--) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W')) {
          break;
        }
      }
    }
    for (let i = col + 1; i <= 8; i++) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W')) {
          break;
        }
      }
    }
    /* Xét theo đường chéo chính (từ trái sang phải). Đặc điểm của đường chéo này là tổng luôn bằng (row + col) và 
    chỉ số dòng và cột luôn trong đoạn [1,8]. */
    let value = col + row;
    for (let i = row + 1; i <= 8; i++) { // Vòng lặp for để xét các điểm ở nhánh trên.
      let cont = true;
      for (let j = col - 1; j >= 1; j--) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              element.classList.add('path');
            } else if (element.innerText.includes('B')) {
              element.classList.add('path');
              cont = false;
              break;
            } else if (element.innerText.includes('W')) {
              cont = false;
              break;
            }
          }
        }
      }
      if (!cont) break;
    }
    for (let i = row - 1; i >= 1; i--) { //Vòng lặp for để xét nhánh dưới đường chéo chính.
      let cont = true;
      for (let j = col + 1; j <= 8; j++) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              element.classList.add('path');
            } else if (element.innerHTML.includes('B')) {
              element.classList.add('path');
              cont = false;
              break;
            } else if (element.innerHTML.includes('W')) {
              cont = false;
              break;
            }
          }
        }
      }
      if (!cont) break;
    }
    /* Xét theo đường chéo phụ (từ phải sang trái). Đặc điểm của đường chéo này là nếu thuộc nhánh trên của đường chéo thì chỉ mục dòng và chỉ mục cột sẽ tăng một đơn vị, các ô phía chéo trên có độ chênh lệch là 1 đơn vị với các ô phía chéo dưới gần nhất. */
    // Xét nhánh chéo trên của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    const delta = row - col;
    for (let i = row + 1; i <= 8; i++) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('B')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('W')) {
          break;
        }
      }
    }
    // Xét nhánh chéo dưới của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    for (let i = row - 1; i >= 1; i--) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('B')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('W')) {
          break;
        }
      }
    }
  } else if (queen.innerText.includes('Bqueen') && turn % 2 == 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(queen);
    // Xét trường hợp là hậu đen.
    /* Xét theo cột hiện tại. */
    for (let i = row + 1; i <= 8; i++) {
      const id = `c${i * 100 + col}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B'))
          break;
      }
    }
    for (let i = row - 1; i >= 1; i--) {
      const id = `c${i * 100 + col}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B'))
          break;
      }
    }

    /* Xét theo hàng hiện tại. */
    for (let i = col - 1; i >= 1; i--) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B')) {
          break;
        }
      }
    }
    for (let i = col + 1; i <= 8; i++) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B')) {
          break;
        }
      }
    }
    /* Xét theo đường chéo chính (từ trái sang phải). Đặc điểm của đường chéo này là tổng luôn bằng (row + col) và 
    chỉ số dòng và cột luôn trong đoạn [1,8]. */
    let value = col + row;
    for (let i = row + 1; i <= 8; i++) { // Vòng lặp for để xét các điểm ở nhánh trên.
      let cont = true;
      for (let j = col - 1; j >= 1; j--) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              element.classList.add('path');
            } else if (element.innerText.includes('W')) {
              element.classList.add('path');
              cont = false;
              break;
            } else if (element.innerText.includes('B')) {
              cont = false;
              break;
            }
          }
        }
      }
      if (!cont) break;
    }
    for (let i = row - 1; i >= 1; i--) { //Vòng lặp for để xét nhánh dưới đường chéo chính.
      let cont = true;
      for (let j = col + 1; j <= 8; j++) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              element.classList.add('path');
            } else if (element.innerHTML.includes('W')) {
              element.classList.add('path');
              cont = false;
              break;
            } else if (element.innerHTML.includes('B')) {
              cont = false;
              break;
            }
          }
        }
      }
      if (!cont) break;
    }
    /* Xét theo đường chéo phụ (từ phải sang trái). Đặc điểm của đường chéo này là nếu thuộc nhánh trên của đường chéo thì chỉ mục dòng và chỉ mục cột sẽ tăng một đơn vị, các ô phía chéo trên có độ chênh lệch là 1 đơn vị với các ô phía chéo dưới gần nhất. */
    // Xét nhánh chéo trên của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    const delta = row - col;
    for (let i = row + 1; i <= 8; i++) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('W')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('B')) {
          break;
        }
      }
    }
    // Xét nhánh chéo dưới của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    for (let i = row - 1; i >= 1; i--) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('W')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('B')) {
          break;
        }
      }
    }
  }
}

/* Hàm tìm đường đi cho Tượng. */
function generatePathForBishop(bishop, turn, indexRow, indexCol, sum) {
  /* Trường hợp 1: Tượng trắng. */
  if (bishop.innerText.includes('Wbishop') && turn % 2 != 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(bishop);
    /* Xét đường chéo chính cho tượng. */
    /* Xét theo đường chéo chính (từ trái sang phải). Đặc điểm của đường chéo này là tổng luôn bằng (row + col) và 
      chỉ số dòng và cột luôn trong đoạn [1,8]. */
    let col = indexCol;
    let row = indexRow / 100;
    let value = col + row;
    for (let i = row + 1; i <= 8; i++) { // Vòng lặp for để xét các điểm ở nhánh trên.
      let cont = true;
      for (let j = col - 1; j >= 1; j--) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              element.classList.add('path');
            } else if (element.innerText.includes('B')) {
              element.classList.add('path');
              cont = false;
              break;
            } else if (element.innerText.includes('W')) {
              cont = false;
              break;
            }
          }
        }
      }
      if (!cont) break;
    }
    for (let i = row - 1; i >= 1; i--) { //Vòng lặp for để xét nhánh dưới đường chéo chính.
      let cont = true;
      for (let j = col + 1; j <= 8; j++) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              document.getElementById(id).classList.add('path');
            } else if (element.innerText.includes('B')) {
              document.getElementById(id).classList.add('path');
              cont = false;
              break;
            } else if (element.innerText.includes('W')) {
              break;
              cont = false;
            }
          }
        }
      }
      if (!cont) break;
    }

    /* Xét theo đường chéo phụ (từ phải sang trái). Đặc điểm của đường chéo này là nếu thuộc nhánh trên của đường chéo thì chỉ mục dòng và chỉ mục cột sẽ tăng một đơn vị, các ô phía chéo trên có độ chênh lệch là 1 đơn vị với các ô phía chéo dưới gần nhất. */
    // Xét nhánh chéo trên của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    const delta = row - col;
    for (let i = row + 1; i <= 8; i++) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('B')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('W')) {
          break;
        }
      }
    }
    // Xét nhánh chéo dưới của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    for (let i = row - 1; i >= 1; i--) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('B')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('W')) {
          break;
        }
      }
    }
  } else if (bishop.innerText.includes('Bbishop') && turn % 2 == 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(bishop);
    /* Xét đường chéo chính cho tượng. */
    /* Xét theo đường chéo chính (từ trái sang phải). Đặc điểm của đường chéo này là tổng luôn bằng (row + col) và 
      chỉ số dòng và cột luôn trong đoạn [1,8]. */
    let col = indexCol;
    let row = indexRow / 100;
    let value = col + row;
    for (let i = row + 1; i <= 8; i++) { // Vòng lặp for để xét các điểm ở nhánh trên.
      let cont = true;
      for (let j = col - 1; j >= 1; j--) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              element.classList.add('path');
            } else if (element.innerText.includes('W')) {
              element.classList.add('path');
              cont = false;
              break;
            } else if (element.innerText.includes('B')) {
              cont = false;
              break;
            }
          }
        }
      }
      if (!cont) break;
    }
    for (let i = row - 1; i >= 1; i--) { //Vòng lặp for để xét nhánh dưới đường chéo chính.
      let cont = true;
      for (let j = col + 1; j <= 8; j++) {
        if (i + j == value) {
          const id = `c${i * 100 + j}`;
          const element = document.getElementById(id);
          if (element == null) break;
          else {
            if (element.innerHTML == '') {
              document.getElementById(id).classList.add('path');
            } else if (element.innerText.includes('W')) {
              document.getElementById(id).classList.add('path');
              cont = false;
              break;
            } else if (element.innerText.includes('B')) {
              cont = false;
              break;
            }
          }
        }
      }
      if (!cont) break;
    }

    /* Xét theo đường chéo phụ (từ phải sang trái). Đặc điểm của đường chéo này là nếu thuộc nhánh trên của đường chéo thì chỉ mục dòng và chỉ mục cột sẽ tăng một đơn vị, các ô phía chéo trên có độ chênh lệch là 1 đơn vị với các ô phía chéo dưới gần nhất. */
    // Xét nhánh chéo trên của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    const delta = row - col;
    for (let i = row + 1; i <= 8; i++) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('W')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('B')) {
          break;
        }
      }
    }
    // Xét nhánh chéo dưới của phần tử hiện tại (tính các ô ở bên trên của ô hiện tại).
    for (let i = row - 1; i >= 1; i--) {
      const index_Col = i - delta;
      if (1 <= index_Col && index_Col <= 8) {
        const id = generateID(i * 100, 0, index_Col);
        if (document.getElementById(id).innerHTML == '') {
          document.getElementById(id).classList.add('path');
          continue;
        } else if (document.getElementById(id).innerText.includes('W')) {
          document.getElementById(id).classList.add('path');
          break;
        } else if (document.getElementById(id).innerText.includes('B')) {
          break;
        }
      }
    }
  }

}

/* Hàm tìm đường đi cho Mã. */
function generatePathForKnight(knight, turn, indexRow, indexCol, sum) {

  if (knight.innerHTML.includes('Wknight') && turn % 2 != 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(knight);
    if (indexCol < 7 && indexRow < 800) {
      if (document.getElementById(generateID(sum, 100, 2)) != null) {
        if (document.getElementById(generateID(sum, 100, 2)).innerHTML.includes('B') || document.getElementById(generateID(sum, 100, 2)).innerHTML == '')
          document.getElementById(generateID(sum, 100, 2)).classList.add('path');
      }
    }
    if (indexCol < 7 && indexRow > 200) {
      if (document.getElementById(generateID(sum, -100, 2)) != null) {
        if (document.getElementById(generateID(sum, -100, 2)).innerHTML.includes('B') || document.getElementById(generateID(sum, -100, 2)).innerHTML == '')
          document.getElementById(generateID(sum, -100, 2)).classList.add('path');
      }
    }
    if (indexCol < 8 && indexRow < 700) {
      if (document.getElementById(generateID(sum, 200, 1)) != null) {
        if (document.getElementById(generateID(sum, 200, 1)).innerHTML.includes('B') || document.getElementById(generateID(sum, 200, 1)).innerHTML == '')
          document.getElementById(generateID(sum, 200, 1)).classList.add('path');
      }
    }
    if (indexCol > 1 && indexRow < 700) {
      if (document.getElementById(generateID(sum, 200, -1)) != null) {
        if (document.getElementById(generateID(sum, 200, -1)).innerHTML.includes('B') || document.getElementById(generateID(sum, 200, -1)).innerHTML == '')
          document.getElementById(generateID(sum, 200, -1)).classList.add('path');
      }
    }
    if (indexCol > 2 && indexRow < 800) {
      if (document.getElementById(generateID(sum, 100, -2)) != null) {
        if (document.getElementById(generateID(sum, 100, -2)).innerHTML.includes('B') || document.getElementById(generateID(sum, 100, -2)).innerHTML == '')
          document.getElementById(generateID(sum, 100, -2)).classList.add('path');
      }
    }
    if (indexCol > 2 && indexRow > 100) {
      if (document.getElementById(generateID(sum, -100, -2)) != null) {
        if (document.getElementById(generateID(sum, -100, -2)).innerHTML.includes('B') || document.getElementById(generateID(sum, -100, -2)).innerHTML == '')
          document.getElementById(generateID(sum, -100, -2)).classList.add('path');
      }
    }
    if (indexCol < 8 && indexRow > 200) {
      if (document.getElementById(generateID(sum, -200, 1)) != null) {
        if (document.getElementById(generateID(sum, -200, 1)).innerHTML.includes('B') || document.getElementById(generateID(sum, -200, 1)).innerHTML == '')
          document.getElementById(generateID(sum, -200, 1)).classList.add('path');
      }
    }
    if (indexCol > 1 && indexRow > 200) {
      if (document.getElementById(generateID(sum, -200, -1)) != null) {
        if (document.getElementById(generateID(sum, -200, -1)).innerHTML.includes('B') || document.getElementById(generateID(sum, -200, -1)).innerHTML == '')
          document.getElementById(generateID(sum, -200, -1)).classList.add('path');
      }
    }
  } else if (knight.innerHTML.includes('Bknight') && turn % 2 == 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(knight);
    if (indexCol < 7 && indexRow < 800) {
      if (document.getElementById(generateID(sum, 100, 2)) != null) {
        if (document.getElementById(generateID(sum, 100, 2)).innerHTML.includes('W') || document.getElementById(generateID(sum, 100, 2)).innerHTML == '')
          document.getElementById(generateID(sum, 100, 2)).classList.add('path');
      }
    }
    if (indexCol < 7 && indexRow > 200) {
      if (document.getElementById(generateID(sum, -100, 2)) != null) {
        if (document.getElementById(generateID(sum, -100, 2)).innerHTML.includes('W') || document.getElementById(generateID(sum, -100, 2)).innerHTML == '')
          document.getElementById(generateID(sum, -100, 2)).classList.add('path');
      }
    }
    if (indexCol < 8 && indexRow < 700) {
      if (document.getElementById(generateID(sum, 200, 1)) != null) {
        if (document.getElementById(generateID(sum, 200, 1)).innerHTML.includes('W') || document.getElementById(generateID(sum, 200, 1)).innerHTML == '')
          document.getElementById(generateID(sum, 200, 1)).classList.add('path');
      }
    }
    if (indexCol > 1 && indexRow < 700) {
      if (document.getElementById(generateID(sum, 200, -1)) != null) {
        if (document.getElementById(generateID(sum, 200, -1)).innerHTML.includes('W') || document.getElementById(generateID(sum, 200, -1)).innerHTML == '')
          document.getElementById(generateID(sum, 200, -1)).classList.add('path');
      }
    }
    if (indexCol > 2 && indexRow < 800) {
      if (document.getElementById(generateID(sum, 100, -2)) != null) {
        if (document.getElementById(generateID(sum, 100, -2)).innerHTML.includes('W') || document.getElementById(generateID(sum, 100, -2)).innerHTML == '')
          document.getElementById(generateID(sum, 100, -2)).classList.add('path');
      }
    }
    if (indexCol > 2 && indexRow > 100) {
      if (document.getElementById(generateID(sum, -100, -2)) != null) {
        if (document.getElementById(generateID(sum, -100, -2)).innerHTML.includes('W') || document.getElementById(generateID(sum, -100, -2)).innerHTML == '')
          document.getElementById(generateID(sum, -100, -2)).classList.add('path');
      }
    }
    if (indexCol < 8 && indexRow > 200) {
      if (document.getElementById(generateID(sum, -200, 1)) != null) {
        if (document.getElementById(generateID(sum, -200, 1)).innerHTML.includes('W') || document.getElementById(generateID(sum, -200, 1)).innerHTML == '')
          document.getElementById(generateID(sum, -200, 1)).classList.add('path');
      }
    }
    if (indexCol > 1 && indexRow > 200) {
      if (document.getElementById(generateID(sum, -200, -1)) != null) {
        if (document.getElementById(generateID(sum, -200, -1)).innerHTML.includes('W') || document.getElementById(generateID(sum, -200, -1)).innerHTML == '')
          document.getElementById(generateID(sum, -200, -1)).classList.add('path');
      }
    }
  }
}

/* Hàm tìm đường đi cho xe. */
function generatePathForRook(rook, turn, indexRow, indexCol, sum) {
  /*Xét đường đi cho xe trắng. */
  let row = indexRow / 100;
  let col = indexCol;
  if (rook.innerHTML.includes("Wrook") && turn % 2 != 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(rook);
    /*Tìm đường đi theo cột hiện tại. */
    for (let i = row + 1; i <= 8; i++) {
      const id = `c${i * 100 + col}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W')) {
          break;
        }
      }
    }
    for (let i = row - 1; i >= 1; i--) {
      const id = `c${i * 100 + col}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W')) {
          break;
        }
      }
    }

    /* Tìm đường đi theo dòng hiện tại. */
    for (let i = col - 1; i >= 1; i--) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
          continue;
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W')) {
          break
        }
      }
    }
    for (let i = col + 1; i <= 8; i++) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
          continue;
        } else if (element.innerText.includes('B')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('W')) {
          break
        }
      }
    }
  } else if (rook.innerText.includes('B') && turn % 2 == 0) {
    removeBeforeSelectedItemsAndSetSelectedForCurrent(rook);
    /*Tìm đường đi theo cột hiện tại. */
    for (let i = row + 1; i <= 8; i++) {
      const id = `c${i * 100 + col}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B')) {
          break;
        }
      }
    }
    for (let i = row - 1; i >= 1; i--) {
      const id = `c${i * 100 + col}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B')) {
          break;
        }
      }
    }

    /* Tìm đường đi theo dòng hiện tại. */
    for (let i = col - 1; i >= 1; i--) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
          continue;
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B')) {
          break
        }
      }
    }
    for (let i = col + 1; i <= 8; i++) {
      const id = `c${indexRow + i}`;
      const element = document.getElementById(id);
      if (element != null) {
        if (element.innerText.length == 0) {
          element.classList.add('path');
          continue;
        } else if (element.innerText.includes('W')) {
          element.classList.add('path');
          break;
        } else if (element.innerText.includes('B')) {
          break
        }
      }
    }
  }
}


let turn = 1;/* Quân cờ trắng được đánh trước. */

document.querySelectorAll('.cell').forEach(element => {
  element.addEventListener('click', () => {
    if (element.innerText.length != 0 && !element.classList.contains('path')) {
      // Trường hợp này là chọn đường đi.
      document.querySelectorAll('.path').forEach(path => {
        path.classList.remove('path');
      })
      let indexRow = Number.parseInt(element.id.charAt(1)) * 100;
      let indexCol = Number.parseInt(element.id.charAt(3));
      let sum = indexRow + indexCol;

      if (element.innerText.includes('pawn')) {
        genereatePathForPawn(element, turn, indexRow, indexCol, sum);
      }
      else if (element.innerText.includes('rook')) {
        generatePathForRook(element, turn, indexRow, indexCol, sum);
      }
      else if (element.innerText.includes('knight')) {
        generatePathForKnight(element, turn, indexRow, indexCol, sum);
      }
      else if (element.innerText.includes('bishop')) {
        generatePathForBishop(element, turn, indexRow, indexCol, sum);
      }
      else if (element.innerText.includes('queen')) {
        generatePathForQueen(element, turn, indexRow, indexCol, sum);
      }
      else if (element.innerText.includes('king')) {
        generatePathForKing(element, turn, indexRow, indexCol, sum);
      }
    }
    if((element.innerText.length == 0 && element.classList.contains('path')) || (element.innerText.length != 0 && element.classList.contains('path'))) {
      /* Trường hợp này là tiến hành đi */
      const selectedItem = document.querySelector('.selected');
      const id = selectedItem.id;
      const text = selectedItem.innerText;
      element.innerText = text;
      selectedItem.innerHTML = '';
      autoColoring();
      autoInsertPieces();
      removePathAndSelectedItems();
      turn++;
      console.log(turn);  
    }
  })
})


function removePathAndSelectedItems() {
  document.querySelectorAll('.cell').forEach(item => {
    if (item.classList.contains('path')) {
      item.classList.remove('path');
    }
    if (item.classList.contains('selected')) {
      item.classList.remove('selected');
    }
  })
}