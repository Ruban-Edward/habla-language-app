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
  ],
};
