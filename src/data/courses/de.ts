import type { Course } from '../../types';

/**
 * German for English speakers. All content is original.
 * Sentences start with a pronoun, article or adverb rather than a noun, because the first answer tile is
 * lower-cased and German nouns are always capitalised.
 */
export const german: Course = {
  id: 'de',
  name: 'German',
  badge: 'DE',
  color: '#b45309',
  tagline: 'Everyday German, from Guten Tag to confident conversations',
  lang: 'de-DE',
  hello: 'Hallo!',
  congrats: 'Glückwunsch!',
  praise: ['Sehr gut!', 'Super!', 'Toll gemacht!'],
  typePlaceholder: 'Schreib auf Deutsch',
  specialChars: ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'],
  typeInTarget: true,
  units: [
    {
      id: 'u1',
      level: 'beginner',
      title: 'First words',
      description: 'Greet people and introduce yourself',
      color: '#b45309',
      lessons: [
        {
          id: 'u1l1',
          title: 'Hallo!',
          words: [
            { t: 'hallo', en: 'hello', emoji: '👋' },
            { t: 'tschüss', en: 'goodbye', emoji: '🚶' },
            { t: 'danke', en: 'thank you', emoji: '🙏' },
            { t: 'bitte', en: 'please', emoji: '🤲' },
            { t: 'ja', en: 'yes', emoji: '✅' },
            { t: 'guten Abend', en: 'good evening', emoji: '🌆' },
          ],
          sentences: [
            { t: 'Hallo, danke.', en: '(Hello|Hi), (thank you|thanks).' },
            { t: 'Ja, bitte.', en: 'Yes, please.' },
            { t: 'Nein, danke.', en: 'No, (thank you|thanks).' },
            { t: 'Guten Abend und tschüss.', en: 'Good evening and (goodbye|bye).' },
          ],
        },
        {
          id: 'u1l2',
          title: 'People',
          words: [
            { t: 'Mann', en: 'man', emoji: '👨' },
            { t: 'Frau', en: 'woman', emoji: '👩' },
            { t: 'Junge', en: 'boy', emoji: '👦' },
            { t: 'Mädchen', en: 'girl', emoji: '👧' },
            { t: 'ich', en: 'I', emoji: '🙋' },
          ],
          sentences: [
            { t: 'Ich bin ein Mann.', en: "I( am|'m) a man." },
            { t: '(Das|Sie) ist eine Frau.', en: "(That|She)( is|'s) a woman." },
            { t: 'Der Junge und das Mädchen.', en: 'The boy and the girl.' },
            { t: 'Ich bin ein Mädchen.', en: "I( am|'m) a girl." },
          ],
        },
        {
          id: 'u1l3',
          title: 'Nice to meet you',
          words: [
            { t: 'Name', en: 'name', emoji: '📛' },
            { t: 'Freund', en: 'friend', emoji: '🤝' },
            { t: 'gut', en: 'good', emoji: '👍' },
            { t: 'schlecht', en: 'bad', emoji: '👎' },
            { t: 'und', en: 'and', emoji: '➕' },
          ],
          sentences: [
            { t: 'Ich heiße Paul.', en: ["My name( is|'s) Paul.", "I( am|'m) called Paul."] },
            { t: "(Mir geht es|Mir geht's) gut, danke.", en: "I( am|'m) (well|fine|good), (thank you|thanks)." },
            { t: 'Das ist mein Freund.', en: "(This|That|He)( is|'s) my friend." },
            { t: '(Wie heißt du|Wie heißen Sie)?', en: "What( is|'s) your name?" },
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
            { t: 'Wasser', en: 'water', emoji: '💧' },
            { t: 'Brot', en: 'bread', emoji: '🍞' },
            { t: 'Apfel', en: 'apple', emoji: '🍎' },
            { t: 'Milch', en: 'milk', emoji: '🥛' },
            { t: 'Kaffee', en: 'coffee', emoji: '☕' },
          ],
          sentences: [
            { t: 'Ich trinke Wasser.', en: ['I drink water.', "I('m| am) drinking water."] },
            { t: 'Ich esse Brot.', en: ['I eat bread.', "I('m| am) eating bread."] },
            { t: 'Ein Apfel und ein Kaffee.', en: '(An|One) apple and (a|one) coffee.' },
            { t: 'Eine Milch, bitte.', en: '(A|One|Some) milk, please.' },
          ],
        },
        {
          id: 'u2l2',
          title: 'Meals',
          words: [
            { t: 'Essen', en: 'meal', emoji: '🍽️' },
            { t: 'Reis', en: 'rice', emoji: '🍚' },
            { t: 'Käse', en: 'cheese', emoji: '🧀' },
            { t: 'Ei', en: 'egg', emoji: '🥚' },
            { t: 'Orange', en: 'orange', emoji: '🍊' },
          ],
          sentences: [
            { t: 'Sie isst Reis.', en: ['She eats rice.', "She('s| is) eating rice."] },
            { t: 'Der Käse ist gut.', en: "The cheese( is|'s) good." },
            { t: 'Ich esse ein Ei.', en: ['I eat an egg.', "I('m| am) eating an egg."] },
            { t: 'Das Essen ist lecker.', en: "The (meal|food)( is|'s) (delicious|tasty|good)." },
          ],
        },
        {
          id: 'u2l3',
          title: 'At the café',
          words: [
            { t: 'Tee', en: 'tea', emoji: '🍵' },
            { t: 'Saft', en: 'juice', emoji: '🧃' },
            { t: 'Suppe', en: 'soup', emoji: '🥣' },
            { t: 'Hähnchen', en: 'chicken', emoji: '🍗' },
            { t: 'Fisch', en: 'fish', emoji: '🐟' },
          ],
          sentences: [
            { t: 'Ich hätte gern einen Tee, bitte.', en: "(I would like|I'd like|I want) [a ]tea, please." },
            { t: 'Das Hähnchen und der Fisch.', en: '[The ]chicken and [the ]fish.' },
            { t: 'Die Suppe ist gut.', en: "The soup( is|'s) good." },
            { t: 'Er trinkt Saft.', en: ['He drinks juice.', "He('s| is) drinking juice."] },
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
            { t: 'Mutter', en: 'mother', emoji: '👩‍👧' },
            { t: 'Vater', en: 'father', emoji: '👨‍👦' },
            { t: 'Bruder', en: 'brother', emoji: '👦' },
            { t: 'Schwester', en: 'sister', emoji: '👧' },
            { t: 'Familie', en: 'family', emoji: '👨‍👩‍👧' },
          ],
          sentences: [
            { t: 'Meine Mutter und mein Vater.', en: 'My (mother|mom|mum) and my (father|dad).' },
            { t: 'Ich habe einen Bruder.', en: ['I have a brother.', "I('ve| have) got a brother."] },
            { t: 'Das ist meine Schwester.', en: "(This|That|She)( is|'s) my sister." },
            { t: 'Meine Familie ist groß.', en: "My family( is|'s) (big|large)." },
          ],
        },
        {
          id: 'u3l2',
          title: 'Home',
          words: [
            { t: 'Haus', en: 'house', emoji: '🏠' },
            { t: 'Hund', en: 'dog', emoji: '🐶' },
            { t: 'Katze', en: 'cat', emoji: '🐱' },
            { t: 'Bett', en: 'bed', emoji: '🛏️' },
            { t: 'Buch', en: 'book', emoji: '📖' },
          ],
          sentences: [
            { t: 'Der Hund und die Katze.', en: 'The dog and the cat.' },
            { t: 'Mein Haus ist klein.', en: "My (house|home)( is|'s) (small|little)." },
            { t: 'Die Katze ist auf dem Bett.', en: "The cat( is|'s) on the bed." },
            { t: 'Ich lese ein Buch.', en: ['I read a book.', "I('m| am) reading a book."] },
          ],
        },
        {
          id: 'u3l3',
          title: 'Describing things',
          words: [
            { t: 'groß', en: 'big', emoji: '🐘' },
            { t: 'klein', en: 'small', emoji: '🐭' },
            { t: 'rot', en: 'red', emoji: '🔴' },
            { t: 'blau', en: 'blue', emoji: '🔵' },
            { t: 'neu', en: 'new', emoji: '✨' },
          ],
          sentences: [
            { t: 'Der Hund ist groß.', en: "The dog( is|'s) (big|large|tall)." },
            { t: 'Das Haus ist blau.', en: "The (house|home)( is|'s) blue." },
            { t: 'Ich habe eine kleine Katze.', en: 'I have a (small|little) cat.' },
            { t: 'Mein Buch ist neu.', en: "My book( is|'s) new." },
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
            { t: 'Zug', en: 'train', emoji: '🚆' },
            { t: 'Flugzeug', en: 'plane', emoji: '✈️' },
            { t: 'Strand', en: 'beach', emoji: '🏖️' },
            { t: 'Hotel', en: 'hotel', emoji: '🏨' },
            { t: 'Stadt', en: 'city', emoji: '🏙️' },
          ],
          sentences: [
            { t: 'Wo ist das Hotel?', en: "Where( is|'s) the hotel?" },
            { t: 'Der Zug ist schnell.', en: "The train( is|'s) (fast|quick)." },
            { t: 'Ich fahre an den Strand.', en: "(I'm going|I am going|I go) to the beach." },
            { t: 'Die Stadt ist schön.', en: "The city( is|'s) (beautiful|pretty|nice|lovely)." },
          ],
        },
        {
          id: 'u4l2',
          title: 'Directions',
          words: [
            { t: 'links', en: 'left', emoji: '⬅️' },
            { t: 'rechts', en: 'right', emoji: '➡️' },
            { t: 'Straße', en: 'street', emoji: '🛣️' },
            { t: 'Karte', en: 'map', emoji: '🗺️' },
            { t: 'in der Nähe', en: 'nearby', emoji: '📍' },
          ],
          sentences: [
            { t: 'Das Hotel ist in der Nähe.', en: "The hotel( is|'s) (near here|close by|nearby|close)." },
            { t: 'Biegen Sie rechts ab.', en: 'Turn [to the ]right.' },
            { t: 'Ich brauche eine Karte.', en: 'I need a map.' },
            { t: 'Die Straße ist links.', en: "The street( is|'s) (on|to) the left." },
          ],
        },
        {
          id: 'u4l3',
          title: 'Time',
          words: [
            { t: 'heute', en: 'today', emoji: '📅' },
            { t: 'morgen', en: 'tomorrow', emoji: '🌅' },
            { t: 'Nacht', en: 'night', emoji: '🌙' },
            { t: 'Tag', en: 'day', emoji: '☀️' },
            { t: 'Stunde', en: 'hour', emoji: '⏰' },
          ],
          sentences: [
            {
              t: 'Heute fahre ich in die Stadt.',
              en: [
                "Today (I'm going|I am going|I go) (to the city|into town|to town).",
                "(I'm going|I am going|I go) (to the city|into town|to town) today.",
              ],
            },
            { t: 'Gute Nacht.', en: 'Good night.' },
            { t: 'Bis morgen.', en: '(See you|Until) tomorrow.' },
            { t: 'Wie spät ist es?', en: 'What time is it?' },
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
            { t: 'aufwachen', en: 'to wake up', emoji: '⏰' },
            { t: 'die U-Bahn', en: 'the subway', emoji: '🚇' },
            { t: 'zuerst', en: 'first', emoji: '1️⃣' },
            { t: 'dann', en: 'then', emoji: '➡️' },
            { t: 'ankommen', en: 'to arrive', emoji: '🏁' },
          ],
          sentences: [
            { t: 'Ich wache vor acht Uhr auf.', en: 'I wake up before eight[ o’clock].' },
            { t: 'Dann nehme ich die U-Bahn zur Arbeit.', en: 'Then I take the (subway|underground|metro) to work.' },
            { t: 'Ich komme gegen neun Uhr im Büro an.', en: 'I arrive at the office (around|at about) nine[ o’clock].' },
          ],
        },
        {
          id: 'u5l2',
          title: 'Last weekend',
          words: [
            { t: 'das Wochenende', en: 'the weekend', emoji: '🗓️' },
            { t: 'ein Museum', en: 'a museum', emoji: '🏛️' },
            { t: 'ein Spaziergang', en: 'a walk', emoji: '🚶' },
            { t: 'der Fluss', en: 'the river', emoji: '🌊' },
            { t: 'nach Hause gehen', en: 'to go home', emoji: '🏠' },
          ],
          sentences: [
            { t: 'Letztes Wochenende haben wir ein Museum besucht.', en: 'Last weekend[,] we visited a museum.' },
            { t: 'Danach haben wir einen Spaziergang am Fluss gemacht.', en: 'After that[,] we (took|went for) a walk (by|along) the river.' },
            { t: 'Es hat geregnet, also sind wir früh nach Hause gegangen.', en: 'It rained, so we went home early.' },
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
            { t: 'vorschlagen', en: 'to suggest', emoji: '💡' },
            { t: 'reservieren', en: 'to book', emoji: '📅' },
            { t: 'sich treffen', en: 'to meet up', emoji: '🤝' },
            { t: 'frei', en: 'available', emoji: '🕊️' },
            { t: 'verschieben', en: 'to reschedule', emoji: '🔁' },
          ],
          sentences: [
            { t: 'Ich schlage vor, einen Tisch zu reservieren.', en: ['I suggest (booking|reserving) a table.', 'I suggest that we (book|reserve) a table.'] },
            { t: 'Wir könnten uns um neunzehn Uhr treffen.', en: ['We could meet at 7 pm.', 'We could meet at seven (pm|in the evening).'] },
            { t: 'Wenn du frei bist, können wir unseren Termin verschieben.', en: "If you( are|'re) (free|available), we can (reschedule|move|postpone) our appointment." },
          ],
        },
        {
          id: 'u6l2',
          title: 'Giving an opinion',
          words: [
            { t: 'meiner Meinung nach', en: 'in my opinion', emoji: '💬' },
            { t: 'bevorzugen', en: 'to prefer', emoji: '👍' },
            { t: 'ein Vorteil', en: 'an advantage', emoji: '➕' },
            { t: 'günstig', en: 'affordable', emoji: '💶' },
            { t: 'jedoch', en: 'however', emoji: '↔️' },
          ],
          sentences: [
            { t: 'Meiner Meinung nach ist der Zug praktischer als das Auto.', en: 'In my opinion[,] the train is more (convenient|practical) than the car.' },
            { t: 'Das Restaurant ist klein, jedoch sehr gemütlich.', en: "The restaurant is small, (but|yet|however) (it is |it's |)very (cozy|cosy|comfortable)." },
            { t: 'Wir haben die günstigste Option gewählt.', en: 'We (chose|picked|have chosen) the (most affordable|cheapest) option.' },
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
            { t: 'im Homeoffice arbeiten', en: 'to work from home', emoji: '💻' },
            { t: 'ein Team', en: 'a team', emoji: '👥' },
            { t: 'eine Besprechung', en: 'a meeting', emoji: '🗣️' },
            { t: 'das Protokoll', en: 'the meeting notes', emoji: '📝' },
            { t: 'eine Frist', en: 'a deadline', emoji: '⏳' },
          ],
          sentences: [
            { t: 'Ich arbeite zwei Tage pro Woche im Homeoffice.', en: 'I work (from home|remotely) two days a week.' },
            { t: 'Unser Team trifft sich jeden Montagmorgen.', en: 'Our team meets every Monday morning.' },
            { t: 'Kannst du das Protokoll vor der Frist schicken?', en: '(Can|Could) you send the (meeting notes|minutes) before the deadline?' },
          ],
        },
        {
          id: 'u7l2',
          title: 'Solving a problem',
          words: [
            { t: 'eine Panne', en: 'a breakdown', emoji: '⚠️' },
            { t: 'eine Lieferung', en: 'a delivery', emoji: '📦' },
            { t: 'informieren', en: 'to inform', emoji: '📣' },
            { t: 'erstatten', en: 'to refund', emoji: '💳' },
            { t: 'eine Lösung', en: 'a solution', emoji: '🧩' },
          ],
          sentences: [
            { t: 'Während der Lieferung gab es eine Panne.', en: 'There was a breakdown during the delivery.' },
            { t: 'Wir haben den Kunden informiert und eine Erstattung angeboten.', en: 'We informed the customer and offered a refund.' },
            { t: 'Könnten Sie uns helfen, eine Lösung zu finden?', en: '(Could|Can) you help us (to |)find a solution?' },
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
          title: 'Debating public policy',
          words: [
            { t: 'finanzieren', en: 'to fund', emoji: '🏛️' },
            { t: 'der Nahverkehr', en: 'public transport', emoji: '🚌' },
            { t: 'eine Maßnahme', en: 'a measure', emoji: '📋' },
            { t: 'teuer', en: 'costly', emoji: '💶' },
            { t: 'eine Herausforderung', en: 'a challenge', emoji: '⚖️' },
          ],
          sentences: [
            { t: 'Man sollte den öffentlichen Nahverkehr stärker finanzieren.', en: '(We|One) should fund public (transport|transportation) more.' },
            { t: 'Obwohl diese Maßnahme teuer ist, bleibt sie notwendig.', en: 'Although this measure is (costly|expensive), it (remains|is still) necessary.' },
            { t: 'Diese Entscheidung bringt eine große Herausforderung mit sich.', en: 'This decision (brings|poses) a (big|major|great) challenge.' },
          ],
        },
        {
          id: 'u8l2',
          title: 'Protecting the environment',
          words: [
            { t: 'die Artenvielfalt', en: 'biodiversity', emoji: '🦋' },
            { t: 'nachhaltig', en: 'sustainable', emoji: '♻️' },
            { t: 'reduzieren', en: 'to reduce', emoji: '📉' },
            { t: 'der Verbrauch', en: 'consumption', emoji: '🌱' },
            { t: 'gemeinsam', en: 'together', emoji: '🤲' },
          ],
          sentences: [
            { t: 'Der Klimaschutz erfordert eine gemeinsame Anstrengung.', en: '(Climate protection|Protecting the climate) requires a (collective|joint|shared) effort.' },
            { t: 'Wir müssen unseren Ressourcenverbrauch reduzieren.', en: 'We (must|have to) reduce our (resource consumption|consumption of resources).' },
            { t: 'Nachhaltiges Wachstum schützt die Artenvielfalt.', en: 'Sustainable growth protects biodiversity.' },
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
            { t: 'eine Hypothese', en: 'a hypothesis', emoji: '🔎' },
            { t: 'zuverlässig', en: 'reliable', emoji: '✅' },
            { t: 'relativieren', en: 'to qualify', emoji: '🎚️' },
            { t: 'allerdings', en: 'however', emoji: '↔️' },
            { t: 'infrage stellen', en: 'to challenge', emoji: '❓' },
          ],
          sentences: [
            { t: 'Diese Hypothese muss mit zuverlässigen Daten überprüft werden.', en: 'This hypothesis (must|has to) be (checked|tested|verified) (against|with) reliable data.' },
            { t: 'Ich verstehe Ihren Standpunkt; allerdings möchte ich ihn relativieren.', en: "I understand your point of view; however, I( would|'d) like to (qualify it|add some nuance)." },
            { t: 'Wir sollten diese Ergebnisse nicht ohne Beweise infrage stellen.', en: "We (should not|shouldn't) (challenge|question) these results without evidence." },
          ],
        },
        {
          id: 'u9l2',
          title: 'Disagreeing politely',
          words: [
            { t: 'anerkennen', en: 'to acknowledge', emoji: '🤝' },
            { t: 'eine Meinungsverschiedenheit', en: 'a disagreement', emoji: '⚖️' },
            { t: 'ein Vorbehalt', en: 'a reservation', emoji: '📝' },
            { t: 'zwar', en: 'admittedly', emoji: '☝️' },
            { t: 'dennoch', en: 'nevertheless', emoji: '➡️' },
          ],
          sentences: [
            { t: 'Ich erkenne den Wert dieses Vorschlags an.', en: 'I acknowledge the value of this proposal.' },
            { t: 'Ich teile zwar Ihre Meinung, aber mit einigen Vorbehalten.', en: ['I share your opinion, but with (a few|some) reservations.', 'Admittedly[,] I share your opinion, but with (a few|some) reservations.'] },
            { t: 'Wir sind uns nicht einig; dennoch können wir gemeinsam weitermachen.', en: "We (disagree|don't agree|do not agree); nevertheless, we can (move forward|carry on|continue) together." },
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
            { t: 'ein Werk', en: 'a work', emoji: '🎨' },
            { t: 'die Handlung', en: 'the plot', emoji: '📖' },
            { t: 'spielen in', en: 'to be set in', emoji: '🎬' },
            { t: 'bewegend', en: 'moving', emoji: '💭' },
            { t: 'eine Generation', en: 'a generation', emoji: '👥' },
          ],
          sentences: [
            { t: 'Dieser Roman erzählt von zwei Generationen.', en: 'This novel (tells the story of|is about|tells of) two generations.' },
            { t: 'Die Handlung spielt in einer Hafenstadt.', en: '(The plot|The story) (takes place|is set) in a port (city|town).' },
            { t: 'Dieses Werk hat mich tief bewegt.', en: 'This work (moved|has moved|touched) me deeply.' },
          ],
        },
        {
          id: 'u10l2',
          title: 'A formal discussion',
          words: [
            { t: 'eine Priorität', en: 'a priority', emoji: '🎯' },
            { t: 'auswählen', en: 'to select', emoji: '☑️' },
            { t: 'einstimmig', en: 'unanimously', emoji: '🗳️' },
            { t: 'sich darum kümmern', en: 'to take care of it', emoji: '🧑‍💼' },
            { t: 'ein Vorschlag', en: 'a proposal', emoji: '📄' },
          ],
          sentences: [
            { t: 'Wir sollten die Prioritäten überprüfen, bevor wir entscheiden.', en: 'We should review the priorities before (deciding|we decide).' },
            { t: 'Ihr Vorschlag wurde einstimmig angenommen.', en: 'Your proposal was (accepted|adopted|approved|selected) unanimously.' },
            { t: 'Ich kümmere mich vor der Frist darum.', en: "I( will|'ll) take care of it before the deadline." },
          ],
        },
      ],
    },
  ],
};
