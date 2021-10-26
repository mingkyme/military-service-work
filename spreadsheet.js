const { GoogleSpreadsheet } = require('google-spreadsheet');
const password = require('./password/password.json');
const doc = new GoogleSpreadsheet('1jQjS5NfNgZJFSjKmmt99Fwm1XJZWSkgcVwQRoqUrTow');
var spreadsheet = {};
spreadsheet.update = async function(list){
    await doc.useServiceAccountAuth({
        client_email: password.client_email,
        private_key: password.private_key,
    });
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    await sheet.clear();
    await sheet.setHeaderRow(['index','name','endDate','startDate','url']);
    await sheet.addRows(list);
    await sheet.saveUpdatedCells();
}
module.exports = spreadsheet;