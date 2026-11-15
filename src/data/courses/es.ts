import type { Course } from '../../types';

/** Spanish for English speakers. All content is original. */
export const spanish: Course = {
  id: 'es',
  name: 'Spanish',
  badge: 'ES',
  color: '#e5603e',
  tagline: 'Greetings, food, family and travel basics',
  lang: 'es-ES',
  hello: '¡Hola!',
  congrats: '¡Felicidades!',
  praise: ['¡Excelente!', '¡Muy bien!'],
  typePlaceholder: 'Escribe en español',
  specialChars: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
  typeInTarget: true,
  units: [
    {
      id: 'u1',
      title: 'First words',
      description: 'Greet people and introduce yourself',
      color: '#5b5bd6',
      lessons: [
        {
          id: 'u1l1',
          title: 'Hello!',
          words: [
            { t: 'hola', en: 'hello', emoji: '👋' },
            { t: 'adiós', en: 'goodbye', emoji: '🚶' },
            { t: 'gracias', en: 'thank you', emoji: '🙏' },
            { t: 'por favor', en: 'please', emoji: '🤲' },
            { t: 'sí', en: 'yes', emoji: '✅' },
            { t: 'buenos días', en: 'good morning', emoji: '🌤️' },
          ],
          sentences: [
            { t: 'Hola, gracias.', en: '(Hello|Hi), (thank you|thanks).' },
            { t: 'Sí, por favor.', en: 'Yes, please.' },
            { t: 'No, gracias.', en: 'No, (thank you|thanks).' },
            { t: 'Buenos días y adiós.', en: 'Good morning and (goodbye|bye).' },
          ],
        },
        {
          id: 'u1l2',
          title: 'People',
          words: [
            { t: 'hombre', en: 'man', emoji: '👨' },
            { t: 'mujer', en: 'woman', emoji: '👩' },
            { t: 'niño', en: 'boy', emoji: '👦' },
            { t: 'niña', en: 'girl', emoji: '👧' },
            { t: 'yo', en: 'I', emoji: '🙋' },
          ],
          sentences: [
            { t: '[Yo ]soy un hombre.', en: "I( am|'m) a man." },
            { t: 'Ella es una mujer.', en: "She( is|'s) a woman." },
            { t: 'El niño y la niña.', en: 'The boy and the girl.' },
            { t: '[Yo ]soy una niña.', en: "I( am|'m) a girl." },
          ],
        },
        {
          id: 'u1l3',
          title: 'Nice to meet you',
          words: [
            { t: 'nombre', en: 'name', emoji: '📛' },
            { t: 'amigo', en: 'friend', emoji: '🤝' },
            { t: 'bien', en: 'well', emoji: '👍' },
            { t: 'mal', en: 'bad', emoji: '👎' },
            { t: 'y', en: 'and', emoji: '➕' },
          ],
          sentences: [
            { t: '[Yo ]me llamo Ana.', en: ["My name( is|'s) Ana.", "I( am|'m) called Ana."] },
            { t: '[Yo ]estoy bien, gracias.', en: "I( am|'m) (well|fine|good), (thank you|thanks)." },
            { t: 'Él es mi amigo.', en: "He( is|'s) my friend." },
            { t: '¿Cómo te llamas?', en: "What( is|'s) your name?" },
          ],
        },
      ],
    },
    {
      id: 'u2',
      title: 'Food & drink',
      description: 'Order snacks and talk about meals',
      color: '#e5603e',
      lessons: [
        {
          id: 'u2l1',
          title: 'Breakfast',
          words: [
            { t: 'agua', en: 'water', emoji: '💧' },
            { t: 'pan', en: 'bread', emoji: '🍞' },
            { t: 'manzana', en: 'apple', emoji: '🍎' },
            { t: 'leche', en: 'milk', emoji: '🥛' },
            { t: 'café', en: 'coffee', emoji: '☕' },
          ],
          sentences: [
            { t: '[Yo ]bebo agua.', en: ['I drink water.', "I('m| am) drinking water."] },
            { t: '[Yo ]como pan.', en: ['I eat bread.', "I('m| am) eating bread."] },
            { t: 'Una manzana y un café.', en: '(An|One) apple and (a|one) coffee.' },
            { t: 'Leche, por favor.', en: 'Milk, please.' },
          ],
        },
        {
          id: 'u2l2',
          title: 'Meals',
          words: [
            { t: 'comida', en: 'food', emoji: '🍽️' },
            { t: 'arroz', en: 'rice', emoji: '🍚' },
            { t: 'queso', en: 'cheese', emoji: '🧀' },
            { t: 'huevo', en: 'egg', emoji: '🥚' },
            { t: 'naranja', en: 'orange', emoji: '🍊' },
          ],
          sentences: [
            { t: 'Ella come arroz.', en: ['She eats rice.', "She('s| is) eating rice."] },
            { t: 'El queso es bueno.', en: "The cheese( is|'s) good." },
            { t: '[Yo ]como un huevo.', en: ['I eat an egg.', "I('m| am) eating an egg."] },
            { t: 'Me gusta la comida.', en: 'I like [the ]food.' },
          ],
        },
        {
          id: 'u2l3',
          title: 'At the café',
          words: [
            { t: 'té', en: 'tea', emoji: '🍵' },
            { t: 'jugo', en: 'juice', emoji: '🧃' },
            { t: 'sopa', en: 'soup', emoji: '🥣' },
            { t: 'pollo', en: 'chicken', emoji: '🍗' },
            { t: 'pescado', en: 'fish', emoji: '🐟' },
          ],
          sentences: [
            { t: '[Yo ]quiero un té, por favor.', en: "(I want|I would like|I'd like) [a ]tea, please." },
            { t: 'El pollo y el pescado.', en: '[The ]chicken and [the ]fish.' },
            { t: 'La sopa es buena.', en: "The soup( is|'s) good." },
            { t: 'Él bebe jugo.', en: ['He drinks juice.', "He('s| is) drinking juice."] },
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
            { t: 'madre', en: 'mother', emoji: '👩‍👧' },
            { t: 'padre', en: 'father', emoji: '👨‍👦' },
            { t: 'hermano', en: 'brother', emoji: '👦' },
            { t: 'hermana', en: 'sister', emoji: '👧' },
            { t: 'familia', en: 'family', emoji: '👨‍👩‍👧' },
          ],
          sentences: [
            { t: 'Mi madre y mi padre.', en: 'My (mother|mom|mum) and my (father|dad).' },
            { t: '[Yo ]tengo un hermano.', en: ['I have a brother.', "I('ve| have) got a brother."] },
            { t: 'Ella es mi hermana.', en: "She( is|'s) my sister." },
            { t: 'Mi familia es grande.', en: "My family( is|'s) (big|large)." },
          ],
        },
        {
          id: 'u3l2',
          title: 'Home',
          words: [
            { t: 'casa', en: 'house', emoji: '🏠' },
            { t: 'perro', en: 'dog', emoji: '🐶' },
            { t: 'gato', en: 'cat', emoji: '🐱' },
            { t: 'cama', en: 'bed', emoji: '🛏️' },
            { t: 'libro', en: 'book', emoji: '📖' },
          ],
          sentences: [
            { t: 'El perro y el gato.', en: 'The dog and the cat.' },
            { t: 'Mi casa es pequeña.', en: "My (house|home)( is|'s) (small|little)." },
            { t: 'El gato está en la cama.', en: "The cat( is|'s) (in|on) the bed." },
            { t: '[Yo ]leo un libro.', en: ['I read a book.', "I('m| am) reading a book."] },
          ],
        },
        {
          id: 'u3l3',
          title: 'Describing things',
          words: [
            { t: 'grande', en: 'big', emoji: '🐘' },
            { t: 'pequeño', en: 'small', emoji: '🐭' },
            { t: 'rojo', en: 'red', emoji: '🔴' },
            { t: 'azul', en: 'blue', emoji: '🔵' },
            { t: 'nuevo', en: 'new', emoji: '✨' },
          ],
          sentences: [
            { t: 'El perro es grande.', en: "The dog( is|'s) (big|large)." },
            { t: 'La casa es azul.', en: "The (house|home)( is|'s) blue." },
            { t: '[Yo ]tengo un gato pequeño.', en: 'I have a (small|little) cat.' },
            { t: 'Mi libro es nuevo.', en: "My book( is|'s) new." },
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
            { t: 'tren', en: 'train', emoji: '🚆' },
            { t: 'avión', en: 'plane', emoji: '✈️' },
            { t: 'playa', en: 'beach', emoji: '🏖️' },
            { t: 'hotel', en: 'hotel', emoji: '🏨' },
            { t: 'ciudad', en: 'city', emoji: '🏙️' },
          ],
          sentences: [
            { t: '¿Dónde está el hotel?', en: "Where( is|'s) the hotel?" },
            { t: 'El tren es rápido.', en: "The train( is|'s) (fast|quick)." },
            { t: '[Yo ]voy a la playa.', en: "(I'm going|I am going|I go) to the beach." },
            { t: 'La ciudad es bonita.', en: "The city( is|'s) (pretty|beautiful|nice|lovely)." },
          ],
        },
        {
          id: 'u4l2',
          title: 'Directions',
          words: [
            { t: 'izquierda', en: 'left', emoji: '⬅️' },
            { t: 'derecha', en: 'right', emoji: '➡️' },
            { t: 'calle', en: 'street', emoji: '🛣️' },
            { t: 'mapa', en: 'map', emoji: '🗺️' },
            { t: 'cerca', en: 'near', emoji: '📍' },
          ],
          sentences: [
            { t: 'El hotel está cerca.', en: "The hotel( is|'s) (near|close|nearby)." },
            { t: 'Gira a la derecha.', en: 'Turn [to the ]right.' },
            { t: '[Yo ]necesito un mapa.', en: 'I need a map.' },
            { t: 'La calle está a la izquierda.', en: "The street( is|'s) (on|to) the left." },
          ],
        },
        {
          id: 'u4l3',
          title: 'Time',
          words: [
            { t: 'hoy', en: 'today', emoji: '📅' },
            { t: 'mañana', en: 'tomorrow', emoji: '🌅' },
            { t: 'noche', en: 'night', emoji: '🌙' },
            { t: 'día', en: 'day', emoji: '☀️' },
            { t: 'hora', en: 'hour', emoji: '⏰' },
          ],
          sentences: [
            {
              t: 'Hoy voy a la ciudad.',
              en: [
                "Today (I'm going|I am going|I go) to the city.",
                "(I'm going|I am going|I go) to the city today.",
              ],
            },
            { t: 'Buenas noches.', en: 'Good (night|evening).' },
            { t: 'Hasta mañana.', en: '(See you|Until) tomorrow.' },
            { t: '¿Qué hora es?', en: 'What time is it?' },
          ],
        },
      ],
    },
  ],
};
