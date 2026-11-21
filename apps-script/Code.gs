/** Mikeila Taiwan Companion → Google Sheet sync.
 * Bind this script to the budget workbook. It uses the existing
 * "Actual Expenses" tab and rows 5 onward; no passport/proof files are read.
 */
const SHEET_NAME = 'Actual Expenses';
const START_ROW = 5;
const HEADERS = ['Expense date','Paid by','Budget line / experience','Description','Category','Payment method','Amount NT$','PHP value','Cash spend NT$','Receipt URL / filename','Verification status'];

function doGet() { return json_({ ok: true, service: 'taiwan-companion-sheet-sync' }); }

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const expected = props.getProperty('TRIP_ACCESS_KEY');
    const supplied = e && e.parameter && e.parameter.key;
    if (!expected || supplied !== expected) return json_({ error: 'Unauthorized' }, 401);
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const entries = Array.isArray(body.entries) ? body.entries : [];
    if (entries.length > 500) return json_({ error: 'Too many entries' }, 400);
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet) return json_({ error: 'Missing Actual Expenses sheet' }, 500);
    const last = Math.max(sheet.getLastRow(), START_ROW - 1);
    const width = 16; // A:K visible ledger + L:P private sync helper columns
    const values = last >= START_ROW ? sheet.getRange(START_ROW, 1, last - START_ROW + 1, width).getValues() : [];
    const byId = {};
    values.forEach((row, i) => { const id = String(row[11] || ''); if (id) byId[id] = { row: START_ROW + i, values: row }; });
    entries.forEach(entry => {
      const id = String(entry.id || '').slice(0, 100);
      if (!id || !entry.title) return;
      const existing = byId[id];
      const existingUpdated = existing ? String(existing.values[12] || '') : '';
      if (existing && existingUpdated >= String(entry.updatedAt || '')) return;
      const row = [entry.date || '', entry.payer || '', '', entry.title || '', entry.category || '', entry.method || '', entry.currency === 'TWD' ? Number(entry.amount || 0) : '', '', entry.currency === 'TWD' && entry.method === 'Cash' ? Number(entry.amount || 0) : '', entry.note || '', entry.deleted ? 'Deleted' : 'Unverified', id, entry.updatedAt || '', entry.forWhom || 'Family', !!entry.excluded, entry.currency || 'TWD'];
      const targetRow = existing ? existing.row : Math.max(sheet.getLastRow() + 1, START_ROW);
      sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
      byId[id] = { row: targetRow, values: row };
    });
    SpreadsheetApp.flush();
    const result = Object.keys(byId).map(id => { const r = byId[id].values; return { id, date: r[0], payer: r[1], title: r[3], category: r[4], method: r[5], amount: Number(r[6] || 0), currency: r[15] || 'TWD', note: r[9], deleted: r[10] === 'Deleted', updatedAt: r[12], forWhom: r[13] || 'Family', excluded: !!r[14] }; });
    return json_({ entries: result });
  } catch (err) { return json_({ error: String(err.message || err) }, 500); }
}

function json_(value, status) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
