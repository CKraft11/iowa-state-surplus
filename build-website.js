const fs = require('fs');

let path = "/home/iowa-state-surplus/"

let devMode = false;

if(devMode == true){
    path = ""
}

const surplusDb = JSON.parse(fs.readFileSync(path + 'surplus-inventory.json', 'utf8'));
let finalHTML = [];
for(i=0;i<surplusDb.items.length;i++){
    let itemName = Object.values(surplusDb.items[i])[0]
    let googleLink = "https://www.google.com/search?q=" + itemName.replace(/ /g, "+");
    let quantity = Object.values(surplusDb.items[i])[1]
    let orgQuantity = Object.values(surplusDb.items[i])[2]
    let dateAdded = Object.values(surplusDb.items[i])[3]
    let tags = Object.values(surplusDb.items[i])[4]
    let html = "";
    html += '                       <tr class=\"item hover\">\n';
    //html += '                          <td></td>\n'
    html += '                          <td class=\"flex\">\n'
    if(dateAdded == surplusDb.latestUpdate){
        html += '                               <div class=\"tag-New overflow-x-clip text-black badge mr-1 overflow-x-hidden\">New</div>\n'
    }
    html += '                               <div class=\"overflow-x-hidden item-name\">'+itemName+'</div>\n'
    html += '                          </td>\n'
    html += '                          <td class="flex-row">\n'
    for(j=0;j<tags.length;j++){
        html += '                              <div class=\"font-semibold tag-' + tags[j] + ' mx-1 text-black badge\">' + tags[j] + '</div>\n';
    }
    html += '                          </td>\n' 
    html += '                          <td>'+quantity+'</td>\n'
    html += '                          <td>'+(orgQuantity)+'</td>\n'
    html += '                          <td>\n'
    html += '                               <div class=\"overflow-x-hidden\">'+dateAdded+'</div>\n'
    html += '                          </td>\n'
    html += '                          <td>\n'
    html += '                              <a class=\"link-primary\" href=\"' + googleLink + '\" target=\"_blank\">Search Product<a/>\n'
    html += '                          </td>\n'
    html += '                       </tr>\n'
    finalHTML.push(html);
}

const fileData = fs.readFileSync(path + 'index-base.html', { encoding: "utf8" });
const fileDataArray = fileData.split("\n");
const newData = finalHTML.join("");
const index = 74; // after each row to insert your data

fileDataArray.splice(index, 0, newData); // insert data into the array

const newFileData = fileDataArray.join("\n"); // create the new file

fs.writeFileSync(path + "index.html", newFileData, { encoding: "utf8" }); // save it
