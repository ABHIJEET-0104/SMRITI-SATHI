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

const DICTS: Record<LanguageCode, Dict> = {
  en,
  hi,
  mr,
  as,
};

export type TranslationKey = keyof typeof en;

export function t(
  lang: LanguageCode,
  key: TranslationKey | string,
): string {
  const dict = DICTS[lang] ?? en;

  return dict[key] ?? en[key] ?? String(key);
}