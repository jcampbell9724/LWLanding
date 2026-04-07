const SHEET_NAME = "Leads";

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      message: "Ledgewave form endpoint is running.",
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" was not found.');
    }

    const headers = sheet
      .getRange(1, 1, 1, sheet.getLastColumn())
      .getValues()[0]
      .map(String);

    const params = e && e.parameter ? e.parameter : {};
    const honeypot = String(params.website || "").trim();

    if (honeypot) {
      return jsonResponse({ ok: true, skipped: true });
    }

    const row = headers.map(function (header) {
      if (header === "submitted_at" && !params[header]) {
        return new Date().toISOString();
      }

      return params[header] || "";
    });

    sheet.appendRow(row);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : String(error),
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (error) {}
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
