export const RECIPES = [

  // ── Breakfast ─────────────────────────────────────────────────────────────

  {
    id: '1', name: 'Akara', category: 'breakfast',
    ingredients: [
      '1 cup black-eyed peas', '1 onion, finely chopped',
      '1–2 fresh peppers, finely chopped', 'Salt to taste', 'Vegetable oil for frying',
    ],
    instructions: [
      'Soak black-eyed peas in water for 2 hours, then peel off the skins.',
      'Blend soaked peas, onions, and peppers until smooth and fluffy.',
      'Add salt to the batter and whisk vigorously to incorporate air.',
      'Heat oil in a deep pan to 180 °C. Drop spoonfuls of batter and fry for 3–4 minutes until golden brown.',
      'Drain on paper towels and serve hot.',
    ],
    pic: '/images/recipe1.jpeg', prep: '2 hrs (inc. soaking)', cook: '20 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '2', name: 'Yam and Egg Sauce', category: 'breakfast',
    ingredients: [
      '1 medium yam, peeled and sliced', '3 eggs', '1 onion, chopped',
      '2 tomatoes, diced', '2 tbsp vegetable oil', 'Salt and pepper to taste',
    ],
    instructions: [
      'Boil yam slices in salted water for 15–20 minutes until tender, or fry until golden.',
      'In a pan, heat oil and sauté onions until translucent.',
      'Add diced tomatoes and cook for 5 minutes until softened.',
      'Beat eggs and pour over the tomato mixture. Stir until just cooked through.',
      'Season with salt and pepper. Serve immediately over yam.',
    ],
    pic: '/images/recipe2.jpeg', prep: '10 min', cook: '25 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '3', name: 'Moi Moi', category: 'breakfast',
    ingredients: [
      '2 cups peeled brown beans', '2–3 fresh peppers', '1 onion',
      '3 boiled eggs, halved', '3 tbsp vegetable oil', 'Salt and spices to taste',
    ],
    instructions: [
      'Soak beans overnight, then peel and rinse thoroughly.',
      'Blend beans, peppers, and onion with a little water until very smooth.',
      'Stir in vegetable oil, salt, and spices.',
      'Pour batter into greased containers or leaves, add boiled egg halves.',
      'Steam over medium heat for 45–50 minutes until firm. Test with a skewer.',
    ],
    pic: '/images/recipe3.jpeg', prep: '20 min', cook: '50 min', servings: '6',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '4', name: 'Plantain Porridge', category: 'breakfast',
    ingredients: [
      '3 ripe plantains, diced', '1 cup spinach, chopped', '1 onion, chopped',
      '2 tomatoes, diced', '2 tbsp palm oil', '200g stockfish or smoked fish',
      'Salt and pepper to taste',
    ],
    instructions: [
      'Soak and boil stockfish for 20 minutes until tender. Flake and set aside.',
      'In a pot, heat palm oil and sauté onions and tomatoes for 5 minutes.',
      'Add diced plantains, fish, and enough water to cover. Season well.',
      'Simmer for 15 minutes until plantains are soft and the stew thickens.',
      'Stir in spinach and cook for 2 more minutes. Serve hot.',
    ],
    pic: '/images/recipe4.jpeg', prep: '15 min', cook: '35 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '5', name: 'Pap (Ogi)', category: 'breakfast',
    ingredients: [
      '1 cup corn flour', '3 cups water', 'Sugar or honey to taste', 'Milk (optional)',
    ],
    instructions: [
      'Mix corn flour with a little cold water to form a smooth lump-free paste.',
      'Bring the remaining water to a rolling boil in a pot.',
      'Slowly pour the corn paste into the boiling water, stirring constantly.',
      'Reduce heat and continue stirring for 5–8 minutes until thick and cooked.',
      'Serve hot, sweetened with sugar or honey. Add milk if desired.',
    ],
    pic: '/images/recipe5.jpeg', prep: '5 min', cook: '10 min', servings: '2',
    favourite: false, rating: 0, cookCount: 0,
  },

  // ── Lunch ──────────────────────────────────────────────────────────────────

  {
    id: '6', name: 'Jollof Rice', category: 'lunch',
    ingredients: [
      '2 cups long-grain parboiled rice', '4 tomatoes, blended', '2 red bell peppers, blended',
      '2 scotch bonnet peppers', '1 large onion, chopped', '500g chicken pieces',
      '3 tbsp vegetable oil', '2 stock cubes', 'Salt to taste',
    ],
    instructions: [
      'Season chicken with spices and stock cubes. Grill or fry until golden and set aside.',
      'In a pot, heat oil and fry onions until golden. Add blended tomatoes and peppers.',
      'Cook the tomato base on medium heat for 20 minutes, stirring occasionally, until the oil rises to the top.',
      'Add chicken stock, washed rice, and chicken pieces. Stir well.',
      'Cover tightly and cook on very low heat for 30 minutes until rice is done. Stir halfway.',
    ],
    pic: '/images/recipe6.jpeg', prep: '20 min', cook: '1 hr', servings: '6',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '7', name: 'Efo Riro', category: 'lunch',
    ingredients: [
      '500g spinach or kale, chopped', '2 tomatoes, blended', '2 onions',
      '4 tbsp red palm oil', '300g assorted meat or fish', '2 scotch bonnet peppers',
      '1 stock cube', 'Salt to taste',
    ],
    instructions: [
      'Cook assorted meats with onion, seasoning, and salt until tender. Set aside.',
      'In a pot, heat palm oil and fry half the sliced onion until golden.',
      'Add blended tomatoes and peppers. Fry for 15 minutes until the sauce is dry and oily.',
      'Add cooked meat, stock, and stock cube. Simmer for 5 minutes.',
      'Stir in chopped greens and cook for 3–5 minutes until just wilted. Serve with eba or rice.',
    ],
    pic: '/images/recipe7.jpg', prep: '15 min', cook: '40 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '8', name: 'Fried Rice', category: 'lunch',
    ingredients: [
      '2 cups parboiled rice', '1 cup mixed vegetables (carrots, peas, corn)',
      '200g chicken or shrimp', '2 eggs', '2 tbsp soy sauce',
      '2 tbsp vegetable oil', 'Salt and pepper to taste',
    ],
    instructions: [
      'Boil rice until just cooked but firm. Spread on a tray and let cool.',
      'In a wok or large pan, heat oil on high heat. Scramble eggs and set aside.',
      'Stir-fry mixed vegetables and protein for 3–4 minutes on high heat.',
      'Add cooled rice and toss everything together vigorously.',
      'Pour in soy sauce, add eggs back, season, and stir-fry for 2 more minutes.',
    ],
    pic: '/images/recipe8.jpg', prep: '15 min', cook: '25 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '9', name: 'Ofada Rice and Ayamase', category: 'lunch',
    ingredients: [
      '2 cups Ofada rice', '300g assorted meats (beef, tripe, liver)',
      '6 green bell peppers', '3 scotch bonnet peppers', '1 onion',
      '4 tbsp palm oil', '2 stock cubes', 'Salt to taste',
    ],
    instructions: [
      'Cook Ofada rice in plenty of water until done. Drain and set aside.',
      'Season and grill or pan-fry assorted meats until cooked through.',
      'Blend green peppers and scotch bonnet — do not add water.',
      'Heat palm oil until bleached (smoke point). Cool slightly, then fry onions.',
      'Add blended pepper and cook for 25 minutes. Add meats and seasoning. Simmer 10 minutes.',
    ],
    pic: '/images/recipe10.jpeg', prep: '20 min', cook: '1 hr 10 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '10', name: 'Egusi Soup', category: 'lunch',
    ingredients: [
      '1 cup ground egusi (melon seeds)', '200g leafy greens (ugu or spinach)',
      '2 tomatoes, blended', '1 onion, chopped', '300g beef or fish',
      '3 tbsp palm oil', '2 stock cubes', 'Pepper to taste',
    ],
    instructions: [
      'Cook beef with onion, seasoning, and salt. Reserve the stock.',
      'Mix ground egusi with a little water to form a thick paste.',
      'Heat palm oil in a pot. Fry onions, then add blended tomatoes and peppers. Cook 10 minutes.',
      'Drop spoonfuls of egusi paste into the sauce. Do not stir for 5 minutes, then mix in.',
      'Add meat, stock, and seasoning. Simmer 10 minutes. Stir in greens and cook 3 minutes.',
    ],
    pic: '/images/recipe9.jpeg', prep: '15 min', cook: '45 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  // ── Dinner ────────────────────────────────────────────────────────────────

  {
    id: '11', name: 'Eba and Okra Soup', category: 'dinner',
    ingredients: [
      '2 cups garri (cassava flour)', '300g okra, sliced or grated',
      '200g assorted meat or fish', '3 tbsp palm oil', '1 onion, chopped',
      '2 tomatoes, diced', '2 stock cubes', 'Pepper to taste',
    ],
    instructions: [
      'Cook assorted meat with onion and seasoning until tender.',
      'Bring 2 cups of water to a boil in a separate pot for the eba.',
      'In another pot, heat palm oil and sauté onions and tomatoes for 5 minutes.',
      'Add sliced okra, meat, and seasoning. Cook for 5–8 minutes until okra is sticky and tender.',
      'Pour boiling water over garri gradually, stirring vigorously until smooth and stretchy. Serve together.',
    ],
    pic: '/images/recipe11.jpeg', prep: '15 min', cook: '30 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '12', name: 'Catfish Pepper Soup', category: 'dinner',
    ingredients: [
      '1 whole catfish, cleaned and cut', '1 handful uziza leaves',
      '2 seeds uda (negro pepper)', '1 onion, chopped', '1 tbsp pepper soup spice',
      '1 tbsp ground crayfish', '2 stock cubes', 'Salt to taste',
    ],
    instructions: [
      'Clean catfish thoroughly with lemon or alum to remove slime.',
      'Bring water to a boil. Add onions, uda seeds, and pepper soup spice.',
      'Add catfish pieces, crayfish, and stock cubes. Simmer on medium heat for 15 minutes.',
      'Taste and adjust seasoning. Add uziza leaves and cook for 3 more minutes.',
      'Serve hot as a soup or as a starter.',
    ],
    pic: '/images/recipe12.jpeg', prep: '15 min', cook: '25 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '13', name: 'Vegetable Rice', category: 'dinner',
    ingredients: [
      '2 cups long-grain rice', '1 cup mixed vegetables (carrots, peas, corn)',
      '1 onion, chopped', '2 tbsp vegetable oil', '2 cups vegetable broth',
      'Salt and pepper to taste',
    ],
    instructions: [
      'Rinse rice until water runs clear. Set aside.',
      'In a pot, sauté onions in oil until soft. Add mixed vegetables and cook 3 minutes.',
      'Add rice and stir to coat in the oil.',
      'Pour in vegetable broth, season with salt and pepper. Bring to a boil.',
      'Reduce heat, cover tightly, and cook for 18–20 minutes until rice absorbs all liquid.',
    ],
    pic: '/images/recipe13.jpg', prep: '10 min', cook: '30 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '14', name: 'Ogbono Soup', category: 'dinner',
    ingredients: [
      '1 cup ground ogbono seeds', '300g assorted meats (beef, tripe, liver)',
      '200g ugu leaves (fluted pumpkin)', '3 tbsp palm oil', '1 onion, chopped',
      '100g stockfish or dried fish', '2 stock cubes', 'Pepper to taste',
    ],
    instructions: [
      'Cook assorted meats and stockfish with onion and seasoning until tender. Reserve stock.',
      'In a pot, heat palm oil until melted. Add ground ogbono directly — do not fry.',
      'Stir ogbono into the oil constantly until it draws (becomes stretchy), about 5 minutes.',
      'Add meat stock gradually, stirring to avoid lumps. Add cooked meats and stock cubes.',
      'Simmer for 10 minutes, then stir in ugu leaves. Cook 3 more minutes and serve.',
    ],
    pic: '/images/recipe14.jpg', prep: '15 min', cook: '40 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '15', name: 'Fried Yam and Sauce', category: 'dinner',
    ingredients: [
      '1 medium yam, peeled and sliced', '3 tomatoes, blended', '1 onion, chopped',
      '3 tbsp red palm oil', '200g beef or fish', '2 stock cubes', 'Pepper to taste',
    ],
    instructions: [
      'Parboil yam slices in salted water for 10 minutes until partially cooked.',
      'Deep fry yam in hot vegetable oil until golden and crisp on the outside.',
      'In a pot, heat palm oil and sauté onions until soft.',
      'Add blended tomatoes, cooked beef or fish, and seasoning. Simmer 15 minutes.',
      'Serve fried yam alongside the sauce.',
    ],
    pic: '/images/recipe15.jpeg', prep: '15 min', cook: '35 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  // ── Snacks ────────────────────────────────────────────────────────────────

  {
    id: '16', name: 'Suya (Chinchinga)', category: 'snacks',
    ingredients: [
      '500g beef sirloin, thinly sliced', '3 tbsp suya spice mix (yaji)',
      '1 tbsp groundnut oil', '1 onion, sliced into rings',
      '2 tomatoes, sliced', 'Salt to taste',
    ],
    instructions: [
      'Slice beef very thinly across the grain. Thread onto skewers.',
      'Mix suya spice with groundnut oil and rub generously over the beef.',
      'Leave to marinate for at least 30 minutes (or overnight in the fridge).',
      'Grill over hot coals or on a griddle pan, turning every 3–4 minutes, for 12–15 minutes total.',
      'Serve hot with sliced onions and tomatoes. Dust with extra suya spice.',
    ],
    pic: '/images/recipe16.jpeg', prep: '35 min', cook: '15 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '17', name: 'Puff Puff', category: 'snacks',
    ingredients: [
      '2 cups all-purpose flour', '1 tsp instant yeast', '3 tbsp sugar',
      '1 cup warm water', 'Vegetable oil for deep frying', '¼ tsp salt', 'Pinch of nutmeg',
    ],
    instructions: [
      'Dissolve yeast and sugar in warm water. Rest for 5 minutes until frothy.',
      'Combine flour, salt, and nutmeg in a bowl. Add yeast mixture and mix into a sticky batter.',
      'Cover and rest in a warm place for 1 hour until batter has doubled.',
      'Heat oil to 175 °C. Use wet hands or a spoon to drop balls of batter into the oil.',
      'Fry for 3–4 minutes, turning once, until evenly golden. Drain on paper towels.',
    ],
    pic: '/images/recipe17.jpeg', prep: '1 hr 10 min', cook: '20 min', servings: '6',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '18', name: 'Akara Burger', category: 'snacks',
    ingredients: [
      '4 large akara cakes (see Akara recipe)', '4 burger buns',
      '4 lettuce leaves', '2 tomatoes, sliced', '2 tbsp mayonnaise', '1 tbsp ketchup',
    ],
    instructions: [
      'Prepare akara according to the Akara recipe. Make them slightly flat for burger shape.',
      'Slice buns and lightly toast the cut sides on a dry pan.',
      'Spread mayonnaise on the bottom bun and ketchup on the top bun.',
      'Layer lettuce, akara, and sliced tomatoes.',
      'Close and serve immediately while akara is still warm and crispy.',
    ],
    pic: '/images/recipe18.jpeg', prep: '10 min', cook: '5 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '19', name: 'Samosa', category: 'snacks',
    ingredients: [
      '2 large potatoes, boiled and diced', '½ cup peas', '200g minced beef or chicken',
      '1 onion, finely chopped', '12 samosa wrappers', 'Vegetable oil for frying',
      '1 tsp curry powder', 'Salt and pepper to taste',
    ],
    instructions: [
      'Fry onions and minced meat in a little oil until cooked. Add potatoes, peas, and curry powder.',
      'Season with salt and pepper. Stir well and let the filling cool completely.',
      'Place a spoonful of filling on each wrapper and fold into a triangle, sealing edges with water.',
      'Deep fry samosas in hot oil at 170 °C for 4–5 minutes until golden and crisp.',
      'Drain and serve hot with chilli sauce or chutney.',
    ],
    pic: '/images/recipe19.jpeg', prep: '30 min', cook: '20 min', servings: '6',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '20', name: 'Chin-Chin', category: 'snacks',
    ingredients: [
      '4 cups all-purpose flour', '½ cup sugar', '4 tbsp butter, melted',
      '½ cup milk', '¼ tsp nutmeg', 'Vegetable oil for frying', 'Pinch of salt',
    ],
    instructions: [
      'Combine flour, sugar, nutmeg, and salt in a large bowl.',
      'Add melted butter and milk. Mix into a firm, smooth dough — add a little more flour if sticky.',
      'Roll dough out thinly (about 3mm). Cut into small strips or desired shapes.',
      'Heat oil to 160 °C. Fry chin-chin in batches for 5–7 minutes, stirring occasionally, until golden.',
      'Drain thoroughly on paper towels. Cool completely before storing in an airtight container.',
    ],
    pic: '/images/recipe20.jpg', prep: '20 min', cook: '30 min', servings: '8',
    favourite: false, rating: 0, cookCount: 0,
  },

  // ── Dessert ───────────────────────────────────────────────────────────────

  // NOTE: Chin-Chin dessert duplicate removed. Replaced with Buns.
  {
    id: '21', name: 'Nigerian Buns', category: 'dessert',
    ingredients: [
      '2 cups all-purpose flour', '½ cup sugar', '1 tsp baking powder',
      '2 eggs', '3 tbsp butter, melted', '¼ cup milk', 'Nutmeg to taste',
      'Vegetable oil for frying',
    ],
    instructions: [
      'Whisk eggs and sugar together until pale and creamy.',
      'Add melted butter and milk. Mix well.',
      'Fold in flour, baking powder, and nutmeg to form a thick, scoopable batter.',
      'Heat oil to 165 °C. Drop heaped spoonfuls into oil — they should form round balls.',
      'Fry for 5–6 minutes, turning once, until deep golden. They should be cooked through with no raw centre.',
    ],
    pic: '/images/recipe17.jpeg', prep: '10 min', cook: '20 min', servings: '6',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '22', name: 'Coconut Rice Pudding', category: 'dessert',
    ingredients: [
      '1 cup white rice', '400ml coconut milk', '2 tbsp sugar',
      '½ tsp vanilla extract', '½ tsp cinnamon', 'Shredded coconut for garnish',
    ],
    instructions: [
      'Rinse rice and combine with coconut milk and 200ml water in a pot.',
      'Bring to a boil, then reduce heat to very low. Cover and cook for 20 minutes.',
      'Stir in sugar and vanilla extract. The pudding should be thick and creamy.',
      'Serve warm or chilled, garnished with shredded coconut and a dusting of cinnamon.',
    ],
    pic: '/images/recipe22.jpg', prep: '5 min', cook: '25 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '23', name: 'Plantain Mosa', category: 'dessert',
    ingredients: [
      '3 very ripe plantains', '½ cup all-purpose flour', '2 tbsp sugar',
      '¼ tsp nutmeg', 'Vegetable oil for frying',
    ],
    instructions: [
      'Mash ripe plantains thoroughly in a bowl until completely smooth.',
      'Add flour, sugar, and nutmeg. Mix into a thick, dropping batter.',
      'Heat oil to 170 °C. Drop rounded spoonfuls into the oil.',
      'Fry for 3–4 minutes each side until deep golden brown.',
      'Drain well and serve warm. Best eaten the same day.',
    ],
    pic: '/images/recipe23.jpg', prep: '10 min', cook: '15 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '24', name: 'Banana Fritters', category: 'dessert',
    ingredients: [
      '3 ripe bananas', '¾ cup all-purpose flour', '2 tbsp sugar',
      '½ tsp cinnamon', '1 egg', 'Vegetable oil for frying',
    ],
    instructions: [
      'Slice bananas into 1cm rounds.',
      'Mix flour, sugar, cinnamon, and egg with just enough water to make a smooth batter.',
      'Dip banana slices into the batter, letting excess drip off.',
      'Fry in hot oil at 175 °C for 2–3 minutes per side until golden.',
      'Drain and dust with cinnamon sugar. Serve warm with ice cream or honey.',
    ],
    pic: '/images/recipe24.jpg', prep: '10 min', cook: '15 min', servings: '4',
    favourite: false, rating: 0, cookCount: 0,
  },

  {
    id: '25', name: 'Fruit Salad', category: 'dessert',
    ingredients: [
      '1 apple, diced', '2 bananas, sliced', '1 mango, diced',
      '1 cup pineapple chunks', '2 tbsp honey', '1 tbsp lemon juice',
      'Fresh mint leaves for garnish',
    ],
    instructions: [
      'Wash and peel all fruits. Cut into similar bite-sized pieces.',
      'Combine all fruit in a large bowl.',
      'Drizzle with honey and lemon juice. Toss gently to coat.',
      'Refrigerate for 15 minutes before serving so the flavours meld.',
      'Garnish with fresh mint leaves and serve cold.',
    ],
    pic: '/images/recipe25.jpeg', prep: '15 min', cook: '0 min', servings: '6',
    favourite: false, rating: 0, cookCount: 0,
  },
];