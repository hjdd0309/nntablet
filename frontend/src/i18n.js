import { useApp } from './context/AppContext'

const translations = {
  ko: {
    back: '뒤로',
    chooseLanguage: '언어를 선택해주세요',

    chooseState: '상태를 선택해주세요',
    imWaiting: '대기 중입니다',
    readyToEnjoy: '즐길 준비가\n됐어요!',

    selectWorkshop: '공방을 선택해주세요',

    welcomeTitle: '나녕 공방에 오신 것을 환영합니다',
    exploreToGallery: '갤러리 탐색하기',
    whatIsChilbo: '칠보란 무엇인가요?',
    aboutChilbo: '칠보에 대하여',
    askForHelp: '도움 요청하기',
    readyToEnjoyBtn: '즐길 준비가 됐어요!',
    chilboMeta: '칠보공예; chilbogongye',
    priceMeta: '가격, 과정 등',

    call: '호출',

    chooseYourDesign: '디자인을 선택해주세요',
    koreanHat: '한국 모자\n(갓)',
    rectangularBase: '직사각형\n베이스',

    information: '정보',
    aboutChilboTitle: '칠보에 대하여',
    aboutChilboDesc:
      '칠보는 금속에 화려한 에나멜을 장식하는 전통 한국 공예입니다. 칠보는 금속에 화려한 에나멜을 장식하는 전통 한국 공예입니다. 칠보는 금속에 화려한 에나멜을 장식하는 전통 한국 공예입니다.',
    chooseYourDesignTitle: '디자인 선택',
    chooseDesignDesc: '칠보는 금속에 화려한 에나멜을 장식하는 전통 한국 공예입니다. 칠보공예',
    koreanHatGat: '한국 모자 (갓)',
    square: '정사각형',
    price: '가격',
    duration: '소요 시간',
    difficulty: '난이도',
    experienceProgress: '체험 진행 과정',

    galleryTitle: '갤러리 탐색하기',
    mySaved: '🔖 저장 목록',
    filter: '≡ 필터',
    mostLiked: '좋아요 많은 순',
    mostSaved: '저장 많은 순',

    askForHelpTitle: '도움 요청하기',
    selectRoleSubtitle: '즉시 번역을 시작하려면 역할을 선택해주세요',
    imOwner: '저는\n사장님입니다',
    imGuest: '저는\n손님입니다',
    otherQuestions: '다른 질문',
    selectQuestionSubtitle: '자주 묻는 질문을 선택하거나 번역을 요청하세요',
    checkTranslationSubtitle: '메시지가 정확하게 번역되었는지 확인해주세요',
    listeningText: '듣는 중...',
    tapMic: '마이크를 눌러 질문하세요',
    didIGetRight: '제대로 이해했나요?',
    noTryAgain: '아니요, 다시 시도해주세요',
    yesThatRight: '네, 맞아요',
    speakClearly: '질문을 명확하게 말씀해주세요',
    ownerQuestion: '이 부분이 어려우신가요? 도와드릴게요',

    stepOverview: '개요',
    stepChooseDesign: '디자인 선택',
    stepSketching: '스케치',
    stepProcessLog: '작업 기록',
    stepHandcrafting: '손작업',
    stepSelectPackage: '패키지 선택',
    stepCompletion: '완성',
  },
  en: {
    back: 'Back',
    chooseLanguage: 'Choose your language',

    chooseState: 'Choose your State',
    imWaiting: "I'm waiting",
    readyToEnjoy: 'Ready to\nEnjoy!',

    selectWorkshop: 'Select a Workshop',

    welcomeTitle: 'Welcome to Nanyeong Workshop',
    exploreToGallery: 'Explore to Gallery',
    whatIsChilbo: 'What is Chilbo?',
    aboutChilbo: 'About Chilbo',
    askForHelp: 'Ask for Help',
    readyToEnjoyBtn: 'Ready to Enjoy!',
    chilboMeta: '칠보공예; chilbogongye',
    priceMeta: 'Price, Process, etc',

    call: 'Call',

    chooseYourDesign: 'Choose your design',
    koreanHat: 'Korean hat\n(Gat)',
    rectangularBase: 'Rectangular\nBase',

    information: 'Information',
    aboutChilboTitle: 'About Chilbo',
    aboutChilboDesc:
      'Chilbo is a traditional Korean craft that decorates metal with colourful enamel. Chilbo is a traditional Korean craft that decorates metal with colourful enamel. Chilbo is a traditional Korean craft that decorates metal with colourful enamel.',
    chooseYourDesignTitle: 'Choose your Design',
    chooseDesignDesc: 'Chilbo is a traditional Korean craft that decorates metal with colourful enamel. Chilbo is a traditional Korean craft',
    koreanHatGat: 'Korean hat (Gat)',
    square: 'Square',
    price: 'Price',
    duration: 'Duration',
    difficulty: 'Difficulty',
    experienceProgress: 'Experience progress',

    galleryTitle: 'Explore to Gallery',
    mySaved: '🔖 My Saved',
    filter: '≡ Filter',
    mostLiked: 'Most liked',
    mostSaved: 'Most saved',

    askForHelpTitle: 'Ask for Help',
    selectRoleSubtitle: 'Select your role to start the instant translation',
    imOwner: "I'm the\nOwner",
    imGuest: "I'm a\nGuest",
    otherQuestions: 'Other Questions',
    selectQuestionSubtitle: 'Select a common question or request a translation',
    checkTranslationSubtitle: 'Please check if the message has been translated accurately',
    listeningText: 'Listening...',
    tapMic: 'Tap the microphone to ask a question',
    didIGetRight: 'Did I get that right?',
    noTryAgain: 'No, try again',
    yesThatRight: "Yes, that's right",
    speakClearly: 'Speak your question clearly',
    ownerQuestion: "I'm struggling with this part, please help",

    stepOverview: 'Overview',
    stepChooseDesign: 'Choose Design',
    stepSketching: 'Sketching',
    stepProcessLog: 'Process Log',
    stepHandcrafting: 'Handcrafting',
    stepSelectPackage: 'Select Package',
    stepCompletion: 'Completion',
  },
}

export function useT() {
  const { language } = useApp()
  return translations[language === '한국어' ? 'ko' : 'en']
}
