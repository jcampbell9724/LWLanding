# Google Sheets Form Setup

Use this if you want the landing site forms to append directly into a Google Sheet.

## 1. Create the sheet

Create a Google Sheet and name the first tab `Leads`.

Use this exact header row in row 1:

```text
form_type,submitted_at,page,name,email,company,role,current_system,crm_system,invoice_volume,team_size,bottleneck,timeline,integration_priority,workflow_notes,team,resource_interest,goal,website
```

## 2. Add the Apps Script

1. Open the Google Sheet.
2. Go to `Extensions > Apps Script`.
3. Replace the default script with the contents of [`GOOGLE_APPS_SCRIPT.gs`](./GOOGLE_APPS_SCRIPT.gs).
4. Save the project.

## 3. Deploy it as a web app

1. Click `Deploy > New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set `Who has access` to `Anyone`.
5. Deploy and copy the `Web app URL`.

Google's web app docs: https://developers.google.com/apps-script/guides/web

## 4. Paste the URL into the site

Open [`script.js`](./script.js) and replace this value:

```js
const GOOGLE_SHEETS_ENDPOINT =
  window.LEDGEWAVE_FORM_ENDPOINT || "PASTE_DEPLOYED_GOOGLE_APPS_SCRIPT_URL_HERE";
```

Paste your deployed web app URL in place of `PASTE_DEPLOYED_GOOGLE_APPS_SCRIPT_URL_HERE`.

## 5. Test both forms

- [`demo.html`](./demo.html) should append a row with `form_type=demo_request`
- [`resources.html`](./resources.html) should append a row with `form_type=resource_signup`

## Notes

- The `website` field is a hidden honeypot for basic spam filtering.
- The site uses a browser `fetch()` POST with `mode: "no-cors"` because this is a static frontend posting to a Google Apps Script web app.
- With that setup, the browser treats a successful send as fire-and-forget, so the site can show a success message but cannot inspect the response body.
