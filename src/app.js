// fetch('https://surplus.cadenkraft.com/api')
//   .then((response) => response.json())
//   .then((data) => addItems(data));
  
// function addItems(surplus) {
//     var table = document.getElementById('items').tBodies[0];
//     for(let i = 0; i < surplus.items.length; i++) {
//         row = table.insertRow();
//         cell0 = row.insertCell(0);
//         cell1 = row.insertCell(1);
//         cell2 = row.insertCell(2);
//         cell3 = row.insertCell(3);
//         cell4 = row.insertCell(4);
//         cell0.innerHTML = i;
//         cell1.innerHTML = surplus.items[i].itemName;
//         cell2.innerHTML = surplus.items[i].quantity;
//         cell3.innerHTML = "12/12/2022";
//         surplus.items[i].itemName = surplus.items[i].itemName.replace(/ /g, "+");
//         googleLink = "https://www.google.com/search?q="+surplus.items[i].itemName;
//         cell4.innerHTML = "<a class='link-primary' href="+ googleLink +">Search Product</a>";
//     }
// }
