const fs = require('fs');

const surplusDb = JSON.parse(fs.readFileSync('surplus-inventory.json', 'utf8'));
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
    html += '<tr>\n';
    html += '   <td></td>\n'
    html += '   <td>'+itemName+'</td>\n'
    html += '   <td class="flex flex-row">\n'
    for(j=0;j<tags.length;j++){
        html += '       <div class=\"font-semibold tag-' + tags[j] + ' mx-1 badge text-black\">' + tags[j] + '</div>\n';
    }
    html += '   </td>\n' 
    html += '   <td>'+quantity+'</td>\n'
    html += '   <td>'+orgQuantity+'</td>\n'
    html += '   <td>'+dateAdded+'</td>\n'
    html += '   <td>\n'
    html += '       <a class=\"link-primary\" href=\"' + googleLink + '\">Search Product<a/>\n'
    html += '   </td>\n'
    html += '</tr>\n'
    console.log(i + "/" + surplusDb.items.length);
    finalHTML.push(html);
}
fs.writeFileSync('test.html', finalHTML.join(""));