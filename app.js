const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {

    const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const surplus = {};
    let firstPull = false;
    let diffArr = [];
    // try {
    //     const surplusDb = JSON.parse(fs.readFileSync('surplus-inventory.json', 'utf8'));
    //     let itemNamesDb = surplusDb.items.map(a => a.itemName);
    //     let oQuantityDb = surplusDb.items.map(a => a.originalQuantity);
    //     let dateAddedDb = surplusDb.items.map(a => a.dateAdded);
    // } catch {
    //     firstPull = true;
    // }
    let path = "/home/iowa-state-surplus/"

    let devMode = false;

    if(devMode == true){
        path = ""
    }
    const surplusDb = JSON.parse(fs.readFileSync(path + 'surplus-inventory.json', 'utf8'));
    let itemNamesDb = surplusDb.items.map(a => a.itemName);
    let oQuantityDb = surplusDb.items.map(a => a.originalQuantity);
    let dateAddedDb = surplusDb.items.map(a => a.dateAdded);
    
    const page = await browser.newPage();
    await page.goto("https://www.surplus.iastate.edu/sales/inventory");
    let items = await page.evaluate(() => document.querySelector('.wd-Grid-cell').innerHTML);
    let itemsArr = items.split('<br>\n ');
    let date = itemsArr[0].substring(itemsArr[0].indexOf("Updated:") + 9,itemsArr[0].indexOf("Updated: ") + 18)
    date = date.replace(/</g, "");
    surplus.latestUpdate = date;
    itemsArr.shift();
    itemsArr[itemsArr.length - 1] = itemsArr[itemsArr.length - 1].substring(0, itemsArr[itemsArr.length - 1].length - 6);

    let tags = [
        [["Office"],["copier","label","pencil","dymo","stapler","paper","envelope","folder","file","binder","hole punch","brother","toner","cartridge","scan","laserjet","lexmark","organizer","printer","paper","scanner","fax","xerox"]],
        [["Furniture/Appliances"],["desk","basket","mirror","table","shelv","drawer","shelf","frame","poster","pillow","lamp","clock","vacuum","cart","coffee","cabinet","microwave","bulletin","walnut","oak","carpet","chair","table","herman","flooring","wood"]],
        [["Scientific"],["electrolytic","dc power","benchtop","voltage","amperage","regulator","funtion","generator","instrument","data","petri","beaker","funnel","solder","magni","heat","motor","electronic","scope","detect","pipet","meter","exchanger","pump","chem","physics","lab","machine","temp","scale","timer","bio","beckman","flask","therm","scien","calculator","fisher","humid","fuge","controller","ology"]],
        [["AV"],["casseette","headphones","yahmaha","ampli","cd-","extron","music","clicker","panasonic bb","polaroid","dvd","vcr","player","elmo","sound","media","remote","cam","shure","olympus","kramer","tripod","photo","video","camera","nikon","canon","sony","speaker","microphone"]],
        [["Monitor/TV"],["tv","monitor","17\" monitor","19\" monitor","22\" monitor","23\" monitor","24\" monitor","27\" monitor","29\" monitor","32\" monitor","34\" monitor"]],
        [["Computer"],["thinkpad","thinkcentre","lenovo","hdmi","power supply","hard drive","netgear","display","vga","dvi","cable","kvm","ethernet","switch","sunmicro","supermicro","xbox","playstation","network","webcam","keyboard","802","router","asus"," ups","surface","macbook","mac pro","macpro","macintosh","mac mini","macmini","chromebook","dvd","logitech","dell", "imac","server"]],
        [["Networking"],["kvm","24 port","48 port","switch","router","poe","ethernet","access point","firewall","netgear"]],
        [["Projector"],["panasonic pt","projector","epson","bulb","elmo"]],
        [["Tools"],["mill","vise","lathe","drill","screwdriver","hammer","cnc","wrench","snap-on","snapon","socket","band saw","dewalt","milwaukee","wera","ryobi","allen key","planer","endmill","tool","caliper","micrometer","pliers","knipex","klien","cutter","bluepoint","impact","circular saw","grinder","oscillating","blade"]],
        [["Apple"],["apple","macbook","ipad","ipod ","imac","mac pro","macpro","macintosh","mac mini","macmini","xserve"]]
    ];

    for(let i = 0; i < itemsArr.length; i++) {
        if(itemsArr[i][0] === '(') {
            var quantity = itemsArr[i].substring(
            itemsArr[i].indexOf("(") + 1, 
            itemsArr[i].lastIndexOf(")")
            );
            var quantity = parseInt(quantity);
            itemsArr[i] = itemsArr[i].substring(4, itemsArr[i].length);
            } else {
            var quantity = 1;
            }
            if(itemsArr[i][0] === ' ') {
            itemsArr[i] = itemsArr[i].substring(1, itemsArr[i].length);
            }
            itemTags = [];
            for(var k = 0; k < tags.length; k++) {
                for(var j = 0; j < tags[k][1].length; j++) {
                    if(itemsArr[i].toLocaleLowerCase().includes(tags[k][1][j]) == true && itemTags.indexOf(tags[k][0][0]) == -1) {
                        itemTags.push(tags[k][0][0]);
                    }
                }
            }
            if(itemTags.length == 0){
                itemTags.push("Other");
            }
            // if(firstPull = false){
                if(itemNamesDb.indexOf(itemsArr[i]) >= 0) {
                    diffArr[i] = {itemName:itemsArr[i], quantity:quantity, originalQuantity:oQuantityDb[itemNamesDb.indexOf(itemsArr[i])],dateAdded:dateAddedDb[itemNamesDb.indexOf(itemsArr[i])],tags:itemTags};
                } else {
                    diffArr[i] = {itemName:itemsArr[i], quantity:quantity, originalQuantity:quantity,dateAdded:date,tags:itemTags};
                }
            // } else {
            //     diffArr[i] = {itemName:itemsArr[i], quantity:quantity, originalQuantity:quantity,dateAdded:date,tags:itemTags};
            // }
    }
    surplus.items=diffArr;
    //var json = JSON.stringify(itemsArr);
    //console.log(json);
    fs.writeFileSync(path + 'surplus-inventory.json', JSON.stringify(surplus, null, 4));
    //onsole.log(surplus);
    await browser.close();
})();
