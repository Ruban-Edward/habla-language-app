import type { Mission } from '../types';

/**
 * Everyday missions: the market, a doctor, a phone booking, the airport, a restaurant meal and the Wi-Fi.
 * Same format and rules as `missions.ts`; kept separate so each file stays easy to review.
 */
export const EVERYDAY_MISSIONS: Record<string, Mission[]> = {
  es: [
    {
      id: 'market',
      title: 'Shop at the market',
      emoji: '🍅',
      scenario: 'You’re buying fruit and vegetables at a market stall in Valencia.',
      afterUnit: 'u2',
      reasons: ['travel', 'curious'],
      turns: [
        {
          partner: { t: 'Buenos días. ¿Qué le pongo?', en: 'Good morning. What can I get you?' },
          goal: 'Ask for a kilo of tomatoes.',
          replies: [
            { t: 'Un kilo de tomates, por favor.', en: 'A kilo of tomatoes, please.', correct: true, feedback: 'Quantity + de + product: the standard way to order at a market.' },
            { t: 'Un kilo tomates, por favor.', en: 'A kilo tomatoes, please.', correct: false, feedback: 'Spanish needs de between a quantity and the product: un kilo de tomates.' },
            { t: 'Quiero tomate un kilo.', en: 'I want tomato a kilo.', correct: false, feedback: 'The order is scrambled. Put the quantity first: Un kilo de tomates, por favor.' },
          ],
        },
        {
          partner: { t: 'Aquí tiene. ¿Algo más?', en: 'Here you are. Anything else?' },
          goal: 'Ask how much the oranges cost.',
          replies: [
            { t: '¿Cuánto cuestan las naranjas?', en: 'How much are the oranges?', correct: true, feedback: 'Cuestan is plural because naranjas is plural.' },
            { t: '¿Cuánto cuesta las naranjas?', en: 'How much is the oranges?', correct: false, feedback: 'Naranjas is plural, so the verb is plural too: ¿Cuánto cuestan las naranjas?' },
            { t: '¿Qué hora es?', en: 'What time is it?', correct: false, feedback: 'That asks the time. For a price, ask ¿Cuánto cuestan…?' },
          ],
        },
        {
          partner: { t: 'Dos euros el kilo.', en: 'Two euros a kilo.' },
          goal: 'Take half a kilo and ask what you owe.',
          replies: [
            { t: 'Medio kilo, por favor. ¿Cuánto es?', en: 'Half a kilo, please. How much is it?', correct: true, feedback: '¿Cuánto es? is how you ask for the total.' },
            { t: 'Mitad kilo, por favor.', en: 'Half kilo, please.', correct: false, feedback: 'Half a kilo is medio kilo. Mitad is “half” as a noun (la mitad).' },
            { t: 'Un medio kilo, por favor.', en: 'A half a kilo, please.', correct: false, feedback: 'Drop un: medio already means “half a”. Say medio kilo.' },
          ],
        },
      ],
    },
    {
      id: 'doctor',
      title: 'See a doctor',
      emoji: '🩺',
      scenario: 'You feel unwell on holiday and visit a local clinic.',
      afterUnit: 'u5',
      reasons: ['travel', 'people'],
      turns: [
        {
          partner: { t: 'Buenas tardes. ¿Qué le pasa?', en: 'Good afternoon. What’s the matter?' },
          goal: 'Say your head hurts.',
          replies: [
            { t: 'Me duele la cabeza.', en: 'My head hurts.', correct: true, feedback: 'Doler works like gustar: me duele, literally “the head hurts me”.' },
            { t: 'Tengo dolor de cabeza.', en: 'I have a headache.', correct: true, feedback: 'Also natural: “I have a headache”.' },
            { t: 'Yo duelo la cabeza.', en: 'I hurt the head.', correct: false, feedback: 'The head does the hurting, as with gustar. Say: Me duele la cabeza.' },
          ],
        },
        {
          partner: { t: '¿Desde cuándo?', en: 'Since when?' },
          goal: 'Say since yesterday.',
          replies: [
            { t: 'Desde ayer.', en: 'Since yesterday.', correct: true, feedback: 'A short answer is perfect here.' },
            { t: 'Desde mañana.', en: 'Since tomorrow.', correct: false, feedback: 'Mañana is tomorrow. Yesterday is ayer: Desde ayer.' },
            { t: 'Hace ayer.', en: 'Ago yesterday.', correct: false, feedback: 'Hace goes with a length of time (hace dos días). With a day, use desde: Desde ayer.' },
          ],
        },
        {
          partner: { t: '¿Tiene fiebre?', en: 'Do you have a fever?' },
          goal: 'Say no, but you feel very tired.',
          replies: [
            { t: 'No, pero estoy muy cansado.', en: 'No, but I’m very tired.', correct: true, feedback: 'Estar for a temporary state. A woman says cansada.' },
            { t: 'No, pero soy muy cansado.', en: 'No, but I’m a very tiring person.', correct: false, feedback: 'Ser describes what someone is like, so this says you’re tiresome! Use estar: estoy muy cansado.' },
            { t: 'Sí, tengo fiebre.', en: 'Yes, I have a fever.', correct: false, feedback: 'That says yes, you have a fever. Start with No, pero…' },
          ],
        },
        {
          partner: { t: 'Tome esto dos veces al día.', en: 'Take this twice a day.' },
          goal: 'Thank the doctor.',
          replies: [
            { t: 'Muchas gracias.', en: 'Thank you very much.', correct: true, feedback: 'Warm and polite.' },
            { t: '¿Dos veces al día? Gracias.', en: 'Twice a day? Thanks.', correct: true, feedback: 'Checking the dose back is a smart habit.' },
            { t: 'De nada.', en: 'You’re welcome.', correct: false, feedback: 'De nada answers thanks. Here you’re the one thanking: Muchas gracias.' },
          ],
        },
      ],
    },
    {
      id: 'phone',
      title: 'Book a table by phone',
      emoji: '📞',
      scenario: 'You call a restaurant to reserve dinner for tonight.',
      afterUnit: 'u6',
      reasons: ['travel', 'work', 'people'],
      turns: [
        {
          partner: { t: 'Restaurante Sol, ¿dígame?', en: 'Sol Restaurant, hello?' },
          goal: 'Say you’d like to book a table for two.',
          replies: [
            { t: 'Hola, quería reservar una mesa para dos.', en: 'Hello, I’d like to book a table for two.', correct: true, feedback: 'Quería (literally “I wanted”) is the polite way to make a request on the phone.' },
            { t: 'Hola, quiero reservar una mesa para dos.', en: 'Hello, I want to book a table for two.', correct: true, feedback: 'Clear. Quería sounds a touch softer.' },
            { t: 'Hola, reservo una mesa por dos.', en: 'Hello, I book a table by two.', correct: false, feedback: 'For a number of people, use para: una mesa para dos. And quería reservar sounds more polite.' },
          ],
        },
        {
          partner: { t: '¿Para qué hora?', en: 'For what time?' },
          goal: 'Say for nine o’clock.',
          replies: [
            { t: 'Para las nueve.', en: 'For nine o’clock.', correct: true, feedback: 'Hours take las (except la una).' },
            { t: 'A las nueve.', en: 'At nine.', correct: true, feedback: 'Also natural.' },
            { t: 'Para nueve horas.', en: 'For nine hours.', correct: false, feedback: 'That sounds like “for nine hours”. For a time, say para las nueve.' },
          ],
        },
        {
          partner: { t: 'Muy bien. ¿A nombre de quién?', en: 'Very good. Under what name?' },
          goal: 'Give the name Alex.',
          replies: [
            { t: 'A nombre de Alex.', en: 'Under the name Alex.', correct: true, feedback: 'Echoing the question is the easy way to answer.' },
            { t: 'Me llamo Alex.', en: 'My name is Alex.', correct: true, feedback: 'Perfectly clear.' },
            { t: 'Soy nombre Alex.', en: 'I am name Alex.', correct: false, feedback: 'Say A nombre de Alex, or simply Me llamo Alex.' },
          ],
        },
        {
          partner: { t: 'Perfecto, hasta esta noche.', en: 'Perfect, see you tonight.' },
          goal: 'Thank them and say goodbye.',
          replies: [
            { t: 'Gracias, hasta luego.', en: 'Thanks, see you.', correct: true, feedback: 'A friendly way to end the call.' },
            { t: 'Buenos días.', en: 'Good morning.', correct: false, feedback: 'That’s a greeting. To end the call: Gracias, hasta luego.' },
          ],
        },
      ],
    },
    {
      id: 'airport',
      title: 'Check in at the airport',
      emoji: '✈️',
      scenario: 'You’re at the check-in desk for your flight home.',
      afterUnit: 'u4',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'Buenos días. Su pasaporte, por favor.', en: 'Good morning. Your passport, please.' },
          goal: 'Hand it over: “Here you are.”',
          replies: [
            { t: 'Aquí tiene.', en: 'Here you are.', correct: true, feedback: 'The set phrase when handing something over (usted form).' },
            { t: 'Tome.', en: 'Take it.', correct: true, feedback: 'Fine, though Aquí tiene sounds gentler.' },
            { t: 'Aquí está usted.', en: 'Here you are (you are located here).', correct: false, feedback: 'That says “you are here”. When handing something over, say Aquí tiene.' },
          ],
        },
        {
          partner: { t: '¿Factura alguna maleta?', en: 'Are you checking a suitcase?' },
          goal: 'Say yes, one suitcase.',
          replies: [
            { t: 'Sí, una maleta.', en: 'Yes, one suitcase.', correct: true, feedback: 'Maleta is feminine: una maleta.' },
            { t: 'Sí, un maleta.', en: 'Yes, one suitcase.', correct: false, feedback: 'Maleta is feminine, so it’s una maleta.' },
            { t: 'No, gracias.', en: 'No, thanks.', correct: false, feedback: 'That says no. You have one bag: Sí, una maleta.' },
          ],
        },
        {
          partner: { t: '¿Ventanilla o pasillo?', en: 'Window or aisle?' },
          goal: 'Ask for a window seat.',
          replies: [
            { t: 'Ventanilla, por favor.', en: 'Window, please.', correct: true, feedback: 'On planes and trains the window seat is ventanilla.' },
            { t: 'Pasillo, por favor.', en: 'Aisle, please.', correct: false, feedback: 'Pasillo is the aisle. The window seat is ventanilla.' },
            { t: 'Ventana, por favor.', en: 'Window (of a building), please.', correct: false, feedback: 'Ventana is a window in a building. On a plane, say ventanilla.' },
          ],
        },
        {
          partner: { t: 'Puerta doce. Embarque a las diez.', en: 'Gate twelve. Boarding at ten.' },
          goal: 'Check: gate twelve?',
          replies: [
            { t: '¿Puerta doce?', en: 'Gate twelve?', correct: true, feedback: 'Checking back is a great habit at the airport.' },
            { t: '¿Puerta dos?', en: 'Gate two?', correct: false, feedback: 'Dos is two; doce is twelve. Worth checking!' },
          ],
        },
      ],
    },
    {
      id: 'restaurant',
      title: 'Dinner at a restaurant',
      emoji: '🍽️',
      scenario: 'You’re having dinner at a restaurant in Seville.',
      afterUnit: 'u2',
      reasons: ['travel', 'people', 'curious'],
      turns: [
        {
          partner: { t: '¿Qué va a tomar?', en: 'What will you have?' },
          goal: 'Order the fish.',
          replies: [
            { t: 'Para mí, el pescado.', en: 'For me, the fish.', correct: true, feedback: 'Para mí (for me) is very common when ordering.' },
            { t: 'El pescado, por favor.', en: 'The fish, please.', correct: true, feedback: 'Short and polite.' },
            { t: 'Yo soy el pescado.', en: 'I am the fish.', correct: false, feedback: 'That says you are the fish! Use Para mí, el pescado.' },
          ],
        },
        {
          partner: { t: '¿Y para beber?', en: 'And to drink?' },
          goal: 'Ask for a glass of red wine.',
          replies: [
            { t: 'Una copa de vino tinto, por favor.', en: 'A glass of red wine, please.', correct: true, feedback: 'Red wine is vino tinto, and it comes in una copa.' },
            { t: 'Un vaso de vino rojo.', en: 'A tumbler of red wine.', correct: false, feedback: 'Red wine is vino tinto, not rojo, and wine comes in una copa.' },
            { t: 'Agua con gas.', en: 'Sparkling water.', correct: false, feedback: 'That’s sparkling water. For red wine: una copa de vino tinto.' },
          ],
        },
        {
          partner: { t: '¿Todo bien?', en: 'Is everything all right?' },
          goal: 'Say it’s delicious.',
          replies: [
            { t: 'Sí, está riquísimo.', en: 'Yes, it’s really tasty.', correct: true, feedback: 'Riquísimo is how people praise food every day.' },
            { t: 'Sí, está delicioso.', en: 'Yes, it’s delicious.', correct: true, feedback: 'Estar for how food tastes right now.' },
            { t: 'Sí, estoy rico.', en: 'Yes, I’m rich.', correct: false, feedback: 'Estoy rico is about you, not the food. Say: está riquísimo.' },
          ],
        },
        {
          partner: { t: '¿Algo más?', en: 'Anything else?' },
          goal: 'Ask for the bill.',
          replies: [
            { t: 'La cuenta, por favor.', en: 'The bill, please.', correct: true, feedback: 'The everyday way to ask.' },
            { t: '¿Me trae la cuenta, por favor?', en: 'Could you bring me the bill, please?', correct: true, feedback: 'Polite and natural.' },
            { t: 'El billete, por favor.', en: 'The ticket, please.', correct: false, feedback: 'Billete is a ticket or banknote. The bill is la cuenta.' },
          ],
        },
      ],
    },
    {
      id: 'wifi',
      title: 'Ask for the Wi-Fi',
      emoji: '📶',
      scenario: 'You’ve just sat down at a café and need to get online.',
      afterUnit: 'u1',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'Hola, ¿qué tal?', en: 'Hi, how are you?' },
          goal: 'Ask if there’s Wi-Fi.',
          replies: [
            { t: 'Hola, ¿hay wifi?', en: 'Hi, is there Wi-Fi?', correct: true, feedback: 'Hay means “is there” or “there is”.' },
            { t: 'Hola, ¿tiene wifi?', en: 'Hi, do you have Wi-Fi?', correct: true, feedback: 'Also natural: “do you have Wi-Fi?”' },
            { t: 'Hola, ¿es wifi?', en: 'Hi, is it Wi-Fi?', correct: false, feedback: 'Es means “it is”. To ask whether something exists, use hay: ¿Hay wifi?' },
          ],
        },
        {
          partner: { t: 'Sí, claro.', en: 'Yes, of course.' },
          goal: 'Ask for the password.',
          replies: [
            { t: '¿Cuál es la contraseña?', en: 'What’s the password?', correct: true, feedback: 'Use cuál, not qué, before es when asking for a specific piece of information.' },
            { t: '¿Qué es la contraseña?', en: 'What is a password?', correct: false, feedback: 'That asks what a password is. To ask for it: ¿Cuál es la contraseña?' },
            { t: '¿Cómo es la contraseña?', en: 'What is the password like?', correct: false, feedback: '¿Cómo es? asks what something is like. To ask for it: ¿Cuál es la contraseña?' },
          ],
        },
        {
          partner: { t: 'Está en el ticket, abajo.', en: 'It’s on the receipt, at the bottom.' },
          goal: 'Thank them.',
          replies: [
            { t: 'Vale, muchas gracias.', en: 'OK, thanks a lot.', correct: true, feedback: 'Vale (OK) is everywhere in Spain.' },
            { t: 'Perfecto, gracias.', en: 'Perfect, thanks.', correct: true, feedback: 'Friendly and natural.' },
            { t: 'Por favor.', en: 'Please.', correct: false, feedback: 'Por favor asks for something. To thank: gracias.' },
          ],
        },
      ],
    },
  ],

  fr: [
    {
      id: 'market',
      title: 'Shop at the market',
      emoji: '🍅',
      scenario: 'You’re buying fruit and vegetables at an open-air market in Lyon.',
      afterUnit: 'u2',
      reasons: ['travel', 'curious'],
      turns: [
        {
          partner: { t: 'Bonjour ! Qu’est-ce que je vous sers ?', en: 'Hello! What can I get you?' },
          goal: 'Ask for a kilo of tomatoes.',
          replies: [
            { t: 'Un kilo de tomates, s’il vous plaît.', en: 'A kilo of tomatoes, please.', correct: true, feedback: 'Quantity + de + product: the way everyone orders.' },
            { t: 'Un kilo des tomates, s’il vous plaît.', en: 'A kilo of the tomatoes, please.', correct: false, feedback: 'After a quantity, use de, not des: un kilo de tomates.' },
            { t: 'Je suis un kilo de tomates.', en: 'I am a kilo of tomatoes.', correct: false, feedback: 'Je suis means “I am”. Just say: Un kilo de tomates, s’il vous plaît.' },
          ],
        },
        {
          partner: { t: 'Voilà. Et avec ceci ?', en: 'Here you go. Anything else?' },
          goal: 'Ask how much the strawberries are.',
          replies: [
            { t: 'Combien coûtent les fraises ?', en: 'How much are the strawberries?', correct: true, feedback: 'Coûtent is plural because fraises is plural.' },
            { t: 'C’est combien, les fraises ?', en: 'How much are the strawberries?', correct: true, feedback: 'Very common in everyday speech.' },
            { t: 'Quelle heure est-il ?', en: 'What time is it?', correct: false, feedback: 'That asks the time. For a price: C’est combien, les fraises ?' },
          ],
        },
        {
          partner: { t: 'Quatre euros la barquette.', en: 'Four euros a punnet.' },
          goal: 'Take one punnet and ask for the total.',
          replies: [
            { t: 'Une barquette, s’il vous plaît. Ça fait combien ?', en: 'One punnet, please. How much is that?', correct: true, feedback: 'Ça fait combien ? asks for the total.' },
            { t: 'Un barquette, s’il vous plaît.', en: 'One punnet, please.', correct: false, feedback: 'Barquette is feminine: une barquette.' },
            { t: 'Une barquette, merci. Au revoir !', en: 'One punnet, thanks. Goodbye!', correct: false, feedback: 'Don’t leave before paying! Ask for the total: Ça fait combien ?' },
          ],
        },
      ],
    },
    {
      id: 'doctor',
      title: 'See a doctor',
      emoji: '🩺',
      scenario: 'You feel unwell on holiday and see a doctor in Nice.',
      afterUnit: 'u5',
      reasons: ['travel', 'people'],
      turns: [
        {
          partner: { t: 'Bonjour. Qu’est-ce qui ne va pas ?', en: 'Hello. What’s wrong?' },
          goal: 'Say your head hurts.',
          replies: [
            { t: 'J’ai mal à la tête.', en: 'I have a headache.', correct: true, feedback: 'Avoir mal à + body part is the standard way to say something hurts.' },
            { t: 'Je suis mal à la tête.', en: 'I am bad at the head.', correct: false, feedback: 'Pain uses avoir: j’ai mal à la tête.' },
            { t: 'J’ai mal de tête.', en: 'I have head pain.', correct: false, feedback: 'With avoir mal, use à: j’ai mal à la tête. (Un mal de tête is “a headache”.)' },
          ],
        },
        {
          partner: { t: 'Depuis quand ?', en: 'Since when?' },
          goal: 'Say since yesterday.',
          replies: [
            { t: 'Depuis hier.', en: 'Since yesterday.', correct: true, feedback: 'Short and clear.' },
            { t: 'Depuis demain.', en: 'Since tomorrow.', correct: false, feedback: 'Demain is tomorrow. Yesterday is hier: depuis hier.' },
            { t: 'Il y a hier.', en: 'Ago yesterday.', correct: false, feedback: 'Il y a goes with a length of time (il y a deux jours). With a day, use depuis: depuis hier.' },
          ],
        },
        {
          partner: { t: 'Vous avez de la fièvre ?', en: 'Do you have a fever?' },
          goal: 'Say no, but you’re very tired.',
          replies: [
            { t: 'Non, mais je suis très fatigué.', en: 'No, but I’m very tired.', correct: true, feedback: 'A woman writes fatiguée; it sounds the same.' },
            { t: 'Non, mais j’ai très fatigué.', en: 'No, but I have very tired.', correct: false, feedback: 'Tired uses être: je suis très fatigué.' },
            { t: 'Oui, j’ai de la fièvre.', en: 'Yes, I have a fever.', correct: false, feedback: 'That says yes. Start with Non, mais…' },
          ],
        },
        {
          partner: { t: 'Prenez ce médicament deux fois par jour.', en: 'Take this medicine twice a day.' },
          goal: 'Thank the doctor.',
          replies: [
            { t: 'Merci beaucoup, docteur.', en: 'Thank you very much, doctor.', correct: true, feedback: 'Docteur works as a polite form of address.' },
            { t: 'Deux fois par jour ? Merci.', en: 'Twice a day? Thanks.', correct: true, feedback: 'Checking the dose back is a smart habit.' },
            { t: 'De rien.', en: 'You’re welcome.', correct: false, feedback: 'De rien answers thanks. Here you thank: Merci beaucoup.' },
          ],
        },
      ],
    },
    {
      id: 'phone',
      title: 'Book a table by phone',
      emoji: '📞',
      scenario: 'You call a bistro to book dinner for tonight.',
      afterUnit: 'u6',
      reasons: ['travel', 'work', 'people'],
      turns: [
        {
          partner: { t: 'Bistrot du Coin, bonjour !', en: 'Bistrot du Coin, hello!' },
          goal: 'Say you’d like to book a table for two.',
          replies: [
            { t: 'Bonjour, je voudrais réserver une table pour deux.', en: 'Hello, I’d like to book a table for two.', correct: true, feedback: 'Je voudrais is the polite way to ask.' },
            { t: 'Bonjour, je veux réserver une table pour deux.', en: 'Hello, I want to book a table for two.', correct: true, feedback: 'Understandable, though je voudrais sounds much more polite.' },
            { t: 'Bonjour, je suis une table pour deux.', en: 'Hello, I am a table for two.', correct: false, feedback: 'Je suis means “I am”. Say: je voudrais réserver une table pour deux.' },
          ],
        },
        {
          partner: { t: 'Pour quelle heure ?', en: 'For what time?' },
          goal: 'Say for eight in the evening.',
          replies: [
            { t: 'Pour vingt heures.', en: 'For 8 pm.', correct: true, feedback: 'Bookings often use the 24-hour clock: vingt heures.' },
            { t: 'Pour huit heures du soir.', en: 'For eight in the evening.', correct: true, feedback: 'Also fine.' },
            { t: 'Pour huit heures du matin.', en: 'For eight in the morning.', correct: false, feedback: 'Du matin is the morning. For dinner: vingt heures, or huit heures du soir.' },
          ],
        },
        {
          partner: { t: 'C’est à quel nom ?', en: 'What name is it under?' },
          goal: 'Give the name Alex.',
          replies: [
            { t: 'Au nom d’Alex.', en: 'Under the name Alex.', correct: true, feedback: 'Au nom de… is the set phrase for bookings.' },
            { t: 'C’est Alex.', en: 'It’s Alex.', correct: true, feedback: 'Short and natural.' },
            { t: 'Je m’appelle nom Alex.', en: 'I am called name Alex.', correct: false, feedback: 'Say Au nom d’Alex, or simply C’est Alex.' },
          ],
        },
        {
          partner: { t: 'Parfait, à ce soir !', en: 'Perfect, see you tonight!' },
          goal: 'Thank them and say goodbye.',
          replies: [
            { t: 'Merci, à ce soir !', en: 'Thanks, see you tonight!', correct: true, feedback: 'Echoing à ce soir is warm and natural.' },
            { t: 'Bonne nuit !', en: 'Good night!', correct: false, feedback: 'Bonne nuit is for bedtime. Say: Merci, à ce soir !' },
          ],
        },
      ],
    },
    {
      id: 'airport',
      title: 'Check in at the airport',
      emoji: '✈️',
      scenario: 'You’re at the check-in desk at Charles de Gaulle.',
      afterUnit: 'u4',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'Bonjour, votre passeport, s’il vous plaît.', en: 'Hello, your passport, please.' },
          goal: 'Hand it over: “Here you are.”',
          replies: [
            { t: 'Voilà.', en: 'Here you are.', correct: true, feedback: 'Voilà is the everyday “here you go”.' },
            { t: 'Le voici.', en: 'Here it is.', correct: true, feedback: 'A little more formal, and just as good.' },
            { t: 'Je suis ici.', en: 'I am here.', correct: false, feedback: 'That says where you are. When handing something over: voilà.' },
          ],
        },
        {
          partner: { t: 'Vous avez des bagages à enregistrer ?', en: 'Do you have bags to check in?' },
          goal: 'Say yes, one suitcase.',
          replies: [
            { t: 'Oui, une valise.', en: 'Yes, one suitcase.', correct: true, feedback: 'Valise is feminine: une valise.' },
            { t: 'Oui, un valise.', en: 'Yes, one suitcase.', correct: false, feedback: 'Valise is feminine, so it’s une valise.' },
            { t: 'Non, merci.', en: 'No, thanks.', correct: false, feedback: 'That says no. You have one bag: Oui, une valise.' },
          ],
        },
        {
          partner: { t: 'Hublot ou couloir ?', en: 'Window or aisle?' },
          goal: 'Ask for a window seat.',
          replies: [
            { t: 'Hublot, s’il vous plaît.', en: 'Window, please.', correct: true, feedback: 'On a plane, the window seat is côté hublot.' },
            { t: 'Couloir, s’il vous plaît.', en: 'Aisle, please.', correct: false, feedback: 'Couloir is the aisle. The window is hublot.' },
            { t: 'Toilettes, s’il vous plaît.', en: 'Toilets, please.', correct: false, feedback: 'That asks for the toilets! The window seat is hublot.' },
          ],
        },
        {
          partner: { t: 'Porte douze, embarquement à dix heures.', en: 'Gate twelve, boarding at ten.' },
          goal: 'Check: gate twelve?',
          replies: [
            { t: 'Porte douze ?', en: 'Gate twelve?', correct: true, feedback: 'Checking back is a great habit at the airport.' },
            { t: 'Porte deux ?', en: 'Gate two?', correct: false, feedback: 'Deux is two; douze is twelve. Worth checking!' },
          ],
        },
      ],
    },
    {
      id: 'restaurant',
      title: 'Dinner at a restaurant',
      emoji: '🍽️',
      scenario: 'You’re having dinner at a brasserie in Paris.',
      afterUnit: 'u2',
      reasons: ['travel', 'people', 'curious'],
      turns: [
        {
          partner: { t: 'Vous avez choisi ?', en: 'Have you decided?' },
          goal: 'Order the fish.',
          replies: [
            { t: 'Oui, je vais prendre le poisson.', en: 'Yes, I’ll have the fish.', correct: true, feedback: 'Je vais prendre is the classic way to order.' },
            { t: 'Le poisson, s’il vous plaît.', en: 'The fish, please.', correct: true, feedback: 'Short and polite.' },
            { t: 'Je suis le poisson.', en: 'I am the fish.', correct: false, feedback: 'That says you are the fish! Say: je vais prendre le poisson.' },
          ],
        },
        {
          partner: { t: 'Et comme boisson ?', en: 'And to drink?' },
          goal: 'Ask for a glass of red wine.',
          replies: [
            { t: 'Un verre de vin rouge, s’il vous plaît.', en: 'A glass of red wine, please.', correct: true, feedback: 'After a quantity (un verre), use de.' },
            { t: 'Un verre du vin rouge.', en: 'A glass of the red wine.', correct: false, feedback: 'After a quantity, use de: un verre de vin rouge.' },
            { t: 'Une carafe d’eau.', en: 'A jug of water.', correct: false, feedback: 'That’s tap water (free in France!). For red wine: un verre de vin rouge.' },
          ],
        },
        {
          partner: { t: 'Tout se passe bien ?', en: 'Is everything all right?' },
          goal: 'Say it’s delicious.',
          replies: [
            { t: 'Oui, c’est délicieux !', en: 'Yes, it’s delicious!', correct: true, feedback: 'The cook will be pleased.' },
            { t: 'Oui, c’est très bon.', en: 'Yes, it’s very good.', correct: true, feedback: 'Everyday praise.' },
            { t: 'Oui, je suis délicieux !', en: 'Yes, I am delicious!', correct: false, feedback: 'That says you are delicious! Talk about the food: c’est délicieux.' },
          ],
        },
        {
          partner: { t: 'Je vous apporte autre chose ?', en: 'Can I bring you anything else?' },
          goal: 'Ask for the bill.',
          replies: [
            { t: 'L’addition, s’il vous plaît.', en: 'The bill, please.', correct: true, feedback: 'In France the waiter usually waits for you to ask.' },
            { t: 'Non merci, l’addition, s’il vous plaît.', en: 'No thanks, the bill, please.', correct: true, feedback: 'Polite and clear.' },
            { t: 'Le billet, s’il vous plaît.', en: 'The ticket, please.', correct: false, feedback: 'Un billet is a ticket or banknote. The bill is l’addition.' },
          ],
        },
      ],
    },
    {
      id: 'wifi',
      title: 'Ask for the Wi-Fi',
      emoji: '📶',
      scenario: 'You’ve just sat down in a café and need to get online.',
      afterUnit: 'u1',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'Bonjour !', en: 'Hello!' },
          goal: 'Ask if there’s Wi-Fi.',
          replies: [
            { t: 'Bonjour, vous avez le wifi ?', en: 'Hello, do you have Wi-Fi?', correct: true, feedback: 'Le wifi takes le; many people say “wee-fee”.' },
            { t: 'Bonjour, il y a du wifi ?', en: 'Hello, is there Wi-Fi?', correct: true, feedback: 'Il y a means “there is”.' },
            { t: 'Bonjour, c’est wifi ?', en: 'Hello, is it Wi-Fi?', correct: false, feedback: 'C’est means “it is”. Ask: vous avez le wifi ?' },
          ],
        },
        {
          partner: { t: 'Oui, bien sûr.', en: 'Yes, of course.' },
          goal: 'Ask for the password.',
          replies: [
            { t: 'Quel est le mot de passe ?', en: 'What’s the password?', correct: true, feedback: 'Quel before est asks for a specific piece of information.' },
            { t: 'C’est quoi, le mot de passe ?', en: 'What’s the password?', correct: true, feedback: 'Casual and very common.' },
            { t: 'Qu’est-ce qu’un mot de passe ?', en: 'What is a password?', correct: false, feedback: 'That asks what a password is. To ask for it: Quel est le mot de passe ?' },
          ],
        },
        {
          partner: { t: 'C’est écrit sur le ticket.', en: 'It’s written on the receipt.' },
          goal: 'Thank them.',
          replies: [
            { t: 'Super, merci !', en: 'Great, thanks!', correct: true, feedback: 'Friendly and natural.' },
            { t: 'D’accord, merci beaucoup.', en: 'OK, thanks a lot.', correct: true, feedback: 'Polite and clear.' },
            { t: 'S’il vous plaît.', en: 'Please.', correct: false, feedback: 'That asks for something. To thank: merci.' },
          ],
        },
      ],
    },
  ],

  hi: [
    {
      id: 'market',
      title: 'Shop at the market',
      emoji: '🍅',
      scenario: 'You’re buying vegetables from a sabzi stall.',
      afterUnit: 'u3',
      reasons: ['travel', 'curious'],
      turns: [
        {
          partner: { t: 'आइए, क्या चाहिए?', en: 'Come, what do you need?', roman: 'aaiye, kya chaahiye?' },
          goal: 'Ask for a kilo of tomatoes.',
          replies: [
            { t: 'एक किलो टमाटर दीजिए।', en: 'Please give me a kilo of tomatoes.', roman: 'ek kilo tamaatar deejiye.', correct: true, feedback: 'दीजिए is the polite “please give”.' },
            { t: 'एक किलो टमाटर दो।', en: 'Give a kilo of tomatoes.', roman: 'ek kilo tamaatar do.', correct: false, feedback: 'दो is the familiar command, abrupt from a customer. Use दीजिए.' },
            { t: 'मैं टमाटर हूँ।', en: 'I am a tomato.', roman: 'main tamaatar hoon.', correct: false, feedback: 'हूँ means “am”, so you just said you are a tomato. Say: एक किलो टमाटर दीजिए।' },
          ],
        },
        {
          partner: { t: 'और कुछ?', en: 'Anything else?', roman: 'aur kuchh?' },
          goal: 'Ask how much the onions are a kilo.',
          replies: [
            { t: 'प्याज़ कितने रुपये किलो है?', en: 'How many rupees a kilo are the onions?', roman: 'pyaaz kitne rupaye kilo hai?', correct: true, feedback: 'कितने रुपये किलो? is the everyday way to ask a price.' },
            { t: 'प्याज़ कहाँ है?', en: 'Where are the onions?', roman: 'pyaaz kahaan hai?', correct: false, feedback: 'कहाँ means “where”. For the price: कितने रुपये किलो है?' },
            { t: 'प्याज़ कौन है?', en: 'Who is the onion?', roman: 'pyaaz kaun hai?', correct: false, feedback: 'कौन means “who”. For the price: कितने रुपये किलो है?' },
          ],
        },
        {
          partner: { t: 'चालीस रुपये किलो।', en: 'Forty rupees a kilo.', roman: 'chaalees rupaye kilo.' },
          goal: 'Ask for half a kilo.',
          replies: [
            { t: 'आधा किलो दीजिए।', en: 'Please give me half a kilo.', roman: 'aadha kilo deejiye.', correct: true, feedback: 'आधा means “half”.' },
            { t: 'आधी किलो दीजिए।', en: 'Please give me half a kilo.', roman: 'aadhi kilo deejiye.', correct: false, feedback: 'किलो is masculine, so आधा, not आधी.' },
            { t: 'दो किलो दीजिए।', en: 'Please give me two kilos.', roman: 'do kilo deejiye.', correct: false, feedback: 'दो किलो is two kilos. Half a kilo is आधा किलो.' },
          ],
        },
        {
          partner: { t: 'बीस रुपये हुए।', en: 'That’s twenty rupees.', roman: 'bees rupaye hue.' },
          goal: 'Hand over the money and thank them.',
          replies: [
            { t: 'ये लीजिए, शुक्रिया।', en: 'Here you are, thanks.', roman: 'ye leejiye, shukriya.', correct: true, feedback: 'लीजिए means “please take”.' },
            { t: 'आपका स्वागत है।', en: 'You’re welcome here.', roman: 'aapka svaagat hai.', correct: false, feedback: 'That welcomes someone. Hand over the money: ये लीजिए, शुक्रिया।' },
          ],
        },
      ],
    },
    {
      id: 'doctor',
      title: 'See a doctor',
      emoji: '🩺',
      scenario: 'You feel unwell while travelling and visit a clinic.',
      afterUnit: 'u5',
      reasons: ['travel', 'people'],
      turns: [
        {
          partner: { t: 'बताइए, क्या तकलीफ़ है?', en: 'Tell me, what’s the trouble?', roman: 'bataaiye, kya takleef hai?' },
          goal: 'Say you have a headache.',
          replies: [
            { t: 'मेरे सिर में दर्द है।', en: 'I have a headache.', roman: 'mere sir mein dard hai.', correct: true, feedback: 'Literally “there is pain in my head”.' },
            { t: 'मेरा सिर दर्द कर रहा है।', en: 'My head is hurting.', roman: 'mera sir dard kar raha hai.', correct: true, feedback: 'Also very natural.' },
            { t: 'मैं सिर दर्द हूँ।', en: 'I am a headache.', roman: 'main sir dard hoon.', correct: false, feedback: 'हूँ means “am”. Say: मेरे सिर में दर्द है।' },
          ],
        },
        {
          partner: { t: 'कब से?', en: 'Since when?', roman: 'kab se?' },
          goal: 'Say since yesterday.',
          replies: [
            { t: 'कल से।', en: 'Since yesterday.', roman: 'kal se.', correct: true, feedback: 'कल means both yesterday and tomorrow; with से it’s clearly yesterday.' },
            { t: 'आज तक।', en: 'Until today.', roman: 'aaj tak.', correct: false, feedback: 'तक means “until”. For “since yesterday”, say कल से।' },
          ],
        },
        {
          partner: { t: 'बुख़ार है?', en: 'Do you have a fever?', roman: 'bukhaar hai?' },
          goal: 'Say no, but you’re very tired.',
          replies: [
            { t: 'नहीं, पर मैं बहुत थका हुआ हूँ।', en: 'No, but I’m very tired.', roman: 'nahin, par main bahut thaka hua hoon.', correct: true, feedback: 'A woman says थकी हुई हूँ (thaki hui hoon).' },
            { t: 'नहीं, पर मैं बहुत थका हुआ है।', en: 'No, but I is very tired.', roman: 'nahin, par main bahut thaka hua hai.', correct: false, feedback: 'With मैं the verb is हूँ, not है: मैं थका हुआ हूँ।' },
            { t: 'हाँ, बुख़ार है।', en: 'Yes, I have a fever.', roman: 'haan, bukhaar hai.', correct: false, feedback: 'That says yes. Start with नहीं, पर…' },
          ],
        },
        {
          partner: { t: 'यह दवाई दिन में दो बार लीजिए।', en: 'Take this medicine twice a day.', roman: 'yah davaai din mein do baar leejiye.' },
          goal: 'Thank the doctor.',
          replies: [
            { t: 'धन्यवाद, डॉक्टर।', en: 'Thank you, doctor.', roman: 'dhanyavaad, doctor.', correct: true, feedback: 'धन्यवाद suits a doctor’s office.' },
            { t: 'दिन में दो बार? धन्यवाद।', en: 'Twice a day? Thank you.', roman: 'din mein do baar? dhanyavaad.', correct: true, feedback: 'Checking the dose back is a smart habit.' },
            { t: 'कोई बात नहीं।', en: 'No problem.', roman: 'koi baat nahin.', correct: false, feedback: 'That answers an apology or thanks. Here, you thank: धन्यवाद।' },
          ],
        },
      ],
    },
    {
      id: 'phone',
      title: 'Book a table by phone',
      emoji: '📞',
      scenario: 'You call a restaurant to book dinner for tonight.',
      afterUnit: 'u6',
      reasons: ['travel', 'work', 'people'],
      turns: [
        {
          partner: { t: 'हैलो, सागर रेस्टोरेंट।', en: 'Hello, Sagar Restaurant.', roman: 'hailo, saagar restorent.' },
          goal: 'Say you need to book a table for two.',
          replies: [
            { t: 'नमस्ते, मुझे दो लोगों के लिए टेबल बुक करनी है।', en: 'Hello, I need to book a table for two.', roman: 'namaste, mujhe do logon ke liye tebal buk karni hai.', correct: true, feedback: 'मुझे … करनी है means “I need to …”. टेबल is feminine, so करनी.' },
            { t: 'नमस्ते, दो लोगों के लिए टेबल मिलेगी?', en: 'Hello, can we get a table for two?', roman: 'namaste, do logon ke liye tebal milegi?', correct: true, feedback: 'मिलेगी? (“will I get?”) is a natural, polite way to ask.' },
            { t: 'नमस्ते, मैं दो लोग हूँ।', en: 'Hello, I am two people.', roman: 'namaste, main do log hoon.', correct: false, feedback: 'हूँ means “am”. Say: मुझे दो लोगों के लिए टेबल बुक करनी है।' },
          ],
        },
        {
          partner: { t: 'किस समय?', en: 'At what time?', roman: 'kis samay?' },
          goal: 'Say at eight o’clock.',
          replies: [
            { t: 'आठ बजे।', en: 'At eight o’clock.', roman: 'aath baje.', correct: true, feedback: 'बजे marks the hour.' },
            { t: 'आठ घंटे।', en: 'Eight hours.', roman: 'aath ghante.', correct: false, feedback: 'घंटे means hours (how long). For a time, use बजे: आठ बजे।' },
            { t: 'सुबह आठ बजे।', en: 'At eight in the morning.', roman: 'subah aath baje.', correct: false, feedback: 'सुबह is the morning. For dinner, say रात आठ बजे, or just आठ बजे।' },
          ],
        },
        {
          partner: { t: 'किस नाम से?', en: 'Under what name?', roman: 'kis naam se?' },
          goal: 'Give the name Alex.',
          replies: [
            { t: 'ऐलेक्स के नाम से।', en: 'Under the name Alex.', roman: 'aileks ke naam se.', correct: true, feedback: 'Echo the question: … के नाम से.' },
            { t: 'मेरा नाम ऐलेक्स है।', en: 'My name is Alex.', roman: 'mera naam aileks hai.', correct: true, feedback: 'Perfectly clear.' },
            { t: 'आपका नाम ऐलेक्स है।', en: 'Your name is Alex.', roman: 'aapka naam aileks hai.', correct: false, feedback: 'आपका means “your”. For yourself, say मेरा नाम.' },
          ],
        },
        {
          partner: { t: 'ठीक है, शाम को मिलते हैं।', en: 'OK, see you this evening.', roman: 'theek hai, shaam ko milte hain.' },
          goal: 'Thank them and say goodbye.',
          replies: [
            { t: 'शुक्रिया, नमस्ते।', en: 'Thanks, goodbye.', roman: 'shukriya, namaste.', correct: true, feedback: 'नमस्ते works for goodbye too.' },
            { t: 'शुभ प्रभात।', en: 'Good morning.', roman: 'shubh prabhaat.', correct: false, feedback: 'That’s a formal “good morning”. To end the call: शुक्रिया, नमस्ते।' },
          ],
        },
      ],
    },
    {
      id: 'airport',
      title: 'Check in at the airport',
      emoji: '✈️',
      scenario: 'You’re at the check-in counter in Delhi.',
      afterUnit: 'u5',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'नमस्ते, अपना पासपोर्ट दिखाइए।', en: 'Hello, please show your passport.', roman: 'namaste, apna paasport dikhaaiye.' },
          goal: 'Hand it over: “Here you are.”',
          replies: [
            { t: 'जी, ये लीजिए।', en: 'Yes, here you are.', roman: 'ji, ye leejiye.', correct: true, feedback: 'जी adds politeness; लीजिए is “please take”.' },
            { t: 'ये लो।', en: 'Here, take it.', roman: 'ye lo.', correct: false, feedback: 'लो is the familiar form. With an official, use लीजिए.' },
            { t: 'मेरा पासपोर्ट नहीं है।', en: 'It’s not my passport.', roman: 'mera paasport nahin hai.', correct: false, feedback: 'That says you don’t have a passport! Hand it over: जी, ये लीजिए।' },
          ],
        },
        {
          partner: { t: 'कितने बैग हैं?', en: 'How many bags are there?', roman: 'kitne baig hain?' },
          goal: 'Say one bag.',
          replies: [
            { t: 'एक बैग है।', en: 'There’s one bag.', roman: 'ek baig hai.', correct: true, feedback: 'One bag is singular, so है.' },
            { t: 'एक बैग हैं।', en: 'There are one bag.', roman: 'ek baig hain.', correct: false, feedback: 'One bag is singular, so है, not हैं.' },
            { t: 'दस बैग हैं।', en: 'There are ten bags.', roman: 'das baig hain.', correct: false, feedback: 'दस is ten! One is एक.' },
          ],
        },
        {
          partner: { t: 'खिड़की वाली सीट या गलियारे वाली?', en: 'Window seat or aisle?', roman: 'khidki vaali seat ya galiyaare vaali?' },
          goal: 'Ask for a window seat.',
          replies: [
            { t: 'खिड़की वाली सीट, प्लीज़।', en: 'A window seat, please.', roman: 'khidki vaali seat, please.', correct: true, feedback: 'प्लीज़ is everyday Hindi; कृपया is more formal.' },
            { t: 'गलियारे वाली, प्लीज़।', en: 'The aisle one, please.', roman: 'galiyaare vaali, please.', correct: false, feedback: 'गलियारा is the aisle. The window is खिड़की.' },
            { t: 'खिड़की वाला सीट।', en: 'Window seat.', roman: 'khidki vaala seat.', correct: false, feedback: 'सीट is feminine, so वाली: खिड़की वाली सीट.' },
          ],
        },
        {
          partner: { t: 'गेट नंबर बारह, बोर्डिंग दस बजे।', en: 'Gate number twelve, boarding at ten.', roman: 'gate number baarah, boarding das baje.' },
          goal: 'Check: gate twelve?',
          replies: [
            { t: 'बारह नंबर?', en: 'Number twelve?', roman: 'baarah number?', correct: true, feedback: 'Checking back is a great habit at the airport.' },
            { t: 'बीस नंबर?', en: 'Number twenty?', roman: 'bees number?', correct: false, feedback: 'बीस is twenty; बारह is twelve.' },
          ],
        },
      ],
    },
    {
      id: 'restaurant',
      title: 'Dinner at a dhaba',
      emoji: '🍽️',
      scenario: 'You stop for dinner at a dhaba on the highway.',
      afterUnit: 'u3',
      reasons: ['travel', 'people', 'curious'],
      turns: [
        {
          partner: { t: 'क्या लाऊँ?', en: 'What shall I bring?', roman: 'kya laaoon?' },
          goal: 'Order a dal and two rotis.',
          replies: [
            { t: 'एक दाल और दो रोटी दीजिए।', en: 'Please give me a dal and two rotis.', roman: 'ek daal aur do roti deejiye.', correct: true, feedback: 'When ordering, people say दो रोटी rather than रोटियाँ.' },
            { t: 'एक दाल और दो रोटी, प्लीज़।', en: 'A dal and two rotis, please.', roman: 'ek daal aur do roti, please.', correct: true, feedback: 'Short and natural.' },
            { t: 'मैं दाल हूँ।', en: 'I am dal.', roman: 'main daal hoon.', correct: false, feedback: 'हूँ means “am”. Say: एक दाल और दो रोटी दीजिए।' },
          ],
        },
        {
          partner: { t: 'पीने के लिए?', en: 'To drink?', roman: 'peene ke liye?' },
          goal: 'Ask for a lassi.',
          replies: [
            { t: 'एक लस्सी, प्लीज़।', en: 'A lassi, please.', roman: 'ek lassi, please.', correct: true, feedback: 'A dhaba classic.' },
            { t: 'एक लस्सी पीता।', en: 'One lassi drinks.', roman: 'ek lassi peeta.', correct: false, feedback: 'पीता alone isn’t a request. Say: एक लस्सी, प्लीज़।' },
          ],
        },
        {
          partner: { t: 'खाना कैसा है?', en: 'How is the food?', roman: 'khaana kaisa hai?' },
          goal: 'Say it’s very tasty.',
          replies: [
            { t: 'बहुत स्वादिष्ट है!', en: 'It’s very tasty!', roman: 'bahut svaadisht hai!', correct: true, feedback: 'The cook will be pleased.' },
            { t: 'बहुत बढ़िया है!', en: 'It’s great!', roman: 'bahut badhiya hai!', correct: true, feedback: 'Everyday praise.' },
            { t: 'बहुत स्वादिष्ट हूँ!', en: 'I am very tasty!', roman: 'bahut svaadisht hoon!', correct: false, feedback: 'हूँ means “am”. Talk about the food: बहुत स्वादिष्ट है!' },
          ],
        },
        {
          partner: { t: 'और कुछ चाहिए?', en: 'Do you need anything else?', roman: 'aur kuchh chaahiye?' },
          goal: 'Ask for the bill.',
          replies: [
            { t: 'नहीं, बस बिल दे दीजिए।', en: 'No, just the bill, please.', roman: 'nahin, bas bill de deejiye.', correct: true, feedback: 'बस means “just” here.' },
            { t: 'बिल ले आइए, प्लीज़।', en: 'Please bring the bill.', roman: 'bill le aaiye, please.', correct: true, feedback: 'Polite and clear.' },
            { t: 'टिकट दीजिए।', en: 'Give me a ticket.', roman: 'tikat deejiye.', correct: false, feedback: 'टिकट is a ticket. The bill is बिल.' },
          ],
        },
      ],
    },
    {
      id: 'wifi',
      title: 'Ask for the Wi-Fi',
      emoji: '📶',
      scenario: 'You’ve checked into a guesthouse and need to get online.',
      afterUnit: 'u2',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'जी, बताइए।', en: 'Yes, how can I help?', roman: 'ji, bataaiye.' },
          goal: 'Ask if there’s Wi-Fi here.',
          replies: [
            { t: 'क्या यहाँ वाई-फ़ाई है?', en: 'Is there Wi-Fi here?', roman: 'kya yahaan wifi hai?', correct: true, feedback: 'क्या at the start turns a sentence into a yes/no question.' },
            { t: 'वाई-फ़ाई है?', en: 'Is there Wi-Fi?', roman: 'wifi hai?', correct: true, feedback: 'Short and natural, with a rising tone.' },
            { t: 'वाई-फ़ाई कौन है?', en: 'Who is Wi-Fi?', roman: 'wifi kaun hai?', correct: false, feedback: 'कौन means “who”. Ask: क्या यहाँ वाई-फ़ाई है?' },
          ],
        },
        {
          partner: { t: 'हाँ, है।', en: 'Yes, there is.', roman: 'haan, hai.' },
          goal: 'Ask for the password.',
          replies: [
            { t: 'पासवर्ड क्या है?', en: 'What’s the password?', roman: 'password kya hai?', correct: true, feedback: 'Simple and clear.' },
            { t: 'पासवर्ड कब है?', en: 'When is the password?', roman: 'password kab hai?', correct: false, feedback: 'कब means “when”. Ask: पासवर्ड क्या है?' },
          ],
        },
        {
          partner: { t: 'कमरे में कार्ड पर लिखा है।', en: 'It’s written on the card in your room.', roman: 'kamre mein card par likha hai.' },
          goal: 'Thank them.',
          replies: [
            { t: 'अच्छा, शुक्रिया!', en: 'OK, thanks!', roman: 'achchha, shukriya!', correct: true, feedback: 'अच्छा here means “I see” or “OK”.' },
            { t: 'माफ़ कीजिए।', en: 'Sorry.', roman: 'maaf keejiye.', correct: false, feedback: 'That’s an apology. To thank: शुक्रिया।' },
          ],
        },
      ],
    },
  ],
  de: [
    {
      id: 'market',
      title: 'Shop at the market',
      emoji: '🍅',
      scenario: 'You’re buying fruit and vegetables at a market in Munich.',
      afterUnit: 'u2',
      reasons: ['travel', 'curious'],
      turns: [
        {
          partner: { t: 'Guten Morgen! Was darf’s sein?', en: 'Good morning! What can I get you?' },
          goal: 'Ask for a kilo of tomatoes.',
          replies: [
            { t: 'Ein Kilo Tomaten, bitte.', en: 'A kilo of tomatoes, please.', correct: true, feedback: 'German needs no word for “of” after a quantity: ein Kilo Tomaten.' },
            { t: 'Ein Kilo von Tomaten, bitte.', en: 'A kilo of tomatoes, please.', correct: false, feedback: 'Leave out von after a quantity: ein Kilo Tomaten.' },
            { t: 'Ich bin ein Kilo Tomaten.', en: 'I am a kilo of tomatoes.', correct: false, feedback: 'Ich bin means “I am”. Just say: Ein Kilo Tomaten, bitte.' },
          ],
        },
        {
          partner: { t: 'Bitte schön. Sonst noch etwas?', en: 'Here you are. Anything else?' },
          goal: 'Ask how much the strawberries cost.',
          replies: [
            { t: 'Was kosten die Erdbeeren?', en: 'How much are the strawberries?', correct: true, feedback: 'Kosten is plural because Erdbeeren is plural.' },
            { t: 'Was kostet die Erdbeeren?', en: 'How much is the strawberries?', correct: false, feedback: 'Erdbeeren is plural, so the verb is plural too: Was kosten die Erdbeeren?' },
            { t: 'Wie spät ist es?', en: 'What time is it?', correct: false, feedback: 'That asks the time. For a price: Was kosten…?' },
          ],
        },
        {
          partner: { t: 'Vier Euro die Schale.', en: 'Four euros a punnet.' },
          goal: 'Take one punnet and ask for the total.',
          replies: [
            { t: 'Eine Schale, bitte. Was macht das?', en: 'One punnet, please. How much is that?', correct: true, feedback: 'Was macht das? asks for the total.' },
            { t: 'Ein Schale, bitte.', en: 'One punnet, please.', correct: false, feedback: 'Schale is feminine: eine Schale.' },
            { t: 'Eine Schale, danke. Tschüss!', en: 'One punnet, thanks. Bye!', correct: false, feedback: 'Don’t leave before paying! Ask for the total: Was macht das?' },
          ],
        },
      ],
    },
    {
      id: 'doctor',
      title: 'See a doctor',
      emoji: '🩺',
      scenario: 'You feel unwell on holiday and see a doctor in Vienna.',
      afterUnit: 'u5',
      reasons: ['travel', 'people'],
      turns: [
        {
          partner: { t: 'Guten Tag. Was fehlt Ihnen?', en: 'Hello. What’s wrong?' },
          goal: 'Say you have a headache.',
          replies: [
            { t: 'Ich habe Kopfschmerzen.', en: 'I have a headache.', correct: true, feedback: 'Kopfschmerzen (headache) is almost always plural in German.' },
            { t: 'Mein Kopf tut weh.', en: 'My head hurts.', correct: true, feedback: 'Also natural: wehtun means to hurt.' },
            { t: 'Ich bin Kopfschmerzen.', en: 'I am a headache.', correct: false, feedback: 'Pain uses haben: Ich habe Kopfschmerzen.' },
          ],
        },
        {
          partner: { t: 'Seit wann?', en: 'Since when?' },
          goal: 'Say since yesterday.',
          replies: [
            { t: 'Seit gestern.', en: 'Since yesterday.', correct: true, feedback: 'Short and clear.' },
            { t: 'Seit morgen.', en: 'Since tomorrow.', correct: false, feedback: 'Morgen is tomorrow. Yesterday is gestern: seit gestern.' },
            { t: 'Bis gestern.', en: 'Until yesterday.', correct: false, feedback: 'Bis means “until”. “Since” is seit: seit gestern.' },
          ],
        },
        {
          partner: { t: 'Haben Sie Fieber?', en: 'Do you have a fever?' },
          goal: 'Say no, but you’re very tired.',
          replies: [
            { t: 'Nein, aber ich bin sehr müde.', en: 'No, but I’m very tired.', correct: true, feedback: 'Müde (tired) goes with sein.' },
            { t: 'Nein, aber ich habe sehr müde.', en: 'No, but I have very tired.', correct: false, feedback: 'Tired uses sein: ich bin sehr müde.' },
            { t: 'Ja, ich habe Fieber.', en: 'Yes, I have a fever.', correct: false, feedback: 'That says yes. Start with Nein, aber…' },
          ],
        },
        {
          partner: { t: 'Nehmen Sie diese Tabletten zweimal am Tag.', en: 'Take these tablets twice a day.' },
          goal: 'Thank the doctor.',
          replies: [
            { t: 'Vielen Dank.', en: 'Thank you very much.', correct: true, feedback: 'Warm and polite.' },
            { t: 'Zweimal am Tag? Danke.', en: 'Twice a day? Thanks.', correct: true, feedback: 'Checking the dose back is a smart habit.' },
            { t: 'Gern geschehen.', en: 'You’re welcome.', correct: false, feedback: 'Gern geschehen answers a thank you. Here you thank: Vielen Dank.' },
          ],
        },
      ],
    },
    {
      id: 'phone',
      title: 'Book a table by phone',
      emoji: '📞',
      scenario: 'You call a restaurant to reserve dinner for tonight.',
      afterUnit: 'u6',
      reasons: ['travel', 'work', 'people'],
      turns: [
        {
          partner: { t: 'Restaurant Linde, guten Tag!', en: 'Restaurant Linde, hello!' },
          goal: 'Say you’d like to book a table for two.',
          replies: [
            { t: 'Guten Tag, ich möchte einen Tisch für zwei Personen reservieren.', en: 'Hello, I’d like to book a table for two.', correct: true, feedback: 'Ich möchte … reservieren is the standard phrase; the verb goes to the end.' },
            { t: 'Guten Tag, ich reserviere ein Tisch für zwei.', en: 'Hello, I book a table for two.', correct: false, feedback: 'Tisch is masculine, so einen Tisch. Ich möchte … reservieren also sounds more polite.' },
            { t: 'Guten Tag, ich bin ein Tisch für zwei.', en: 'Hello, I am a table for two.', correct: false, feedback: 'Ich bin means “I am”. Say: ich möchte einen Tisch für zwei reservieren.' },
          ],
        },
        {
          partner: { t: 'Für wie viel Uhr?', en: 'For what time?' },
          goal: 'Say for 7 pm.',
          replies: [
            { t: 'Für neunzehn Uhr, bitte.', en: 'For 7 pm, please.', correct: true, feedback: 'Bookings usually use the 24-hour clock.' },
            { t: 'Um sieben Uhr abends.', en: 'At seven in the evening.', correct: true, feedback: 'Also clear.' },
            { t: 'Für sieben Stunden.', en: 'For seven hours.', correct: false, feedback: 'That means “for seven hours”. For a time: neunzehn Uhr.' },
          ],
        },
        {
          partner: { t: 'Auf welchen Namen?', en: 'Under what name?' },
          goal: 'Give the name Alex.',
          replies: [
            { t: 'Auf den Namen Alex.', en: 'Under the name Alex.', correct: true, feedback: 'Echoing the question is the easy way to answer.' },
            { t: 'Alex, bitte.', en: 'Alex, please.', correct: true, feedback: 'Short and clear.' },
            { t: 'Ich bin Name Alex.', en: 'I am name Alex.', correct: false, feedback: 'Say Auf den Namen Alex, or simply Alex.' },
          ],
        },
        {
          partner: { t: 'Alles klar, bis heute Abend!', en: 'All right, see you tonight!' },
          goal: 'Thank them and say goodbye.',
          replies: [
            { t: 'Danke, bis heute Abend!', en: 'Thanks, see you tonight!', correct: true, feedback: 'Echoing bis heute Abend is warm and natural.' },
            { t: 'Guten Morgen!', en: 'Good morning!', correct: false, feedback: 'That’s a morning greeting. To end the call: Danke, bis heute Abend!' },
          ],
        },
      ],
    },
    {
      id: 'airport',
      title: 'Check in at the airport',
      emoji: '✈️',
      scenario: 'You’re at the check-in desk at Frankfurt airport.',
      afterUnit: 'u4',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'Guten Tag, Ihren Pass, bitte.', en: 'Hello, your passport, please.' },
          goal: 'Hand it over: “Here you are.”',
          replies: [
            { t: 'Bitte schön.', en: 'Here you are.', correct: true, feedback: 'The standard phrase when handing something over.' },
            { t: 'Hier, bitte.', en: 'Here, please.', correct: true, feedback: 'Also natural.' },
            { t: 'Ich bin hier.', en: 'I am here.', correct: false, feedback: 'That says where you are. When handing something over: Bitte schön.' },
          ],
        },
        {
          partner: { t: 'Haben Sie Gepäck aufzugeben?', en: 'Do you have luggage to check in?' },
          goal: 'Say yes, one suitcase.',
          replies: [
            { t: 'Ja, einen Koffer.', en: 'Yes, one suitcase.', correct: true, feedback: 'Koffer is masculine, so it becomes einen here.' },
            { t: 'Ja, eine Koffer.', en: 'Yes, one suitcase.', correct: false, feedback: 'Koffer is masculine: einen Koffer.' },
            { t: 'Nein, danke.', en: 'No, thanks.', correct: false, feedback: 'That says no. You have one bag: Ja, einen Koffer.' },
          ],
        },
        {
          partner: { t: 'Fenster oder Gang?', en: 'Window or aisle?' },
          goal: 'Ask for a window seat.',
          replies: [
            { t: 'Fenster, bitte.', en: 'Window, please.', correct: true, feedback: 'A window seat is ein Fensterplatz.' },
            { t: 'Gang, bitte.', en: 'Aisle, please.', correct: false, feedback: 'Gang is the aisle. The window is Fenster.' },
            { t: 'Toilette, bitte.', en: 'Toilet, please.', correct: false, feedback: 'That asks for the toilet! The window seat is Fenster.' },
          ],
        },
        {
          partner: { t: 'Gate zwölf, Boarding um zehn Uhr.', en: 'Gate twelve, boarding at ten.' },
          goal: 'Check: gate twelve?',
          replies: [
            { t: 'Gate zwölf?', en: 'Gate twelve?', correct: true, feedback: 'Checking back is a great habit at the airport.' },
            { t: 'Gate zwei?', en: 'Gate two?', correct: false, feedback: 'Zwei is two; zwölf is twelve. Worth checking!' },
          ],
        },
      ],
    },
    {
      id: 'restaurant',
      title: 'Dinner at a restaurant',
      emoji: '🍽️',
      scenario: 'You’re having dinner at a restaurant in Hamburg.',
      afterUnit: 'u2',
      reasons: ['travel', 'people', 'curious'],
      turns: [
        {
          partner: { t: 'Haben Sie schon gewählt?', en: 'Have you decided?' },
          goal: 'Order the fish.',
          replies: [
            { t: 'Ja, ich nehme den Fisch.', en: 'Yes, I’ll have the fish.', correct: true, feedback: 'Ich nehme… is the classic way to order. Fisch is masculine: den Fisch.' },
            { t: 'Den Fisch, bitte.', en: 'The fish, please.', correct: true, feedback: 'Short and polite.' },
            { t: 'Ich bin der Fisch.', en: 'I am the fish.', correct: false, feedback: 'That says you are the fish! Say: Ich nehme den Fisch.' },
          ],
        },
        {
          partner: { t: 'Und zu trinken?', en: 'And to drink?' },
          goal: 'Ask for a glass of red wine.',
          replies: [
            { t: 'Ein Glas Rotwein, bitte.', en: 'A glass of red wine, please.', correct: true, feedback: 'No word for “of” after a quantity: ein Glas Rotwein.' },
            { t: 'Ein Glas von Rotwein.', en: 'A glass of red wine.', correct: false, feedback: 'Leave out von: ein Glas Rotwein.' },
            { t: 'Ein Wasser, bitte.', en: 'A water, please.', correct: false, feedback: 'That’s water. For red wine: ein Glas Rotwein.' },
          ],
        },
        {
          partner: { t: 'Schmeckt es Ihnen?', en: 'Are you enjoying your meal?' },
          goal: 'Say it’s delicious.',
          replies: [
            { t: 'Ja, es ist sehr lecker!', en: 'Yes, it’s delicious!', correct: true, feedback: 'Lecker is the everyday word for tasty.' },
            { t: 'Ja, sehr gut, danke.', en: 'Yes, very good, thanks.', correct: true, feedback: 'Friendly and natural.' },
            { t: 'Ja, ich bin lecker!', en: 'Yes, I am tasty!', correct: false, feedback: 'That says you are tasty! Talk about the food: Es ist sehr lecker.' },
          ],
        },
        {
          partner: { t: 'Darf es noch etwas sein?', en: 'Would you like anything else?' },
          goal: 'Ask for the bill.',
          replies: [
            { t: 'Die Rechnung, bitte.', en: 'The bill, please.', correct: true, feedback: 'Clear and polite.' },
            { t: 'Zahlen, bitte.', en: 'I’d like to pay, please.', correct: true, feedback: 'Literally “paying, please”: the everyday way to ask.' },
            { t: 'Die Karte, bitte.', en: 'The menu, please.', correct: false, feedback: 'Die Karte is the menu. The bill is die Rechnung.' },
          ],
        },
      ],
    },
    {
      id: 'wifi',
      title: 'Ask for the Wi-Fi',
      emoji: '📶',
      scenario: 'You’ve just sat down in a café and need to get online.',
      afterUnit: 'u1',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'Hallo!', en: 'Hello!' },
          goal: 'Ask if there’s Wi-Fi.',
          replies: [
            { t: 'Hallo, gibt es hier WLAN?', en: 'Hello, is there Wi-Fi here?', correct: true, feedback: 'Germans usually say WLAN (vay-lahn) for Wi-Fi.' },
            { t: 'Hallo, haben Sie WLAN?', en: 'Hello, do you have Wi-Fi?', correct: true, feedback: 'Also natural.' },
            { t: 'Hallo, ist WLAN?', en: 'Hello, is Wi-Fi?', correct: false, feedback: 'That’s incomplete. Ask: Gibt es hier WLAN?' },
          ],
        },
        {
          partner: { t: 'Ja, natürlich.', en: 'Yes, of course.' },
          goal: 'Ask for the password.',
          replies: [
            { t: 'Wie ist das Passwort?', en: 'What’s the password?', correct: true, feedback: 'Wie ist…? asks for a specific piece of information.' },
            { t: 'Was ist das Passwort?', en: 'What’s the password?', correct: true, feedback: 'Very common in everyday speech.' },
            { t: 'Wer ist das Passwort?', en: 'Who is the password?', correct: false, feedback: 'Wer means “who”. Ask: Wie ist das Passwort?' },
          ],
        },
        {
          partner: { t: 'Es steht auf dem Kassenbon.', en: 'It’s on the receipt.' },
          goal: 'Thank them.',
          replies: [
            { t: 'Super, danke!', en: 'Great, thanks!', correct: true, feedback: 'Friendly and natural.' },
            { t: 'Alles klar, vielen Dank.', en: 'All right, thank you very much.', correct: true, feedback: 'Polite and clear.' },
            { t: 'Gern geschehen.', en: 'You’re welcome.', correct: false, feedback: 'That answers a thank you. To thank them: danke.' },
          ],
        },
      ],
    },
  ],

  ja: [
    {
      id: 'market',
      title: 'Shop at a greengrocer',
      emoji: '🍎',
      scenario: 'You’re buying fruit at a small greengrocer in Osaka.',
      afterUnit: 'u3',
      reasons: ['travel', 'curious'],
      turns: [
        {
          partner: { t: 'いらっしゃい！', en: 'Welcome!', roman: 'irasshai!' },
          goal: 'Ask how much these apples are.',
          replies: [
            { t: 'このりんごはいくらですか？', en: 'How much are these apples?', roman: 'kono ringo wa ikura desu ka?', correct: true, feedback: 'いくら means “how much”.' },
            { t: 'このりんごはどこですか？', en: 'Where are these apples?', roman: 'kono ringo wa doko desu ka?', correct: false, feedback: 'どこ means “where”. For the price: いくらですか？' },
            { t: 'りんごです。', en: 'It’s an apple.', roman: 'ringo desu.', correct: false, feedback: 'That just says “it’s an apple”. Ask the price: いくらですか？' },
          ],
        },
        {
          partner: { t: '一つ百円です。', en: 'They’re 100 yen each.', roman: 'hitotsu hyaku en desu.' },
          goal: 'Ask for three.',
          replies: [
            { t: '三つください。', en: 'Three, please.', roman: 'mittsu kudasai.', correct: true, feedback: 'Small objects are counted with つ: 一つ, 二つ, 三つ.' },
            { t: '三ください。', en: 'Three, please.', roman: 'san kudasai.', correct: false, feedback: 'With objects, use the counter: 三つ (mittsu).' },
            { t: '三つあります。', en: 'There are three.', roman: 'mittsu arimasu.', correct: false, feedback: 'That says there are three. To buy them: 三つください。' },
          ],
        },
        {
          partner: { t: '三百円です。', en: 'That’s 300 yen.', roman: 'sanbyaku en desu.' },
          goal: 'Hand over the money and thank them.',
          replies: [
            { t: 'はい、どうぞ。ありがとう。', en: 'Here you are. Thanks.', roman: 'hai, dōzo. arigatō.', correct: true, feedback: 'どうぞ goes with handing something over.' },
            { t: 'いただきます。', en: '(said before eating)', roman: 'itadakimasu.', correct: false, feedback: 'いただきます is said before eating. Here: はい、どうぞ。' },
          ],
        },
      ],
    },
    {
      id: 'doctor',
      title: 'See a doctor',
      emoji: '🩺',
      scenario: 'You feel unwell while travelling and visit a clinic.',
      afterUnit: 'u5',
      reasons: ['travel', 'people'],
      turns: [
        {
          partner: { t: 'どうしましたか？', en: 'What’s the matter?', roman: 'dō shimashita ka?' },
          goal: 'Say you have a headache.',
          replies: [
            { t: '頭が痛いです。', en: 'My head hurts.', roman: 'atama ga itai desu.', correct: true, feedback: 'Body part + が痛いです means “my … hurts”.' },
            { t: '頭を痛いです。', en: 'My head hurts.', roman: 'atama o itai desu.', correct: false, feedback: '痛い takes が, not を: 頭が痛いです。' },
            { t: '頭が好きです。', en: 'I like heads.', roman: 'atama ga suki desu.', correct: false, feedback: 'That says you like heads! Say: 頭が痛いです。' },
          ],
        },
        {
          partner: { t: 'いつからですか？', en: 'Since when?', roman: 'itsu kara desu ka?' },
          goal: 'Say since yesterday.',
          replies: [
            { t: 'きのうからです。', en: 'Since yesterday.', roman: 'kinō kara desu.', correct: true, feedback: 'から means “from” or “since”.' },
            { t: 'あしたからです。', en: 'From tomorrow.', roman: 'ashita kara desu.', correct: false, feedback: 'あした is tomorrow. Yesterday is きのう.' },
          ],
        },
        {
          partner: { t: '熱はありますか？', en: 'Do you have a fever?', roman: 'netsu wa arimasu ka?' },
          goal: 'Say no, but you’re very tired.',
          replies: [
            { t: 'いいえ、でもとても疲れています。', en: 'No, but I’m very tired.', roman: 'iie, demo totemo tsukarete imasu.', correct: true, feedback: '疲れています describes being tired right now.' },
            { t: 'はい、あります。', en: 'Yes, I do.', roman: 'hai, arimasu.', correct: false, feedback: 'That says yes, you have a fever. Start with いいえ、でも…' },
          ],
        },
        {
          partner: { t: 'この薬を一日二回飲んでください。', en: 'Please take this medicine twice a day.', roman: 'kono kusuri o ichinichi nikai nonde kudasai.' },
          goal: 'Thank the doctor.',
          replies: [
            { t: 'ありがとうございました。', en: 'Thank you (for your help).', roman: 'arigatō gozaimashita.', correct: true, feedback: 'The past form thanks someone for something already done, perfect when leaving.' },
            { t: '一日二回ですね。ありがとうございます。', en: 'Twice a day, right? Thank you.', roman: 'ichinichi nikai desu ne. arigatō gozaimasu.', correct: true, feedback: 'Checking the dose back is a smart habit.' },
            { t: 'どういたしまして。', en: 'You’re welcome.', roman: 'dō itashimashite.', correct: false, feedback: 'That’s the reply to thanks. Here you thank: ありがとうございました。' },
          ],
        },
      ],
    },
    {
      id: 'phone',
      title: 'Book a table by phone',
      emoji: '📞',
      scenario: 'You call a restaurant to book dinner for tonight.',
      afterUnit: 'u6',
      reasons: ['travel', 'work', 'people'],
      turns: [
        {
          partner: { t: 'はい、さくら食堂です。', en: 'Hello, Sakura Restaurant.', roman: 'hai, Sakura shokudō desu.' },
          goal: 'Say you’d like to book for two people tonight.',
          replies: [
            { t: '今晩、二人で予約したいのですが。', en: 'I’d like to book for two people tonight.', roman: 'konban, futari de yoyaku shitai no desu ga.', correct: true, feedback: '〜たいのですが is a soft, polite way to make a request.' },
            { t: '今晩、二人で予約をお願いします。', en: 'A booking for two tonight, please.', roman: 'konban, futari de yoyaku o onegaishimasu.', correct: true, feedback: 'Short and polite.' },
            { t: '今晩、二つで予約したいです。', en: 'I want to book for two (things) tonight.', roman: 'konban, futatsu de yoyaku shitai desu.', correct: false, feedback: 'People are counted with 人: 二人 (futari), not 二つ.' },
          ],
        },
        {
          partner: { t: '何時になさいますか？', en: 'What time would you like?', roman: 'nanji ni nasaimasu ka?' },
          goal: 'Say seven o’clock.',
          replies: [
            { t: '七時でお願いします。', en: 'Seven o’clock, please.', roman: 'shichiji de onegaishimasu.', correct: true, feedback: '時 (ji) marks the hour.' },
            { t: '七時間です。', en: 'Seven hours.', roman: 'shichijikan desu.', correct: false, feedback: '時間 means hours (how long). For a time: 七時.' },
          ],
        },
        {
          partner: { t: 'お名前をお願いします。', en: 'Your name, please.', roman: 'o-namae o onegaishimasu.' },
          goal: 'Give the name Alex.',
          replies: [
            { t: 'アレックスです。', en: 'It’s Alex.', roman: 'Arekkusu desu.', correct: true, feedback: 'Just your name + です.' },
            { t: 'お名前はアレックスです。', en: 'Your honourable name is Alex.', roman: 'o-namae wa Arekkusu desu.', correct: false, feedback: 'お名前 is the polite word for someone else’s name. For yours, just say アレックスです。' },
          ],
        },
        {
          partner: { t: 'かしこまりました。お待ちしております。', en: 'Certainly. We look forward to seeing you.', roman: 'kashikomarimashita. omachi shite orimasu.' },
          goal: 'Thank them and end the call politely.',
          replies: [
            { t: 'よろしくお願いします。失礼します。', en: 'Thank you. Goodbye.', roman: 'yoroshiku onegaishimasu. shitsurei shimasu.', correct: true, feedback: '失礼します is the polite way to end a phone call.' },
            { t: 'おやすみなさい。', en: 'Good night.', roman: 'oyasuminasai.', correct: false, feedback: 'That’s said at bedtime. End the call with 失礼します。' },
          ],
        },
      ],
    },
    {
      id: 'airport',
      title: 'Check in at the airport',
      emoji: '✈️',
      scenario: 'You’re at the check-in counter at Narita airport.',
      afterUnit: 'u5',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'パスポートをお願いします。', en: 'Your passport, please.', roman: 'pasupōto o onegaishimasu.' },
          goal: 'Hand it over: “Here you are.”',
          replies: [
            { t: 'はい、どうぞ。', en: 'Here you are.', roman: 'hai, dōzo.', correct: true, feedback: 'どうぞ is said when handing something over.' },
            { t: 'いただきます。', en: '(said before eating)', roman: 'itadakimasu.', correct: false, feedback: 'いただきます is said before eating. Here: はい、どうぞ。' },
          ],
        },
        {
          partner: { t: 'お預けの荷物はありますか？', en: 'Do you have bags to check in?', roman: 'o-azuke no nimotsu wa arimasu ka?' },
          goal: 'Say yes, one suitcase.',
          replies: [
            { t: 'はい、スーツケースが一つあります。', en: 'Yes, one suitcase.', roman: 'hai, sūtsukēsu ga hitotsu arimasu.', correct: true, feedback: 'あります is used for things.' },
            { t: 'はい、スーツケースが一ついます。', en: 'Yes, one suitcase.', roman: 'hai, sūtsukēsu ga hitotsu imasu.', correct: false, feedback: 'います is for people and animals. For things, use あります.' },
            { t: 'いいえ、ありません。', en: 'No, I don’t.', roman: 'iie, arimasen.', correct: false, feedback: 'That says no. You have one bag: はい、スーツケースが一つあります。' },
          ],
        },
        {
          partner: { t: '窓側と通路側、どちらがよろしいですか？', en: 'Would you prefer a window or an aisle seat?', roman: 'madogawa to tsūrogawa, dochira ga yoroshii desu ka?' },
          goal: 'Ask for a window seat.',
          replies: [
            { t: '窓側でお願いします。', en: 'Window, please.', roman: 'madogawa de onegaishimasu.', correct: true, feedback: '窓側 means the window side.' },
            { t: '通路側でお願いします。', en: 'Aisle, please.', roman: 'tsūrogawa de onegaishimasu.', correct: false, feedback: '通路側 is the aisle side. The window is 窓側.' },
          ],
        },
        {
          partner: { t: '十二番ゲートからご搭乗ください。', en: 'Please board from gate twelve.', roman: 'jūniban gēto kara go-tōjō kudasai.' },
          goal: 'Check: gate twelve?',
          replies: [
            { t: '十二番ですか？', en: 'Number twelve?', roman: 'jūniban desu ka?', correct: true, feedback: 'Checking back is a great habit at the airport.' },
            { t: '二番ですか？', en: 'Number two?', roman: 'niban desu ka?', correct: false, feedback: '二 is two; 十二 is twelve.' },
          ],
        },
      ],
    },
    {
      id: 'restaurant',
      title: 'Dinner at an izakaya',
      emoji: '🍽️',
      scenario: 'You’re having dinner at an izakaya (a Japanese pub) in Kyoto.',
      afterUnit: 'u3',
      reasons: ['travel', 'people', 'curious'],
      turns: [
        {
          partner: { t: 'ご注文はお決まりですか？', en: 'Are you ready to order?', roman: 'go-chūmon wa o-kimari desu ka?' },
          goal: 'Order the grilled fish.',
          replies: [
            { t: '焼き魚をください。', en: 'The grilled fish, please.', roman: 'yakizakana o kudasai.', correct: true, feedback: '焼き魚 is grilled fish.' },
            { t: 'これをください。', en: 'This one, please.', roman: 'kore o kudasai.', correct: true, feedback: 'Pointing at the menu with これ works everywhere.' },
            { t: '魚が好きです。', en: 'I like fish.', roman: 'sakana ga suki desu.', correct: false, feedback: 'That says you like fish but doesn’t order. Say: 焼き魚をください。' },
          ],
        },
        {
          partner: { t: 'お飲み物は？', en: 'And to drink?', roman: 'o-nomimono wa?' },
          goal: 'Ask for one beer.',
          replies: [
            { t: 'ビールを一つお願いします。', en: 'One beer, please.', roman: 'bīru o hitotsu onegaishimasu.', correct: true, feedback: 'Drinks are counted with つ when ordering.' },
            { t: 'ビールを一人お願いします。', en: 'One person of beer, please.', roman: 'bīru o hitori onegaishimasu.', correct: false, feedback: '一人 counts people. For drinks: 一つ.' },
          ],
        },
        {
          partner: { t: 'お味はいかがですか？', en: 'How is the food?', roman: 'o-aji wa ikaga desu ka?' },
          goal: 'Say it’s delicious.',
          replies: [
            { t: 'とてもおいしいです！', en: 'It’s very tasty!', roman: 'totemo oishii desu!', correct: true, feedback: 'The cook will be pleased.' },
            { t: 'とても高いです。', en: 'It’s very expensive.', roman: 'totemo takai desu.', correct: false, feedback: '高い means expensive (or tall). Delicious is おいしい.' },
          ],
        },
        {
          partner: { t: 'ほかに何かいかがですか？', en: 'Would you like anything else?', roman: 'hoka ni nanika ikaga desu ka?' },
          goal: 'Ask for the bill.',
          replies: [
            { t: 'お会計をお願いします。', en: 'The bill, please.', roman: 'o-kaikei o onegaishimasu.', correct: true, feedback: 'お会計 is the bill.' },
            { t: 'ごちそうさまでした。お会計をお願いします。', en: 'Thank you for the meal. The bill, please.', roman: 'gochisōsama deshita. o-kaikei o onegaishimasu.', correct: true, feedback: 'ごちそうさまでした thanks the staff for the meal.' },
            { t: 'お水をください。', en: 'Water, please.', roman: 'o-mizu o kudasai.', correct: false, feedback: 'That asks for water. The bill is お会計.' },
          ],
        },
      ],
    },
    {
      id: 'wifi',
      title: 'Ask for the Wi-Fi',
      emoji: '📶',
      scenario: 'You’ve checked into a hotel and need to get online.',
      afterUnit: 'u2',
      reasons: ['travel', 'work'],
      turns: [
        {
          partner: { t: 'いらっしゃいませ。', en: 'Welcome.', roman: 'irasshaimase.' },
          goal: 'Ask if there’s Wi-Fi.',
          replies: [
            { t: 'ワイファイはありますか？', en: 'Is there Wi-Fi?', roman: 'waifai wa arimasu ka?', correct: true, feedback: 'ありますか asks whether something is available.' },
            { t: 'ワイファイはいますか？', en: 'Is Wi-Fi here (as a person)?', roman: 'waifai wa imasu ka?', correct: false, feedback: 'います is for people and animals. For things, use あります.' },
          ],
        },
        {
          partner: { t: 'はい、ございます。', en: 'Yes, we have it.', roman: 'hai, gozaimasu.' },
          goal: 'Ask for the password.',
          replies: [
            { t: 'パスワードは何ですか？', en: 'What’s the password?', roman: 'pasuwādo wa nan desu ka?', correct: true, feedback: '何 (nan) means “what”.' },
            { t: 'パスワードはいつですか？', en: 'When is the password?', roman: 'pasuwādo wa itsu desu ka?', correct: false, feedback: 'いつ means “when”. Ask: パスワードは何ですか？' },
          ],
        },
        {
          partner: { t: 'こちらのカードに書いてあります。', en: 'It’s written on this card.', roman: 'kochira no kādo ni kaite arimasu.' },
          goal: 'Thank them.',
          replies: [
            { t: 'ありがとうございます。', en: 'Thank you.', roman: 'arigatō gozaimasu.', correct: true, feedback: 'Polite and warm.' },
            { t: 'ごめんなさい。', en: 'I’m sorry.', roman: 'gomen nasai.', correct: false, feedback: 'That’s an apology. To thank: ありがとうございます。' },
          ],
        },
      ],
    },
  ],
};
