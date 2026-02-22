import { describe } from "node:test";

export type Language = "en" | "ka";

export const translations = {
  nav: {
    home: { en: "Home", ka: "მთავარი" },
    interactiveMap: { en: "Interactive Map", ka: "ინტერაქტიული რუკა" },
    riskAlert: { en: "Risk Alert", ka: "საფრთხის შეტყობინება" },
    landmarks: { en: "Landmarks", ka: "ღირსშესანიშნაობები" },
    projects: { en: "Projects", ka: "პროექტები" },
    findings: { en: "Findings", ka: "კვლევები" },
    news: { en: "News", ka: "სიახლეები" },
    contact: { en: "Contact", ka: "კონტაქტი" },
    about: { en: "About", ka: "ჩვენ შესახებ" },
  },
  map: {
    title: {
      en: "Environmental Monitoring Map",
      ka: "გარემოს მონიტორინგის რუკა",
    },
    headerDesc: {
      'ka': "თვალი ადევნეთ მონაცემებს, მოქალაქეთა რეპორტებს, დაბინძურების წერტილებს და მდინარის მონიტორინგის შედეგებს რეალურ დროში.",
    },
    description: {
      ka: "თვალი ადევნეთ მონაცემებს, მოქალაქეთა რეპორტებს, დაბინძურების წერტილებს და მდინარის მონიტორინგის შედეგებს რეალურ დროში."
    },
    
    apiKeyMissingTitle: {
      en: "Google Maps API Key Missing",
      ka: "აკლია Google Maps API კოდი",
    },
    apiKeyMissingBody: {
      en: "Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file",
      ka: "გთხოვთ დაამატოთ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY თქვენს .env.local ფაილში",
    },
    reportPromptTitle: {
      en: "Report Environmental Issue?",
      ka: "გარემოსდაცვითი პრობლემის მოხსენება?",
    },
    reportPromptBody: {
      en: "You've selected a location. Do you want to report an environmental issue here?",
      ka: "თქვენ აირჩიეთ მდებარეობა. გსურთ ამ ადგილზე გარემოსდაცვითი პრობლემის შეტყობინება?",
    },
    reportYes: { en: "Yes, Report Issue", ka: "დიახ, პრობლემის შეტყობინება" },
    cancel: { en: "Cancel", ka: "გაუქმება" },
    status: {
      normal: { en: "Normal", ka: "ნორმალური" },
      risk: { en: "Risk", ka: "რისკი" },
      problematic: { en: "Problematic", ka: "პრობლემური" },
      warning: { en: "Warning", ka: "გაფრთხილება" },
      problem: { en: "Problem", ka: "პრობლემა" },
    },
    legendStatusTitle: {
      en: "Water Quality Status",
      ka: "წყლის ხარისხის სტატუსი",
    },
    legendTitle: { en: "Layer Types", ka: "ფენების ტიპები" },
    instructionsTitle: {
      en: "How to Use the Map",
      ka: "როგორ გამოვიყენოთ რუკა",
    },
    instructionStep1: {
      en: "Select a layer from the buttons above to filter data by type (water quality, pollution, risks, or infrastructure).",
      ka: "აირჩიეთ ფენა ზემოთ მოცემული ღილაკებიდან, რათა გაფილტროთ მონაცემები ტიპის მიხედვით (წყლის ხარისხი, დაბინძურება, რისკები ან ინფრასტრუქტურა).",
    },
    instructionStep2: {
      en: "Click on any colored marker on the map to view detailed information about that monitoring point.",
      ka: "დააწკაპუნეთ ნებისმიერ ფერად მარკერზე რუკაზე, რათა იხილოთ დეტალური ინფორმაცია მონიტორინგის იმ წერტილის შესახებ.",
    },
    instructionStep3: {
      en: "Click anywhere on the map to report a new environmental issue at that location.",
      ka: "დააწკაპუნეთ რუკაზე ნებისმიერ ადგილას, რათა მოახსენოთ ახალი გარემოსდაცვითი პრობლემა იმ ლოკაციაზე.",
    },
    instructionStep4: {
      en: "View the statistics at the bottom to see an overview of environmental conditions in the area.",
      ka: "იხილეთ სტატისტიკა ქვემოთ, რათა მიიღოთ ზოგადი წარმოდგენა გარემოსდაცვით პირობებზე რეგიონში.",
    },
    layersCardTitle: { en: "Map Layers", ka: "რუკის ფენები" },
    layersCardDesc: {
      en: "Toggle data visibility",
      ka: "მონაცემების ხილვადობის გადართვა",
    },
    layerAll: { en: "All Layers", ka: "ყველა ფენა" },
    layerWater: { en: "Water Quality", ka: "წყლის ხარისხი" },
    layerPollution: { en: "All Pollution", ka: "ყველა დაბინძურება" },
    layerWaste: { en: "Waste Accumulation", ka: "ნარჩენების დაგროვება" },
    layerIllegalDump: { en: "Illegal Dumping", ka: "არალეგალური ჩაღვრა" },
    layerOdor: { en: "Odor/Stagnation", ka: "სუნი/სტაგნაცია" },
    layerFlood: { en: "Flood Zones", ka: "დატბორვის ზონები" },
    layerDrainage: { en: "Drainage Channels", ka: "სანიაღვრე არხები" },
    layerSeaIntrusion: { en: "Sea Water Intrusion", ka: "ზღვის წყლის შეჭრა" },
    layerErosion: { en: "Erosion Sections", ka: "ეროზიის მონაკვეთები" },
    layerRisk: { en: "Other Climate Risks", ka: "სხვა კლიმატის რისკები" },
    layerInfrastructure: {
      en: "Other Infrastructure",
      ka: "სხვა ინფრასტრუქტურა",
    },
    quickStatsNormal: { en: "Normal Status", ka: "ნორმალური სტატუსი" },
    quickStatsRisk: { en: "At Risk", ka: "რისკის ქვეშ" },
    quickStatsProblem: { en: "Problem Areas", ka: "პრობლემური ზონები" },
    quickStatsReports: { en: "Citizen Reports", ka: "მოქალაქეთა რეპორტები" },
    reportIssueTitle: { en: "Report an Issue", ka: "პრობლემის მოხსენება" },
    reportIssueHint: {
      en: "See pollution or environmental concerns?",
      ka: "ხედავთ დაბინძურებას ან გარემოს პრობლემებს?",
    },
  },
  footer: {
    quickLinks: { en: "Quick Links", ka: "სწრაფი ბმულები" },
    interactiveMap: { en: "Interactive Map", ka: "ინტერაქტიული რუკა" },
    ourProjects: { en: "Our Projects", ka: "ჩვენი პროექტები" },
    reportIssue: { en: "Report an Issue", ka: "პრობლემის მოხსენება" },
    findingsReports: {
      en: "Findings & Reports",
      ka: "მონაცემები და რეპორტები",
    },
    contact: { en: "Contact", ka: "კონტაქტი" },
    aboutBody: {
      en: "Strengthening climate resilience and environmental governance through data-driven analysis, community engagement, and policy advocacy in Poti, Georgia.",
      ka: "ვნერგავთ ინოვაციურ მიდგომებს და ვაძლიერებთ პარტნიორი ორგანიზაციების ინსტიტუციურ პასუხისმგებლობას და მდგრადობას.",
    },
    copyright: {
      en: "© CPC Georgia. All rights reserved.",
      ka: "© CPC საქართველო. ყველა უფლება დაცულია.",
    },
  },
  modals: {
    dataModal: {
      titles: {
        water: {
          en: "Water Quality Monitoring Point",
          ka: "წყლის ხარისხის მონიტორინგის პუნქტი",
        },
        pollution: { en: "Pollution Hotspot", ka: "დაბინძურების ჰოთსპოტი" },
        risk: { en: "Climate Risk Zone", ka: "კლიმატის რისკის ზონა" },
        infrastructure: {
          en: "Infrastructure Point",
          ka: "ინფრასტრუქტურის პუნქტი",
        },
      },
      description: { en: "Description", ka: "აღწერა" },
      close: { en: "Close", ka: "დახურვა" },
      viewFullReport: { en: "View Full Report", ka: "სრული რეპორტის ნახვა" },
      reportedBy: { en: "Reported By", ka: "ავტორი" },
      dateReported: { en: "Date Reported", ka: "რეპორტის თარიღი" },
    },
    clickReport: {
      title: {
        en: "Report Environmental Issue",
        ka: "გარემოსდაცვითი პრობლემის მოხსენება",
      },
      body: {
        en: "Report an issue at the selected location",
        ka: "მოხსენეთ პრობლემა არჩეულ ლოკაციაზე",
      },
      contactInfo: {
        en: "Your Contact Information",
        ka: "თქვენი საკონტაქტო ინფორმაცია",
      },
      submitting: { en: "Submitting...", ka: "იგზავნება..." },
    },
  },
  report: {
    issueType: { en: "Type of Issue *", ka: "პრობლემის ტიპი *" },
    issueTypeSelect: { en: "Select issue type", ka: "აირჩიეთ პრობლემის ტიპი" },
    issueTypeOptions: {
      water: { en: "Water Quality", ka: "წყლის ხარისხი" },
      waste: { en: "Waste Dumping", ka: "ნარჩენების დაგროვება" },
      dump: { en: "Illegal Dumping", ka: "არალეგალური ჩაღვრა" },
      odor: { en: "Odor/Stagnation", ka: "სუნი/სტაგნაცია" },
      drainage: { en: "Blocked Drainage", ka: "დატბორვილი დრენაჟი" },
      flooding: { en: "Flood Zones", ka: "დატბორვის ზონები" },
      channels: { en: "Drainage Channels", ka: "სანიაღვრე არხები" },
      sea: { en: "Sea Water Intrusion", ka: "ზღვის წყლის შეჭრა" },
      erosion: { en: "Erosion Sections", ka: "ეროზიის მონაკვეთები" },
    },
    locationDesc: { en: "Location Coordinates ", ka: "კოორდინატები " },
    locationPlaceholder: {
      en: "Coordinates are auto-generated.",
      ka: "კოორდინატები (ავტომატურად გენერირებული).",
    },
    detailedDesc: { en: "Detailed Description *", ka: "დეტალური აღწერა *" },
    detailedPlaceholder: {
      en: "Describe what you observed, when it happened, and details...",
      ka: "აღწერეთ რასაც დააკვირდით, როდის მოხდა და დეტალები...",
    },
    photos: { en: "Photo", ka: "ფოტოები" },
    clickToUpload: {
      en: "Click to upload photos",
      ka: "დააწკაპუნეთ ფოტოების ასატვირთად",
    },
    uploadHint: {
      en: "PNG, JPG up to 10MB each",
      ka: "PNG, JPG თითო 10MB-მდე",
    },
    contactInfo: {
      en: "Your Contact Information",
      ka: "თქვენი საკონტაქტო ინფორმაცია",
    },
    nameLabel: { en: "Name *", ka: "სახელი *" },
    namePlaceholder: {
      en: "Your name or anonym",
      ka: "თქვენი სახელი ან ანონიმი",
    },
    emailLabel: { en: "Email", ka: "ელ.ფოსტა" },
    emailPlaceholder: { en: "your@email.com", ka: "your@email.com" },
    phoneLabel: { en: "Phone (Optional)", ka: "ტელეფონი" },
    submit: { en: "Submit Report", ka: "რეპორტის გაგზავნა" },
    cancel: { en: "Cancel", ka: "გაუქმება" },
  },
  reportPage: {
    headerTitle: {
      en: "Risk Alert – Active Citizen",
      ka: "საფრთხის შეტყობინება – აქტიური მოქალაქე",
    },
    headerDesc: {
      en: "Report environmental issues, pollution, or climate risks in your community. Your observations help us protect the Kaparchina River and build climate resilience.",
      ka: "მოახსენეთ გარემოსდაცვითი პრობლემები, დაბინძურება ან კლიმატური რისკები თქვენს საზოგადოებაში. თქვენი დაკვირვებები დაგვეხმარება კაპარჩინის მდინარის დაცვასა და კლიმატის გამძლეობის გაძლიერებაში.",
    },
    whatToReport: { en: "What to Report", ka: "რა უნდა მოახსენოთ" },
    waterPollution: { en: "Water Pollution", ka: "წყლის დაბინძურება" },
    waterPollutionDesc: {
      en: "Unusual water color, odor, or visible contamination",
      ka: "წყლის უჩვეულო ფერი, სუნი ან თვალსაჩინო დაბინძურება",
    },
    wasteDumping: { en: "Waste Dumping", ka: "ნარჩენების დაყრა" },
    wasteDumpingDesc: {
      en: "Illegal waste disposal or accumulation",
      ka: "ნარჩენების უკანონო განთესვა ან დაგროვება",
    },
    infrastructureIssues: {
      en: "Infrastructure Issues",
      ka: "ინფრასტრუქტურის პრობლემები",
    },
    infrastructureIssuesDesc: {
      en: "Blocked drains, damaged channels, flooding",
      ka: "დახშული დრენაჟები, დაზიანებული არხები, დატბორვა",
    },
    otherConcerns: { en: "Other Concerns", ka: "სხვა პრობლემები" },
    otherConcernsDesc: {
      en: "Any environmental or climate-related issues",
      ka: "გარემოსთან ან კლიმატთან დაკავშირებული ნებისმიერი პრობლემა",
    },
    yourPrivacy: { en: "Your Privacy", ka: "თქვენი კონფიდენციალურობა" },
    privacyText: {
      en: "Your contact information is kept confidential and used only for follow-up about your report. Reports are reviewed by our team and shared with relevant authorities when necessary.",
      ka: "თქვენი საკონტაქტო ინფორმაცია დაცულია და გამოიყენება მხოლოდ თქვენი რეპორტის დასაზუსტებლად. რეპორტებს ჩვენი გუნდი ამოწმებს და საჭიროების შემთხვევაში გადასცემს შესაბამის უწყებებს.",
    },
    submitTitle: {
      en: "Submit Environmental Report",
      ka: "გარემოსდაცვითი რეპორტის გაგზავნა",
    },
    submitDesc: {
      en: "Provide as much detail as possible to help us take action",
      ka: "მიუთითეთ მაქსიმალურად დეტალური ინფორმაცია, რათა მივიღოთ საჭირო ზომები",
    },
    locationClickHint: {
      en: "Click the map icon to select location on map",
      ka: "დააწკაპუნეთ რუკის ხატულაზე ლოკაციის ასარჩევად",
    },
    successTitle: {
      en: "Report Submitted Successfully",
      ka: "რეპორტი წარმატებით გაიგზავნა",
    },
    successDesc: {
      en: "Thank you for being an active citizen! Your report has been received and will be reviewed by our team. You'll receive updates at the email address provided.",
      ka: "გმადლობთ აქტიური მოქალაქეობისთვის! თქვენი რეპორტი მიღებულია და ჩვენი გუნდი განიხილავს. განახლებებს მიიღებთ თქვენს ელ.ფოსტის მისამართზე.",
    },
    submitAnother: {
      en: "Submit Another Report",
      ka: "კიდევ ერთი რეპორტის გაგზავნა",
    },
    viewMapBtn: { en: "View Map", ka: "რუკის ნახვა" },
  },
  homePage: {
    heroTitle: {
      en: "Civic Participation for Climate & Environment",
      ka: "თანამონაწილეობისა და ჩართულობის ცენტრი",
    },
    heroSubtitle: {
      en: "Turning evidence and citizen action into climate solutions",
      ka: "ვნერგავთ ინოვაციურ მიდგომებს და ვაძლიერებთ პარტნიორი ორგანიზაციების ინსტიტუციურ პასუხისმგებლობას და მდგრადობას.",
    },
    ctaMap: { en: "View Interactive Map", ka: "ინტერაქტიული რუკის ნახვა" },
    ctaProjects: { en: "Explore Our Projects", ka: "ჩვენი პროექტები" },
    whoWeAreTitle: { en: "Who We Are", ka: "ჩვენ შესახებ" },
    whoWeAreDesc: {
      en: "CPC is a civic organization strengthening climate resilience and environmental governance through data-driven analysis, community engagement, and policy advocacy.",
      ka: "დაარსებიდან დღემდე ორგანიზაცია მონაწილეობს საჯარო მმართველობის რეფორმის მონიტორინგში; „თანამონაწილეობისა და ჩართულობის ცენტრი „სიპისი“ აქტიურადაა ჩართული გარემოსდაცვითი პოლიტიკის, მდგარდი განვითარების, კარგი მმართველობის, მოქალაქეთა ჩართულობის, ქალთა საჭიროებების ინდენტიფიცირების გაძლიერების მიმართულებით.",
    },
    aboutCPC: { en: "About CPC", ka: "CPC-ის შესახებ" },
    whatWeDoTitle: { en: "What We Do", ka: "რას ვაკეთებთ" },
    evidenceTitle: {
      en: "Evidence & Data",
      ka: "გარემოსდაცვითი აქტივობები და ადვოკატირება",
    },
    evidenceDesc: {
      en: "Baseline studies, field assessments, ecological and climate risk analysis",
      ka: "საბაზისო კვლევები, საველე შეფასებები, ეკოლოგიური და კლიმატური რისკების ანალიზი",
    },
    communityTitle: {
      en: "Community Engagement",
      ka: "⁠მოქალაქეთა თანამონაწილეობისა და ჩართულობის ხელშეწყობა",
    },
    communityDesc: {
      en: "Citizen monitoring, awareness campaigns, inclusive participation models",
      ka: "მოქალაქეთა მონიტორინგი, ცნობიერების ამაღლება, ინკლუზიური მონაწილეობა",
    },
    policyTitle: { en: "Policy & Advocacy", ka: "⁠საინფორმაციო კამპანიები და მონიტორინგი" },
    policyDesc: {
      en: "Evidence-based recommendations and dialogue with local authorities",
      ka: "მედიატორი ადგილობრივ მმართველობასა და მოქალაქეებს შორის",
    },
    featuredProjectsTitle: {
      en: "Featured Projects",
      ka: "გამორჩეული პროექტები",
    },
    interactiveMapTitle: {
      en: "Interactive Environmental Map",
      ka: "ინტერაქტიული გარემოს რუკა",
    },
    interactiveMapDesc: {
      en: "Explore real-time data, citizen reports, pollution hotspots, and river monitoring results.",
      ka: "გამოიკვლიეთ რეალურ დროში მონაცემები, მოქალაქეთა რეპორტები, დაბინძურების ჰოთსპოტები და მდინარის მონიტორინგის შედეგები.",
    },
    openMap: { en: "Open the Map", ka: "რუკის გახსნა" },
    reportIssue: { en: "Report an Issue", ka: "პრობლემის შეტყობინება" },
    communityInAction: {
      en: "Community in Action",
      ka: "საზოგადოება მოქმედებაში",
    },
    communityInActionDesc: {
      en: "Citizens are co-creators of solutions through monitoring, events, and youth engagement.",
      ka: "სიპისი წარმატებით ასრულებს მედიატორის როლს ადგილობრივ მმართველობასა და მოქალაქეებს შორის. ამავდროულად, არის ლიდერი ორგანიზაცია გარემოსდაცვითი, მდგრადი განვითარების, კარგი მმართველობის, მონაწილეობითი დემოკრატიის, მოქალაქეთა ჩართულობის უზრუნველყოფისა და მოწყვლადი  ჯგუფების ადვოკატირების მიმართულებით.",
    },
    partnersDonorsTitle: {
      en: "Partners & Donors",
      ka: "პარტნიორები და დონორები",
    },
    partnersDonorsDesc: {
      en: "Collaboration with communities, institutions, and international partners",
      ka: "თანამშრომლობა საზოგადოებებთან, ინსტიტუტებთან და საერთაშორისო პარტნიორებთან",
    },
    impactTitle: { en: "Impact & Results", ka: "ზემოქმედება და შედეგები" },
    statsRiversAssessed: { en: "Rivers Assessed", ka: "შეფასებული მდინარეები" },
    statsCitizensEngaged: { en: "Citizens Engaged", ka: "ჩართული მოქალაქეები" },
    statsPolicyRecommendations: {
      en: "Policy Recommendations",
      ka: "პოლიტიკის რეკომენდაციები",
    },
    statsCommunityMonitors: {
      en: "Community Monitors",
      ka: "საზოგადოების მონიტორები",
    },
    resourcesTitle: {
      en: "Resources & Publications",
      ka: "რესურსები და პუბლიკაციები",
    },
    accessAllResources: {
      en: "Access All Resources",
      ka: "ყველა რესურსის ნახვა",
    },
    getInvolvedTitle: { en: "Get Involved", ka: "ჩაერთეთ" },
    getInvolvedDesc: {
      en: "Join us in protecting our environment and building climate resilience",
      ka: "შემოგვიერთდით და ჩაერთეთ სხვადასხვა პროექტებში!",
    },
    becomeObserver: {
      en: "Become a Community Observer",
      ka: "გახდით საზოგადოების დამკვირვებელი",
    },
    joinActivities: {
      en: "Join Our Activities",
      ka: "შემოუერთდით ჩვენს აქტივობებს",
    },
    contactUs: { en: "Contact Us", ka: "დაგვიკავშირდით" },
  },
  projects: {
    headerTitle: { en: "Our Projects", ka: "ჩვენი პროექტები" },
    headerDesc: {
      en: "Data-driven initiatives combining scientific analysis, community engagement, and policy advocacy to build climate resilience in Poti, Georgia.",
      ka: "მონაცემებზე დაფუძნებული ინიციატივები, რომლებიც აერთიანებს სამეცნიერო ანალიზს, საზოგადოების ჩართულობას და პოლიტიკის ადვოკატირებას ფოთში კლიმატის გამძლეობის გასაძლიერებლად.",
    },
    activeTitle: { en: "Active Projects", ka: "აქტიური პროექტები" },
    inPlanningTitle: { en: "In Planning", ka: "გეგმვის ეტაპზე" },
    keyGoals: { en: "Key Goals:", ka: "მთავარი მიზნები:" },
    viewDetails: { en: "View Project Details", ka: "პროექტის დეტალების ნახვა" },
    learnMore: { en: "Learn More", ka: "გაიგეთ მეტი" },
    ctaWant: { en: "Want to Get Involved?", ka: "გსურთ ჩართვა?" },
    ctaBody: {
      en: "Join our community projects, become a citizen observer, or partner with us on new initiatives.",
      ka: "შემოუერთდით ჩვენს საზოგადოებრივ პროექტებს, გახდით მოქალაქე დამკვირვებელი ან იმოქმედეთ ჩვენთან პარტნიორად.",
    },
    ctaObserver: { en: "Become an Observer", ka: "გახდით დამკვირვებელი" },
    ctaPartner: { en: "Partner With Us", ka: "გახდით ჩვენი პარტნიორი" },
  },
  findings: {
    headerTitle: {
      en: "Findings & Recommendations",
      ka: "შედეგები და რეკომენდაციები",
    },
    headerDesc: {
      en: "Access our research reports, policy briefs, training materials, and media coverage.",
      ka: "მიიღეთ წვდომა ჩვენს კვლევებზე, პოლიტიკის მოკლე ცნობებზე, სასწავლო მასალებზე და მედიას გაშუქებაზე.",
    },
    filterAll: { en: "All Resources", ka: "ყველა რესურსი" },
    filterResearch: { en: "Research", ka: "კვლევა" },
    filterPolicy: { en: "Policy", ka: "პოლიტიკა" },
    filterTraining: { en: "Training", ka: "ტრენინგი" },
    newsMedia: { en: "News & Media", ka: "სიახლეები და მედია" },
    stayUpdated: { en: "Stay Updated", ka: "გააგრძელეთ დაკვირვება" },
    subscribeBody: {
      en: "Subscribe to receive our latest reports and findings.",
      ka: "გამოიწერეთ ჩვენი უახლესი ანგარიშებისა და შედეგების მისაღებად.",
    },
    emailPlaceholder: {
      en: "Your email address",
      ka: "თქვენი ელ.ფოსტის მისამართი",
    },
    accessAll: { en: "Access All Resources", ka: "ყველა რესურსის ნახვა" },
    download: { en: "Download", ka: "გადმოწერა" },
    readArticle: { en: "Read Article", ka: "სტატიის ნახვა" },
  },
  news: {
    headerTitle: { en: "News & Activities", ka: "სიახლეები და აქტივობები" },
    headerDesc: {
      en: "Stay informed about our latest activities, media coverage, community events, and environmental updates.",
      ka: "იყავით ინფორმირებული ჩვენი უახლესი აქტივობების, მედია გაშუქების, საზოგადოებრივი ღონისძიებებისა და გარემოსდაცვითი განახლებების შესახებ.",
    },
    viewAll: { en: "View All News", ka: "ყველა სიახლის ნახვა" },
    filterAll: { en: "All News", ka: "ყველა სიახლე" },
    filterArticles: { en: "Articles", ka: "სტატიები" },
    filterInterviews: { en: "Interviews", ka: "ინტერვიუები" },
    filterEvents: { en: "Events", ka: "ღონისძიებები" },
    filterPress: { en: "Press Releases", ka: "პრეს-რელიზები" },
    mediaCoverage: { en: "Media Coverage", ka: "მედია გაშუქება" },
    mediaCoverageDesc: {
      en: "How our work is covered in the news",
      ka: "როგორ აშუქებს მედია ჩვენს საქმიანობას",
    },
    recentActivities: { en: "Recent Activities", ka: "ბოლო აქტივობები" },
    upcomingEvents: { en: "Upcoming Events", ka: "მომავალი ღონისძიებები" },
    readMore: { en: "Read More", ka: "მეტის ნახვა" },
    viewArticle: { en: "View Article", ka: "სტატიის ნახვა" },
    publishedOn: { en: "Published on", ka: "გამოქვეყნდა" },
    source: { en: "Source", ka: "წყარო" },
    noNews: {
      en: "No news available at the moment.",
      ka: "ამ მომენტში სიახლეები არ არის ხელმისაწვდომი.",
    },
    loadMore: { en: "Load More", ka: "მეტის ჩატვირთვა" },
  },
  contact: {
    headerTitle: { en: "Contact Us", ka: "დაგვიკავშირდით" },
    headerDesc: {
      en: "Get in touch with our team for inquiries or partnerships.",
      ka: "დაგვიკავშირდით კითხვებისთვის ან პარტნიორობისთვის.",
    },
    getInTouch: { en: "Get in Touch", ka: "მოგვწერეთ" },
    weAreHere: {
      en: "We're here to answer your questions",
      ka: "ახსნა-განმარტებისთვის მზად ვართ",
    },
    email: { en: "Email", ka: "ელ.ფოსტა" },
    phone: { en: "Phone", ka: "ტელეფონი" },
    office: { en: "Office", ka: "ოფისი" },
    officeHours: { en: "Office Hours", ka: "სამუშაო საათები" },
    sendUsMessage: { en: "Send Us a Message", ka: "მოგვწერეთ" },
    sendFormDesc: {
      en: "Fill out the form and we'll get back to you.",
      ka: "შეავსეთ ფორმა და დაგიკავშირდებით.",
    },
    firstName: { en: "First Name", ka: "სახელი" },
    lastName: { en: "Last Name", ka: "გვარი" },
    subject: { en: "Subject", ka: "თემა" },
    message: { en: "Message", ka: "მესიჯი" },
    sendMessage: { en: "Send Message", ka: "მესიჯის გაგზავნა" },
    visitOffice: { en: "Visit Our Office", ka: "ჩვენი ოფისის მონახულება" },
    findUs: { en: "Find us in Poti, Georgia", ka: "ფოთში, საქართველოში" },
  },
  joinPage: {
    becomeObserver: {
      en: "Become a Community Observer",
      ka: "გახდით საზოგადოების დამკვირვებელი",
    },
    applyNow: { en: "Apply Now", ka: "შეიყვანეთ განაცხადი" },
    whatIsCRON: { en: "What is C-RON?", ka: "რა არის C-RON?" },
    whyJoin: { en: "Why Join?", ka: "რატომ შეუერთდეთ?" },
    whatYouDo: { en: "What You'll Do", ka: "რას გააკეთებთ" },
    whoCanJoin: { en: "Who Can Join?", ka: "ვის შეუძლია შეუერთდეს?" },
    upcomingTraining: {
      en: "Upcoming Training Sessions",
      ka: "მომავალი ტრენინგები",
    },
    readyToMakeDiff: {
      en: "Ready to Make a Difference?",
      ka: "მზად ხართ ცვლილებისთვის?",
    },
    submitApplication: { en: "Submit Application", ka: "განაცხადის გაგზავნა" },
    askQuestions: { en: "Ask Questions", ka: "კითხვები" },
  },
  common: {
    back: { en: "Back", ka: "უკან" },
    cancel: { en: "Cancel", ka: "გაუქმება" },
    save: { en: "Save", ka: "შენახვა" },
    delete: { en: "Delete", ka: "წაშლა" },
    view: { en: "View", ka: "ნახვა" },
    download: { en: "Download", ka: "ჩამოტვირთვა" },
    subscribe: { en: "Subscribe", ka: "გამოწერა" },
  },
  toast: {
    contactSuccess: {
      title: { en: "Message sent!", ka: "შეტყობინება გაიგზავნა!" },
      description: {
        en: "Thank you for contacting us. We'll get back to you soon.",
        ka: "გმადლობთ კონტაქტისთვის. მალე დაგიკავშირდებით.",
      },
    },
    contactError: {
      title: { en: "Error", ka: "შეცდომა" },
      description: {
        en: "Failed to send message. Please try again.",
        ka: "შეტყობინების გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.",
      },
    },
    reportSuccess: {
      title: { en: "Report submitted!", ka: "რეპორტი გაიგზავნა!" },
      description: {
        en: "Thank you for reporting. We'll review your submission.",
        ka: "გმადლობთ მოხსენებისთვის. განვიხილავთ თქვენს მოხსენებას.",
      },
    },
    reportError: {
      title: { en: "Error", ka: "შეცდომა" },
      description: {
        en: "Failed to submit report. Please try again.",
        ka: "რეპორტის გაგზავნა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა.",
      },
    },
  },
} as const;

export type Translations = typeof translations;
