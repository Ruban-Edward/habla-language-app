import type { UsageNote } from '../types';

/**
 * Short usage notes per unit: how words work, not only what they mean.
 * Keyed by course id, then by unprefixed unit id. Every unit should have at least one note
 * (the content test enforces this). Hindi and Japanese examples carry romanization.
 */
export const USAGE_NOTES: Record<string, Record<string, UsageNote[]>> = {
  es: {
    u1: [
      {
        title: 'Two ways to say “you”',
        body: 'Use tú with friends, family and children, and usted with strangers, older people and in formal settings. In Spain, vosotros is the informal plural; in Latin America, ustedes covers every group.',
        examples: [
          { t: '¿Cómo te llamas?', en: 'What’s your name? (tú)' },
          { t: '¿Cómo se llama?', en: 'What’s your name? (usted)' },
        ],
      },
      {
        title: 'Accents and upside-down marks',
        body: 'Questions and exclamations open with ¿ and ¡. Written accents can change meaning: sí means yes, si means if.',
        examples: [{ t: '¡Hola! ¿Qué tal?', en: 'Hi! How’s it going?' }],
      },
      {
        title: 'Soy or estoy?',
        body: 'Both mean “I am”. Ser (soy) describes who or what you are; estar (estoy) describes how you are right now or where something is.',
        examples: [
          { t: 'Soy un hombre.', en: 'I am a man.' },
          { t: 'Estoy bien.', en: 'I am well.' },
        ],
      },
    ],
    u2: [
      {
        title: 'Every noun has a gender',
        body: 'Learn each noun with its article: el or un for masculine, la or una for feminine. Most nouns in -o are masculine and most in -a are feminine, but words in -e must be memorised. Feminine nouns starting with a stressed a- take el in the singular: el agua.',
        examples: [
          { t: 'el café, la leche', en: 'the coffee, the milk' },
          { t: 'el agua fría', en: 'the cold water (still feminine)' },
        ],
      },
      {
        title: 'Words change by region',
        body: 'Juice is jugo in Latin America and zumo in Spain. Potato is papa in Latin America and patata in Spain. Both are understood everywhere.',
      },
      {
        title: 'Ordering politely',
        body: 'Quiero (I want) is normal in a café, especially with por favor. Quisiera (I would like) sounds softer. In Spain you will also hear ¿Me pone…? (Could you give me…?).',
        examples: [{ t: 'Quisiera un té, por favor.', en: 'I would like a tea, please.' }],
      },
    ],
    u3: [
      {
        title: 'Adjectives agree and usually follow the noun',
        body: 'Adjectives match the noun’s gender and number and normally come after it. Adjectives ending in -e or a consonant, like grande and azul, don’t change for gender.',
        examples: [
          { t: 'un gato pequeño, una casa pequeña', en: 'a small cat, a small house' },
          { t: 'una casa azul', en: 'a blue house' },
        ],
      },
      {
        title: 'Tener for family and age',
        body: 'Use tener (to have) for family and age. Hermanos can mean brothers or brothers and sisters together.',
        examples: [
          { t: 'Tengo dos hermanos.', en: 'I have two siblings.' },
          { t: 'Tengo veinte años.', en: 'I am twenty (years old).' },
        ],
      },
      {
        title: 'Estar for location',
        body: 'Where something is always uses estar, even if it never moves.',
        examples: [{ t: 'El gato está en la cama.', en: 'The cat is on the bed.' }],
      },
    ],
    u4: [
      {
        title: 'Asking a stranger',
        body: 'Start with perdone (usted) or perdona (tú) and ask with ¿Dónde está…? People giving directions to strangers usually use the usted form: gire rather than gira.',
        examples: [{ t: 'Perdone, ¿dónde está la estación?', en: 'Excuse me, where is the station?' }],
      },
      {
        title: 'Right, or straight on?',
        body: 'A la derecha means to the right. Todo recto (Spain) and derecho (Latin America) mean straight ahead, so listen closely.',
      },
      {
        title: 'Telling the time',
        body: 'Say es la una for one o’clock and son las dos, son las tres… for the other hours. A las siete means at seven. Mañana means tomorrow, but la mañana means the morning.',
        examples: [{ t: 'Son las tres.', en: 'It’s three o’clock.' }],
      },
    ],
    u5: [
      {
        title: 'Routine verbs are reflexive',
        body: 'Many daily-routine verbs take a reflexive pronoun that matches the subject: me, te, se, nos, os, se.',
        examples: [
          { t: 'Me despierto a las siete.', en: 'I wake up at seven.' },
          { t: '¿A qué hora te despiertas?', en: 'What time do you wake up?' },
        ],
      },
      {
        title: 'Two past tenses',
        body: 'The preterite tells completed events: visité, dimos, volvimos. The imperfect sets the scene or describes what was going on: llovía.',
        examples: [{ t: 'Volvimos temprano porque llovía.', en: 'We came back early because it was raining.' }],
      },
    ],
    u6: [
      {
        title: 'Quedar means meeting up',
        body: 'Quedar (con alguien) is the everyday way to arrange to meet, used in Spain and much of Latin America. Quedar can also mean to remain or to fit, so context matters.',
        examples: [{ t: '¿Quedamos el sábado?', en: 'Shall we meet on Saturday?' }],
      },
      {
        title: 'Softening an opinion',
        body: 'Creo que, en mi opinión and prefiero introduce a view gently. After no creo que, Spanish uses the subjunctive.',
        examples: [
          { t: 'Creo que es caro.', en: 'I think it’s expensive.' },
          { t: 'No creo que sea caro.', en: 'I don’t think it’s expensive.' },
        ],
      },
    ],
    u7: [
      {
        title: 'Polite requests at work',
        body: '¿Puedes…? (tú) is fine with close colleagues. ¿Podría…? (usted, conditional) is more polite, so use it with clients or anyone senior.',
        examples: [{ t: '¿Podría enviarme el informe?', en: 'Could you send me the report?' }],
      },
      {
        title: 'False friends',
        body: 'Actual means current, not actual. Asistir means to attend. Realizar means to carry out. Éxito means success, not exit.',
      },
    ],
    u8: [
      {
        title: 'Aunque with fact or possibility',
        body: 'Aunque with the indicative accepts something as fact. With the subjunctive it means even if, leaving the point open.',
        examples: [
          { t: 'Aunque la medida es costosa…', en: 'Although the measure is costly… (it is)' },
          { t: 'Aunque sea costosa…', en: 'Even if it is costly…' },
        ],
      },
      {
        title: 'Deberíamos softens “we must”',
        body: 'Debemos is a firm “we must”. The conditional deberíamos (“we should”) recommends without sounding like an order.',
      },
    ],
    u9: [
      {
        title: 'Connecting ideas',
        body: 'Sin embargo and no obstante (both “however”, no obstante more formal) start a new clause, often after a semicolon. Aunque and a pesar de que join clauses within one sentence.',
        examples: [{ t: 'Es útil; sin embargo, es caro.', en: 'It’s useful; however, it’s expensive.' }],
      },
      {
        title: 'Disagreeing with care',
        body: 'Acknowledge first, then add your view: Entiendo tu punto de vista, pero… or Comparto tu opinión en parte. Tener reservas means to have doubts.',
      },
    ],
    u10: [
      {
        title: 'Two kinds of passive',
        body: 'Ser plus a past participle is common in formal writing, and the participle agrees with the subject. In everyday speech, the se-passive is more natural.',
        examples: [
          { t: 'La propuesta fue seleccionada.', en: 'The proposal was selected.' },
          { t: 'Se seleccionó la propuesta.', en: 'The proposal was selected.' },
        ],
      },
      {
        title: 'Committing to a task',
        body: 'The future (me encargaré) sounds like a firm promise. In conversation, ir a + infinitive (voy a encargarme) is just as common.',
      },
    ],
  },
  fr: {
    u1: [
      {
        title: 'Tu or vous',
        body: 'Use tu with friends, family and children, and vous with strangers, older people, at work, and for any group. The words around it change too: s’il te plaît (tu) vs s’il vous plaît (vous).',
        examples: [
          { t: 'Comment tu t’appelles ?', en: 'What’s your name? (tu)' },
          { t: 'Comment vous appelez-vous ?', en: 'What’s your name? (vous)' },
        ],
      },
      {
        title: 'Elision',
        body: 'Short words such as le, la, je, me, ne and de drop their vowel before a vowel or a silent h, and an apostrophe takes its place.',
        examples: [{ t: 'Je m’appelle Paul. J’ai un ami.', en: 'My name is Paul. I have a friend.' }],
      },
      {
        title: 'Greetings matter',
        body: 'Always say bonjour when you walk into a shop or start talking to someone. Switch to bonsoir in the evening. Bonne nuit is only for when someone is going to bed.',
      },
    ],
    u2: [
      {
        title: 'Learn the article with the noun',
        body: 'Le and un go with masculine nouns, la and une with feminine ones, and le or la becomes l’ before a vowel. Gender is often unpredictable: le pain, la pomme, l’eau (feminine).',
      },
      {
        title: 'Du, de la, de l’ for “some”',
        body: 'Use the partitive for an unspecified amount. After a negative it becomes de. When talking about likes, use le, la or les.',
        examples: [
          { t: 'Je bois de l’eau.', en: 'I drink (some) water.' },
          { t: 'Je ne bois pas de lait.', en: 'I don’t drink milk.' },
          { t: 'J’aime le fromage.', en: 'I like cheese.' },
        ],
      },
      {
        title: 'Ordering politely',
        body: 'Je voudrais (I would like) is the polite choice. Je veux can sound demanding. Just naming the item works too: un café, s’il vous plaît.',
      },
    ],
    u3: [
      {
        title: 'Adjective agreement and position',
        body: 'Add -e for feminine and -s for plural: bleu, bleue. Most adjectives follow the noun, but common ones for beauty, age, goodness and size usually come first: un petit chat, une grande maison. Nouveau becomes nouvel before a vowel.',
        examples: [{ t: 'un nouvel ami', en: 'a new friend' }],
      },
      {
        title: 'Possessives agree with the thing owned',
        body: 'Mon père, ma mère, mes parents. Before a vowel, use mon even for feminine nouns: mon amie.',
      },
      {
        title: 'C’est or il/elle est?',
        body: 'Use c’est before a determiner plus noun (c’est ma sœur), and il est or elle est before an adjective alone (elle est grande).',
      },
    ],
    u4: [
      {
        title: 'Liaison',
        body: 'A normally silent final consonant is pronounced when the next word starts with a vowel: les‿hôtels, vous‿avez. There is never a liaison after et.',
      },
      {
        title: 'À + le = au',
        body: 'À combines with le and les: au musée, aux toilettes. À la and à l’ stay as they are: à la plage, à l’hôtel.',
      },
      {
        title: 'Times and timetables',
        body: 'Il est huit heures means it’s eight o’clock. Timetables and appointments use the 24-hour clock: dix-neuf heures is 7 pm.',
      },
    ],
    u5: [
      {
        title: 'Passé composé with avoir or être',
        body: 'Most verbs use avoir: nous avons visité. Verbs of movement or change of state, and all reflexive verbs, use être, and their participle agrees with the subject.',
        examples: [
          { t: 'Nous sommes rentrés tôt.', en: 'We went home early.' },
          { t: 'Elle s’est réveillée.', en: 'She woke up.' },
        ],
      },
      {
        title: 'Ordering a story',
        body: 'Use d’abord (first), ensuite or puis (then) and enfin (finally) to put events in order.',
      },
    ],
    u6: [
      {
        title: 'On often means “we”',
        body: 'In conversation, on very often replaces nous. The verb takes the il/elle form.',
        examples: [{ t: 'On pourrait se retrouver à sept heures.', en: 'We could meet at seven.' }],
      },
      {
        title: 'The conditional softens',
        body: 'Pourrait, voudrais and aimerais make suggestions and requests sound polite. Pourtant (yet) and cependant (however) mark a contrast.',
      },
    ],
    u7: [
      {
        title: 'Formal requests and emails',
        body: 'Pourriez-vous… ? and Merci de… are polite ways to ask. Close work emails with Cordialement. Peux-tu… ? is fine with colleagues you call tu.',
        examples: [{ t: 'Merci de m’envoyer le compte rendu.', en: 'Please send me the meeting notes.' }],
      },
      {
        title: 'False friends',
        body: 'Actuellement means currently. Éventuellement means possibly. Une librairie is a bookshop. Un compte rendu is a report or meeting notes, not an account.',
      },
    ],
    u8: [
      {
        title: 'Bien que takes the subjunctive',
        body: 'Bien que (although) is always followed by the subjunctive.',
        examples: [{ t: 'Bien que cette mesure soit coûteuse…', en: 'Although this measure is costly…' }],
      },
      {
        title: 'Il faudrait',
        body: 'This impersonal conditional (“it would be necessary”) is a polite way to say “we should” in debates.',
      },
    ],
    u9: [
      {
        title: 'Connectors of contrast',
        body: 'Toutefois, cependant and néanmoins all mean however; néanmoins is the most formal. Certes… mais concedes a point before answering it.',
        examples: [{ t: 'Certes, c’est cher, mais c’est utile.', en: 'Admittedly it’s expensive, but it’s useful.' }],
      },
      {
        title: 'Polite disagreement',
        body: 'Je comprends votre point de vue, mais… and Je ne suis pas tout à fait d’accord let you disagree without sounding blunt.',
      },
    ],
    u10: [
      {
        title: 'Passé simple in novels',
        body: 'Literature often tells stories in the passé simple (il fut, elle arriva). You only need to recognise it; in speech, use the passé composé.',
      },
      {
        title: 'Formal register',
        body: 'Meetings favour nous over on. Retenir une proposition means to select or shortlist a proposal. Je m’en charge means I’ll take care of it.',
      },
    ],
  },
  hi: {
    u1: [
      {
        title: 'Vowel signs (matras)',
        body: 'A vowel has a full letter at the start of a word (अ, आ, इ…) and a small sign, a matra, when it follows a consonant. Every consonant already includes a short “a”: क is ka.',
        examples: [
          { t: 'क → का, कि, की, कु, के', en: 'the consonant ka with different vowel signs', roman: 'ka → kaa, ki, kee, ku, ke' },
        ],
      },
      {
        title: 'Short and long vowels',
        body: 'Vowel length changes meaning: इ (i) vs ई (ee), उ (u) vs ऊ (oo).',
        examples: [
          { t: 'कि / की', en: 'that / of (feminine)', roman: 'ki / kee' },
        ],
      },
      {
        title: 'Sounds romanization can’t show',
        body: 'Hindi tells apart aspirated consonants (ख kh, with a puff of air) from plain ones (क k), and dental sounds (त, द, tongue on the teeth) from retroflex ones (ट, ड, tongue curled back). Listen to the audio rather than relying on the spelling in English letters.',
      },
    ],
    u2: [
      {
        title: 'Polite and familiar “you”',
        body: 'आप (aap) is respectful: use it with strangers, elders and anyone you’re unsure of. तुम (tum) is for friends and people younger than you. तू (tu) is very intimate, and rude with strangers. The verb changes with each.',
        examples: [
          { t: 'आप कैसे हैं?', en: 'How are you? (aap)', roman: 'aap kaise hain?' },
          { t: 'तुम कैसे हो?', en: 'How are you? (tum)', roman: 'tum kaise ho?' },
        ],
      },
      {
        title: 'The verb comes last',
        body: 'Hindi sentences end with the verb, and the full stop is a danda (।). मैं goes with हूँ, वह with है, and आप or हम with हैं.',
        examples: [{ t: 'मैं लड़का हूँ।', en: 'I am a boy. (literally “I boy am”)', roman: 'main ladka hoon.' }],
      },
      {
        title: 'Thank you, two ways',
        body: 'धन्यवाद (dhanyavaad) is formal. शुक्रिया (shukriya) is just as common in everyday speech. नमस्ते works for both hello and goodbye.',
      },
    ],
    u3: [
      {
        title: 'मुझे … चाहिए',
        body: 'To say you want something, Hindi says “to me … is needed”. The thing wanted acts as the subject. पसंद (liking) works the same way.',
        examples: [
          { t: 'मुझे पानी चाहिए।', en: 'I want water.', roman: 'mujhe paani chaahiye.' },
          { t: 'मुझे खाना पसंद है।', en: 'I like the food.', roman: 'mujhe khaana pasand hai.' },
        ],
      },
      {
        title: 'Gender shows in verbs and adjectives',
        body: 'Verbs and adjectives ending in -ा change to -ी for a feminine noun or speaker. दाल is feminine, so it is अच्छी, not अच्छा.',
        examples: [
          { t: 'वह जूस पीता है। / वह जूस पीती है।', en: 'He drinks juice. / She drinks juice.', roman: 'vah juice peeta hai. / vah juice peeti hai.' },
          { t: 'दाल अच्छी है।', en: 'The daal is good.', roman: 'daal achchhi hai.' },
        ],
      },
      {
        title: 'Borrowed words',
        body: 'Everyday Hindi borrows freely from English: कॉफ़ी, जूस. The dot under फ़ marks an “f” sound, which Hindi borrowed from Persian and English.',
      },
    ],
    u4: [
      {
        title: 'मेरा, मेरी, मेरे',
        body: '“My” agrees with the thing or person owned, not with the owner. मेरे is also used for respect, as with a father.',
        examples: [
          { t: 'मेरा भाई, मेरी बहन, मेरे पिता', en: 'my brother, my sister, my father', roman: 'mera bhaai, meri bahan, mere pita' },
        ],
      },
      {
        title: 'There is no verb “to have”',
        body: 'For family, say “my brother is”. For things you possess, use मेरे पास (“near me”).',
        examples: [
          { t: 'मेरा एक भाई है।', en: 'I have a brother.', roman: 'mera ek bhaai hai.' },
          { t: 'मेरे पास किताब है।', en: 'I have a book.', roman: 'mere paas kitaab hai.' },
        ],
      },
      {
        title: 'Postpositions come after the noun',
        body: 'में (in), पर (on) and से (from) follow the noun, and a masculine noun ending in -ा changes to -े before them.',
        examples: [{ t: 'कमरा → कमरे में', en: 'room → in the room', roman: 'kamra → kamre mein' }],
      },
    ],
    u5: [
      {
        title: 'The habitual present',
        body: 'Take the verb stem and add ता, ती or ते (by gender and number), then a form of होना.',
        examples: [
          { t: 'मैं छह बजे जागता हूँ। / जागती हूँ।', en: 'I wake up at six. (male / female speaker)', roman: 'main chhah baje jaagta hoon. / jaagti hoon.' },
        ],
      },
      {
        title: 'Past tense agreement',
        body: 'With verbs of motion, the verb agrees with the subject: हम संग्रहालय गए. With transitive verbs, the subject takes ने and the verb agrees with the object: हमने समाधान खोजा (you’ll meet this in Work & problem-solving).',
      },
    ],
    u6: [
      {
        title: 'सकना means “can”',
        body: 'Put सकना after the verb stem. It agrees with the subject.',
        examples: [{ t: 'हम मिल सकते हैं।', en: 'We can meet.', roman: 'hum mil sakte hain.' }],
      },
      {
        title: 'Two families of words',
        body: 'Hindi mixes Sanskrit-derived words such as सुझाव and विकल्प with Persian- and Urdu-derived ones such as राय and फ़ायदा. Both kinds are everyday, and casual speech also borrows English (ऑप्शन).',
      },
    ],
    u7: [
      {
        title: 'Levels of politeness in requests',
        body: 'From most polite to most casual: भेजिए and कृपया भेजें (polite), भेजो (familiar), भेज (very casual). Use the polite forms at work unless colleagues invite otherwise.',
        examples: [{ t: 'कृपया रिपोर्ट भेजिए।', en: 'Please send the report.', roman: 'kripya report bhejiye.' }],
      },
      {
        title: 'Hindi at the office',
        body: 'Office Hindi is full of English: टीम, रिपोर्ट, मीटिंग. बैठक is the more formal Hindi word for a meeting.',
      },
    ],
    u8: [
      {
        title: 'चाहिए for “should”',
        body: 'The person who should act takes को, and चाहिए follows an infinitive.',
        examples: [
          { t: 'सरकार को निवेश करना चाहिए।', en: 'The government should invest.', roman: 'sarkaar ko nivesh karna chaahiye.' },
        ],
      },
      {
        title: 'हालाँकि … फिर भी',
        body: 'हालाँकि (although) often pairs with फिर भी (even so) in the main clause.',
      },
    ],
    u9: [
      {
        title: 'Hedging an argument',
        body: 'शायद (maybe), ऐसा लगता है (it seems) and मेरे ख़याल से (in my view) make a claim sound measured.',
        examples: [{ t: 'मेरे ख़याल से यह सही है।', en: 'In my view, this is right.', roman: 'mere khayaal se yah sahi hai.' }],
      },
      {
        title: 'Disagreeing politely',
        body: 'Acknowledge first, then disagree. The verb समझना changes with the speaker’s gender: समझता for a man, समझती for a woman.',
        examples: [
          { t: 'माफ़ कीजिए, पर मैं सहमत नहीं हूँ।', en: 'Sorry, but I don’t agree.', roman: 'maaf keejiye, par main sahmat nahin hoon.' },
        ],
      },
    ],
    u10: [
      {
        title: 'Formal Hindi',
        body: 'Committees, news and official writing prefer Sanskrit-derived words. निर्णय means decision formally; फ़ैसला is the everyday word.',
      },
      {
        title: 'The future shows gender',
        body: 'Future verbs end in -गा for a male speaker and -गी for a female speaker.',
        examples: [
          { t: 'मैं ज़िम्मेदारी लूँगा। / लूँगी।', en: 'I will take responsibility. (male / female speaker)', roman: 'main zimmedaari loonga. / loongi.' },
        ],
      },
    ],
  },
  de: {
    u1: [
      {
        title: 'Du or Sie',
        body: 'Use du with friends, family, children and other young people, and Sie with strangers, older people and at work. Sie is always written with a capital S, and the verb changes with it.',
        examples: [
          { t: 'Wie heißt du?', en: 'What’s your name? (du)' },
          { t: 'Wie heißen Sie?', en: 'What’s your name? (Sie)' },
        ],
      },
      {
        title: 'Nouns are capitalised',
        body: 'Every German noun starts with a capital letter, wherever it is in the sentence: der Mann, die Frau, das Mädchen. It is a handy clue when you read.',
      },
      {
        title: 'Greetings through the day',
        body: 'Guten Morgen in the morning, Guten Tag during the day, Guten Abend in the evening. Hallo and Tschüss are casual; Auf Wiedersehen is the polite goodbye.',
      },
    ],
    u2: [
      {
        title: 'Three genders: der, die, das',
        body: 'Every noun is masculine (der), feminine (die) or neuter (das), and the gender is often unpredictable. Learn the article with the noun: der Apfel, die Milch, das Brot. Ein goes with der and das nouns, eine with die nouns.',
      },
      {
        title: 'Ordering politely',
        body: 'Ich hätte gern… (I would like…) is the polite way to order. Ich möchte… works too. Ich will… sounds demanding.',
        examples: [{ t: 'Ich hätte gern einen Kaffee, bitte.', en: 'I’d like a coffee, please.' }],
      },
      {
        title: 'No word for “some”',
        body: 'For an unspecified amount, German simply drops the article: Ich trinke Wasser (I drink water / some water).',
      },
    ],
    u3: [
      {
        title: 'Mein and meine',
        body: 'Possessives follow the noun’s gender like ein does: mein Vater, mein Haus, but meine Mutter, meine Familie.',
        examples: [{ t: 'Meine Schwester und mein Bruder.', en: 'My sister and my brother.' }],
      },
      {
        title: 'Einen after haben',
        body: 'The direct object goes into the accusative case. Only masculine words change: ein becomes einen, der becomes den.',
        examples: [{ t: 'Ich habe einen Bruder und eine Schwester.', en: 'I have a brother and a sister.' }],
      },
      {
        title: 'Adjective endings',
        body: 'After ist, an adjective takes no ending: Das Haus ist klein. Before a noun it does: ein kleines Haus, eine kleine Katze.',
      },
    ],
    u4: [
      {
        title: 'Verb in second place',
        body: 'In a statement, the verb is always the second element. If you start with heute or another word, the subject moves after the verb.',
        examples: [
          { t: 'Ich fahre heute in die Stadt.', en: 'I’m going into town today.' },
          { t: 'Heute fahre ich in die Stadt.', en: 'Today I’m going into town.' },
        ],
      },
      {
        title: 'Fahren or gehen',
        body: 'Gehen means going on foot; fahren means going by car, train or bike. Germans are precise about this.',
      },
      {
        title: 'Telling the time',
        body: 'Wie spät ist es? or Wie viel Uhr ist es? both ask the time. Timetables and bookings use the 24-hour clock: neunzehn Uhr is 7 pm.',
      },
    ],
    u5: [
      {
        title: 'Separable verbs',
        body: 'Verbs such as aufwachen and ankommen split in a sentence: the prefix jumps to the end.',
        examples: [
          { t: 'Ich wache um sieben Uhr auf.', en: 'I wake up at seven.' },
          { t: 'Der Zug kommt um neun an.', en: 'The train arrives at nine.' },
        ],
      },
      {
        title: 'The spoken past: haben or sein + participle',
        body: 'Everyday German uses the Perfekt for the past. Most verbs take haben; verbs of movement or change, such as gehen and fahren, take sein. The participle goes to the end.',
        examples: [
          { t: 'Wir haben ein Museum besucht.', en: 'We visited a museum.' },
          { t: 'Wir sind nach Hause gegangen.', en: 'We went home.' },
        ],
      },
    ],
    u6: [
      {
        title: 'Könnten for suggestions',
        body: 'Wir könnten… (we could…) makes a soft suggestion. Hast du Zeit? asks whether someone is free.',
      },
      {
        title: 'Comparing things',
        body: 'Add -er for “more” and use als for “than”: praktischer als, günstiger als. For “the most”, use am …sten or the …ste.',
        examples: [{ t: 'Der Zug ist günstiger als das Flugzeug.', en: 'The train is cheaper than the plane.' }],
      },
      {
        title: 'Word order after wenn',
        body: 'Wenn (if, when) sends its verb to the end of the clause, and the main clause then starts with its verb.',
        examples: [{ t: 'Wenn du Zeit hast, können wir uns treffen.', en: 'If you have time, we can meet.' }],
      },
    ],
    u7: [
      {
        title: 'Formal requests',
        body: 'Könnten Sie…? is the polite way to ask for something at work. Kannst du…? is fine with colleagues you call du.',
      },
      {
        title: 'Workplace words',
        body: 'Eine Besprechung is a meeting, das Protokoll is the written notes of it, and eine Frist is a deadline. Many offices also say Meeting and Deadline.',
      },
    ],
    u8: [
      {
        title: 'Man for “people in general”',
        body: 'Man takes the same verb form as er and gives a general statement: Man sollte… means “we should” or “one should”.',
      },
      {
        title: 'Obwohl and the verb at the end',
        body: 'Like wenn and weil, obwohl (although) sends the verb to the end of its clause.',
        examples: [{ t: 'Obwohl es teuer ist, ist es notwendig.', en: 'Although it is expensive, it is necessary.' }],
      },
      {
        title: 'Long compound nouns',
        body: 'German builds new nouns by joining words, and the last part decides the gender: der Ressourcenverbrauch (resource consumption), die Hafenstadt (port city).',
      },
    ],
    u9: [
      {
        title: 'Zwar … aber',
        body: 'Zwar … aber concedes a point before a counterpoint, like “admittedly …, but”.',
        examples: [{ t: 'Die Idee ist zwar gut, aber zu teuer.', en: 'Admittedly the idea is good, but it is too expensive.' }],
      },
      {
        title: 'Softening disagreement',
        body: 'Phrases such as Ich sehe das etwas anders (I see it a little differently) or Da bin ich mir nicht sicher (I’m not sure about that) disagree without sounding blunt.',
      },
    ],
    u10: [
      {
        title: 'Spielen for settings',
        body: 'A story spielt in a place or time: Der Roman spielt in Hamburg. Erzählen von means to tell the story of.',
      },
      {
        title: 'The passive with werden',
        body: 'Formal German often uses the passive: wurde + participle. Der Vorschlag wurde angenommen means “the proposal was accepted”.',
      },
      {
        title: 'Sich um etwas kümmern',
        body: 'Ich kümmere mich darum means “I’ll take care of it”, a useful promise at work.',
      },
    ],
  },
  ja: {
    u1: [
      {
        title: 'Three scripts',
        body: 'Japanese uses hiragana for grammar and native words, katakana for foreign words (コーヒー, coffee), and kanji for most nouns and verb stems. Start with hiragana: every symbol is one syllable.',
        examples: [{ t: 'あ い う え お', en: 'a i u e o', roman: 'a i u e o' }],
      },
      {
        title: 'The odd ones out',
        body: 'Most symbols are a consonant plus a vowel, but some differ from the pattern: し is shi, ち is chi and つ is tsu. ん is a sound on its own.',
      },
      {
        title: 'Two small marks',
        body: 'Two small strokes (゛) make a sound voiced: か ka becomes が ga, さ sa becomes ざ za. A small circle (゜) turns h into p: は ha becomes ぱ pa.',
        examples: [{ t: 'か → が, は → ぱ', en: 'ka → ga, ha → pa', roman: 'ka → ga, ha → pa' }],
      },
    ],
    u2: [
      {
        title: 'は is read “wa”',
        body: 'When は marks the topic of a sentence, it is pronounced wa, not ha. わたし は … means “As for me, …”.',
        examples: [{ t: 'わたし は 学生 です。', en: 'I am a student.', roman: 'watashi wa gakusei desu.' }],
      },
      {
        title: 'です makes it polite',
        body: 'です (desu) works like “is / am / are” and keeps the sentence polite. The final u is usually barely pronounced: “dess”.',
      },
      {
        title: 'Names and さん',
        body: 'Add さん after other people’s names, never your own. Japanese often leaves out “I” and “you” when they are obvious.',
        examples: [{ t: 'ケン さん は 友だち です。', en: 'Ken is a friend.', roman: 'Ken san wa tomodachi desu.' }],
      },
    ],
    u3: [
      {
        title: 'Verb at the end, を for the object',
        body: 'Japanese word order is subject – object – verb. を (pronounced o) marks the thing you eat, drink or read.',
        examples: [{ t: '水 を 飲みます。', en: 'I drink water.', roman: 'mizu o nomimasu.' }],
      },
      {
        title: 'Asking for things',
        body: 'Noun + を ください means “please give me…”, the easiest way to order. Adding お, as in お茶, makes a word sound polite and gentle.',
        examples: [{ t: 'お茶 を ください。', en: 'Tea, please.', roman: 'ocha o kudasai.' }],
      },
      {
        title: 'No “a” or “the”, and no plurals',
        body: 'Japanese has no articles and rarely marks plurals: りんご can be an apple, the apple or apples. Context decides.',
      },
    ],
    u4: [
      {
        title: 'My family, your family',
        body: 'Use plain words for your own family (母, 父, 兄, 姉) and polite ones for someone else’s (お母さん, お父さん, お兄さん, お姉さん).',
        examples: [{ t: 'こちら は 姉 です。', en: 'This is my older sister.', roman: 'kochira wa ane desu.' }],
      },
      {
        title: 'います and あります',
        body: 'Both mean “there is / to have”. Use います for people and animals, and あります for things.',
        examples: [
          { t: 'ねこ が います。', en: 'There is a cat.', roman: 'neko ga imasu.' },
          { t: '本 が あります。', en: 'There is a book.', roman: 'hon ga arimasu.' },
        ],
      },
      {
        title: 'この, その, あの',
        body: 'この is “this” (near me), その is “that” (near you), and あの is “that over there”. They always come before a noun.',
      },
    ],
    u5: [
      {
        title: 'Polite past: -ました',
        body: 'Change -ます to -ました for the past: 行きます (go) becomes 行きました (went).',
        examples: [{ t: '博物館 に 行きました。', en: 'I went to a museum.', roman: 'hakubutsukan ni ikimashita.' }],
      },
      {
        title: 'に for time and destination, で for means',
        body: 'に marks a clock time (七時 に, at seven) and where you go (会社 に, to work). で marks how you get there (電車 で, by train).',
      },
    ],
    u6: [
      {
        title: 'Shall we? Let’s!',
        body: '-ませんか (won’t we?) is a gentle invitation; -ましょう means “let’s”.',
        examples: [
          { t: '七時 に 会いませんか。', en: 'Shall we meet at seven?', roman: 'shichiji ni aimasen ka.' },
          { t: '予約 しましょう。', en: 'Let’s make a reservation.', roman: 'yoyaku shimashō.' },
        ],
      },
      {
        title: 'と思います softens an opinion',
        body: 'Ending with と思います (I think that…) makes a statement sound less direct, which Japanese speakers often prefer.',
      },
      {
        title: 'Comparing with より',
        body: 'A の ほう が B より … means “A is more … than B”.',
        examples: [{ t: '電車 の ほう が 車 より 便利 です。', en: 'The train is more convenient than the car.', roman: 'densha no hō ga kuruma yori benri desu.' }],
      },
    ],
    u7: [
      {
        title: 'Asking a favour',
        body: 'Verb in the -て form + くれますか asks a colleague to do something for you. いただけますか is more polite, for customers or senior people.',
        examples: [{ t: '送って いただけます か？', en: 'Could you send it?', roman: 'okutte itadakemasu ka?' }],
      },
      {
        title: 'Honorific words',
        body: 'Some words have special polite forms at work: お客様 (customer), ご提案 (your proposal). The prefixes お and ご show respect.',
      },
    ],
    u8: [
      {
        title: 'べきです: should',
        body: 'Dictionary-form verb + べき です means “should”. It is fairly strong; と思います after it softens it.',
        examples: [{ t: 'もっと 予算 を 使う べき です。', en: 'We should spend more budget.', roman: 'motto yosan o tsukau beki desu.' }],
      },
      {
        title: 'Must: -なければなりません',
        body: '減らさなければ なりません literally means “if we do not reduce, it will not do”, the formal way to say “we must reduce”.',
      },
    ],
    u9: [
      {
        title: 'Agree first, then add',
        body: 'Japanese discussions often acknowledge the other view before adding a point: お考え は 分かります が… (I understand your view, but…). が here means “but”.',
      },
      {
        title: 'Indirect disagreement',
        body: 'A flat いいえ can sound harsh. Phrases such as それは ちょっと… (that is a little…), left unfinished, signal polite disagreement.',
        examples: [{ t: 'それ は ちょっと…', en: 'That’s a bit… (polite no)', roman: 'sore wa chotto…' }],
      },
    ],
    u10: [
      {
        title: 'Formal speech: keigo',
        body: 'Meetings use respectful language. されました is the honorific passive (“was done”), and ご提案 politely refers to someone else’s proposal.',
      },
      {
        title: 'Talking about stories',
        body: '舞台 (butai, stage) is the setting of a story, あらすじ is the plot summary, and 感動 しました means “I was moved”.',
      },
    ],
  },
};
