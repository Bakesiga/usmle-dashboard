/* ============================================================================
 * USMLE Monthly Evaluation — build a plain Google Form (alternative path)
 *
 * Use this only if you would rather collect with a standard Google Form than the
 * on-brand evaluation.html. It generates the same instrument and links a fresh
 * response spreadsheet.
 *
 * Run it
 *   1. script.google.com -> New project, paste this file in.
 *   2. Run -> buildForm. Approve the permissions prompt.
 *   3. The Execution log prints the live form URL and the editor URL.
 *      Share the live URL with students.
 * ========================================================================== */

function buildForm() {
  var form = FormApp.create("USMLE Step 1 — June Monthly Evaluation");
  form.setDescription(
    "A few honest minutes that tell me where to slow down and what to revisit. " +
    "This is not a test. Rate how well you can make sense of each topic and " +
    "recognise it in a question. About 25 minutes."
  );
  form.setCollectEmail(true);
  form.setProgressBar(true);

  var UNDERSTAND = ["1 Lost", "2 Shaky", "3 Making sense", "4 Solid", "5 Confident", "Skipped (missed it)"];
  var CONF = ["Much lower", "Lower", "About the same", "Higher", "Much higher", "Skipped"];
  var AGREE = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

  // 1. About you
  form.addSectionHeaderItem().setTitle("About you");
  form.addMultipleChoiceItem().setTitle("Roughly how many hours per week did you study this month?")
    .setChoiceValues(["Under 5", "5 to 10", "10 to 15", "15 to 20", "20 or more"]).setRequired(true);
  form.addMultipleChoiceItem().setTitle("How much of the live classes did you attend?")
    .setChoiceValues(["All or almost all", "Most", "About half", "Less than half"]).setRequired(true);

  // 2. Your month overall
  form.addSectionHeaderItem().setTitle("Your month overall");
  form.addScaleItem().setTitle("Overall, how would you rate this month of the programme?")
    .setBounds(1, 5).setLabels("Poor", "Excellent").setRequired(true);
  form.addScaleItem().setTitle("How well do you feel you understood this month's material overall?")
    .setBounds(1, 5).setLabels("Not at all", "Very well").setRequired(true);
  form.addScaleItem().setTitle("Compared with the start of June, my overall confidence with this material is now")
    .setBounds(1, 5).setLabels("Much lower", "Much higher").setRequired(true);
  form.addScaleItem().setTitle("How likely are you to recommend these classes to a friend preparing for Step 1?")
    .setBounds(0, 10).setLabels("Not at all", "Absolutely");

  // 3. Teaching and support
  form.addSectionHeaderItem().setTitle("Teaching and support");
  form.addGridItem().setTitle("How much do you agree with each statement?")
    .setRows([
      "The teaching was clear and easy to follow.",
      "The classes moved at a pace I could keep up with.",
      "The class recordings were useful for review.",
      "The dashboard and study materials supported my learning.",
      "The practice questions helped me apply the concepts.",
      "I felt supported when I had questions or struggled.",
      "The amount of material this month felt manageable."
    ]).setColumns(AGREE).setRequired(true);
  form.addMultipleChoiceItem().setTitle("Overall, how was the pace of the classes?")
    .setChoiceValues(["Too slow", "A bit slow", "Just right", "A bit fast", "Too fast"]).setRequired(true);

  // 4. Confidence by subject
  form.addSectionHeaderItem().setTitle("Confidence, then and now")
    .setHelpText("Compared with the start of June, how is your confidence in each subject now?");
  form.addGridItem().setTitle("My confidence now is")
    .setRows(["Cardiovascular", "Respiratory", "Epidemiology and Biostatistics", "General Pathology"])
    .setColumns(CONF).setRequired(true);

  // 5. Understanding topic by topic
  form.addSectionHeaderItem().setTitle("Topic by topic")
    .setHelpText("How well can you make sense of each topic and recognise it in a question? If you missed that class, choose Skipped.");

  form.addGridItem().setTitle("Cardiovascular").setColumns(UNDERSTAND).setRequired(true).setRows([
    "Embryology and fetal circulation",
    "Cardiac cycle and pressure volume loops",
    "Preload, afterload, contractility and cardiac output",
    "Blood pressure regulation (baroreceptors, RAAS)",
    "Cardiac and vascular function curves",
    "Cardiac electrophysiology and the ECG",
    "Hypertension and vascular disease",
    "Atherosclerosis and aneurysms",
    "Ischaemic heart disease and myocardial infarction",
    "Heart failure",
    "Cardiomyopathies and pericardial disease",
    "Valvular disease and murmurs",
    "Arrhythmias",
    "Antihypertensive and heart failure drugs",
    "Antiarrhythmic and lipid lowering drugs"
  ]);

  form.addGridItem().setTitle("Respiratory").setColumns(UNDERSTAND).setRequired(true).setRows([
    "Embryology and anatomy",
    "Lung volumes and capacities",
    "Mechanics of breathing and compliance",
    "Pulmonary circulation and the A-a gradient",
    "V/Q mismatch and dead space",
    "Oxygen transport and the oxygen-haemoglobin curve",
    "Carbon dioxide transport and acid-base",
    "Obstructive lung disease (asthma, COPD)",
    "Restrictive and interstitial lung disease",
    "Lung cancers",
    "Pulmonary embolism, pulmonary hypertension and pleural disease",
    "Respiratory drugs (antihistamines, antitussives, decongestants)"
  ]);

  form.addGridItem().setTitle("Epidemiology and Biostatistics").setColumns(UNDERSTAND).setRequired(true).setRows([
    "Observational designs (cohort, case control, cross sectional)",
    "Experimental designs and clinical trials",
    "Bias and confounding",
    "Quantifying risk (relative risk, odds ratio, attributable risk)",
    "Number needed to treat and number needed to harm",
    "Sensitivity and specificity",
    "Predictive values and likelihood ratios",
    "Incidence versus prevalence",
    "Validity, reliability, precision and accuracy",
    "Hypothesis testing, type I and II error and power",
    "Confidence intervals and statistical tests (t-test, ANOVA, chi-square, correlation)"
  ]);

  form.addGridItem().setTitle("General Pathology").setColumns(UNDERSTAND).setRequired(true).setRows([
    "Cellular adaptations (hyperplasia, hypertrophy, atrophy, metaplasia)",
    "Reversible versus irreversible cell injury",
    "Cell death: necrosis types and apoptosis",
    "Free radical injury",
    "Acute inflammation and chemical mediators",
    "Chronic and granulomatous inflammation",
    "Tumour nomenclature, grading and staging",
    "Hallmarks of cancer",
    "Oncogenes and tumour suppressor genes",
    "Carcinogens and tumour markers",
    "Invasion, metastasis and paraneoplastic syndromes",
    "Cancer epidemiology and prevention"
  ]);

  // 6. Where to focus
  form.addSectionHeaderItem().setTitle("Where should we focus?");
  form.addParagraphTextItem().setTitle("Which topics do you most want us to revisit or slow down on next time? List up to five.").setRequired(true);
  form.addParagraphTextItem().setTitle("What is the single biggest thing getting in the way of your progress right now?");
  form.addParagraphTextItem().setTitle("What worked best for you this month?");
  form.addParagraphTextItem().setTitle("What should we change or add next month?");
  form.addParagraphTextItem().setTitle("Anything else you want me to know? (optional)");

  // Linked response spreadsheet
  var ss = SpreadsheetApp.create("USMLE June Evaluation — Responses");
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  Logger.log("LIVE form (share this): " + form.getPublishedUrl());
  Logger.log("EDIT form: " + form.getEditUrl());
  Logger.log("RESPONSES sheet: " + ss.getUrl());
}
