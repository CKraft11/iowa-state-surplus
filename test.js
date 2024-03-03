let str = "HP D200 Printer";
let tags = [
    [["office"], ["printer", "paper", "d200", "scanner", "fax"]],//office
    [["computer"],["hp", "dell", "mac","server"]]//computer
];
let tagNames = ["office","computer"];
console.log(tags[1][1].length);
// itemTags = [];
// for(var i = 0; i < tags.length; i++) {
//     for(var j = 0; j < tags[i].length; j++) {
//         if(str.toLocaleLowerCase().includes(tags[i][1][j]) == true && itemTags.indexOf(tagNames[i]) == -1) {
//             itemTags.push(tagNames[i]);
//         }
//     }
// }
// console.log(itemTags);

// while(i<(Object.keys(tags).length+1)) {
//   itemTags = []
//   if(k<tags.office.length){
//     if(str.toLocaleLowerCase().includes(tags.office[k]) == true) {
//       console.log("office tag")
//       i++;
//     } else {
//         i++;
//     }
//   }
//   if(k<tags.computer.length){
//     if(str.toLocaleLowerCase().includes(tags.computer[k]) == true) {
//       console.log("computer tag")
//     }
//   } else{
//     i++
//   }
//   k++;
// }