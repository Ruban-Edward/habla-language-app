import type { Mission } from '../types';

/**
 * Real-life missions: short dialogues where the learner chooses (or types) a reply and gets a correction.
 * Keyed by course id. `afterUnit` is the unprefixed unit id whose vocabulary the mission builds on.
 * Each turn needs at least one correct reply and one reply with a correction; Hindi lines need `roman`.
 */
export const MISSIONS: Record<string, Mission[]> = {
  es: [
    {
      id: 'cafe',
      title: 'Order at a café',
      emoji: '☕',
      scenario: 'You walk up to the counter of a busy café in Madrid.',
      afterUnit: 'u2',
      reasons: ['travel', 'curious', 'people'],
      turns: [
        {
          partner: { t: '¡Hola! ¿Qué le pongo?', en: 'Hi! What can I get you?' },
          goal: 'Order a coffee politely.',
          replies: [
            { t: 'Un café, por favor.', en: 'A coffee, please.', correct: true, feedback: 'Short and polite: exactly how people order.' },
            { t: 'Quiero un café, por favor.', en: 'I want a coffee, please.', correct: true, feedback: 'Fine with por favor. Quisiera (I would like) sounds a little softer.' },
            { t: 'Soy un café, por favor.', en: 'I am a coffee, please.', correct: false, feedback: 'Soy means “I am”, so you just said you are a coffee. Drop soy: Un café, por favor.' },
          ],
        },
        {
          partner: { t: '¿Con leche?', en: 'With milk?' },
          goal: 'Say yes, with milk.',
          replies: [
            { t: 'Sí, con leche, gracias.', en: 'Yes, with milk, thanks.', correct: true, feedback: 'Clear and friendly.' },
            { t: 'No, gracias.', en: 'No, thanks.', correct: false, feedback: 'That turns the milk down. To say yes: Sí, con leche.' },
            { t: 'Sí, leche es.', en: 'Yes, milk is.', correct: false, feedback: 'The word order is off. Simply answer: Sí, con leche.' },
          ],
        },
        {
          partner: { t: '¿Algo para comer?', en: 'Anything to eat?' },
          goal: 'Say no thanks, just the coffee.',
          replies: [
            { t: 'No, gracias, solo el café.', en: 'No, thanks, just the coffee.', correct: true, feedback: 'Solo means “just” or “only” here.' },
            { t: 'No, por favor.', en: 'No, please.', correct: false, feedback: '“No, por favor” sounds like pleading (“no, please don’t!”). To decline, use gracias.' },
            { t: 'Adiós, café.', en: 'Goodbye, coffee.', correct: false, feedback: 'That says goodbye to your coffee! Try: No, gracias, solo el café.' },
          ],
        },
        {
          partner: { t: 'Son dos euros.', en: 'That’s two euros.' },
          goal: 'Thank them and say goodbye.',
          replies: [
            { t: 'Gracias, ¡hasta luego!', en: 'Thanks, see you!', correct: true, feedback: 'Hasta luego is the everyday goodbye in shops and cafés.' },
            { t: 'Gracias, adiós.', en: 'Thanks, goodbye.', correct: true, feedback: 'Perfectly clear. Hasta luego is a little warmer.' },
            { t: 'Buenas noches.', en: 'Good night.', correct: false, feedback: 'Buenas noches is for the evening or night, as a greeting or goodbye. In the daytime, use hasta luego.' },
          ],
        },
      ],
    },
    {
      id: 'directions',
      title: 'Find your hotel',
      emoji: '🧭',
      scenario: 'You’re lost near the old town and stop a passer-by.',
      afterUnit: 'u4',
      reasons: ['travel'],
      turns: [
        {
          partner: { t: '¿Sí? ¿Le puedo ayudar?', en: 'Yes? Can I help you?' },
          goal: 'Excuse yourself and ask where the hotel is.',
          replies: [
            { t: 'Perdone, ¿dónde está el hotel?', en: 'Excuse me, where is the hotel?', correct: true, feedback: 'Perdone is the polite usted form, right for a stranger.' },
            { t: '¿Dónde es el hotel?', en: 'Where is the hotel?', correct: false, feedback: 'Use estar for location: ¿Dónde está el hotel?' },
            { t: 'Oye, hotel.', en: 'Hey, hotel.', correct: false, feedback: 'Oye is casual and abrupt with a stranger. Start with perdone and ask a full question.' },
          ],
        },
        {
          partner: { t: 'Está cerca. Gire a la derecha en esta calle.', en: 'It’s close. Turn right on this street.' },
          goal: 'Check that you turn right.',
          replies: [
            { t: '¿A la derecha?', en: 'To the right?', correct: true, feedback: 'Checking back is a great habit when you’re getting directions.' },
            { t: '¿A la izquierda?', en: 'To the left?', correct: false, feedback: 'Izquierda is left. They said derecha, right.' },
            { t: '¿Todo recto?', en: 'Straight on?', correct: false, feedback: 'Todo recto means straight ahead. Derecha means right, and the two are easy to mix up.' },
          ],
        },
        {
          partner: { t: 'Sí, y luego el hotel está a la izquierda.', en: 'Yes, and then the hotel is on the left.' },
          goal: 'Thank them warmly.',
          replies: [
            { t: '¡Muchas gracias!', en: 'Thank you very much!', correct: true, feedback: 'Warm and natural.' },
            { t: 'De nada.', en: 'You’re welcome.', correct: false, feedback: 'De nada is the reply to thanks. You want: ¡Muchas gracias!' },
            { t: 'Por favor.', en: 'Please.', correct: false, feedback: 'Por favor asks for something. To thank, say gracias.' },
          ],
        },
        {
          partner: { t: 'De nada. ¡Buen viaje!', en: 'You’re welcome. Have a good trip!' },
          goal: 'Say goodbye.',
          replies: [
            { t: 'Gracias, adiós.', en: 'Thanks, goodbye.', correct: true, feedback: 'A friendly close.' },
            { t: 'Hola.', en: 'Hello.', correct: false, feedback: 'Hola is hello. To leave, say adiós or hasta luego.' },
          ],
        },
      ],
    },
    {
      id: 'colleague',
      title: 'Meet a new colleague',
      emoji: '🤝',
      scenario: 'It’s your first day on a new team. Marta comes over to say hello.',
      afterUnit: 'u1',
      reasons: ['work', 'people', 'curious'],
      turns: [
        {
          partner: { t: 'Hola, soy Marta. ¿Cómo te llamas?', en: 'Hi, I’m Marta. What’s your name?' },
          goal: 'Say hello and tell her your name is Alex.',
          replies: [
            { t: 'Hola, me llamo Alex.', en: 'Hi, my name is Alex.', correct: true, feedback: 'Me llamo is the most common way to give your name.' },
            { t: 'Hola, mi nombre Alex.', en: 'Hi, my name Alex.', correct: false, feedback: 'The verb is missing. Say Mi nombre es Alex, or more naturally, Me llamo Alex.' },
            { t: 'Hola, te llamas Alex.', en: 'Hi, you are called Alex.', correct: false, feedback: 'Te llamas means “you are called”. For yourself, use me llamo.' },
          ],
        },
        {
          partner: { t: 'Encantada. ¿Cómo estás?', en: 'Nice to meet you. How are you?' },
          goal: 'Say you’re well and ask how she is.',
          replies: [
            { t: 'Muy bien, gracias. ¿Y tú?', en: 'Very well, thanks. And you?', correct: true, feedback: 'Marta used tú, and you matched her.' },
            { t: 'Soy bien, gracias.', en: 'I am well, thanks.', correct: false, feedback: 'For how you feel, use estar: Estoy bien, or just Bien.' },
            { t: 'Bien, gracias. ¿Y usted?', en: 'Fine, thanks. And you? (formal)', correct: false, feedback: 'Polite, but Marta used tú. Answer the same way with ¿Y tú? so you don’t sound distant.' },
          ],
        },
        {
          partner: { t: '¿Es tu primer día?', en: 'Is it your first day?' },
          goal: 'Say yes, it’s your first day.',
          replies: [
            { t: 'Sí, es mi primer día.', en: 'Yes, it’s my first day.', correct: true, feedback: 'Mi means my and tu means your, and you got them right.' },
            { t: 'Sí, es tu primer día.', en: 'Yes, it’s your first day.', correct: false, feedback: 'Tu means “your”. About yourself, say mi primer día.' },
            { t: 'Sí, soy mi primer día.', en: 'Yes, I am my first day.', correct: false, feedback: 'Use es (it is): es mi primer día.' },
          ],
        },
        {
          partner: { t: '¡Qué bien! Hasta luego.', en: 'How nice! See you later.' },
          goal: 'Thank her and say see you later.',
          replies: [
            { t: 'Gracias, ¡hasta luego!', en: 'Thanks, see you later!', correct: true, feedback: 'A natural way to end a short chat.' },
            { t: 'De nada, hasta luego.', en: 'You’re welcome, see you later.', correct: false, feedback: 'De nada answers someone else’s thanks. Here, say gracias.' },
          ],
        },
      ],
    },
  ],
  fr: [
    {
      id: 'cafe',
      title: 'Order at a café',
      emoji: '☕',
      scenario: 'You sit down at a café terrace in Lyon and the server comes over.',
      afterUnit: 'u2',
      reasons: ['travel', 'curious', 'people'],
      turns: [
        {
          partner: { t: 'Bonjour ! Qu’est-ce que je vous sers ?', en: 'Hello! What can I get you?' },
          goal: 'Greet the server and order a coffee politely.',
          replies: [
            { t: 'Bonjour, un café, s’il vous plaît.', en: 'Hello, a coffee, please.', correct: true, feedback: 'Starting with bonjour matters a lot in France.' },
            { t: 'Un café.', en: 'A coffee.', correct: false, feedback: 'Without bonjour and s’il vous plaît, this sounds curt in France. Say: Bonjour, un café, s’il vous plaît.' },
            { t: 'Je suis un café, s’il vous plaît.', en: 'I am a coffee, please.', correct: false, feedback: 'Je suis means “I am”. Drop it, or say Je voudrais un café.' },
          ],
        },
        {
          partner: { t: 'Avec du lait ?', en: 'With milk?' },
          goal: 'Say no, thank you.',
          replies: [
            { t: 'Non, merci.', en: 'No, thank you.', correct: true, feedback: 'Clear and polite.' },
            { t: 'Non, s’il vous plaît.', en: 'No, please.', correct: false, feedback: 'That sounds like pleading. To decline, use Non, merci.' },
            { t: 'Oui, s’il vous plaît.', en: 'Yes, please.', correct: false, feedback: 'That accepts the milk. Your goal was to say no: Non, merci.' },
          ],
        },
        {
          partner: { t: 'Et avec ceci ?', en: 'Anything else?' },
          goal: 'Ask for a croissant as well.',
          replies: [
            { t: 'Un croissant aussi, s’il vous plaît.', en: 'A croissant too, please.', correct: true, feedback: 'Aussi means “too” or “as well”.' },
            { t: 'Je voudrais une croissant.', en: 'I would like a croissant.', correct: false, feedback: 'Croissant is masculine: un croissant.' },
            { t: 'Avec ceci.', en: 'With this.', correct: false, feedback: 'That just repeats the server’s words. Name what you want: Un croissant aussi.' },
          ],
        },
        {
          partner: { t: 'Ça fait trois euros cinquante.', en: 'That’s three euros fifty.' },
          goal: 'Pay, thank them and say goodbye.',
          replies: [
            { t: 'Voilà, merci. Bonne journée !', en: 'Here you are, thanks. Have a good day!', correct: true, feedback: 'Voilà when handing over money, and bonne journée to leave in the daytime.' },
            { t: 'Merci, bonne nuit !', en: 'Thanks, good night!', correct: false, feedback: 'Bonne nuit is only for bedtime. In the daytime, say bonne journée; in the evening, bonne soirée.' },
          ],
        },
      ],
    },
    {
      id: 'directions',
      title: 'Find your hotel',
      emoji: '🧭',
      scenario: 'You’re looking for your hotel in Paris and stop someone on the street.',
      afterUnit: 'u4',
      reasons: ['travel'],
      turns: [
        {
          partner: { t: 'Oui ? Je peux vous aider ?', en: 'Yes? Can I help you?' },
          goal: 'Excuse yourself and ask where the hotel is.',
          replies: [
            { t: 'Excusez-moi, où est l’hôtel ?', en: 'Excuse me, where is the hotel?', correct: true, feedback: 'Excusez-moi is the vous form, right for a stranger.' },
            { t: 'Excuse-moi, où est le hôtel ?', en: 'Excuse me, where is the hotel?', correct: false, feedback: 'Two things to fix: excuse-moi is the tu form, and le becomes l’ before hôtel. Say: Excusez-moi, où est l’hôtel ?' },
            { t: 'Où est hôtel ?', en: 'Where is hotel?', correct: false, feedback: 'French needs the article: où est l’hôtel ?' },
          ],
        },
        {
          partner: { t: 'C’est tout près. Tournez à droite, puis continuez.', en: 'It’s very close. Turn right, then keep going.' },
          goal: 'Check that you turn right.',
          replies: [
            { t: 'À droite ?', en: 'Right?', correct: true, feedback: 'Checking back is a great habit when you’re getting directions.' },
            { t: 'Tout droit ?', en: 'Straight on?', correct: false, feedback: 'Tout droit means straight ahead. À droite means to the right, and the two are easy to mix up.' },
            { t: 'À gauche ?', en: 'Left?', correct: false, feedback: 'Gauche is left. They said droite, right.' },
          ],
        },
        {
          partner: { t: 'Oui, et l’hôtel est à gauche.', en: 'Yes, and the hotel is on the left.' },
          goal: 'Thank them.',
          replies: [
            { t: 'Merci beaucoup !', en: 'Thank you very much!', correct: true, feedback: 'Warm and natural.' },
            { t: 'De rien.', en: 'You’re welcome.', correct: false, feedback: 'De rien is the reply to thanks. You want: Merci beaucoup !' },
            { t: 'Bienvenue.', en: 'Welcome.', correct: false, feedback: 'Bienvenue means “welcome” as in welcome to a place, not “you’re welcome”, and here you want to say thank you: Merci beaucoup !' },
          ],
        },
        {
          partner: { t: 'Je vous en prie. Bonne soirée !', en: 'You’re welcome. Have a good evening!' },
          goal: 'Wish them the same.',
          replies: [
            { t: 'Merci, vous aussi !', en: 'Thanks, you too!', correct: true, feedback: 'Vous aussi matches the vous they used with you.' },
            { t: 'Merci, toi aussi !', en: 'Thanks, you too!', correct: false, feedback: 'Toi is too familiar for a stranger who used vous. Say vous aussi.' },
          ],
        },
      ],
    },
    {
      id: 'colleague',
      title: 'Meet a new colleague',
      emoji: '🤝',
      scenario: 'It’s your first day on a new team. Claire comes over to introduce herself.',
      afterUnit: 'u1',
      reasons: ['work', 'people', 'curious'],
      turns: [
        {
          partner: { t: 'Bonjour, je m’appelle Claire. Et toi ?', en: 'Hi, my name is Claire. And you?' },
          goal: 'Tell her your name is Alex.',
          replies: [
            { t: 'Moi, c’est Alex.', en: 'I’m Alex.', correct: true, feedback: 'A relaxed, very natural way to give your name.' },
            { t: 'Je m’appelle Alex.', en: 'My name is Alex.', correct: true, feedback: 'Clear and correct.' },
            { t: 'Je suis appelle Alex.', en: 'I am call Alex.', correct: false, feedback: 'S’appeler is reflexive: je m’appelle Alex.' },
          ],
        },
        {
          partner: { t: 'Enchantée ! Ça va ?', en: 'Nice to meet you! How are you?' },
          goal: 'Say you’re well and ask how she is.',
          replies: [
            { t: 'Ça va bien, merci. Et toi ?', en: 'I’m good, thanks. And you?', correct: true, feedback: 'Claire used tu, and you matched her.' },
            { t: 'Je suis bien, merci.', en: 'I am well, thanks.', correct: false, feedback: 'That’s a word-for-word copy of English. Say Ça va bien or Je vais bien.' },
            { t: 'Ça va bien, merci. Et vous ?', en: 'I’m good, thanks. And you? (formal)', correct: false, feedback: 'Polite, but Claire used tu. Answer the same way with et toi ?' },
          ],
        },
        {
          partner: { t: 'C’est ton premier jour ?', en: 'Is it your first day?' },
          goal: 'Say yes, it’s your first day.',
          replies: [
            { t: 'Oui, c’est mon premier jour.', en: 'Yes, it’s my first day.', correct: true, feedback: 'Jour is masculine, so it’s mon premier jour.' },
            { t: 'Oui, c’est ma premier jour.', en: 'Yes, it’s my first day.', correct: false, feedback: 'Jour is masculine, so use mon: mon premier jour.' },
            { t: 'Oui, c’est ton premier jour.', en: 'Yes, it’s your first day.', correct: false, feedback: 'Ton means “your”. About yourself, say mon premier jour.' },
          ],
        },
        {
          partner: { t: 'Bienvenue dans l’équipe !', en: 'Welcome to the team!' },
          goal: 'Thank her.',
          replies: [
            { t: 'Merci beaucoup !', en: 'Thanks a lot!', correct: true, feedback: 'Simple and warm.' },
            { t: 'De rien !', en: 'You’re welcome!', correct: false, feedback: 'De rien answers someone else’s thanks. Here, say merci.' },
          ],
        },
      ],
    },
  ],
  hi: [
    {
      id: 'chai',
      title: 'Order chai',
      emoji: '🍵',
      scenario: 'You stop at a tea stall near a railway station.',
      afterUnit: 'u3',
      reasons: ['travel', 'curious', 'people'],
      turns: [
        {
          partner: { t: 'नमस्ते! क्या लेंगे?', en: 'Hello! What will you have?', roman: 'namaste! kya lenge?' },
          goal: 'Ask for a tea politely.',
          replies: [
            { t: 'एक चाय, कृपया।', en: 'One tea, please.', roman: 'ek chaay, kripya.', correct: true, feedback: 'Clear and polite. You will also hear एक चाय दीजिए (ek chaay deejiye).' },
            { t: 'मैं चाय हूँ।', en: 'I am tea.', roman: 'main chaay hoon.', correct: false, feedback: 'हूँ means “am”, so you just said you are tea. Say: एक चाय, कृपया।' },
            { t: 'चाय दो।', en: 'Give tea.', roman: 'chaay do.', correct: false, feedback: 'दो is the familiar command: fine between friends, but abrupt from a customer. Add कृपया or say दीजिए.' },
          ],
        },
        {
          partner: { t: 'मीठी या कम मीठी?', en: 'Sweet or less sweet?', roman: 'meethi ya kam meethi?' },
          goal: 'Ask for it less sweet.',
          replies: [
            { t: 'कम मीठी, कृपया।', en: 'Less sweet, please.', roman: 'kam meethi, kripya.', correct: true, feedback: 'चाय is feminine, so मीठी (not मीठा).' },
            { t: 'बहुत मीठा।', en: 'Very sweet.', roman: 'bahut meetha.', correct: false, feedback: 'That asks for very sweet. Also, चाय is feminine, so it takes मीठी. Try: कम मीठी।' },
            { t: 'गरम है।', en: 'It is hot.', roman: 'garam hai.', correct: false, feedback: 'That says the tea is hot. Answer the question: कम मीठी।' },
          ],
        },
        {
          partner: { t: 'और कुछ?', en: 'Anything else?', roman: 'aur kuchh?' },
          goal: 'Ask for a samosa too.',
          replies: [
            { t: 'एक समोसा भी, कृपया।', en: 'A samosa too, please.', roman: 'ek samosa bhi, kripya.', correct: true, feedback: 'भी means “too” or “also”.' },
            { t: 'समोसा अच्छी है।', en: 'The samosa is good.', roman: 'samosa achchhi hai.', correct: false, feedback: 'That comments on the samosa instead of asking for one, and समोसा is masculine (अच्छा). Say: एक समोसा भी।' },
            { t: 'एक समोसा नहीं।', en: 'Not one samosa.', roman: 'ek samosa nahin.', correct: false, feedback: 'नहीं means “no” or “not”. Use भी (too): एक समोसा भी।' },
          ],
        },
        {
          partner: { t: 'बीस रुपये।', en: 'Twenty rupees.', roman: 'bees rupaye.' },
          goal: 'Thank them.',
          replies: [
            { t: 'शुक्रिया!', en: 'Thanks!', roman: 'shukriya!', correct: true, feedback: 'The everyday thank you at a stall.' },
            { t: 'धन्यवाद!', en: 'Thank you!', roman: 'dhanyavaad!', correct: true, feedback: 'Correct and polite, though a little formal for a tea stall. शुक्रिया is just as common.' },
            { t: 'नहीं, धन्यवाद।', en: 'No, thank you.', roman: 'nahin, dhanyavaad.', correct: false, feedback: 'That sounds like you’re refusing. Just say शुक्रिया or धन्यवाद.' },
          ],
        },
      ],
    },
    {
      id: 'directions',
      title: 'Find the museum',
      emoji: '🧭',
      scenario: 'You’re walking to the city museum and ask a shopkeeper for the way.',
      afterUnit: 'u5',
      reasons: ['travel'],
      turns: [
        {
          partner: { t: 'जी, बताइए?', en: 'Yes, how can I help?', roman: 'ji, bataaiye?' },
          goal: 'Excuse yourself and ask where the museum is.',
          replies: [
            { t: 'माफ़ कीजिए, संग्रहालय कहाँ है?', en: 'Excuse me, where is the museum?', roman: 'maaf keejiye, sangrahalay kahaan hai?', correct: true, feedback: 'माफ़ कीजिए is a polite way to get someone’s attention.' },
            { t: 'संग्रहालय कहाँ हो?', en: 'Where are museum?', roman: 'sangrahalay kahaan ho?', correct: false, feedback: 'हो goes with तुम. For a place, use है: संग्रहालय कहाँ है?' },
            { t: 'अरे, संग्रहालय!', en: 'Hey, museum!', roman: 'are, sangrahalay!', correct: false, feedback: 'Abrupt with a stranger. Start with माफ़ कीजिए and ask a full question.' },
          ],
        },
        {
          partner: { t: 'सीधे जाइए, फिर दाएँ मुड़िए।', en: 'Go straight, then turn right.', roman: 'seedhe jaaiye, phir daaen mudiye.' },
          goal: 'Check that you turn right.',
          replies: [
            { t: 'दाएँ?', en: 'Right?', roman: 'daaen?', correct: true, feedback: 'Checking back is a great habit when you’re getting directions.' },
            { t: 'बाएँ?', en: 'Left?', roman: 'baaen?', correct: false, feedback: 'बाएँ is left. They said दाएँ, right.' },
            { t: 'सीधे नहीं?', en: 'Not straight?', roman: 'seedhe nahin?', correct: false, feedback: 'They did say सीधे (straight) first, then दाएँ (right). Confirm the turn: दाएँ?' },
          ],
        },
        {
          partner: { t: 'हाँ, संग्रहालय नदी के किनारे है।', en: 'Yes, the museum is by the river.', roman: 'haan, sangrahalay nadi ke kinaare hai.' },
          goal: 'Thank them.',
          replies: [
            { t: 'बहुत धन्यवाद!', en: 'Thank you very much!', roman: 'bahut dhanyavaad!', correct: true, feedback: 'Warm and polite.' },
            { t: 'कोई बात नहीं।', en: 'No problem.', roman: 'koi baat nahin.', correct: false, feedback: 'कोई बात नहीं (“no problem”) is the reply to thanks. You want: बहुत धन्यवाद!' },
          ],
        },
        {
          partner: { t: 'कोई बात नहीं।', en: 'No problem.', roman: 'koi baat nahin.' },
          goal: 'Say goodbye.',
          replies: [
            { t: 'नमस्ते!', en: 'Goodbye!', roman: 'namaste!', correct: true, feedback: 'नमस्ते works for goodbye as well as hello.' },
            { t: 'अलविदा!', en: 'Farewell!', roman: 'alvida!', correct: false, feedback: 'अलविदा is for long or final partings, and sounds dramatic with a shopkeeper. Use नमस्ते.' },
          ],
        },
      ],
    },
    {
      id: 'colleague',
      title: 'Meet a new colleague',
      emoji: '🤝',
      scenario: 'It’s your first day on a new team. Priya comes over to say hello.',
      afterUnit: 'u2',
      reasons: ['work', 'people', 'curious'],
      turns: [
        {
          partner: { t: 'नमस्ते, मेरा नाम प्रिया है। आपका नाम क्या है?', en: 'Hello, my name is Priya. What is your name?', roman: 'namaste, mera naam Priya hai. aapka naam kya hai?' },
          goal: 'Tell her your name is Alex.',
          replies: [
            { t: 'नमस्ते, मेरा नाम एलेक्स है।', en: 'Hello, my name is Alex.', roman: 'namaste, mera naam Alex hai.', correct: true, feedback: 'The verb है comes at the end, as it should.' },
            { t: 'नमस्ते, आपका नाम एलेक्स है।', en: 'Hello, your name is Alex.', roman: 'namaste, aapka naam Alex hai.', correct: false, feedback: 'आपका means “your”. About yourself, use मेरा (my).' },
            { t: 'नमस्ते, मेरा नाम एलेक्स।', en: 'Hello, my name Alex.', roman: 'namaste, mera naam Alex.', correct: false, feedback: 'Hindi sentences end with the verb. Add है: मेरा नाम एलेक्स है।' },
          ],
        },
        {
          partner: { t: 'आप कैसे हैं?', en: 'How are you?', roman: 'aap kaise hain?' },
          goal: 'Say you’re fine and ask how she is.',
          replies: [
            { t: 'मैं ठीक हूँ, धन्यवाद। आप कैसी हैं?', en: 'I’m fine, thank you. How are you?', roman: 'main theek hoon, dhanyavaad. aap kaisi hain?', correct: true, feedback: 'You used कैसी because Priya is a woman.' },
            { t: 'मैं ठीक है।', en: 'I is fine.', roman: 'main theek hai.', correct: false, feedback: 'मैं takes हूँ: मैं ठीक हूँ।' },
            { t: 'मैं ठीक हूँ। तू कैसी है?', en: 'I’m fine. How are you? (intimate)', roman: 'main theek hoon. tu kaisi hai?', correct: false, feedback: 'तू is very intimate and sounds rude with a new colleague. Use आप: आप कैसी हैं?' },
          ],
        },
        {
          partner: { t: 'मैं भी ठीक हूँ। क्या आज आपका पहला दिन है?', en: 'I’m fine too. Is today your first day?', roman: 'main bhi theek hoon. kya aaj aapka pehla din hai?' },
          goal: 'Say yes, today is your first day.',
          replies: [
            { t: 'हाँ, आज मेरा पहला दिन है।', en: 'Yes, today is my first day.', roman: 'haan, aaj mera pehla din hai.', correct: true, feedback: 'मेरा agrees with दिन, which is masculine.' },
            { t: 'हाँ, आज आपका पहला दिन है।', en: 'Yes, today is your first day.', roman: 'haan, aaj aapka pehla din hai.', correct: false, feedback: 'आपका means “your”. About yourself, say मेरा पहला दिन.' },
            { t: 'नहीं, धन्यवाद।', en: 'No, thank you.', roman: 'nahin, dhanyavaad.', correct: false, feedback: 'That declines an offer. She asked a question, so answer हाँ (yes).' },
          ],
        },
        {
          partner: { t: 'टीम में आपका स्वागत है!', en: 'Welcome to the team!', roman: 'team mein aapka svaagat hai!' },
          goal: 'Thank her.',
          replies: [
            { t: 'बहुत धन्यवाद!', en: 'Thank you very much!', roman: 'bahut dhanyavaad!', correct: true, feedback: 'Warm and polite.' },
            { t: 'स्वागत है!', en: 'Welcome!', roman: 'svaagat hai!', correct: false, feedback: 'That repeats “welcome” back to her. Say thank you: बहुत धन्यवाद!' },
          ],
        },
      ],
    },
  ],
};
