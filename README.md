COPY TO YOUR ACCOUNT \[Database\]

https://docs.google.com/spreadsheets/d/1qJScQWluoToxYdJ3B8cvaP7WGKjRcQ0Y_6oRrO1DSaQ


AND NEW SCRIPT

https://script.google.com/home
```JAVASCRIPT
// YOUR SHEET ID HERE
const sheet_id = "1qJScQWluoToxYdJ3B8cvaP7WGKjRcQ0Y_6oRrO1DSaQ"

const ss = SpreadsheetApp.openById(sheet_id)
const sheet = ss.getSheetByName("Config")

function myFunction() {
    const values = sheet.getRange("A3:O").getValues()
    let data = []

    for (let i = 0; i < values.length; i++) {
        if (values[i][0] == false) continue;
        const end = values[i][3].toString().split(":")
        data.push({
            "name": values[i][1],
            "UTC": +values[i][2],
            "newDay": {
                "hours": +end[0],
                "minutes": +end[1]
            },
            "mode": values[i][4],
            "dayOfWeek": [values[i][5], values[i][6], values[i][7], values[i][8], values[i][9], values[i][10], values[i][11]],
            "step": values[i][12],
            "startDate": values[i][13],
            "image": values[i][14]
        })
    }
    return data
}

function doGet() {
    const json = myFunction()
    return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON)
}
```