const fs = require('fs');

const surplusDb = JSON.parse(fs.readFileSync('/home/iowa-state-surplus/surplus-inventory.json', 'utf8'));
let finalHTML = [];
for(i=0;i<surplusDb.items.length;i++){
    let itemName = Object.values(surplusDb.items[i])[0]
    let googleLink = "https://www.google.com/search?q=" + itemName.replace(/ /g, "+");
    let quantity = Object.values(surplusDb.items[i])[1]
    let orgQuantity = Object.values(surplusDb.items[i])[2]
    let dateAdded = Object.values(surplusDb.items[i])[3]
    let tags = Object.values(surplusDb.items[i])[4]
    console.log(itemName);
    let html = "";
    html += '                       <tr class=\"item hover\">\n';
    //html += '                          <td></td>\n'
    html += '                          <td class=\"item-name\">\n'
    html += '                               <div class=\"overflow-x-hidden\">'+itemName+'</div>\n'
    html += '                          </td>\n'
    html += '                          <td class="flex flex-row">\n'
    for(j=0;j<tags.length;j++){
        html += '                              <div class=\"font-semibold tag-' + tags[j] + ' mx-1 badge text-black\">' + tags[j] + '</div>\n';
    }
    html += '                          </td>\n' 
    html += '                          <td>'+quantity+'</td>\n'
    html += '                          <td>'+(orgQuantity-quantity)+'</td>\n'
    html += '                          <td>\n'
    html += '                               <div class=\"overflow-x-hidden\">'+dateAdded+'</div>\n'
    html += '                          </td>\n'
    html += '                          <td>\n'
    html += '                              <a class=\"link-primary\" href=\"' + googleLink + '\">Search Product<a/>\n'
    html += '                          </td>\n'
    html += '                       </tr>\n'
    console.log(i + "/" + surplusDb.items.length);
    finalHTML.push(html);
}

const fileData = fs.readFileSync('/home/iowa-state-surplus/index-base.html', { encoding: "utf8" });
const fileDataArray = fileData.split("\n");
const newData = finalHTML.join("");
const index = 65; // after each row to insert your data

fileDataArray.splice(index, 0, newData); // insert data into the array

const newFileData = fileDataArray.join("\n"); // create the new file

fs.writeFileSync("/home/iowa-state-surplus/index.html", newFileData, { encoding: "utf8" }); // save it
