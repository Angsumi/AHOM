export type QuizType = 'MCQ' | 'FLASHCARD_CHOICE' | 'STATEMENT' | 'CHRONOLOGY';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  statementA?: string;
  statementB?: string;
}

export interface AhomKing {
  id: string;
  name: string;
  reign: string;
  title: string;
  description: string;
  achievements: string[];
  story?: string;
  imagePrompt: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  storyText: string;
  kings: AhomKing[];
  quiz: QuizQuestion[];
}

export interface Era {
  id: string;
  name: string;
  period: string;
  description: string;
  lessons: Lesson[];
}

export const ahomHistory: Era[] = [
  {
    id: "early",
    name: "The Early Period",
    period: "1228 – 1497",
    description: "The foundation of the kingdom and the reigns of the first four kings.",
    lessons: [
      {
        id: "founding-kings",
        title: "The First Four Kings",
        subtitle: "Laying the Foundation",
        storyText: "Sukapha founded the kingdom in 1228. He was followed by Suteupha, Subinpha, and Sukhangpha. During this time, the Ahoms consolidated their power in the region around Charaideo and Tipam. They established the administrative structure that would last for centuries, focusing on agriculture and peaceful coexistence with local tribes.",
        kings: [
          {
            id: "sukapha",
            name: "Chaolung Sukapha",
            reign: "1228–1268",
            title: "The Great Founder",
            description: "Established the first capital at Charaideo.",
            achievements: ["Unified local tribes", "Introduced Buranjis", "Founded Charaideo"],
            imagePrompt: "A majestic Tai-Ahom king in 13th-century royal attire, holding a Hengdan sword, standing on a hill overlooking the Brahmaputra valley, cinematic lighting, historical epic style."
          },
          {
            id: "suteupha",
            name: "Suteupha",
            reign: "1268–1281",
            title: "The Consolidator",
            description: "Expanded the kingdom's influence towards the west.",
            achievements: ["Settled boundary disputes", "Strengthened administration"],
            imagePrompt: "A medieval Ahom king in a royal court, discussing boundaries with tribal leaders, detailed silk robes."
          }
        ],
        quiz: [
          {
            id: "q1",
            type: "MCQ",
            question: "Who was the second king of the Ahom dynasty?",
            options: ["Suteupha", "Subinpha", "Sukhangpha", "Suhungmung"],
            correctAnswer: "Suteupha",
            explanation: "Suteupha succeeded his father Sukapha in 1268."
          },
          {
            id: "q2",
            type: "STATEMENT",
            question: "Evaluate the following statements about the early Ahom period:",
            statementA: "The first capital was established at Charaideo.",
            statementB: "The early kings focused on large-scale wars with the Mughals.",
            correctAnswer: "Statement A is true",
            explanation: "The Mughals didn't arrive until much later; the early focus was on local consolidation."
          }
        ]
      }
    ]
  },
  {
    id: "expansion",
    name: "Expansion & Upper Assam",
    period: "1497 – 1603",
    description: "The era of Suhungmung and the integration of the Chutiya and Kachari kingdoms.",
    lessons: [
      {
        id: "upper-assam-expansion",
        title: "The Dihingia Raja's Conquests",
        subtitle: "Upper Assam Expansion",
        storyText: "Suhungmung, also known as the Dihingia Raja, was a transformative ruler. He defeated the Chutiya kingdom in 1523 and the Kachari kingdom shortly after. This era saw the first major expansion of Ahom territory and the introduction of the title 'Swargadeo'.",
        kings: [
          {
            id: "suhungmung",
            name: "Suhungmung",
            reign: "1497–1539",
            title: "Swarganarayan",
            description: "Expanded the kingdom significantly and introduced firearms.",
            achievements: ["Defeated Chutiyas", "Introduced Firearms", "Created Borpatrogohain"],
            imagePrompt: "A powerful 16th-century Ahom king inspecting early cannons and muskets, royal court background, intricate silk robes."
          }
        ],
        quiz: [
          {
            id: "q3",
            type: "FLASHCARD_CHOICE",
            question: "Which king is known for defeating the Chutiya kingdom in 1523?",
            correctAnswer: "Suhungmung",
            explanation: "Suhungmung's victory over the Chutiyas was a turning point in Ahom history."
          }
        ]
      }
    ]
  },
  {
    id: "mughal-wars",
    name: "Mughal Conflicts",
    period: "1603 – 1681",
    description: "The long struggle against the Mughal Empire and the heroism of Lachit Borphukan.",
    lessons: [
      {
        id: "early-mughal-conflict",
        title: "The First Mughal Invasions",
        subtitle: "Defending the Borders",
        storyText: "The conflict with the Mughals began in earnest during the reign of Pratap Singha. The Mughals were attracted by the wealth and resources of the Brahmaputra valley. This period saw the creation of the posts of Borphukan and Borbarua to manage the expanding administrative and military needs.",
        kings: [
          {
            id: "pratap-singha",
            name: "Pratap Singha",
            reign: "1603–1641",
            title: "Burha Raja",
            description: "Faced the first major Mughal attacks and reorganized the Paik system.",
            achievements: ["Created Borphukan post", "Built fortifications", "Reorganized Paiks"],
            imagePrompt: "An elderly but sharp Ahom king in a war room, planning defenses against an approaching Mughal army, maps and scrolls."
          }
        ],
        quiz: [
          {
            id: "q4",
            type: "MCQ",
            question: "Which administrative post was created by Pratap Singha to manage Lower Assam?",
            options: ["Borphukan", "Borbarua", "Buragohain", "Borgohain"],
            correctAnswer: "Borphukan",
            explanation: "Pratap Singha created the post of Borphukan to govern the territories west of Kaliabor."
          }
        ]
      }
    ]
  },
  {
    id: "zenith",
    name: "The Golden Zenith",
    period: "1681 – 1751",
    description: "The peak of Ahom power, architecture, and cultural synthesis.",
    lessons: [
      {
        id: "cultural-impact",
        title: "The Architect of Rangpur",
        subtitle: "Cultural Impact & Hinduisation",
        storyText: "Rudra Singha brought the kingdom to its cultural zenith. He promoted the Bihu festival and built the city of Rangpur. This era also saw the increasing influence of Hinduism, with kings formally adopting Hindu names and patronizing Satras (monasteries).",
        kings: [
          {
            id: "rudra-singha",
            name: "Rudra Singha",
            reign: "1696–1714",
            title: "The Great Architect",
            description: "Built the Talatal Ghar and promoted arts and culture.",
            achievements: ["Built Rangpur", "Promoted Bihu", "Diplomatic Confederacy"],
            imagePrompt: "A sophisticated Ahom king standing before a grand brick palace, surrounded by scholars and artists, vibrant colors."
          }
        ],
        quiz: [
          {
            id: "q5",
            type: "STATEMENT",
            question: "Regarding the reign of Rudra Singha:",
            statementA: "He introduced the Bihu festival to the royal court.",
            statementB: "He was the first king to flee from the Mughals.",
            correctAnswer: "Statement A is true",
            explanation: "Rudra Singha was a great patron of culture; it was Jayadhwaj Singha who was known as the 'fleeing king'."
          }
        ]
      }
    ]
  },
  {
    id: "decline",
    name: "Decline & Rebellion",
    period: "1751 – 1826",
    description: "The Moamoria Rebellion and the eventual weakening of the kingdom.",
    lessons: [
      {
        id: "moamoria-rebellion",
        title: "The Moamoria Rebellion",
        subtitle: "Internal Strife",
        storyText: "The Moamoria Rebellion was a series of civil wars that devastated the kingdom. It was a conflict between the Ahom kings and the Moamoria sect of Vaishnavites. This internal weakening paved the way for Burmese invasions and the eventual British annexation.",
        kings: [
          {
            id: "rajeswar-singha",
            name: "Rajeswar Singha",
            reign: "1751–1769",
            title: "The Elegant",
            description: "The last of the great builders before the major rebellions.",
            achievements: ["Built Kareng Ghar", "Maintained sophisticated court"],
            imagePrompt: "An Ahom king in a luxurious palace, unaware of the brewing rebellion in the countryside, soft lighting, elegant attire."
          }
        ],
        quiz: [
          {
            id: "q6",
            type: "MCQ",
            question: "The Moamoria Rebellion was primarily a conflict between the Ahom state and which group?",
            options: ["Vaishnavite sect", "Mughal invaders", "Burmese army", "British traders"],
            correctAnswer: "Vaishnavite sect",
            explanation: "The rebellion was a socio-religious conflict that severely weakened the Ahom monarchy."
          }
        ]
      }
    ]
  }
];
