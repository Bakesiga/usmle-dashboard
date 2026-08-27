/**
 * USMLE Step 1 Progress Check — Google Form builder
 *
 * HOW TO RUN (one time, ~1 minute):
 *  1. Go to https://script.google.com  (signed in as the Google account
 *     you want to OWN the form, i.e. allanbakesiga@gmail.com).
 *  2. Click "New project".
 *  3. Delete the default "function myFunction() {}" and paste this WHOLE file.
 *  4. Click Save (disk icon), then click "Run" (the play arrow).
 *  5. Google will ask you to authorize: click through "Review permissions",
 *     pick your account, "Advanced" -> "Go to <project> (unsafe)" -> Allow.
 *     (It is your own script acting on your own Drive, that warning is normal.)
 *  6. After it runs, open the "Execution log" (Ctrl/Cmd + Enter). It prints
 *     the EDIT link and the LIVE (shareable) link of the new form.
 *
 * The form lands in your Google Drive named "USMLE Step 1 Progress Check".
 * No em dashes anywhere in the student-facing copy.
 */

function buildUsmleProgressForm() {
  var form = FormApp.create('USMLE Step 1 Progress Check');

  form.setDescription(
    'A quick check-in so I can see where each of you is in the USMLE registration ' +
    'and study journey, and support you where you are stuck. Use the same name and ' +
    'Gmail you use for the class dashboard. This takes about 3 minutes.'
  );

  // Do NOT auto-collect email; we ask it as a typed question instead.
  form.setCollectEmail(false);
  form.setProgressBar(true);
  form.setAllowResponseEdits(true);

  // 1. Full name
  form.addTextItem()
    .setTitle('Full name')
    .setHelpText('The same name you use on the class dashboard and payment records.')
    .setRequired(true);

  // 2. Dashboard email
  form.addTextItem()
    .setTitle('Email used for the class dashboard')
    .setHelpText('Use the exact Gmail you sign into the dashboard with, so I can match your progress to your records.')
    .setRequired(true);

  // 3. WhatsApp number
  form.addTextItem()
    .setTitle('WhatsApp number (with country code)')
    .setHelpText('Example: +256 700 000000')
    .setRequired(false);

  // 4. Registration stage (dropdown)
  var regStage = form.addListItem();
  regStage.setTitle('Where are you in the registration process?')
    .setHelpText('Pick the furthest stage you have reached on the path to a booked Step 1 exam.')
    .setRequired(true)
    .setChoiceValues([
      'Not started yet',
      'Creating my ECFMG account, getting my ID number',
      'I have my USMLE / ECFMG ID number',
      'Completed the Application for ECFMG Certification',
      'Applied for Step 1 and selected my eligibility period',
      'Paid the Step 1 exam fees',
      'Submitted the Certification of Identification Form (Form 186)',
      'My medical school is verifying my credentials',
      'Received my Scheduling Permit',
      'Scheduled my exam date with Prometric',
      'I already have a confirmed test date'
    ]);

  // 5. Target / confirmed test date
  form.addDateItem()
    .setTitle('Target or confirmed test date (if you have one)')
    .setHelpText('Leave blank if you do not have a date yet. An approximate target month is fine.')
    .setRequired(false);

  // 6. Content preparation stage (multiple choice)
  form.addMultipleChoiceItem()
    .setTitle('Where are you in your content preparation?')
    .setRequired(true)
    .setChoiceValues([
      'Not started yet',
      'First pass through First Aid',
      'Finished content, starting UWorld',
      'In the middle of my first UWorld pass',
      'On my second UWorld pass',
      'Taking NBME / practice assessments',
      'Ready to test'
    ]);

  // 7. UWorld progress (linear scale 0 to 100 in tens)
  form.addScaleItem()
    .setTitle('UWorld progress (percent of the question bank completed)')
    .setHelpText('0 means not started, 10 means about 100 percent done. Pick the closest.')
    .setBounds(0, 10)
    .setLabels('0 percent', '100 percent')
    .setRequired(false);

  // 8. Most recent NBME / practice score
  form.addTextItem()
    .setTitle('Most recent NBME or practice assessment score (if any)')
    .setHelpText('For example: NBME 28, score 215. Leave blank if you have not taken one.')
    .setRequired(false);

  // 9. What is slowing you down (checkboxes)
  form.addCheckboxItem()
    .setTitle('What is slowing you down right now?')
    .setHelpText('Choose all that apply.')
    .setChoiceValues([
      'Finances (exam fees or related costs)',
      'Medical school credential verification delay',
      'The Certification of Identification Form (Form 186)',
      'I am confused about the registration process',
      'Not enough study time',
      'Motivation or accountability',
      'Nothing major, I am on track',
      'Other'
    ]);

  // 10. Open ask
  form.addParagraphTextItem()
    .setTitle('Anything you want me to help with?')
    .setHelpText('A specific question, a concept, a process problem, or anything else on your mind.')
    .setRequired(false);

  // Log the links so Allan can grab them from the execution log
  Logger.log('FORM CREATED');
  Logger.log('Edit (admin) link:  ' + form.getEditUrl());
  Logger.log('Live (share) link:  ' + form.getPublishedUrl());
  Logger.log('Short form link:    ' + form.shortenFormUrl(form.getPublishedUrl()));
}

// Apps Script runs the first function by default; alias so "Run" works
// regardless of which function the editor has selected.
function myFunction() {
  buildUsmleProgressForm();
}
