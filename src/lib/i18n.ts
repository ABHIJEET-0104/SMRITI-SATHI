/**
 * Single source of truth for every user-visible string and every spoken
 * prompt, in all four supported languages. Screens must never hardcode
 * text or voice strings — they call t(lang, key) or
 * VoiceService.speak(key) with a semantic key defined here.
 */

export const LANGUAGES = [
  {
    code: "en",
    label: "English",
    native: "English",
    locale: "en-IN",
  },
  {
    code: "hi",
    label: "Hindi",
    native: "हिन्दी",
    locale: "hi-IN",
  },
  {
    code: "mr",
    label: "Marathi",
    native: "मराठी",
    locale: "mr-IN",
  },
  {
    code: "as",
    label: "Assamese",
    native: "অসমীয়া",
    locale: "as-IN",
  },
  {
    code: "bn",
    label: "Bengali",
    native: "বাংলা",
    locale: "bn-IN",
  },
  {
    code: "lus",
    label: "Mizo",
    native: "Mizo ṭawng",
    locale: "lus-IN",
  },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export function localeFor(lang: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === lang)?.locale ?? "en-IN";
}

type Dict = Record<string, string>;

const en: Dict = {
  app_name: "Smriti Sathi",
  tagline: "Cognitive care companion",

  // Landing Page
  hero_title:
    "A calm memory companion for elders — and peace of mind for their family.",

  hero_description:
    "Smriti Sathi offers two simple memory games, daily reminders and spoken guidance in your own language. Caregivers can follow game performance from anywhere.",

  feature_memory:
    "Two gentle memory games built around your own family photos",

  feature_voice:
    "Spoken guidance in English, Hindi, Marathi and Assamese",

  feature_offline:
    "Games keep working without internet and sync up later",

  feature_caregiver:
    "Caregivers see game performance only — never a medical claim",

  medical_disclaimer:
    "Smriti Sathi does not diagnose any medical condition. Game performance trends are informational and are not a medical diagnosis.",

  // Auth
  sign_in: "Sign in",
  sign_in_patient: "Patient / Elder Sign In",
  sign_in_caregiver: "Caregiver Sign In",
  sign_up: "Create account",
  sign_up_patient: "Register as Patient / Elder",
  sign_up_caregiver: "Register as Caregiver",
  sign_out: "Sign out",
  email: "Email",
  password: "Password",
  full_name: "Full name",
  age: "Age",
  i_am: "I am",
  role_elderly: "The person using the games (Patient / Elder)",
  role_caregiver: "A family member or caregiver",
  login_as_patient: "Elder / Patient Login",
  login_as_caregiver: "Caregiver Login",
  patient_desc:
    "Play cognitive memory games, view daily reminders & hear voice assistance",
  caregiver_desc:
    "Monitor game performance, add family photos & manage daily reminders",
  patient_signup: "Register as Patient",
  caregiver_signup: "Register as Caregiver",
  continue_google: "Continue with Google",
  have_account: "Already have an account? Sign in",
  need_account: "New here? Create an account",
  check_email:
    "Check your email to confirm your account, then sign in.",

  // Home
  welcome: "Welcome. What would you like to do?",
  home_prompt: "What would you like to do today?",
  greeting: "Namaskar",
  start_a_game: "Start a game",
  family_game: "Family Memory Match",
  family_game_desc:
    "Look at a photo, then choose the right name.",
  sequence_game: "Sequence Memory",
  sequence_game_desc:
    "Watch a short pattern, then repeat it.",
  start_game: "Start game",
  todays_reminders: "Today's reminders",
  no_reminders: "No reminders for today.",
  mark_done: "Done",
  reminder_done: "Done",
  reminder_due: "It is time for:",
  voice_assistant: "Voice assistant",
  voice_hint: "Tap to hear what you can do",
  voice_unavailable:
    "Voice is not available on this device. Instructions are shown on screen.",
  profile: "Profile",
  language: "Language",
  caregiver: "Caregiver",
  care_code: "Care code",
  care_code_hint:
    "Give this code to your caregiver so they can follow your progress.",
  not_linked: "Not linked yet",
  back_home: "Back to home",
  suggested_level: "Suggested level",

  // Games
  game_instruction: "Look carefully at the picture.",
  sequence_instruction: "Remember the sequence.",
  memory_preview: "Look carefully.",
  question_prompt: "Who is this?",
  choose_name: "Tap the correct name below",
  repeat_sequence: "Now repeat the pattern.",
  correct_feedback: "Very good!",
  incorrect_feedback:
    "That's okay. Let's try the next one.",
  try_again: "Let's try again.",
  game_complete:
    "You completed the game. Well done.",
  question_of: "Question",
  of: "of",
  score: "Score",
  accuracy: "Accuracy",
  mistakes: "Mistakes",
  response_time: "Response time",
  play_again: "Play again",
  finish: "Finish",
  your_result: "Your result",
  need_family_first:
    "Your caregiver needs to add family photos before this game can start.",
  need_family_more:
    "Please add at least 1 more family member before this game can start.",
  caregiver_preview: "Caregiver Preview: Playing for",

  watch: "Watch",
  your_turn: "Your turn",
  level: "Level",
  level_up: "Level passed! Unlocking next level 🎉",
  retry_prompt: "That's okay. Let's watch one more time.",
  highest_level_reached: "Highest level reached",

  // Caregiver
  caregiver_dashboard: "Caregiver dashboard",
  elderly_profile: "Profile",
  family_members: "Family members",
  add_member: "Add family member",
  edit: "Edit",
  delete: "Delete",
  save: "Save",
  cancel: "Cancel",
  name: "Name",
  relationship: "Relationship",
  category: "Category",
  photo: "Photo",
  game_performance: "Game performance",
  games_completed: "Games",
  average_score: "Average score",
  performance_trend: "Game Performance Trend",
  trend_improving: "Improving",
  trend_stable: "Stable",
  trend_declining: "Declining",
  trend_disclaimer:
    "Game performance trends are informational and are not a medical diagnosis.",
  games_disclaimer:
    "This trend reflects performance in Smriti Sathi games and is not a medical diagnosis.",
  adaptive_difficulty: "Adaptive difficulty",
  alerts: "Notes",
  no_alerts: "Nothing to note right now.",
  reminders: "Reminders",
  add_reminder: "Add reminder",
  upcoming: "Upcoming",
  completed: "Completed",
  missed: "Missed",
  link_elderly: "Link the person you care for",
  link_hint:
    "Enter the 6-character care code shown on their profile.",
  link: "Link",
  linked_people: "People you care for",
  no_linked:
    "No one linked yet. Enter a care code to begin.",
  load_demo: "Load demo family and history",
  recent_sessions: "Recent sessions",
  no_sessions: "No games played yet.",

  // Offline / sync
  online: "Online",
  offline: "Offline",
  results_waiting: "results waiting to sync",
  sync_now: "Sync now",
  sync_complete: "Your game results are synced.",
  sync_failed:
    "Could not sync yet. Your results are saved and will retry.",
  saved_offline:
    "Saved on this device. It will sync when you are back online.",

  // Levels
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const hi: Dict = {
  ...en,

  app_name: "स्मृति साथी",
  tagline: "संज्ञानात्मक देखभाल साथी",

  // Landing Page
  hero_title:
    "बुजुर्गों के लिए एक शांत स्मृति साथी — और उनके परिवार के लिए मन की शांति।",

  hero_description:
    "स्मृति साथी दो सरल स्मृति खेल, दैनिक अनुस्मारक और आपकी अपनी भाषा में आवाज़ मार्गदर्शन प्रदान करता है। देखभाल करने वाले कहीं से भी खेल के प्रदर्शन को देख सकते हैं।",

  feature_memory:
    "आपकी अपनी पारिवारिक तस्वीरों पर आधारित दो सरल स्मृति खेल",

  feature_voice:
    "हिंदी, अंग्रेज़ी, मराठी और असमिया में आवाज़ द्वारा मार्गदर्शन",

  feature_offline:
    "खेल इंटरनेट के बिना भी चलते हैं और बाद में सिंक हो जाते हैं",

  feature_caregiver:
    "देखभाल करने वाले केवल खेल के प्रदर्शन को देखते हैं — कोई चिकित्सीय दावा नहीं",

  medical_disclaimer:
    "स्मृति साथी किसी भी चिकित्सीय स्थिति का निदान नहीं करता। खेल के प्रदर्शन के रुझान केवल जानकारी के लिए हैं और चिकित्सीय निदान नहीं हैं।",

  // Auth
  sign_in: "साइन इन करें",
  sign_in_patient: "मरीज़ / बुजुर्ग साइन इन",
  sign_in_caregiver: "देखभालकर्ता साइन इन",
  sign_up: "खाता बनाएं",
  sign_up_patient: "मरीज़ / बुजुर्ग के रूप में पंजीकरण करें",
  sign_up_caregiver: "देखभालकर्ता के रूप में पंजीकरण करें",
  sign_out: "साइन आउट",
  email: "ईमेल",
  password: "पासवर्ड",
  full_name: "पूरा नाम",
  age: "उम्र",
  i_am: "मैं हूँ",
  role_elderly: "खेल खेलने वाला व्यक्ति",
  role_caregiver: "परिवार का सदस्य या देखभाल करने वाला",
  login_as_patient: "बुजुर्ग / मरीज़ लॉगिन",
  login_as_caregiver: "देखभालकर्ता लॉगिन",
  patient_desc:
    "संज्ञानात्मक स्मृति खेल खेलें, दैनिक अनुस्मारक देखें और आवाज़ सहायता सुनें",
  caregiver_desc:
    "खेल के प्रदर्शन पर नज़र रखें, पारिवारिक तस्वीरें जोड़ें और दैनिक अनुस्मारक प्रबंधित करें",
  patient_signup: "मरीज़ के रूप में पंजीकरण करें",
  caregiver_signup: "देखभालकर्ता के रूप में पंजीकरण करें",
  continue_google: "Google के साथ जारी रखें",
  have_account: "पहले से खाता है? साइन इन करें",
  need_account: "नए हैं? खाता बनाएं",
  check_email:
    "अपने खाते की पुष्टि करने के लिए ईमेल देखें, फिर साइन इन करें।",

  // Home
  welcome: "स्वागत है। आप क्या करना चाहेंगे?",
  home_prompt: "आज आप क्या करना चाहेंगे?",
  greeting: "नमस्कार",
  start_a_game: "खेल शुरू करें",
  family_game: "परिवार स्मृति खेल",
  family_game_desc:
    "फ़ोटो देखिए, फिर सही नाम चुनिए।",
  sequence_game: "क्रम स्मृति खेल",
  sequence_game_desc:
    "पैटर्न देखिए, फिर दोहराइए।",
  start_game: "खेल शुरू करें",
  todays_reminders: "आज के अनुस्मारक",
  no_reminders: "आज के लिए कोई अनुस्मारक नहीं है।",
  mark_done: "पूरा हुआ",
  reminder_done: "पूरा हुआ",
  reminder_due: "यह समय है:",
  voice_assistant: "आवाज़ सहायक",
  voice_hint: "आप क्या कर सकते हैं यह सुनने के लिए टैप करें",
  voice_unavailable:
    "इस डिवाइस पर आवाज़ उपलब्ध नहीं है। निर्देश स्क्रीन पर दिखाए गए हैं।",
  profile: "प्रोफ़ाइल",
  language: "भाषा",
  caregiver: "देखभालकर्ता",
  care_code: "देखभाल कोड",
  care_code_hint:
    "यह कोड अपने देखभालकर्ता को दें ताकि वे आपकी प्रगति देख सकें।",
  not_linked: "अभी लिंक नहीं है",
  back_home: "घर वापस",
  suggested_level: "सुझाया गया स्तर",

  // Games
  game_instruction: "तस्वीर को ध्यान से देखिए।",
  sequence_instruction: "क्रम को याद रखिए।",
  memory_preview: "ध्यान से देखिए।",
  question_prompt: "यह कौन है?",
  choose_name: "नीचे सही नाम पर टैप करें",
  repeat_sequence: "अब क्रम दोहराइए।",
  correct_feedback: "बहुत अच्छा!",
  incorrect_feedback:
    "कोई बात नहीं। अगला प्रयास करें।",
  try_again: "फिर से कोशिश करें।",
  game_complete:
    "आपने खेल पूरा किया। शाबाश।",
  question_of: "प्रश्न",
  of: "में से",
  score: "अंक",
  accuracy: "सटीकता",
  mistakes: "गलतियाँ",
  response_time: "प्रतिक्रिया समय",
  play_again: "फिर खेलें",
  finish: "समाप्त करें",
  your_result: "आपका परिणाम",
  need_family_first:
    "यह खेल शुरू करने से पहले आपके देखभालकर्ता को पारिवारिक तस्वीरें जोड़नी होंगी।",
  need_family_more:
    "कृपया इस खेल को शुरू करने के लिए कम से कम 1 और परिवार सदस्य जोड़ें।",
  caregiver_preview: "देखभालकर्ता पूर्वावलोकन: खेल रहे हैं",

  watch: "देखिए",
  your_turn: "आपकी बारी",
  level: "स्तर",
  level_up: "स्तर पार हुआ! अगला स्तर खुल रहा है 🎉",
  retry_prompt: "कोई बात नहीं। एक बार फिर ध्यान से देखते हैं।",
  highest_level_reached: "उच्चतम स्तर",

  // Caregiver
  caregiver_dashboard: "देखभालकर्ता डैशबोर्ड",
  elderly_profile: "प्रोफ़ाइल",
  family_members: "परिवार के सदस्य",
  add_member: "परिवार का सदस्य जोड़ें",
  edit: "संपादित करें",
  delete: "हटाएं",
  save: "सहेजें",
  cancel: "रद्द करें",
  name: "नाम",
  relationship: "रिश्ता",
  category: "श्रेणी",
  photo: "फ़ोटो",
  game_performance: "खेल का प्रदर्शन",
  games_completed: "खेल",
  average_score: "औसत अंक",
  performance_trend: "खेल प्रदर्शन की प्रवृत्ति",
  trend_improving: "सुधार हो रहा है",
  trend_stable: "स्थिर",
  trend_declining: "गिरावट",
  trend_disclaimer:
    "खेल प्रदर्शन के रुझान केवल जानकारी के लिए हैं और चिकित्सीय निदान नहीं हैं।",
  games_disclaimer:
    "यह प्रवृत्ति स्मृति साथी के खेलों में प्रदर्शन को दर्शाती है और चिकित्सीय निदान नहीं है।",
  adaptive_difficulty: "अनुकूली कठिनाई",
  alerts: "टिप्पणियाँ",
  no_alerts: "अभी ध्यान देने योग्य कुछ नहीं है।",
  reminders: "अनुस्मारक",
  add_reminder: "अनुस्मारक जोड़ें",
  upcoming: "आगामी",
  completed: "पूर्ण",
  missed: "छूटे हुए",
  link_elderly: "जिस व्यक्ति की आप देखभाल करते हैं उसे लिंक करें",
  link_hint:
    "उनकी प्रोफ़ाइल पर दिखाया गया 6-अक्षर का देखभाल कोड दर्ज करें।",
  link: "लिंक करें",
  linked_people: "जिन लोगों की आप देखभाल करते हैं",
  no_linked:
    "अभी कोई लिंक नहीं है। शुरू करने के लिए देखभाल कोड दर्ज करें।",
  load_demo: "डेमो परिवार और इतिहास लोड करें",
  recent_sessions: "हाल के सत्र",
  no_sessions: "अभी तक कोई खेल नहीं खेला गया है।",

  // Offline / sync
  online: "ऑनलाइन",
  offline: "ऑफ़लाइन",
  results_waiting: "परिणाम सिंक होने की प्रतीक्षा में",
  sync_now: "अभी सिंक करें",
  sync_complete: "आपके खेल के परिणाम सिंक हो गए हैं।",
  sync_failed:
    "अभी सिंक नहीं हो सका। आपके परिणाम सुरक्षित हैं और फिर से प्रयास किया जाएगा।",
  saved_offline:
    "इस डिवाइस पर सहेजा गया है। ऑनलाइन आने पर सिंक हो जाएगा।",

  // Levels
  easy: "आसान",
  medium: "मध्यम",
  hard: "कठिन",
};

const mr: Dict = {
  ...en,

  app_name: "स्मृती साथी",
  tagline: "संज्ञानात्मक काळजी साथी",

  // Landing Page
  hero_title:
    "ज्येष्ठांसाठी एक शांत स्मृती साथी — आणि त्यांच्या कुटुंबासाठी मनःशांती.",

  hero_description:
    "स्मृती साथी दोन सोपे स्मृती खेळ, दररोजच्या आठवणी आणि तुमच्या स्वतःच्या भाषेत आवाजाद्वारे मार्गदर्शन देते. काळजीवाहक कुठूनही खेळाची कामगिरी पाहू शकतात.",

  feature_memory:
    "तुमच्या स्वतःच्या कौटुंबिक फोटोंवर आधारित दोन सोपे स्मृती खेळ",

  feature_voice:
    "इंग्रजी, हिंदी, मराठी आणि आसामी भाषेत आवाजाद्वारे मार्गदर्शन",

  feature_offline:
    "इंटरनेट नसतानाही खेळ सुरू राहतात आणि नंतर सिंक होतात",

  feature_caregiver:
    "काळजीवाहक फक्त खेळाची कामगिरी पाहतात — कोणताही वैद्यकीय दावा नाही",

  medical_disclaimer:
    "स्मृती साथी कोणत्याही वैद्यकीय स्थितीचे निदान करत नाही. खेळाच्या कामगिरीतील कल केवळ माहितीसाठी आहेत आणि ते वैद्यकीय निदान नाहीत.",

  // Auth
  sign_in: "साइन इन करा",
  sign_in_patient: "रुग्ण / ज्येष्ठ साइन इन",
  sign_in_caregiver: "काळजीवाहक साइन इन",
  sign_up: "खाते तयार करा",
  sign_up_patient: "रुग्ण / ज्येष्ठ म्हणून नोंदणी करा",
  sign_up_caregiver: "काळजीवाहक म्हणून नोंदणी करा",
  sign_out: "साइन आउट",
  email: "ईमेल",
  password: "पासवर्ड",
  full_name: "पूर्ण नाव",
  age: "वय",
  i_am: "मी आहे",
  role_elderly: "खेळ खेळणारी व्यक्ती",
  role_caregiver: "कुटुंबातील सदस्य किंवा काळजीवाहक",
  login_as_patient: "ज्येष्ठ / रुग्ण लॉगिन",
  login_as_caregiver: "काळजीवाहक लॉगिन",
  patient_desc:
    "संज्ञानात्मक स्मृती खेळ खेळा, दररोजच्या आठवणी पाहा आणि आवाजाची मदत ऐका",
  caregiver_desc:
    "खेळाची कामगिरी पाहा, कौटुंबिक फोटो जोडा आणि दररोजच्या आठवणी व्यवस्थापित करा",
  patient_signup: "रुग्ण म्हणून नोंदणी करा",
  caregiver_signup: "काळजीवाहक म्हणून नोंदणी करा",
  continue_google: "Google सह पुढे जा",
  have_account: "आधीच खाते आहे? साइन इन करा",
  need_account: "नवीन आहात? खाते तयार करा",
  check_email:
    "तुमच्या खात्याची पुष्टी करण्यासाठी ईमेल तपासा आणि नंतर साइन इन करा.",

  // Home
  welcome: "स्वागत आहे. तुम्हाला काय करायचे आहे?",
  home_prompt: "आज तुम्हाला काय करायचे आहे?",
  greeting: "नमस्कार",
  start_a_game: "खेळ सुरू करा",
  family_game: "कुटुंब स्मृती खेळ",
  family_game_desc:
    "फोटो पाहा, नंतर योग्य नाव निवडा.",
  sequence_game: "क्रम स्मृती खेळ",
  sequence_game_desc:
    "नमुना पाहा, नंतर तो पुन्हा करा.",
  start_game: "खेळ सुरू करा",
  todays_reminders: "आजच्या आठवणी",
  no_reminders: "आजसाठी कोणत्याही आठवणी नाहीत.",
  mark_done: "झाले",
  reminder_done: "झाले",
  reminder_due: "ही वेळ आहे:",
  voice_assistant: "आवाज सहाय्यक",
  voice_hint: "तुम्ही काय करू शकता हे ऐकण्यासाठी टॅप करा",
  voice_unavailable:
    "या डिव्हाइसवर आवाज उपलब्ध नाही. सूचना स्क्रीनवर दाखवल्या आहेत.",
  profile: "प्रोफाइल",
  language: "भाषा",
  caregiver: "काळजीवाहक",
  care_code: "काळजी कोड",
  care_code_hint:
    "हा कोड तुमच्या काळजीवाहकाला द्या, जेणेकरून ते तुमची प्रगती पाहू शकतील.",
  not_linked: "अजून लिंक केलेले नाही",
  back_home: "घरी परत",
  suggested_level: "सुचवलेली पातळी",

  // Games
  game_instruction: "चित्र लक्षपूर्वक पाहा.",
  sequence_instruction: "क्रम लक्षात ठेवा.",
  memory_preview: "लक्षपूर्वक पाहा.",
  question_prompt: "हे कोण आहे?",
  choose_name: "खालील योग्य नावावर टॅप करा",
  repeat_sequence: "आता क्रम पुन्हा करा.",
  correct_feedback: "खूप छान!",
  incorrect_feedback:
    "हरकत नाही. पुढचा प्रयत्न करू.",
  try_again: "पुन्हा प्रयत्न करू.",
  game_complete:
    "तुम्ही खेळ पूर्ण केला. शाबास.",
  question_of: "प्रश्न",
  of: "पैकी",
  score: "गुण",
  accuracy: "अचूकता",
  mistakes: "चुका",
  response_time: "प्रतिसाद वेळ",
  play_again: "पुन्हा खेळा",
  finish: "समाप्त करा",
  your_result: "तुमचा निकाल",
  need_family_first:
    "हा खेळ सुरू करण्यापूर्वी तुमच्या काळजीवाहकाने कौटुंबिक फोटो जोडणे आवश्यक आहे.",
  need_family_more:
    "कृपया हा खेळ सुरू करण्यासाठी किमान 1 आणखी कुटुंब सदस्य जोडा.",
  caregiver_preview: "काळजीवाहक पूर्वावलोकन: खेळत आहे",

  watch: "पाहा",
  your_turn: "तुमची पाळी",
  level: "पातळी",
  level_up: "पातळी पूर्ण झाली! पुढची पातळी सुरू होत आहे 🎉",
  retry_prompt: "काही हरकत नाही. पुन्हा एकदा काळजीपूर्वक पाहूया.",
  highest_level_reached: "सर्वोच्च पातळी गाठली",

  // Caregiver
  caregiver_dashboard: "काळजीवाहक डॅशबोर्ड",
  elderly_profile: "प्रोफाइल",
  family_members: "कुटुंबातील सदस्य",
  add_member: "कुटुंबातील सदस्य जोडा",
  edit: "संपादित करा",
  delete: "हटवा",
  save: "जतन करा",
  cancel: "रद्द करा",
  name: "नाव",
  relationship: "नाते",
  category: "श्रेणी",
  photo: "फोटो",
  game_performance: "खेळाची कामगिरी",
  games_completed: "खेळ",
  average_score: "सरासरी गुण",
  performance_trend: "खेळाच्या कामगिरीचा कल",
  trend_improving: "सुधारत आहे",
  trend_stable: "स्थिर",
  trend_declining: "घसरत आहे",
  trend_disclaimer:
    "खेळाच्या कामगिरीतील कल केवळ माहितीसाठी आहेत आणि ते वैद्यकीय निदान नाहीत.",
  games_disclaimer:
    "हा कल स्मृती साथीच्या खेळातील कामगिरी दर्शवतो आणि तो वैद्यकीय निदान नाही.",
  adaptive_difficulty: "अनुकूली अवघडपणा",
  alerts: "नोंदी",
  no_alerts: "सध्या नोंद करण्यासारखे काही नाही.",
  reminders: "आठवणी",
  add_reminder: "आठवण जोडा",
  upcoming: "आगामी",
  completed: "पूर्ण",
  missed: "चुकलेले",
  link_elderly: "तुम्ही काळजी घेत असलेल्या व्यक्तीला लिंक करा",
  link_hint:
    "त्यांच्या प्रोफाइलवर दाखवलेला 6-अक्षरी काळजी कोड प्रविष्ट करा.",
  link: "लिंक करा",
  linked_people: "तुम्ही काळजी घेत असलेले लोक",
  no_linked:
    "अजून कोणी लिंक केलेले नाही. सुरुवात करण्यासाठी काळजी कोड प्रविष्ट करा.",
  load_demo: "डेमो कुटुंब आणि इतिहास लोड करा",
  recent_sessions: "अलीकडील सत्रे",
  no_sessions: "अजून कोणताही खेळ खेळला गेलेला नाही.",

  // Offline / sync
  online: "ऑनलाइन",
  offline: "ऑफलाइन",
  results_waiting: "निकाल सिंक होण्याची प्रतीक्षा आहे",
  sync_now: "आता सिंक करा",
  sync_complete: "तुमचे खेळाचे निकाल सिंक झाले आहेत.",
  sync_failed:
    "आत्ता सिंक होऊ शकले नाही. तुमचे निकाल जतन झाले आहेत आणि पुन्हा प्रयत्न केला जाईल.",
  saved_offline:
    "या डिव्हाइसवर जतन केले आहे. ऑनलाइन आल्यावर सिंक होईल.",

  // Levels
  easy: "सोपे",
  medium: "मध्यम",
  hard: "कठीण",
};

const as: Dict = {
  ...en,

  app_name: "স্মৃতি সাথী",
  tagline: "জ্ঞানমূলক যত্নৰ সংগী",

  // Landing Page
  hero_title:
    "জ্যেষ্ঠসকলৰ বাবে এক শান্ত স্মৃতি সংগী — আৰু তেওঁলোকৰ পৰিয়ালৰ বাবে মানসিক শান্তি।",

  hero_description:
    "স্মৃতি সাথীয়ে দুটা সহজ স্মৃতি খেল, দৈনিক সোঁৱৰাই দিয়া আৰু আপোনাৰ নিজৰ ভাষাত কথিত নিৰ্দেশনা প্ৰদান কৰে। যত্ন লওতাসকলে যিকোনো ঠাইৰ পৰা খেলৰ প্ৰদৰ্শন অনুসৰণ কৰিব পাৰে।",

  feature_memory:
    "আপোনাৰ নিজৰ পৰিয়ালৰ ফটোৰ ওপৰত ভিত্তি কৰি দুটা সহজ স্মৃতি খেল",

  feature_voice:
    "ইংৰাজী, হিন্দী, মাৰাঠী আৰু অসমীয়াত কথিত নিৰ্দেশনা",

  feature_offline:
    "ইণ্টাৰনেট নথকালেও খেল চলি থাকে আৰু পিছত ছিংক হয়",

  feature_caregiver:
    "যত্ন লওতাসকলে কেৱল খেলৰ প্ৰদৰ্শন চায় — কোনো চিকিৎসা সম্পৰ্কীয় দাবী নহয়",

  medical_disclaimer:
    "স্মৃতি সাথীয়ে কোনো চিকিৎসাজনিত অৱস্থাৰ নিৰ্ণয় নকৰে। খেলৰ প্ৰদৰ্শনৰ ধাৰাসমূহ কেৱল তথ্যৰ বাবে আৰু চিকিৎসাজনিত নিৰ্ণয় নহয়।",

  // Auth
  sign_in: "ছাইন ইন কৰক",
  sign_in_patient: "ৰোগী / জ্যেষ্ঠ ছাইন ইন",
  sign_in_caregiver: "যত্ন লওতা ছাইন ইন",
  sign_up: "একাউণ্ট বনাওক",
  sign_up_patient: "ৰোগী / জ্যেষ্ঠ হিচাপে পঞ্জীয়ন কৰক",
  sign_up_caregiver: "যত্ন লওতা হিচাপে পঞ্জীয়ন কৰক",
  sign_out: "ছাইন আউট",
  email: "ইমেইল",
  password: "পাছৱৰ্ড",
  full_name: "সম্পূৰ্ণ নাম",
  age: "বয়স",
  i_am: "মই হওঁ",
  role_elderly: "খেল খেলা ব্যক্তি",
  role_caregiver: "পৰিয়ালৰ সদস্য বা যত্ন লওতা",
  login_as_patient: "জ্যেষ্ঠ / ৰোগী লগইন",
  login_as_caregiver: "যত্ন লওতা লগইন",
  patient_desc:
    "জ্ঞানমূলক স্মৃতি খেল খেলক, দৈনিক সোঁৱৰাই দিয়া চাওক আৰু মাতৰ সহায়তা শুনক",
  caregiver_desc:
    "খেলৰ প্ৰদৰ্শন নিৰীক্ষণ কৰক, পৰিয়ালৰ ফটো যোগ কৰক আৰু দৈনিক সোঁৱৰাই দিয়া পৰিচালনা কৰক",
  patient_signup: "ৰোগী হিচাপে পঞ্জীয়ন কৰক",
  caregiver_signup: "যত্ন লওতা হিচাপে পঞ্জীয়ন কৰক",
  continue_google: "Google ৰ সৈতে আগবাঢ়ক",
  have_account: "ইতিমধ্যে একাউণ্ট আছে? ছাইন ইন কৰক",
  need_account: "নতুন নেকি? একাউণ্ট বনাওক",
  check_email:
    "আপোনাৰ একাউণ্ট নিশ্চিত কৰিবলৈ ইমেইল পৰীক্ষা কৰক, তাৰ পিছত ছাইন ইন কৰক।",

  // Home
  welcome: "স্বাগতম। আপুনি কি কৰিব বিচাৰে?",
  home_prompt: "আজি আপুনি কি কৰিব বিচাৰে?",
  greeting: "নমস্কাৰ",
  start_a_game: "খেল আৰম্ভ কৰক",
  family_game: "পৰিয়াল স্মৃতি খেল",
  family_game_desc:
    "ফটো চাওক, তাৰ পিছত শুদ্ধ নাম বাছনি কৰক।",
  sequence_game: "ক্ৰম স্মৃতি খেল",
  sequence_game_desc:
    "নমুনা চাওক, তাৰ পিছত পুনৰ কৰক।",
  start_game: "খেল আৰম্ভ কৰক",
  todays_reminders: "আজিৰ সোঁৱৰাই দিয়া",
  no_reminders: "আজিৰ বাবে কোনো সোঁৱৰাই দিয়া নাই।",
  mark_done: "হ'ল",
  reminder_done: "হ'ল",
  reminder_due: "এই সময় হৈছে:",
  voice_assistant: "মাত সহায়ক",
  voice_hint: "আপুনি কি কৰিব পাৰে শুনিবলৈ টেপ কৰক",
  voice_unavailable:
    "এই ডিভাইচত মাত উপলব্ধ নহয়। নিৰ্দেশনাসমূহ পৰ্দাত দেখুওৱা হৈছে।",
  profile: "প্ৰফাইল",
  language: "ভাষা",
  caregiver: "যত্ন লওতা",
  care_code: "যত্ন কোড",
  care_code_hint:
    "এই কোডটো আপোনাৰ যত্ন লওতাক দিয়ক যাতে তেওঁলোকে আপোনাৰ অগ্ৰগতি অনুসৰণ কৰিব পাৰে।",
  not_linked: "এতিয়াও লিংক কৰা হোৱা নাই",
  back_home: "ঘৰলৈ উভতি যাওক",
  suggested_level: "পৰামৰ্শ দিয়া স্তৰ",

  // Games
  game_instruction: "ছবিখন ভালদৰে চাওক।",
  sequence_instruction: "ক্ৰমটো মনত ৰাখক।",
  memory_preview: "ভালদৰে চাওক।",
  question_prompt: "এইজন কোন?",
  choose_name: "তলত সঠিক নামটো বাছনি কৰক",
  repeat_sequence: "এতিয়া ক্ৰমটো পুনৰ কৰক।",
  correct_feedback: "বৰ ভাল!",
  incorrect_feedback:
    "কোনো কথা নাই। পৰৱৰ্তীটো চেষ্টা কৰোঁ।",
  try_again: "পুনৰ চেষ্টা কৰোঁ।",
  game_complete:
    "আপুনি খেল সম্পূৰ্ণ কৰিলে। ভাল কৰিলে।",
  question_of: "প্ৰশ্ন",
  of: "ৰ",
  score: "নম্বৰ",
  accuracy: "সঠিকতা",
  mistakes: "ভুল",
  response_time: "সঁহাৰি সময়",
  play_again: "পুনৰ খেলক",
  finish: "সমাপ্ত কৰক",
  your_result: "আপোনাৰ ফলাফল",
  need_family_first:
    "এই খেল আৰম্ভ কৰাৰ আগতে আপোনাৰ যত্ন লওতাই পৰিয়ালৰ ফটো যোগ কৰিব লাগিব।",
  need_family_more:
    "এই খেলটো আৰম্ভ কৰিবলৈ অনুগ্ৰহ কৰি কমেও আৰু ১ জন পৰিয়ালৰ সদস্য যোগ কৰক।",
  caregiver_preview: "যত্নদাতা পূৰ্বলোকন: খেলি থকা হৈছে",

  watch: "চাওক",
  your_turn: "আপোনাৰ পাল",
  level: "স্তৰ",
  level_up: "স্তৰ সম্পূৰ্ণ হ'ল! পৰৱৰ্তী স্তৰ মুকলি হৈছে 🎉",
  retry_prompt: "কোনো চিন্তা নাই। পুনৰ এবাৰ ভালদৰে চাওঁ।",
  highest_level_reached: "সৰ্বোচ্চ স্তৰ পালে",

  // Caregiver
  caregiver_dashboard: "যত্ন লওতাৰ ডেশ্বব'ৰ্ড",
  elderly_profile: "প্ৰফাইল",
  family_members: "পৰিয়ালৰ সদস্য",
  add_member: "পৰিয়ালৰ সদস্য যোগ কৰক",
  edit: "সম্পাদনা কৰক",
  delete: "মচক",
  save: "সংৰক্ষণ কৰক",
  cancel: "বাতিল কৰক",
  name: "নাম",
  relationship: "সম্পৰ্ক",
  category: "শ্ৰেণী",
  photo: "ফটো",
  game_performance: "খেলৰ প্ৰদৰ্শন",
  games_completed: "খেল",
  average_score: "গড় নম্বৰ",
  performance_trend: "খেলৰ প্ৰদৰ্শনৰ ধাৰা",
  trend_improving: "উন্নতি হৈছে",
  trend_stable: "স্থিৰ",
  trend_declining: "অৱনতি হৈছে",
  trend_disclaimer:
    "খেলৰ প্ৰদৰ্শনৰ ধাৰাসমূহ কেৱল তথ্যৰ বাবে আৰু চিকিৎসাজনিত নিৰ্ণয় নহয়।",
  games_disclaimer:
    "এই ধাৰাটোৱে স্মৃতি সাথীৰ খেলসমূহৰ প্ৰদৰ্শন প্ৰতিফলিত কৰে আৰু ই চিকিৎসাজনিত নিৰ্ণয় নহয়।",
  adaptive_difficulty: "অনুকূলিত কঠিনতা",
  alerts: "টোকা",
  no_alerts: "এই মুহূৰ্তত কোনো কথা উল্লেখ কৰিবলগীয়া নাই।",
  reminders: "সোঁৱৰাই দিয়া",
  add_reminder: "সোঁৱৰাই দিয়া যোগ কৰক",
  upcoming: "আগন্তুক",
  completed: "সম্পূৰ্ণ",
  missed: "বাদ পৰা",
  link_elderly: "আপুনি যত্ন লোৱা ব্যক্তিজনক লিংক কৰক",
  link_hint:
    "তেওঁলোকৰ প্ৰফাইলত দেখুওৱা ৬-অংকৰ যত্ন কোডটো দিয়ক।",
  link: "লিংক কৰক",
  linked_people: "আপুনি যত্ন লোৱা লোকসকল",
  no_linked:
    "এতিয়াও কোনো লিংক কৰা হোৱা নাই। আৰম্ভ কৰিবলৈ যত্ন কোড দিয়ক।",
  load_demo: "ডেমো পৰিয়াল আৰু ইতিহাস লোড কৰক",
  recent_sessions: "শেহতীয়া ছেচন",
  no_sessions: "এতিয়াও কোনো খেল খেলা হোৱা নাই।",

  // Offline / sync
  online: "অনলাইন",
  offline: "অফলাইন",
  results_waiting: "ফলাফল ছিংকৰ বাবে অপেক্ষা কৰি আছে",
  sync_now: "এতিয়া ছিংক কৰক",
  sync_complete: "আপোনাৰ খেলৰ ফলাফল ছিংক হৈছে।",
  sync_failed:
    "এতিয়া ছিংক কৰিব পৰা নগ'ল। আপোনাৰ ফলাফল সংৰক্ষিত হৈছে আৰু পুনৰ চেষ্টা কৰা হ'ব।",
  saved_offline:
    "এই ডিভাইচত সংৰক্ষিত হৈছে। অনলাইন হ'লে ছিংক হ'ব।",

  // Levels
  easy: "সহজ",
  medium: "মধ্যম",
  hard: "কঠিন",
};

const bn: Dict = {
  ...en,

  app_name: "স্মৃতি সাথী",
  tagline: "জ্ঞানীয় যত্ন সঙ্গী",

  // Landing Page
  hero_title:
    "বয়োজ্যেষ্ঠদের জন্য এক প্রশান্ত স্মৃতি সঙ্গী — এবং তাঁদের পরিবারের জন্য মানসিক শান্তি।",

  hero_description:
    "স্মৃতি সাথী দুটি সহজ স্মৃতি খেলা, দৈনন্দিন অনুস্মারক এবং আপনার নিজের ভাষায় কথ্য নির্দেশনা প্রদান করে। যত্নশীলরা যেকোনো জায়গা থেকে খেলার পারফরম্যান্স পর্যবেক্ষণ করতে পারেন।",

  feature_memory:
    "আপনার নিজের পারিবারিক ছবির ওপর ভিত্তি করে দুটি সহজ স্মৃতি খেলা",

  feature_voice:
    "বাংলা, ইংরেজি, হিন্দি, মারাঠি ও অসমীয়াসহ নিজস্ব ভাষায় কথ্য নির্দেশনা",

  feature_offline:
    "ইন্টারনেট ছাড়াও খেলাগুলি চলে এবং পরে সিঙ্ক হয়ে যায়",

  feature_caregiver:
    "যত্নশীলরা শুধুমাত্র খেলার পারফরম্যান্স দেখতে পান — কোনো ডাক্তারি দাবি নয়",

  medical_disclaimer:
    "স্মৃতি সাথী কোনো চিকিৎসা পরিস্থিতি নির্ণয় করে না। খেলার পারফরম্যান্সের ধারাগুলো শুধুমাত্র তথ্যমূলক এবং ডাক্তারি রোগনির্ণয় নয়।",

  // Auth
  sign_in: "সাইন ইন করুন",
  sign_in_patient: "রোগী / প্রবীণ সাইন ইন",
  sign_in_caregiver: "যত্নশীল সাইন ইন",
  sign_up: "অ্যাকাউন্ট তৈরি করুন",
  sign_up_patient: "রোগী / প্রবীণ হিসেবে নিবন্ধন করুন",
  sign_up_caregiver: "যত্নশীল হিসেবে নিবন্ধন করুন",
  sign_out: "সাইন আউট",
  email: "ইমেল",
  password: "পাসওয়ার্ড",
  full_name: "পুরো নাম",
  age: "বয়স",
  i_am: "আমি একজন",
  role_elderly: "যিনি খেলা খেলছেন (রোগী / প্রবীণ)",
  role_caregiver: "পরিবারের সদস্য বা যত্নশীল",
  login_as_patient: "প্রবীণ / রোগী লগইন",
  login_as_caregiver: "যত্নশীল লগইন",
  patient_desc:
    "জ্ঞানীয় স্মৃতি খেলা খেলুন, দৈনন্দিন অনুস্মারক দেখুন এবং কথ্য সহায়তা শুনুন",
  caregiver_desc:
    "খেলার পারফরম্যান্স পর্যবেক্ষণ করুন, পারিবারিক ছবি যুক্ত করুন এবং দৈনন্দিন অনুস্মারক পরিচালনা করুন",
  patient_signup: "রোগী হিসেবে নিবন্ধন করুন",
  caregiver_signup: "যত্নশীল হিসেবে নিবন্ধন করুন",
  continue_google: "Google দিয়ে এগিয়ে যান",
  have_account: "ইতিমধ্যেই অ্যাকাউন্ট আছে? সাইন ইন করুন",
  need_account: "নতুন ব্যবহারকারী? অ্যাকাউন্ট তৈরি করুন",
  check_email:
    "আপনার অ্যাকাউন্ট নিশ্চিত করতে ইমেল পরীক্ষা করুন, তারপর সাইন ইন করুন।",

  // Home
  welcome: "স্বাগতম। আপনি কী করতে চান?",
  home_prompt: "আজ আপনি কী করতে চান?",
  greeting: "নমস্কার",
  start_a_game: "একটি খেলা শুরু করুন",
  family_game: "পারিবারিক স্মৃতি খেলা",
  family_game_desc:
    "একটি ছবি দেখুন, তারপর সঠিক নামটি বেছে নিন।",
  sequence_game: "ক্রম স্মৃতি খেলা",
  sequence_game_desc:
    "একটি সংক্ষিপ্ত প্যাটার্ন দেখুন, তারপর তা পুনরাবৃত্তি করুন।",
  start_game: "খেলা শুরু করুন",
  todays_reminders: "আজকের অনুস্মারক",
  no_reminders: "আজকের জন্য কোনো অনুস্মারক নেই।",
  mark_done: "সম্পন্ন",
  reminder_done: "সম্পন্ন",
  reminder_due: "এর সময় হয়েছে:",
  voice_assistant: "ভয়েস সহকারী",
  voice_hint: "আপনি কী করতে পারেন তা শুনতে ট্যাপ করুন",
  voice_unavailable:
    "এই ডিভাইসে ভয়েস উপলব্ধ নয়। নির্দেশাবলী স্ক্রিনে প্রদর্শিত হচ্ছে।",
  profile: "প্রোফাইল",
  language: "ভাষা",
  caregiver: "যত্নশীল",
  care_code: "যত্ন কোড",
  care_code_hint:
    "এই কোডটি আপনার যত্নশীলকে দিন যাতে তিনি আপনার অগ্রগতি দেখতে পারেন।",
  not_linked: "এখনো যুক্ত করা হয়নি",
  back_home: "হোমে ফিরে যান",
  suggested_level: "প্রস্তাবিত স্তর",

  // Games
  game_instruction: "ছবিটি মনোযোগ দিয়ে দেখুন।",
  sequence_instruction: "ক্রমটি মনে রাখুন।",
  memory_preview: "মনোযোগ দিয়ে দেখুন।",
  question_prompt: "ইনি কে?",
  choose_name: "নিচে সঠিক নামে ট্যাপ করুন",
  repeat_sequence: "এবার প্যাটার্নটি পুনরাবৃত্তি করুন।",
  correct_feedback: "খুব সুন্দর!",
  incorrect_feedback:
    "কোনো ব্যাপার না। আসুন পরেরটি চেষ্টা করি।",
  try_again: "আসুন আবার চেষ্টা করি।",
  game_complete:
    "আপনি খেলাটি সম্পূর্ণ করেছেন। দারুণ!",
  question_of: "প্রশ্ন",
  of: "এর মধ্যে",
  score: "স্কোর",
  accuracy: "সঠিকতা",
  mistakes: "ভুল",
  response_time: "প্রতিক্রিয়ার সময়",
  play_again: "আবার খেলুন",
  finish: "সমাপ্ত",
  your_result: "আপনার ফলাফল",
  need_family_first:
    "এই খেলা শুরু করার আগে আপনার যত্নশীলকে পারিবারিক ছবি যুক্ত করতে হবে।",
  need_family_more:
    "এই খেলাটি শুরু করতে অনুগ্রহ করে কমপক্ষে আরও ১ জন পরিবারের সদস্য যুক্ত করুন।",
  caregiver_preview: "যত্নশীল প্রিভিউ: খেলছেন",

  watch: "দেখুন",
  your_turn: "আপনার পালা",
  level: "স্তর",
  level_up: "স্তর পার হয়েছে! পরবর্তী স্তর আনলক হচ্ছে 🎉",
  retry_prompt: "কোনো চিন্তা নেই। আসুন আরও একবার মনোযোগ দিয়ে দেখি।",
  highest_level_reached: "সর্বোচ্চ স্তর অর্জিত",

  // Caregiver
  caregiver_dashboard: "যত্নশীল ড্যাশবোর্ড",
  elderly_profile: "প্রোফাইল",
  family_members: "পরিবারের সদস্যরা",
  add_member: "পরিবারের সদস্য যুক্ত করুন",
  edit: "সম্পাদনা",
  delete: "মুছুন",
  save: "সংরক্ষণ করুন",
  cancel: "বাতিল",
  name: "নাম",
  relationship: "সম্পর্ক",
  category: "বিভাগ",
  photo: "ছবি",
  game_performance: "খেলার পারফরম্যান্স",
  games_completed: "খেলা",
  average_score: "গড় স্কোর",
  performance_trend: "খেলার পারফরম্যান্স ধারা",
  trend_improving: "উন্নতি হচ্ছে",
  trend_stable: "স্থিতিশীল",
  trend_declining: "অবনতি",
  trend_disclaimer:
    "খেলার পারফরম্যান্সের ধারাগুলো তথ্যমূলক এবং চিকিৎসাজনিত রোগনির্ণয় নয়।",
  games_disclaimer:
    "এই ধারাটি স্মৃতি সাথীর খেলাগুলির পারফরম্যান্স প্রকাশ করে এবং কোনো ডাক্তারি নির্ণয় নয়।",
  adaptive_difficulty: "অভিযোজিত স্তর",
  alerts: "নোট",
  no_alerts: "এই মুহূর্তে কোনো নোট নেই।",
  reminders: "অনুস্মারক",
  add_reminder: "অনুস্মারক যুক্ত করুন",
  upcoming: "আসন্ন",
  completed: "সম্পন্ন",
  missed: "অনুপস্থিত",
  link_elderly: "আপনি যাঁর যত্ন নেন তাঁকে যুক্ত করুন",
  link_hint:
    "তাঁদের প্রোফাইলে প্রদর্শিত ৬ অক্ষরের কেয়ার কোডটি লিখুন।",
  link: "যুক্ত করুন",
  linked_people: "যাঁদের যত্ন নিচ্ছেন",
  no_linked:
    "এখনো কাউকে যুক্ত করা হয়নি। শুরু করতে একটি কেয়ার কোড লিখুন।",
  load_demo: "ডেমো পরিবার এবং ইতিহাস লোড করুন",
  recent_sessions: "সাম্প্রতিক সেশন",
  no_sessions: "এখনো কোনো খেলা খেলা হয়নি।",

  // Offline / sync
  online: "অনলাইন",
  offline: "অফলাইন",
  results_waiting: "ফলাফল সিঙ্ক হওয়ার অপেক্ষায় রয়েছে",
  sync_now: "এখনই সিঙ্ক করুন",
  sync_complete: "আপনার খেলার ফলাফল সিঙ্ক হয়েছে।",
  sync_failed:
    "এখন সিঙ্ক করা যায়নি। আপনার ফলাফল সংরক্ষিত আছে এবং পুনরায় চেষ্টা করা হবে।",
  saved_offline:
    "এই ডিভাইসে সংরক্ষিত হয়েছে। অনলাইন এলে সিঙ্ক হবে।",

  // Levels
  easy: "সহজ",
  medium: "মাঝারি",
  hard: "কঠিন",
};

const lus: Dict = {
  ...en,

  app_name: "Smriti Sathi",
  tagline: "Hriatreuna enkawltu ṭhian",

  // Landing Page
  hero_title:
    "Pitar leh putarte tana hriatreuna ṭhian muanawm — chhungte tana rilru hahdamna.",

  hero_description:
    "Smriti Sathi hian hriatreuna infiamna awlsam tak pahnih, nitin hriattirna leh mahni ṭawnga aw hmanga kaihhruaina a pe. Enkawltute chuan khawi hmun aṭang pawhin infiamna kalhmang an en thei.",

  feature_memory:
    "Chhungkaw thlalak ngei hmanga infiamna awlsam pahnih",

  feature_voice:
    "Mizo, English, Hindi leh ṭawng danga aw hmanga kaihhruaina",

  feature_offline:
    "Internet awm loh pawhin a khelh theih a, hnuaiah a in-sync leh ang",

  feature_caregiver:
    "Enkawltuten infiamna dinhmun chauh an hmu ang — damdawi thutlukna a ni lo",

  medical_disclaimer:
    "Smriti Sathi hian natna a zawngchhuak lo. Infiamna dinhmun hi hriatzauna atan chauh a ni a, damdawi lam thutlukna a ni lo.",

  // Auth
  sign_in: "Lut rawh",
  sign_in_patient: "Damlo / Pitar-Putar Luhna",
  sign_in_caregiver: "Enkawltu Luhna",
  sign_up: "Account siam rawh",
  sign_up_patient: "Damlo / Pitar-Putar inziah luhna",
  sign_up_caregiver: "Enkawltu inziah luhna",
  sign_out: "Chhuak rawh",
  email: "Email",
  password: "Password",
  full_name: "Hming pum",
  age: "Kum",
  i_am: "Ka nihna",
  role_elderly: "Infiamna hmangtu (Damlo / Pitar-Putar)",
  role_caregiver: "Chhungkhat emaw enkawltu",
  login_as_patient: "Pitar-Putar / Damlo Luhna",
  login_as_caregiver: "Enkawltu Luhna",
  patient_desc:
    "Hriatreuna infiamna khel la, nitin hriattirna enin aw ṭanpuina ngaithla rawh",
  caregiver_desc:
    "Infiamna dinhmun vil la, chhungkaw thlalak dah lutin nitin hriattirna enkawl rawh",
  patient_signup: "Damlo anga inziah luhna",
  caregiver_signup: "Enkawltu anga inziah luhna",
  continue_google: "Google hmangin chhunzawm rawh",
  have_account: "Account i nei tawh em? Lut rawh",
  need_account: "A thar i ni em? Account siam rawh",
  check_email:
    "I account nemngheh nan i email enfiah la, chumi hnuah lut rawh.",

  // Home
  welcome: "Chibai. Vawiinah enge i tih duh le?",
  home_prompt: "Vawiinah enge i tih duh le?",
  greeting: "Chibai",
  start_a_game: "Infiamna ṭan rawh",
  family_game: "Chhungkaw Hriatreuna Infiamna",
  family_game_desc:
    "Thlalak en la, hming dik thlang rawh.",
  sequence_game: "Indawt Hriatreuna",
  sequence_game_desc:
    "Entirna en la, a dawt zelin zawm rawh.",
  start_game: "Khel ṭan rawh",
  todays_reminders: "Vawiin hriattirnate",
  no_reminders: "Vawiin atan hriattirna a awm lo.",
  mark_done: "Zo ta",
  reminder_done: "Zo ta",
  reminder_due: "A hun a thleng ta:",
  voice_assistant: "Aw hmanga ṭanpuitu",
  voice_hint: "I tih theih hriat nan hmet rawh",
  voice_unavailable:
    "He khawlah hian aw a awm thei lo. Hriattirna hi screen-ah a lang.",
  profile: "Profile",
  language: "Ṭawng",
  caregiver: "Enkawltu",
  care_code: "Care code",
  care_code_hint:
    "I enkawltu hnenah he code hi pe la, i hmasawnna an lo thlir thei ang.",
  not_linked: "Zawm a la ni lo",
  back_home: "In lamah kir leh rawh",
  suggested_level: "Rawtna level",

  // Games
  game_instruction: "Thlalak hi uluk takin en rawh.",
  sequence_instruction: "A indawt dan hi hre reng rawh.",
  memory_preview: "Uluk takin en rawh.",
  question_prompt: "Tunge he mi hi?",
  choose_name: "A hnuai ami hming dik hi hmet rawh",
  repeat_sequence: "Tunah a dawt danin zawm ve rawh le.",
  correct_feedback: "A va ṭha em!",
  incorrect_feedback:
    "A pawi lo ve. A dawt leh ami kan tum dawn nia.",
  try_again: "Tum nawn leh ang hmiang.",
  game_complete:
    "Infiamna i zo ta. I ti ṭha hle mai.",
  question_of: "Zawhna",
  of: "/",
  score: "Point",
  accuracy: "Dik zat",
  mistakes: "Tihsual",
  response_time: "Chhan hun chhung",
  play_again: "Khel nawn leh rawh",
  finish: "Zo ta",
  your_result: "I result",
  need_family_first:
    "He infiamna ṭan hmain i enkawltuin chhungkaw thlalak a dah luh a ngai.",
  need_family_more:
    "He infiamna ṭan nan khawngaihin chhungkaw mi pakhat tal belh leh rawh.",
  caregiver_preview: "Enkawltu Preview: Khelhsak mek",

  watch: "En rawh",
  your_turn: "I hun a thleng ta",
  level: "Level",
  level_up: "Level i zo ta! A dawt chhawng a inhawng e 🎉",
  retry_prompt: "A pawi lo ve. Vawikhat uluk takin i en nawn leh ang hmiang.",
  highest_level_reached: "Level sang ber thlen chin",

  // Caregiver
  caregiver_dashboard: "Enkawltu Dashboard",
  elderly_profile: "Profile",
  family_members: "Chhungkaw mite",
  add_member: "Chhungkaw mi belh rawh",
  edit: "Siamṭha rawh",
  delete: "Paihsak rawh",
  save: "Vawng ṭha rawh",
  cancel: "Ṭhulh rawh",
  name: "Hming",
  relationship: "Inlaichinna",
  category: "Pawl",
  photo: "Thlalak",
  game_performance: "Khelh dan dinhmun",
  games_completed: "Khelh zat",
  average_score: "Average score",
  performance_trend: "Hmasawnna kalhmang",
  trend_improving: "A ṭha chho zel",
  trend_stable: "A ngai reng",
  trend_declining: "A tla hniam",
  trend_disclaimer:
    "Infiamna dinhmun hi hriatzauna chauh a ni a, damdawi lam thutlukna a ni lo.",
  games_disclaimer:
    "He kalhmang hian Smriti Sathi infiamna khelh dan chauh a entir a, damdawi thutlukna a ni lo.",
  adaptive_difficulty: "Harsat zawng insiamrem",
  alerts: "Hriattirnate",
  no_alerts: "Tunah hriattirna thar a awm lo.",
  reminders: "Hriattirnate",
  add_reminder: "Hriattirna belh rawh",
  upcoming: "Lo thleng tur",
  completed: "Tih zawh tawh",
  missed: "Tih hmaih",
  link_elderly: "I enkawl lai zawm rawh",
  link_hint:
    "An profile-a 6-character care code lang kha chhu lut rawh.",
  link: "Zawm rawh",
  linked_people: "I enkawl laite",
  no_linked:
    "Zawm a la awm lo. Ṭan nan care code chhu lut rawh.",
  load_demo: "Demo chhungkua leh chanchin dah lut rawh",
  recent_sessions: "Khelh hnuhnungte",
  no_sessions: "Infiamna khelh a la awm lo.",

  // Offline / sync
  online: "Online",
  offline: "Offline",
  results_waiting: "results sync nghak mek",
  sync_now: "Sync nghal rawh",
  sync_complete: "I infiamna result chu sync fel a ni ta.",
  sync_failed:
    "Sync theih rih a ni lo. I result a him a, a tum nawn leh ang.",
  saved_offline:
    "He khawlah hian dah ṭhat a ni. Online leh hunah a in-sync ang.",

  // Levels
  easy: "Awlsam",
  medium: "Laihawi",
  hard: "Harsa",
};

const DICTS: Record<LanguageCode, Dict> = {
  en,
  hi,
  mr,
  as,
  bn,
  lus,
};

export type TranslationKey = keyof typeof en;

export function t(
  lang: LanguageCode,
  key: TranslationKey | string,
): string {
  const dict = DICTS[lang] ?? en;

  return dict[key] ?? en[key] ?? String(key);
}