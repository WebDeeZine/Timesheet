Ane Yulviane Timesheet - email PDF version

What this version does
- No cloud saving
- Keeps local browser saving only
- Generates a PDF of the current timesheet
- Emails the PDF to info@camelotcottages.com.au

Netlify setup needed
1. Deploy this site to Netlify from GitHub
2. In Netlify, go to Site configuration > Environment variables
3. Add:
   RESEND_API_KEY = your Resend API key
   FROM_EMAIL = a verified sender address in Resend
   Example FROM_EMAIL: Camelot <timesheets@yourdomain.com>
4. Trigger a redeploy

Notes
- The email button will not work until those two environment variables are added.
- Reset PIN is 1621.
