import type { Course } from '../../types';

/** French for English speakers. All content is original. */
export const french: Course = {
  id: 'fr',
  name: 'French',
  badge: 'FR',
  color: '#3b6fd8',
  tagline: 'Café conversations, family, home and getting around',
  lang: 'fr-FR',
  hello: 'Bonjour !',
  congrats: 'Félicitations !',
  praise: ['Très bien !', 'Parfait !', 'Bravo !'],
  typePlaceholder: 'Écris en français',
  specialChars: ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ô', 'ù', 'û', 'ë', 'œ'],
  typeInTarget: true,
  units: [
    {
      id: 'u1',
      level: 'beginner',
      title: 'First words',
      description: 'Greet people and introduce yourself',
      color: '#3b6fd8',
      lessons: [
        {
          id: 'u1l1',
          title: 'Bonjour!',
          words: [
            { t: 'bonjour', en: 'hello', emoji: '👋' },
            { t: 'au revoir', en: 'goodbye', emoji: '🚶' },
            { t: 'merci', en: 'thank you', emoji: '🙏' },
            { t: "s'il vous plaît", en: 'please', emoji: '🤲' },
            { t: 'oui', en: 'yes', emoji: '✅' },
            { t: 'bonsoir', en: 'good evening', emoji: '🌆' },
          ],
          sentences: [
            { t: 'Bonjour, merci.', en: '(Hello|Hi|Good morning), (thank you|thanks).' },
            { t: "Oui, s'il vous plaît.", en: 'Yes, please.' },
            { t: 'Non, merci.', en: 'No, (thank you|thanks).' },
            { t: 'Bonsoir et au revoir.', en: 'Good evening and (goodbye|bye).' },
          ],
        },
        {
          id: 'u1l2',
          title: 'People',
          words: [
            { t: 'homme', en: 'man', emoji: '👨' },
            { t: 'femme', en: 'woman', emoji: '👩' },
            { t: 'garçon', en: 'boy', emoji: '👦' },
            { t: 'fille', en: 'girl', emoji: '👧' },
            { t: 'je', en: 'I', emoji: '🙋' },
          ],
          sentences: [
            { t: 'Je suis un homme.', en: "I( am|'m) a man." },
            { t: "(C'est|Elle est) une femme.", en: "(She|It)( is|'s) a woman." },
            { t: 'Le garçon et la fille.', en: 'The boy and the girl.' },
            { t: 'Je suis une fille.', en: "I( am|'m) a girl." },
          ],
        },
        {
          id: 'u1l3',
          title: 'Nice to meet you',
          words: [
            { t: 'nom', en: 'name', emoji: '📛' },
            { t: 'ami', en: 'friend', emoji: '🤝' },
            { t: 'bien', en: 'well', emoji: '👍' },
            { t: 'mal', en: 'bad', emoji: '👎' },
            { t: 'et', en: 'and', emoji: '➕' },
          ],
          sentences: [
            { t: "Je m'appelle Paul.", en: ["My name( is|'s) Paul.", "I( am|'m) called Paul."] },
            { t: '(Je vais|Ça va) bien, merci.', en: "I( am|'m) (well|fine|good), (thank you|thanks)." },
            { t: "C'est mon ami.", en: "(He|This)( is|'s) my friend." },
            { t: "Comment (tu t'appelles|vous vous appelez)?", en: "What( is|'s) your name?" },
          ],
        },
      ],
    },
    {
      id: 'u2',
      level: 'beginner',
      title: 'Food & drink',
      description: 'Order at a café and talk about meals',
      color: '#c2410c',
      lessons: [
        {
          id: 'u2l1',
          title: 'Breakfast',
          words: [
            { t: 'eau', en: 'water', emoji: '💧' },
            { t: 'pain', en: 'bread', emoji: '🥖' },
            { t: 'pomme', en: 'apple', emoji: '🍎' },
            { t: 'lait', en: 'milk', emoji: '🥛' },
            { t: 'café', en: 'coffee', emoji: '☕' },
          ],
          sentences: [
            { t: "Je bois de l'eau.", en: ['I drink water.', "I('m| am) drinking water."] },
            { t: 'Je mange du pain.', en: ['I eat bread.', "I('m| am) eating bread."] },
            { t: 'Une pomme et un café.', en: '(An|One) apple and (a|one) coffee.' },
            { t: "Du lait, s'il vous plaît.", en: '[Some ]milk, please.' },
          ],
        },
        {
          id: 'u2l2',
          title: 'Meals',
          words: [
            { t: 'repas', en: 'meal', emoji: '🍽️' },
            { t: 'riz', en: 'rice', emoji: '🍚' },
            { t: 'fromage', en: 'cheese', emoji: '🧀' },
            { t: 'œuf', en: 'egg', emoji: '🥚' },
            { t: 'orange', en: 'orange', emoji: '🍊' },
          ],
          sentences: [
            { t: 'Elle mange du riz.', en: ['She eats rice.', "She('s| is) eating rice."] },
            { t: 'Le fromage est bon.', en: "The cheese( is|'s) good." },
            { t: 'Je mange un œuf.', en: ['I eat an egg.', "I('m| am) eating an egg."] },
            { t: "J'aime le repas.", en: 'I (like|love) the meal.' },
          ],
        },
        {
          id: 'u2l3',
          title: 'At the café',
          words: [
            { t: 'thé', en: 'tea', emoji: '🍵' },
            { t: 'jus', en: 'juice', emoji: '🧃' },
            { t: 'soupe', en: 'soup', emoji: '🥣' },
            { t: 'poulet', en: 'chicken', emoji: '🍗' },
            { t: 'poisson', en: 'fish', emoji: '🐟' },
          ],
          sentences: [
            { t: "Je voudrais un thé, s'il vous plaît.", en: "(I would like|I'd like|I want) [a ]tea, please." },
            { t: 'Le poulet et le poisson.', en: '[The ]chicken and [the ]fish.' },
            { t: 'La soupe est bonne.', en: "The soup( is|'s) good." },
            { t: 'Il boit du jus.', en: ['He drinks juice.', "He('s| is) drinking juice."] },
          ],
        },
      ],
    },
    {
      id: 'u3',
      level: 'beginner',
      title: 'Family & home',
      description: 'Talk about the people and things around you',
      color: '#0f9b8e',
      lessons: [
        {
          id: 'u3l1',
          title: 'Family',
          words: [
            { t: 'mère', en: 'mother', emoji: '👩‍👧' },
            { t: 'père', en: 'father', emoji: '👨‍👦' },
            { t: 'frère', en: 'brother', emoji: '👦' },
            { t: 'sœur', en: 'sister', emoji: '👧' },
            { t: 'famille', en: 'family', emoji: '👨‍👩‍👧' },
          ],
          sentences: [
            { t: 'Ma mère et mon père.', en: 'My (mother|mom|mum) and my (father|dad).' },
            { t: "J'ai un frère.", en: ['I have a brother.', "I('ve| have) got a brother."] },
            { t: "C'est ma sœur.", en: "(She|This)( is|'s) my sister." },
            { t: 'Ma famille est grande.', en: "My family( is|'s) (big|large)." },
          ],
        },
        {
          id: 'u3l2',
          title: 'Home',
          words: [
            { t: 'maison', en: 'house', emoji: '🏠' },
            { t: 'chien', en: 'dog', emoji: '🐶' },
            { t: 'chat', en: 'cat', emoji: '🐱' },
            { t: 'lit', en: 'bed', emoji: '🛏️' },
            { t: 'livre', en: 'book', emoji: '📖' },
          ],
          sentences: [
            { t: 'Le chien et le chat.', en: 'The dog and the cat.' },
            { t: 'Ma maison est petite.', en: "My (house|home)( is|'s) (small|little)." },
            { t: 'Le chat est sur le lit.', en: "The cat( is|'s) on the bed." },
            { t: 'Je lis un livre.', en: ['I read a book.', "I('m| am) reading a book."] },
          ],
        },
        {
          id: 'u3l3',
          title: 'Describing things',
          words: [
            { t: 'grand', en: 'big', emoji: '🐘' },
            { t: 'petit', en: 'small', emoji: '🐭' },
            { t: 'rouge', en: 'red', emoji: '🔴' },
            { t: 'bleu', en: 'blue', emoji: '🔵' },
            { t: 'nouveau', en: 'new', emoji: '✨' },
          ],
          sentences: [
            { t: 'Le chien est grand.', en: "The dog( is|'s) (big|large|tall)." },
            { t: 'La maison est bleue.', en: "The (house|home)( is|'s) blue." },
            { t: "J'ai un petit chat.", en: 'I have a (small|little) cat.' },
            { t: 'Mon livre est nouveau.', en: "My book( is|'s) new." },
          ],
        },
      ],
    },
    {
      id: 'u4',
      level: 'beginner',
      title: 'Getting around',
      description: 'Find your way while travelling',
      color: '#c2298a',
      lessons: [
        {
          id: 'u4l1',
          title: 'Travel',
          words: [
            { t: 'train', en: 'train', emoji: '🚆' },
            { t: 'avion', en: 'plane', emoji: '✈️' },
            { t: 'plage', en: 'beach', emoji: '🏖️' },
            { t: 'hôtel', en: 'hotel', emoji: '🏨' },
            { t: 'ville', en: 'city', emoji: '🏙️' },
          ],
          sentences: [
            { t: "Où est l'hôtel?", en: "Where( is|'s) the hotel?" },
            { t: 'Le train est rapide.', en: "The train( is|'s) (fast|quick)." },
            { t: 'Je vais à la plage.', en: "(I'm going|I am going|I go) to the beach." },
            { t: 'La ville est belle.', en: "The city( is|'s) (beautiful|pretty|nice|lovely)." },
          ],
        },
        {
          id: 'u4l2',
          title: 'Directions',
          words: [
            { t: 'gauche', en: 'left', emoji: '⬅️' },
            { t: 'droite', en: 'right', emoji: '➡️' },
            { t: 'rue', en: 'street', emoji: '🛣️' },
            { t: 'carte', en: 'map', emoji: '🗺️' },
            { t: 'près', en: 'near', emoji: '📍' },
          ],
          sentences: [
            { t: "L'hôtel est près d'ici.", en: "The hotel( is|'s) (near here|close by|nearby|close)." },
            { t: 'Tournez à droite.', en: 'Turn [to the ]right.' },
            { t: "J'ai besoin d'une carte.", en: 'I need a map.' },
            { t: 'La rue est à gauche.', en: "The street( is|'s) (on|to) the left." },
          ],
        },
        {
          id: 'u4l3',
          title: 'Time',
          words: [
            { t: "aujourd'hui", en: 'today', emoji: '📅' },
            { t: 'demain', en: 'tomorrow', emoji: '🌅' },
            { t: 'nuit', en: 'night', emoji: '🌙' },
            { t: 'jour', en: 'day', emoji: '☀️' },
            { t: 'heure', en: 'hour', emoji: '⏰' },
          ],
          sentences: [
            {
              t: "Aujourd'hui, je vais en ville.",
              en: [
                "Today (I'm going|I am going|I go) (to the city|into town|to town).",
                "(I'm going|I am going|I go) (to the city|into town|to town) today.",
              ],
            },
            { t: 'Bonne nuit.', en: 'Good night.' },
            { t: 'À demain.', en: '(See you|Until) tomorrow.' },
            { t: 'Quelle heure est-il?', en: 'What time is it?' },
          ],
        },
      ],
    },
    {
      id: 'u5',
      level: 'intermediate',
      title: 'Daily life',
      description: 'Talk about routines and share stories from the past',
      color: '#356d65',
      lessons: [
        {
          id: 'u5l1',
          title: 'A busy morning',
          words: [
            { t: 'se réveiller', en: 'to wake up', emoji: '⏰' },
            { t: 'le métro', en: 'the subway', emoji: '🚇' },
            { t: "d'abord", en: 'first', emoji: '1️⃣' },
            { t: 'ensuite', en: 'then', emoji: '➡️' },
            { t: 'arriver', en: 'to arrive', emoji: '🏁' },
          ],
          sentences: [
            { t: 'Je me réveille avant huit heures.', en: 'I wake up before eight.' },
            { t: 'Ensuite, je prends le métro pour aller au travail.', en: 'Then I take the subway to go to work.' },
            { t: "J'arrive au bureau vers neuf heures.", en: 'I arrive at the office around nine.' },
          ],
        },
        {
          id: 'u5l2',
          title: 'Last weekend',
          words: [
            { t: 'le week-end', en: 'the weekend', emoji: '🗓️' },
            { t: 'un musée', en: 'a museum', emoji: '🏛️' },
            { t: 'une promenade', en: 'a walk', emoji: '🚶' },
            { t: 'la rivière', en: 'the river', emoji: '🌊' },
            { t: 'rentrer', en: 'to go home', emoji: '🏠' },
          ],
          sentences: [
            { t: 'Le week-end dernier, nous avons visité un musée.', en: 'Last weekend, we visited a museum.' },
            {
              t: 'Après la visite, nous nous sommes promenés au bord de la rivière.',
              en: 'After the visit, we took a walk by the river.',
            },
            { t: 'Il a plu, alors nous sommes rentrés tôt.', en: 'It rained, so we went home early.' },
          ],
        },
      ],
    },
    {
      id: 'u6',
      level: 'intermediate',
      title: 'Plans & opinions',
      description: 'Make arrangements and explain what you think',
      color: '#6f5c34',
      lessons: [
        {
          id: 'u6l1',
          title: 'Making plans',
          words: [
            { t: 'proposer', en: 'to suggest', emoji: '💡' },
            { t: 'réserver', en: 'to book', emoji: '📅' },
            { t: 'se retrouver', en: 'to meet up', emoji: '🤝' },
            { t: 'libre', en: 'available', emoji: '🕊️' },
            { t: 'déplacer', en: 'to reschedule', emoji: '🔁' },
          ],
          sentences: [
            { t: 'Je vous propose de réserver une table.', en: 'I suggest that we book a table.' },
            { t: 'On pourrait se retrouver à dix-neuf heures.', en: 'We could meet at 7 pm.' },
            { t: 'Si tu es libre, on peut déplacer notre rendez-vous.', en: 'If you are free, we can reschedule our appointment.' },
          ],
        },
        {
          id: 'u6l2',
          title: 'Giving an opinion',
          words: [
            { t: 'à mon avis', en: 'in my opinion', emoji: '💬' },
            { t: 'préférer', en: 'to prefer', emoji: '👍' },
            { t: 'un avantage', en: 'an advantage', emoji: '➕' },
            { t: 'abordable', en: 'affordable', emoji: '💶' },
            { t: 'pourtant', en: 'yet', emoji: '↔️' },
          ],
          sentences: [
            {
              t: 'À mon avis, le train est plus pratique que la voiture.',
              en: 'In my opinion, the train is more convenient than the car.',
            },
            { t: 'Le restaurant est petit, pourtant il est très confortable.', en: 'The restaurant is small, yet it is very comfortable.' },
            { t: "Nous avons choisi l'option la plus abordable.", en: 'We chose the most affordable option.' },
          ],
        },
      ],
    },
    {
      id: 'u7',
      level: 'intermediate',
      title: 'Work & problem-solving',
      description: 'Handle everyday workplace conversations',
      color: '#45647b',
      lessons: [
        {
          id: 'u7l1',
          title: 'At work',
          words: [
            { t: 'télétravailler', en: 'to work remotely', emoji: '💻' },
            { t: 'une équipe', en: 'a team', emoji: '👥' },
            { t: 'une réunion', en: 'a meeting', emoji: '🗣️' },
            { t: 'un compte rendu', en: 'meeting notes', emoji: '📝' },
            { t: 'une échéance', en: 'a deadline', emoji: '⏳' },
          ],
          sentences: [
            { t: 'Je télétravaille deux jours par semaine.', en: 'I work remotely two days a week.' },
            { t: 'Notre équipe se réunit chaque lundi matin.', en: 'Our team meets every Monday morning.' },
            { t: "Peux-tu envoyer le compte rendu avant l'échéance?", en: 'Can you send the meeting notes before the deadline?' },
          ],
        },
        {
          id: 'u7l2',
          title: 'Solving a problem',
          words: [
            { t: 'une panne', en: 'a breakdown', emoji: '⚠️' },
            { t: 'une livraison', en: 'a delivery', emoji: '📦' },
            { t: 'prévenir', en: 'to inform', emoji: '📣' },
            { t: 'rembourser', en: 'to refund', emoji: '💳' },
            { t: 'une solution', en: 'a solution', emoji: '🧩' },
          ],
          sentences: [
            { t: 'Il y a eu une panne pendant la livraison.', en: 'There was a breakdown during the delivery.' },
            { t: 'Nous avons prévenu le client et proposé un remboursement.', en: 'We informed the customer and offered a refund.' },
            { t: 'Pourriez-vous nous aider à trouver une solution?', en: 'Could you help us find a solution?' },
          ],
        },
      ],
    },
    {
      id: 'u8',
      level: 'advanced',
      title: 'Ideas & society',
      description: 'Discuss public choices and environmental change',
      color: '#8b533e',
      lessons: [
        {
          id: 'u8l1',
          title: 'Debating a public policy',
          words: [
            { t: 'financer', en: 'to fund', emoji: '🏛️' },
            { t: 'un transport public', en: 'public transportation', emoji: '🚌' },
            { t: 'une mesure', en: 'a measure', emoji: '📋' },
            { t: 'coûteux', en: 'costly', emoji: '💶' },
            { t: 'un enjeu', en: 'an issue', emoji: '⚖️' },
          ],
          sentences: [
            { t: 'Il faudrait financer davantage les transports publics.', en: 'We should fund public transportation more.' },
            { t: 'Bien que cette mesure soit coûteuse, elle reste nécessaire.', en: 'Although this measure is costly, it remains necessary.' },
            { t: 'Cette décision soulève un enjeu important.', en: 'This decision raises an important issue.' },
          ],
        },
        {
          id: 'u8l2',
          title: 'Protecting the environment',
          words: [
            { t: 'la biodiversité', en: 'biodiversity', emoji: '🦋' },
            { t: 'durable', en: 'sustainable', emoji: '♻️' },
            { t: 'réduire', en: 'to reduce', emoji: '📉' },
            { t: 'une ressource', en: 'a resource', emoji: '🌱' },
            { t: 'collectif', en: 'collective', emoji: '🤲' },
          ],
          sentences: [
            { t: 'La transition écologique exige un effort collectif.', en: 'The ecological transition requires a collective effort.' },
            { t: 'Nous devons réduire notre consommation de ressources.', en: 'We must reduce our consumption of resources.' },
            { t: 'Une croissance durable protège la biodiversité.', en: 'Sustainable growth protects biodiversity.' },
          ],
        },
      ],
    },
    {
      id: 'u9',
      level: 'advanced',
      title: 'Nuance & argument',
      description: 'Support your ideas and disagree with care',
      color: '#695173',
      lessons: [
        {
          id: 'u9l1',
          title: 'Adding nuance',
          words: [
            { t: 'une hypothèse', en: 'a hypothesis', emoji: '🔎' },
            { t: 'fiable', en: 'reliable', emoji: '✅' },
            { t: 'nuancer', en: 'to qualify', emoji: '🎚️' },
            { t: 'toutefois', en: 'however', emoji: '↔️' },
            { t: 'remettre en question', en: 'to challenge', emoji: '❓' },
          ],
          sentences: [
            { t: 'Cette hypothèse doit être vérifiée par des données fiables.', en: 'This hypothesis must be checked against reliable data.' },
            {
              t: "Je comprends votre point de vue; toutefois, j'aimerais le nuancer.",
              en: "I understand your point of view; however, I'd like to add some nuance.",
            },
            {
              t: 'Nous ne devrions pas remettre ces résultats en question sans preuve.',
              en: 'We should not challenge these results without evidence.',
            },
          ],
        },
        {
          id: 'u9l2',
          title: 'Disagreeing politely',
          words: [
            { t: 'reconnaître', en: 'to acknowledge', emoji: '🤝' },
            { t: 'un désaccord', en: 'a disagreement', emoji: '⚖️' },
            { t: 'une réserve', en: 'a reservation', emoji: '📝' },
            { t: 'certes', en: 'admittedly', emoji: '☝️' },
            { t: 'néanmoins', en: 'nevertheless', emoji: '➡️' },
          ],
          sentences: [
            { t: 'Je reconnais la valeur de cette proposition.', en: 'I acknowledge the value of this proposal.' },
            { t: 'Je partage votre avis, certes, avec quelques réserves.', en: 'I share your opinion, admittedly with a few reservations.' },
            { t: 'Nous sommes en désaccord; néanmoins, nous pouvons avancer ensemble.', en: 'We disagree; nevertheless, we can move forward together.' },
          ],
        },
      ],
    },
    {
      id: 'u10',
      level: 'advanced',
      title: 'Culture & professional life',
      description: 'Discuss creative work and handle formal conversations',
      color: '#435b55',
      lessons: [
        {
          id: 'u10l1',
          title: 'Talking about a novel',
          words: [
            { t: 'une œuvre', en: 'a work of art', emoji: '🎨' },
            { t: 'une intrigue', en: 'a plot', emoji: '📖' },
            { t: 'se dérouler', en: 'to take place', emoji: '🎬' },
            { t: 'bouleversant', en: 'moving', emoji: '💭' },
            { t: 'une génération', en: 'a generation', emoji: '👥' },
          ],
          sentences: [
            { t: 'Ce roman met en scène deux générations.', en: 'This novel depicts two generations.' },
            { t: "L'intrigue se déroule dans une ville portuaire.", en: 'The plot takes place in a port city.' },
            { t: "Cette œuvre m'a profondément bouleversé.", en: 'This work moved me deeply.' },
          ],
        },
        {
          id: 'u10l2',
          title: 'A formal discussion',
          words: [
            { t: 'une priorité', en: 'a priority', emoji: '🎯' },
            { t: 'retenir', en: 'to select', emoji: '☑️' },
            { t: 'à l’unanimité', en: 'unanimously', emoji: '🗳️' },
            { t: "s'en charger", en: 'to take care of it', emoji: '🧑‍💼' },
            { t: 'une proposition', en: 'a proposal', emoji: '📄' },
          ],
          sentences: [
            { t: 'Nous devrions revoir les priorités avant de décider.', en: 'We should review the priorities before deciding.' },
            { t: 'Votre proposition a été retenue à l’unanimité.', en: 'Your proposal was selected unanimously.' },
            { t: "Je m'en chargerai avant l'échéance.", en: 'I will take care of it before the deadline.' },
          ],
        },
      ],
    },
  ],
};
