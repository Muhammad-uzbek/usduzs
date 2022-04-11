const express = require('express');
const app = express();
const fs = require('fs');
const request = require('request-promise');
//set interval for a day
let response = 'nothing';
function fetchScraped(){
    let htmlfile = fs.readFileSync('example.txt', 'utf8');
    let flt1 = htmlfile.replace(/\n|<td>\r\n|\r|/g, '').split(/<tbody>|<\/tbody>/g)[1].split(/<tr>|<\/tr>/g).slice(1);
    // replace spaces with empty string
    let flt2 = flt1.map(el => el.replace(/\s/g, ''));
    let flt3 = flt2.filter(el => {
        return el !='';
    });
    let flt4 = flt3.map(el => {
        return el.split(/<td>|<\/td>/g);
    });
    let answer = [];
    flt4.forEach(el => {
        let obj = {};
        obj.bank = el[2];
        obj.buy = el[3];
        obj.sell = el[4];
        answer.push(obj);
    });
    fs.writeFile('resp.json', JSON.stringify(answer), (err) => {
        if (err) throw err;
        console.log('Answer has been saved!');
    });
    return answer;
}
function fetchWeb(){
    request(`http://api.scraperapi.com/?api_key=fa0084fac24d1b04fd9e1bcb8b37eadc&url=https://m.aniq.uz/uz/valyuta-kurslari`)
    .then(res => {
        fs.writeFile('example.txt', res, (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
            fetchScraped();
        })
        
    })
    .catch(error => {
        console.log(error)
    })
}
fetchWeb();

// a day for interval
const interv  = 1000 * 60 * 60 * 24;

setInterval(() => {
    fetchWeb();
}, 
interv
);

// setInterval(fetchWeb, interval);

app.get('/', (req, res) => {
    res.send(
        fetchScraped()
    )
});

app.listen(3002, () => {
    console.log(`Server is running on port 3002`);
});