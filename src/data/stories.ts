import type { Story } from '../types';

/**
 * Mini-stories: five short sentences, then comprehension questions answered in English.
 * Keyed by course id; `afterUnit` is the unprefixed unit whose vocabulary the story uses. Hindi and Japanese lines need `roman`.
 */
export const STORIES: Record<string, Story[]> = {
  es: [
    {
      id: 'ana-cafe',
      title: 'Ana’s morning coffee',
      emoji: '☕',
      summary: 'A small café, a friendly waiter and a surprise.',
      afterUnit: 'u2',
      lines: [
        { t: 'Ana vive en Madrid.', en: 'Ana lives in Madrid.' },
        { t: 'Cada mañana va a un café pequeño.', en: 'Every morning she goes to a small café.' },
        { t: 'Pide un café con leche y una tostada.', en: 'She orders a coffee with milk and a piece of toast.' },
        { t: 'El camarero se llama Luis y es muy simpático.', en: 'The waiter is called Luis and he is very friendly.' },
        { t: 'Hoy Ana no tiene dinero, ¡pero Luis la invita!', en: 'Today Ana has no money, but Luis treats her!' },
      ],
      questions: [
        { question: 'Where does Ana live?', options: ['Madrid', 'Seville', 'Valencia'], answer: 'Madrid' },
        { question: 'What does Ana order?', options: ['A coffee with milk and toast', 'A tea and a croissant', 'An orange juice'], answer: 'A coffee with milk and toast' },
        { question: 'What is different today?', options: ['Luis pays for her', 'The café is closed', 'Ana orders two coffees'], answer: 'Luis pays for her' },
      ],
    },
    {
      id: 'beach-trip',
      title: 'A day at the beach',
      emoji: '🏖️',
      summary: 'Pablo and his sister take the train to the sea.',
      afterUnit: 'u4',
      lines: [
        { t: 'El sábado, Pablo y su hermana toman el tren a la playa.', en: 'On Saturday, Pablo and his sister take the train to the beach.' },
        { t: 'El viaje dura una hora.', en: 'The journey takes an hour.' },
        { t: 'En la playa hace mucho sol y mucho calor.', en: 'At the beach it is very sunny and very hot.' },
        { t: 'Comen bocadillos y beben agua fría.', en: 'They eat sandwiches and drink cold water.' },
        { t: 'Por la tarde vuelven a casa, cansados pero felices.', en: 'In the evening they go back home, tired but happy.' },
      ],
      questions: [
        { question: 'How do they travel?', options: ['By train', 'By car', 'By bus'], answer: 'By train' },
        { question: 'What is the weather like?', options: ['Sunny and hot', 'Rainy', 'Cold and windy'], answer: 'Sunny and hot' },
        { question: 'How do they feel at the end of the day?', options: ['Tired but happy', 'Bored', 'Hungry and cold'], answer: 'Tired but happy' },
      ],
    },
  ],
  fr: [
    {
      id: 'lea-boulangerie',
      title: 'Léa at the bakery',
      emoji: '🥐',
      summary: 'A morning croissant, a kind baker and a forgotten purse.',
      afterUnit: 'u2',
      lines: [
        { t: 'Léa habite à Paris.', en: 'Léa lives in Paris.' },
        { t: 'Chaque matin, elle va à la boulangerie.', en: 'Every morning she goes to the bakery.' },
        { t: 'Elle achète un croissant et une baguette.', en: 'She buys a croissant and a baguette.' },
        { t: 'La boulangère s’appelle Marie, et elle est très gentille.', en: 'The baker is called Marie, and she is very kind.' },
        { t: 'Aujourd’hui, Léa a oublié son porte-monnaie, mais Marie lui offre le croissant !', en: 'Today Léa forgot her purse, but Marie gives her the croissant!' },
      ],
      questions: [
        { question: 'Where does Léa live?', options: ['Paris', 'Lyon', 'Marseille'], answer: 'Paris' },
        { question: 'What does Léa buy?', options: ['A croissant and a baguette', 'A cake and a coffee', 'Cheese and wine'], answer: 'A croissant and a baguette' },
        { question: 'What happens today?', options: ['Marie gives her the croissant', 'The bakery is closed', 'Léa buys two baguettes'], answer: 'Marie gives her the croissant' },
      ],
    },
    {
      id: 'beach-trip',
      title: 'A day by the sea',
      emoji: '🏖️',
      summary: 'Hugo and his sister take the train to the coast.',
      afterUnit: 'u4',
      lines: [
        { t: 'Samedi, Hugo et sa sœur prennent le train pour la mer.', en: 'On Saturday, Hugo and his sister take the train to the sea.' },
        { t: 'Le voyage dure une heure.', en: 'The journey takes an hour.' },
        { t: 'À la plage, il fait beau et très chaud.', en: 'At the beach, the weather is nice and very hot.' },
        { t: 'Ils mangent des sandwichs et boivent de l’eau fraîche.', en: 'They eat sandwiches and drink cool water.' },
        { t: 'Le soir, ils rentrent à la maison, fatigués mais contents.', en: 'In the evening they go back home, tired but happy.' },
      ],
      questions: [
        { question: 'How do they travel?', options: ['By train', 'By car', 'By bike'], answer: 'By train' },
        { question: 'How long is the journey?', options: ['One hour', 'Ten minutes', 'All day'], answer: 'One hour' },
        { question: 'How do they feel in the evening?', options: ['Tired but happy', 'Bored', 'Sad and cold'], answer: 'Tired but happy' },
      ],
    },
  ],
  hi: [
    {
      id: 'ravi-chai',
      title: 'Ravi’s morning chai',
      emoji: '🍵',
      summary: 'A tea stall, a kind owner and an empty wallet.',
      afterUnit: 'u3',
      lines: [
        { t: 'रवि दिल्ली में रहता है।', en: 'Ravi lives in Delhi.', roman: 'ravi dilli mein rehta hai.' },
        { t: 'हर सुबह वह चाय की दुकान पर जाता है।', en: 'Every morning he goes to the tea stall.', roman: 'har subah vah chaay ki dukaan par jaata hai.' },
        { t: 'वह एक चाय और दो बिस्कुट लेता है।', en: 'He has a tea and two biscuits.', roman: 'vah ek chaay aur do biskut leta hai.' },
        { t: 'दुकानवाले का नाम मोहन है, और वह बहुत अच्छा है।', en: 'The stall owner is called Mohan, and he is very nice.', roman: 'dukaanvaale ka naam mohan hai, aur vah bahut achchha hai.' },
        { t: 'आज रवि के पास पैसे नहीं हैं, पर मोहन कहता है, “कोई बात नहीं!”', en: 'Today Ravi has no money, but Mohan says, “No problem!”', roman: 'aaj ravi ke paas paise nahin hain, par mohan kehta hai, “koi baat nahin!”' },
      ],
      questions: [
        { question: 'Where does Ravi live?', options: ['Delhi', 'Mumbai', 'Jaipur'], answer: 'Delhi' },
        { question: 'What does Ravi have?', options: ['A tea and two biscuits', 'A coffee and a samosa', 'A lassi'], answer: 'A tea and two biscuits' },
        { question: 'What does Mohan say when Ravi has no money?', options: ['“No problem!”', '“Come back tomorrow.”', '“The stall is closed.”'], answer: '“No problem!”' },
      ],
    },
    {
      id: 'sunday-dinner',
      title: 'Sunday with Grandma',
      emoji: '🍛',
      summary: 'Neha and her mother cook for a special visitor.',
      afterUnit: 'u4',
      lines: [
        { t: 'आज रविवार है।', en: 'Today is Sunday.', roman: 'aaj ravivaar hai.' },
        { t: 'नेहा की दादी घर आ रही हैं।', en: 'Neha’s grandmother is coming to the house.', roman: 'neha ki daadi ghar aa rahi hain.' },
        { t: 'नेहा और उसकी माँ दाल, चावल और रोटी बनाती हैं।', en: 'Neha and her mother make dal, rice and roti.', roman: 'neha aur uski maan daal, chaaval aur roti banaati hain.' },
        { t: 'दादी को खाना बहुत पसंद आता है।', en: 'Grandma really likes the food.', roman: 'daadi ko khaana bahut pasand aata hai.' },
        { t: 'खाने के बाद सब मिलकर चाय पीते हैं।', en: 'After the meal, everyone drinks chai together.', roman: 'khaane ke baad sab milkar chaay peete hain.' },
      ],
      questions: [
        { question: 'What day is it?', options: ['Sunday', 'Monday', 'Friday'], answer: 'Sunday' },
        { question: 'Who is visiting?', options: ['Neha’s grandmother', 'Neha’s teacher', 'Neha’s brother'], answer: 'Neha’s grandmother' },
        { question: 'What does everyone do after the meal?', options: ['Drink chai together', 'Go to the market', 'Watch a film'], answer: 'Drink chai together' },
      ],
    },
  ],
  de: [
    {
      id: 'lena-cafe',
      title: 'Lena’s morning coffee',
      emoji: '☕',
      summary: 'A small café, a friendly waiter and a surprise.',
      afterUnit: 'u2',
      lines: [
        { t: 'Lena wohnt in Hamburg.', en: 'Lena lives in Hamburg.' },
        { t: 'Jeden Morgen geht sie in ein kleines Café.', en: 'Every morning she goes to a small café.' },
        { t: 'Sie bestellt einen Kaffee mit Milch und ein Brötchen.', en: 'She orders a coffee with milk and a bread roll.' },
        { t: 'Der Kellner heißt Tom und ist sehr freundlich.', en: 'The waiter is called Tom and he is very friendly.' },
        { t: 'Heute hat Lena kein Geld dabei, aber Tom lädt sie ein!', en: 'Today Lena has no money on her, but Tom treats her!' },
      ],
      questions: [
        { question: 'Where does Lena live?', options: ['Hamburg', 'Berlin', 'Munich'], answer: 'Hamburg' },
        { question: 'What does Lena order?', options: ['A coffee with milk and a bread roll', 'A tea and a slice of cake', 'An orange juice'], answer: 'A coffee with milk and a bread roll' },
        { question: 'What is different today?', options: ['Tom pays for her', 'The café is closed', 'Lena orders two coffees'], answer: 'Tom pays for her' },
      ],
    },
    {
      id: 'lake-trip',
      title: 'A day at the lake',
      emoji: '🏞️',
      summary: 'Max and his sister take the train to a lake.',
      afterUnit: 'u4',
      lines: [
        { t: 'Am Samstag fahren Max und seine Schwester mit dem Zug an einen See.', en: 'On Saturday, Max and his sister take the train to a lake.' },
        { t: 'Die Fahrt dauert eine Stunde.', en: 'The journey takes an hour.' },
        { t: 'Am See ist es sonnig und sehr warm.', en: 'At the lake it is sunny and very warm.' },
        { t: 'Sie schwimmen und essen Brote mit Käse.', en: 'They swim and eat cheese sandwiches.' },
        { t: 'Am Abend fahren sie müde, aber glücklich nach Hause.', en: 'In the evening they go home, tired but happy.' },
      ],
      questions: [
        { question: 'How do they travel?', options: ['By train', 'By car', 'By bike'], answer: 'By train' },
        { question: 'What is the weather like?', options: ['Sunny and warm', 'Rainy', 'Cold and windy'], answer: 'Sunny and warm' },
        { question: 'What do they eat?', options: ['Cheese sandwiches', 'Pizza', 'Fish and chips'], answer: 'Cheese sandwiches' },
      ],
    },
  ],
  ja: [
    {
      id: 'yuki-coffee',
      title: 'Yuki’s morning coffee',
      emoji: '☕',
      summary: 'A small café, a kind owner and a forgotten wallet.',
      afterUnit: 'u3',
      lines: [
        { t: 'ゆきさんは東京に住んでいます。', en: 'Yuki lives in Tokyo.', roman: 'Yuki-san wa Tōkyō ni sunde imasu.' },
        { t: '毎朝、小さい喫茶店に行きます。', en: 'Every morning she goes to a small café.', roman: 'maiasa, chiisai kissaten ni ikimasu.' },
        { t: 'コーヒーとパンを頼みます。', en: 'She orders coffee and bread.', roman: 'kōhī to pan o tanomimasu.' },
        { t: 'お店の人はとても親切です。', en: 'The owner of the shop is very kind.', roman: 'o-mise no hito wa totemo shinsetsu desu.' },
        { t: '今日、ゆきさんは財布を忘れましたが、お店の人は「また今度でいいですよ」と言いました。', en: 'Today Yuki forgot her wallet, but the owner said, “Next time is fine.”', roman: 'kyō, Yuki-san wa saifu o wasuremashita ga, o-mise no hito wa “mata kondo de ii desu yo” to iimashita.' },
      ],
      questions: [
        { question: 'Where does Yuki live?', options: ['Tokyo', 'Osaka', 'Kyoto'], answer: 'Tokyo' },
        { question: 'What does Yuki order?', options: ['Coffee and bread', 'Tea and rice', 'An orange juice'], answer: 'Coffee and bread' },
        { question: 'What happens today?', options: ['She forgets her wallet', 'The café is closed', 'She meets a friend'], answer: 'She forgets her wallet' },
      ],
    },
    {
      id: 'sunday-dinner',
      title: 'Dinner with Grandma',
      emoji: '🍲',
      summary: 'Haruto and his mother cook for a special visitor.',
      afterUnit: 'u4',
      lines: [
        { t: '今日は日曜日です。', en: 'Today is Sunday.', roman: 'kyō wa nichiyōbi desu.' },
        { t: 'はるとさんのおばあさんが家に来ます。', en: 'Haruto’s grandmother is coming to the house.', roman: 'Haruto-san no obāsan ga ie ni kimasu.' },
        { t: 'はるとさんとお母さんは魚と野菜を料理します。', en: 'Haruto and his mother cook fish and vegetables.', roman: 'Haruto-san to okāsan wa sakana to yasai o ryōri shimasu.' },
        { t: 'おばあさんは「おいしい！」と言います。', en: 'Grandma says, “Delicious!”', roman: 'obāsan wa “oishii!” to iimasu.' },
        { t: '食事のあと、みんなでお茶を飲みます。', en: 'After the meal, everyone drinks tea together.', roman: 'shokuji no ato, minna de ocha o nomimasu.' },
      ],
      questions: [
        { question: 'What day is it?', options: ['Sunday', 'Monday', 'Friday'], answer: 'Sunday' },
        { question: 'Who is visiting?', options: ['Haruto’s grandmother', 'Haruto’s teacher', 'Haruto’s friend'], answer: 'Haruto’s grandmother' },
        { question: 'What does everyone do after the meal?', options: ['Drink tea together', 'Go shopping', 'Watch a film'], answer: 'Drink tea together' },
      ],
    },
  ],
};
