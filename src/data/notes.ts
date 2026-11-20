import type { UsageNote } from '../types';

/**
 * Short usage notes per unit: how words work, not only what they mean.
 * Keyed by course id, then by unprefixed unit id. Every unit should have at least one note
 * (the content test enforces this). Hindi examples carry romanization.
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
};
