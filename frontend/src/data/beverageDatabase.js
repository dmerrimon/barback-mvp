// Comprehensive beverage database for Barback
export const beverageDatabase = {
  // Beer Categories
  beer: {
    lagers: [
      { name: "Budweiser", brand: "Anheuser-Busch", abv: 5.0, type: "American Lager", origin: "USA" },
      { name: "Corona Extra", brand: "Grupo Modelo", abv: 4.5, type: "Mexican Lager", origin: "Mexico" },
      { name: "Heineken", brand: "Heineken", abv: 5.0, type: "European Lager", origin: "Netherlands" },
      { name: "Stella Artois", brand: "Stella Artois", abv: 5.2, type: "Belgian Lager", origin: "Belgium" },
      { name: "Modelo Especial", brand: "Grupo Modelo", abv: 4.4, type: "Mexican Lager", origin: "Mexico" },
      { name: "Pacifico", brand: "Grupo Modelo", abv: 4.4, type: "Mexican Lager", origin: "Mexico" },
      { name: "Dos Equis", brand: "Heineken", abv: 4.2, type: "Mexican Lager", origin: "Mexico" },
      { name: "Tecate", brand: "Heineken", abv: 4.5, type: "Mexican Lager", origin: "Mexico" },
      { name: "Yuengling Traditional Lager", brand: "Yuengling", abv: 4.5, type: "American Lager", origin: "USA" },
      { name: "Sam Adams Boston Lager", brand: "Boston Beer Company", abv: 5.0, type: "Vienna Lager", origin: "USA" }
    ],
    ipas: [
      { name: "Dogfish Head 60 Minute IPA", brand: "Dogfish Head", abv: 6.0, type: "American IPA", origin: "USA" },
      { name: "Stone IPA", brand: "Stone Brewing", abv: 6.9, type: "American IPA", origin: "USA" },
      { name: "Lagunitas IPA", brand: "Lagunitas", abv: 6.2, type: "American IPA", origin: "USA" },
      { name: "Ballast Point Sculpin", brand: "Ballast Point", abv: 7.0, type: "American IPA", origin: "USA" },
      { name: "New Belgium Fat Tire", brand: "New Belgium", abv: 5.2, type: "Amber Ale", origin: "USA" },
      { name: "Sierra Nevada Pale Ale", brand: "Sierra Nevada", abv: 5.6, type: "American Pale Ale", origin: "USA" },
      { name: "Founders All Day IPA", brand: "Founders", abv: 4.7, type: "Session IPA", origin: "USA" },
      { name: "Bell's Two Hearted IPA", brand: "Bell's Brewery", abv: 7.0, type: "American IPA", origin: "USA" },
      { name: "Russian River Pliny the Elder", brand: "Russian River", abv: 8.0, type: "Double IPA", origin: "USA" },
      { name: "Deschutes Fresh Squeezed IPA", brand: "Deschutes", abv: 6.4, type: "American IPA", origin: "USA" }
    ],
    stouts: [
      { name: "Guinness Draught", brand: "Guinness", abv: 4.2, type: "Irish Stout", origin: "Ireland" },
      { name: "Founders Breakfast Stout", brand: "Founders", abv: 8.3, type: "Imperial Stout", origin: "USA" },
      { name: "Bell's Kalamazoo Stout", brand: "Bell's Brewery", abv: 6.0, type: "American Stout", origin: "USA" },
      { name: "Samuel Smith's Imperial Stout", brand: "Samuel Smith's", abv: 7.0, type: "Imperial Stout", origin: "England" },
      { name: "Left Hand Milk Stout Nitro", brand: "Left Hand Brewing", abv: 6.0, type: "Milk Stout", origin: "USA" },
      { name: "Deschutes Obsidian Stout", brand: "Deschutes", abv: 6.4, type: "American Stout", origin: "USA" }
    ],
    wheat_beers: [
      { name: "Blue Moon Belgian White", brand: "Blue Moon", abv: 5.4, type: "Belgian Witbier", origin: "USA" },
      { name: "Shock Top Belgian White", brand: "Anheuser-Busch", abv: 5.2, type: "Belgian Witbier", origin: "USA" },
      { name: "Paulaner Hefe-Weizen", brand: "Paulaner", abv: 5.5, type: "German Hefeweizen", origin: "Germany" },
      { name: "Hoegaarden", brand: "Hoegaarden", abv: 4.9, type: "Belgian Witbier", origin: "Belgium" },
      { name: "Allagash White", brand: "Allagash", abv: 5.1, type: "Belgian Witbier", origin: "USA" }
    ]
  },

  // Wine Categories
  wine: {
    red_wines: [
      { name: "Caymus Cabernet Sauvignon", brand: "Caymus", vintage: 2021, region: "Napa Valley", grape: "Cabernet Sauvignon", origin: "USA" },
      { name: "Opus One", brand: "Opus One", vintage: 2019, region: "Napa Valley", grape: "Bordeaux Blend", origin: "USA" },
      { name: "Silver Oak Cabernet Sauvignon", brand: "Silver Oak", vintage: 2018, region: "Alexander Valley", grape: "Cabernet Sauvignon", origin: "USA" },
      { name: "Kendall-Jackson Vintner's Reserve Pinot Noir", brand: "Kendall-Jackson", vintage: 2021, region: "California", grape: "Pinot Noir", origin: "USA" },
      { name: "Jordan Cabernet Sauvignon", brand: "Jordan", vintage: 2019, region: "Alexander Valley", grape: "Cabernet Sauvignon", origin: "USA" },
      { name: "Antinori Chianti Classico", brand: "Antinori", vintage: 2020, region: "Tuscany", grape: "Sangiovese", origin: "Italy" },
      { name: "Cloudy Bay Pinot Noir", brand: "Cloudy Bay", vintage: 2021, region: "Marlborough", grape: "Pinot Noir", origin: "New Zealand" },
      { name: "Penfolds Grange", brand: "Penfolds", vintage: 2018, region: "South Australia", grape: "Shiraz", origin: "Australia" },
      { name: "Château Margaux", brand: "Château Margaux", vintage: 2016, region: "Margaux", grape: "Bordeaux Blend", origin: "France" },
      { name: "Domaine de la Romanée-Conti", brand: "DRC", vintage: 2019, region: "Burgundy", grape: "Pinot Noir", origin: "France" }
    ],
    white_wines: [
      { name: "Kendall-Jackson Vintner's Reserve Chardonnay", brand: "Kendall-Jackson", vintage: 2021, region: "California", grape: "Chardonnay", origin: "USA" },
      { name: "Cloudy Bay Sauvignon Blanc", brand: "Cloudy Bay", vintage: 2022, region: "Marlborough", grape: "Sauvignon Blanc", origin: "New Zealand" },
      { name: "Cakebread Chardonnay", brand: "Cakebread", vintage: 2021, region: "Napa Valley", grape: "Chardonnay", origin: "USA" },
      { name: "Far Niente Chardonnay", brand: "Far Niente", vintage: 2020, region: "Napa Valley", grape: "Chardonnay", origin: "USA" },
      { name: "Sancerre Henri Bourgeois", brand: "Henri Bourgeois", vintage: 2022, region: "Loire Valley", grape: "Sauvignon Blanc", origin: "France" },
      { name: "Chablis William Fèvre", brand: "William Fèvre", vintage: 2021, region: "Burgundy", grape: "Chardonnay", origin: "France" },
      { name: "Riesling Dr. Loosen", brand: "Dr. Loosen", vintage: 2022, region: "Mosel", grape: "Riesling", origin: "Germany" },
      { name: "Oyster Bay Sauvignon Blanc", brand: "Oyster Bay", vintage: 2022, region: "Marlborough", grape: "Sauvignon Blanc", origin: "New Zealand" },
      { name: "Santa Margherita Pinot Grigio", brand: "Santa Margherita", vintage: 2022, region: "Alto Adige", grape: "Pinot Grigio", origin: "Italy" },
      { name: "Château d'Yquem", brand: "Château d'Yquem", vintage: 2015, region: "Bordeaux", grape: "Sémillon/Sauvignon Blanc", origin: "France" }
    ],
    rosé_wines: [
      { name: "Whispering Angel", brand: "Château d'Esclans", vintage: 2022, region: "Provence", grape: "Grenache/Rolle", origin: "France" },
      { name: "Miraval Rosé", brand: "Miraval", vintage: 2022, region: "Provence", grape: "Grenache/Cinsault", origin: "France" },
      { name: "Château Minuty Rosé", brand: "Château Minuty", vintage: 2022, region: "Provence", grape: "Grenache/Syrah", origin: "France" },
      { name: "Domaines Ott Rosé", brand: "Domaines Ott", vintage: 2022, region: "Provence", grape: "Grenache/Cinsault", origin: "France" },
      { name: "AIX Rosé", brand: "AIX", vintage: 2022, region: "Provence", grape: "Syrah/Grenache", origin: "France" }
    ]
  },

  // Champagne & Sparkling
  champagne: {
    champagne: [
      { name: "Dom Pérignon", brand: "Dom Pérignon", vintage: 2012, region: "Champagne", type: "Vintage Champagne", origin: "France" },
      { name: "Krug Grande Cuvée", brand: "Krug", vintage: "NV", region: "Champagne", type: "Prestige Champagne", origin: "France" },
      { name: "Louis Roederer Cristal", brand: "Louis Roederer", vintage: 2013, region: "Champagne", type: "Prestige Champagne", origin: "France" },
      { name: "Veuve Clicquot Brut", brand: "Veuve Clicquot", vintage: "NV", region: "Champagne", type: "Non-Vintage Champagne", origin: "France" },
      { name: "Moët & Chandon Brut Impérial", brand: "Moët & Chandon", vintage: "NV", region: "Champagne", type: "Non-Vintage Champagne", origin: "France" },
      { name: "Perrier-Jouët Belle Epoque", brand: "Perrier-Jouët", vintage: 2014, region: "Champagne", type: "Vintage Champagne", origin: "France" },
      { name: "Bollinger Special Cuvée", brand: "Bollinger", vintage: "NV", region: "Champagne", type: "Non-Vintage Champagne", origin: "France" },
      { name: "Pol Roger Brut", brand: "Pol Roger", vintage: "NV", region: "Champagne", type: "Non-Vintage Champagne", origin: "France" },
      { name: "Taittinger Brut La Française", brand: "Taittinger", vintage: "NV", region: "Champagne", type: "Non-Vintage Champagne", origin: "France" },
      { name: "Laurent-Perrier Brut", brand: "Laurent-Perrier", vintage: "NV", region: "Champagne", type: "Non-Vintage Champagne", origin: "France" }
    ],
    sparkling: [
      { name: "Schramsberg Blanc de Blancs", brand: "Schramsberg", vintage: 2019, region: "Napa Valley", type: "Sparkling Wine", origin: "USA" },
      { name: "Roederer Estate Brut", brand: "Roederer Estate", vintage: "NV", region: "Anderson Valley", type: "Sparkling Wine", origin: "USA" },
      { name: "Prosecco di Valdobbiadene La Marca", brand: "La Marca", vintage: "NV", region: "Veneto", type: "Prosecco", origin: "Italy" },
      { name: "Mionetto Prosecco", brand: "Mionetto", vintage: "NV", region: "Veneto", type: "Prosecco", origin: "Italy" },
      { name: "Cava Freixenet Cordon Negro", brand: "Freixenet", vintage: "NV", region: "Catalonia", type: "Cava", origin: "Spain" },
      { name: "Mumm Napa Brut Prestige", brand: "Mumm Napa", vintage: "NV", region: "Napa Valley", type: "Sparkling Wine", origin: "USA" }
    ]
  },

  // Spirits - Whiskey
  spirits: {
    bourbon: [
      { name: "Maker's Mark", brand: "Maker's Mark", age: "NAS", proof: 90, origin: "Kentucky, USA", mash_bill: "Wheat" },
      { name: "Woodford Reserve", brand: "Woodford Reserve", age: "NAS", proof: 90.4, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" },
      { name: "Buffalo Trace", brand: "Buffalo Trace", age: "8-10 years", proof: 90, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" },
      { name: "Blanton's Original", brand: "Blanton's", age: "6-8 years", proof: 93, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" },
      { name: "Eagle Rare 10 Year", brand: "Eagle Rare", age: "10 years", proof: 90, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" },
      { name: "Pappy Van Winkle 15 Year", brand: "Pappy Van Winkle", age: "15 years", proof: 107, origin: "Kentucky, USA", mash_bill: "Wheat" },
      { name: "Four Roses Single Barrel", brand: "Four Roses", age: "7-9 years", proof: 100, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" },
      { name: "Knob Creek", brand: "Knob Creek", age: "9 years", proof: 100, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" },
      { name: "Elijah Craig Small Batch", brand: "Elijah Craig", age: "12 years", proof: 94, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" },
      { name: "Wild Turkey 101", brand: "Wild Turkey", age: "6-8 years", proof: 101, origin: "Kentucky, USA", mash_bill: "Corn/Rye/Wheat" }
    ],
    scotch: [
      { name: "Macallan 18", brand: "Macallan", age: "18 years", proof: 86, origin: "Scotland", region: "Speyside" },
      { name: "Lagavulin 16", brand: "Lagavulin", age: "16 years", proof: 86, origin: "Scotland", region: "Islay" },
      { name: "Glenfiddich 21", brand: "Glenfiddich", age: "21 years", proof: 80, origin: "Scotland", region: "Speyside" },
      { name: "Glenlivet 18", brand: "Glenlivet", age: "18 years", proof: 86, origin: "Scotland", region: "Speyside" },
      { name: "Ardbeg 10", brand: "Ardbeg", age: "10 years", proof: 92, origin: "Scotland", region: "Islay" },
      { name: "Balvenie 21 PortWood", brand: "Balvenie", age: "21 years", proof: 86, origin: "Scotland", region: "Speyside" },
      { name: "Highland Park 18", brand: "Highland Park", age: "18 years", proof: 86, origin: "Scotland", region: "Highlands" },
      { name: "Johnnie Walker Blue Label", brand: "Johnnie Walker", age: "NAS", proof: 80, origin: "Scotland", region: "Blend" },
      { name: "Oban 14", brand: "Oban", age: "14 years", proof: 86, origin: "Scotland", region: "Highlands" },
      { name: "Talisker 10", brand: "Talisker", age: "10 years", proof: 91.6, origin: "Scotland", region: "Island" }
    ],
    rye_whiskey: [
      { name: "Rittenhouse Rye", brand: "Rittenhouse", age: "4 years", proof: 100, origin: "Kentucky, USA", mash_bill: "51% Rye" },
      { name: "Bulleit Rye", brand: "Bulleit", age: "4-7 years", proof: 90, origin: "Kentucky, USA", mash_bill: "95% Rye" },
      { name: "Sazerac Rye", brand: "Sazerac", age: "6 years", proof: 90, origin: "Kentucky, USA", mash_bill: "51% Rye" },
      { name: "WhistlePig 10", brand: "WhistlePig", age: "10 years", proof: 100, origin: "Vermont, USA", mash_bill: "100% Rye" },
      { name: "Templeton Rye", brand: "Templeton", age: "4 years", proof: 80, origin: "Iowa, USA", mash_bill: "95% Rye" }
    ],
    irish_whiskey: [
      { name: "Jameson", brand: "Jameson", age: "4-7 years", proof: 80, origin: "Ireland", type: "Blended" },
      { name: "Redbreast 12", brand: "Redbreast", age: "12 years", proof: 80, origin: "Ireland", type: "Single Pot Still" },
      { name: "Tullamore D.E.W.", brand: "Tullamore D.E.W.", age: "NAS", proof: 80, origin: "Ireland", type: "Blended" },
      { name: "Bushmills 21", brand: "Bushmills", age: "21 years", proof: 80, origin: "Ireland", type: "Single Malt" },
      { name: "Green Spot", brand: "Green Spot", age: "7-10 years", proof: 80, origin: "Ireland", type: "Single Pot Still" }
    ]
  },

  // Vodka
  vodka: [
    { name: "Grey Goose", brand: "Grey Goose", proof: 80, origin: "France", base: "Wheat" },
    { name: "Beluga Noble", brand: "Beluga", proof: 80, origin: "Russia", base: "Wheat" },
    { name: "Tito's Handmade Vodka", brand: "Tito's", proof: 80, origin: "Texas, USA", base: "Corn" },
    { name: "Chopin Potato Vodka", brand: "Chopin", proof: 80, origin: "Poland", base: "Potato" },
    { name: "Stolichnaya", brand: "Stolichnaya", proof: 80, origin: "Latvia", base: "Wheat/Rye" },
    { name: "Ketel One", brand: "Ketel One", proof: 80, origin: "Netherlands", base: "Wheat" },
    { name: "Absolut", brand: "Absolut", proof: 80, origin: "Sweden", base: "Winter Wheat" },
    { name: "Ciroc", brand: "Ciroc", proof: 80, origin: "France", base: "Grapes" },
    { name: "Belvedere", brand: "Belvedere", proof: 80, origin: "Poland", base: "Rye" },
    { name: "Crystal Head", brand: "Crystal Head", proof: 80, origin: "Canada", base: "Corn/Wheat" }
  ],

  // Gin
  gin: [
    { name: "Tanqueray", brand: "Tanqueray", proof: 94.6, origin: "England", style: "London Dry" },
    { name: "Bombay Sapphire", brand: "Bombay Sapphire", proof: 94, origin: "England", style: "London Dry" },
    { name: "Hendrick's", brand: "Hendrick's", proof: 88, origin: "Scotland", style: "Contemporary" },
    { name: "The Botanist", brand: "The Botanist", proof: 92, origin: "Scotland", style: "Contemporary" },
    { name: "Monkey 47", brand: "Monkey 47", proof: 94, origin: "Germany", style: "Contemporary" },
    { name: "Aviation", brand: "Aviation", proof: 84, origin: "Oregon, USA", style: "American" },
    { name: "Plymouth", brand: "Plymouth", proof: 82.4, origin: "England", style: "Plymouth" },
    { name: "Nolet's Silver", brand: "Nolet's", proof: 95.2, origin: "Netherlands", style: "Contemporary" },
    { name: "St-Germain", brand: "St-Germain", proof: 40, origin: "France", style: "Elderflower Liqueur" },
    { name: "Sipsmith London Dry", brand: "Sipsmith", proof: 83.8, origin: "England", style: "London Dry" }
  ],

  // Rum
  rum: [
    { name: "Bacardi Superior", brand: "Bacardi", age: "1-2 years", proof: 80, origin: "Puerto Rico", style: "White" },
    { name: "Captain Morgan Spiced", brand: "Captain Morgan", age: "NAS", proof: 70, origin: "Jamaica", style: "Spiced" },
    { name: "Mount Gay Eclipse", brand: "Mount Gay", age: "2-7 years", proof: 80, origin: "Barbados", style: "Gold" },
    { name: "Appleton Estate 12", brand: "Appleton Estate", age: "12 years", proof: 86, origin: "Jamaica", style: "Aged" },
    { name: "Diplomatico Reserva Exclusiva", brand: "Diplomatico", age: "12 years", proof: 80, origin: "Venezuela", style: "Dark" },
    { name: "Plantation 20th Anniversary", brand: "Plantation", age: "20 years", proof: 80, origin: "Barbados", style: "Aged" },
    { name: "Zacapa 23", brand: "Zacapa", age: "23 years", proof: 80, origin: "Guatemala", style: "Dark" },
    { name: "El Dorado 15", brand: "El Dorado", age: "15 years", proof: 86, origin: "Guyana", style: "Dark" },
    { name: "Kraken Black Spiced", brand: "Kraken", age: "NAS", proof: 94, origin: "Trinidad", style: "Spiced" },
    { name: "Gosling's Black Seal", brand: "Gosling's", age: "NAS", proof: 80, origin: "Bermuda", style: "Dark" }
  ],

  // Tequila
  tequila: [
    { name: "Patrón Silver", brand: "Patrón", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Don Julio 1942", brand: "Don Julio", age: "Añejo", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Clase Azul Reposado", brand: "Clase Azul", age: "Reposado", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Herradura Silver", brand: "Herradura", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Casamigos Blanco", brand: "Casamigos", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Fortaleza Blanco", brand: "Fortaleza", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Ocho Plata", brand: "Ocho", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "El Tesoro Platinum", brand: "El Tesoro", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Espolòn Blanco", brand: "Espolòn", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" },
    { name: "Tapatio Blanco", brand: "Tapatio", age: "Blanco", proof: 80, origin: "Mexico", agave: "100% Blue Weber" }
  ],

  // Mezcal
  mezcal: [
    { name: "Del Maguey Vida", brand: "Del Maguey", age: "Joven", proof: 84, origin: "Mexico", agave: "100% Espadín" },
    { name: "Montelobos Joven", brand: "Montelobos", age: "Joven", proof: 86, origin: "Mexico", agave: "100% Espadín" },
    { name: "Los Amantes Joven", brand: "Los Amantes", age: "Joven", proof: 86, origin: "Mexico", agave: "100% Espadín" },
    { name: "Ilegal Joven", brand: "Ilegal", age: "Joven", proof: 80, origin: "Mexico", agave: "100% Espadín" },
    { name: "Fidencio Clásico", brand: "Fidencio", age: "Joven", proof: 82, origin: "Mexico", agave: "100% Espadín" }
  ],

  // Cognac & Brandy
  cognac: [
    { name: "Hennessy VS", brand: "Hennessy", age: "VS", proof: 80, origin: "France", region: "Cognac" },
    { name: "Rémy Martin XO", brand: "Rémy Martin", age: "XO", proof: 80, origin: "France", region: "Cognac" },
    { name: "Martell Cordon Bleu", brand: "Martell", age: "VSOP", proof: 80, origin: "France", region: "Cognac" },
    { name: "Courvoisier VSOP", brand: "Courvoisier", age: "VSOP", proof: 80, origin: "France", region: "Cognac" },
    { name: "Camus VSOP", brand: "Camus", age: "VSOP", proof: 80, origin: "France", region: "Cognac" }
  ],

  // Liqueurs
  liqueurs: [
    { name: "Grand Marnier", brand: "Grand Marnier", proof: 80, origin: "France", flavor: "Orange" },
    { name: "Cointreau", brand: "Cointreau", proof: 80, origin: "France", flavor: "Orange" },
    { name: "Chambord", brand: "Chambord", proof: 33, origin: "France", flavor: "Raspberry" },
    { name: "Bailey's Irish Cream", brand: "Bailey's", proof: 34, origin: "Ireland", flavor: "Cream" },
    { name: "Kahlúa", brand: "Kahlúa", proof: 40, origin: "Mexico", flavor: "Coffee" },
    { name: "Amaretto di Saronno", brand: "Disaronno", proof: 56, origin: "Italy", flavor: "Almond" },
    { name: "Sambuca", brand: "Molinari", proof: 84, origin: "Italy", flavor: "Anise" },
    { name: "Drambuie", brand: "Drambuie", proof: 80, origin: "Scotland", flavor: "Honey/Whisky" },
    { name: "Frangelico", brand: "Frangelico", proof: 40, origin: "Italy", flavor: "Hazelnut" },
    { name: "Jägermeister", brand: "Jägermeister", proof: 70, origin: "Germany", flavor: "Herbal" }
  ],

  // Classic Cocktails
  cocktails: {
    whiskey_cocktails: [
      { name: "Old Fashioned", base: "Bourbon/Rye", ingredients: ["Whiskey", "Sugar", "Bitters", "Orange peel"], garnish: "Orange peel" },
      { name: "Manhattan", base: "Rye Whiskey", ingredients: ["Rye whiskey", "Sweet vermouth", "Angostura bitters"], garnish: "Maraschino cherry" },
      { name: "Whiskey Sour", base: "Bourbon", ingredients: ["Bourbon", "Lemon juice", "Simple syrup"], garnish: "Lemon wheel, cherry" },
      { name: "Mint Julep", base: "Bourbon", ingredients: ["Bourbon", "Mint", "Sugar", "Crushed ice"], garnish: "Fresh mint sprig" },
      { name: "Sazerac", base: "Rye Whiskey", ingredients: ["Rye whiskey", "Absinthe", "Sugar", "Peychaud's bitters"], garnish: "Lemon peel" }
    ],
    gin_cocktails: [
      { name: "Gin & Tonic", base: "Gin", ingredients: ["Gin", "Tonic water", "Lime"], garnish: "Lime wedge" },
      { name: "Martini", base: "Gin", ingredients: ["Gin", "Dry vermouth"], garnish: "Olives or lemon twist" },
      { name: "Negroni", base: "Gin", ingredients: ["Gin", "Campari", "Sweet vermouth"], garnish: "Orange peel" },
      { name: "Tom Collins", base: "Gin", ingredients: ["Gin", "Lemon juice", "Simple syrup", "Club soda"], garnish: "Lemon wheel, cherry" },
      { name: "Aviation", base: "Gin", ingredients: ["Gin", "Maraschino liqueur", "Crème de violette", "Lemon juice"], garnish: "Lemon twist" }
    ],
    vodka_cocktails: [
      { name: "Moscow Mule", base: "Vodka", ingredients: ["Vodka", "Ginger beer", "Lime juice"], garnish: "Lime wedge" },
      { name: "Bloody Mary", base: "Vodka", ingredients: ["Vodka", "Tomato juice", "Hot sauce", "Worcestershire"], garnish: "Celery, olives" },
      { name: "Cosmopolitan", base: "Vodka", ingredients: ["Vodka", "Cranberry juice", "Lime juice", "Cointreau"], garnish: "Lime wheel" },
      { name: "White Russian", base: "Vodka", ingredients: ["Vodka", "Kahlúa", "Heavy cream"], garnish: "None" },
      { name: "Espresso Martini", base: "Vodka", ingredients: ["Vodka", "Espresso", "Kahlúa", "Simple syrup"], garnish: "Coffee beans" }
    ],
    rum_cocktails: [
      { name: "Mojito", base: "White Rum", ingredients: ["White rum", "Mint", "Lime juice", "Sugar", "Club soda"], garnish: "Mint sprig" },
      { name: "Daiquiri", base: "White Rum", ingredients: ["White rum", "Lime juice", "Simple syrup"], garnish: "Lime wheel" },
      { name: "Piña Colada", base: "White Rum", ingredients: ["White rum", "Coconut cream", "Pineapple juice"], garnish: "Pineapple, cherry" },
      { name: "Dark 'n' Stormy", base: "Dark Rum", ingredients: ["Dark rum", "Ginger beer", "Lime juice"], garnish: "Lime wedge" },
      { name: "Mai Tai", base: "Rum", ingredients: ["Light & dark rum", "Orange curaçao", "Orgeat", "Lime juice"], garnish: "Mint, pineapple" }
    ],
    tequila_cocktails: [
      { name: "Margarita", base: "Tequila", ingredients: ["Tequila", "Lime juice", "Cointreau", "Salt rim"], garnish: "Lime wheel" },
      { name: "Paloma", base: "Tequila", ingredients: ["Tequila", "Grapefruit juice", "Lime juice", "Club soda"], garnish: "Grapefruit wheel" },
      { name: "Tequila Sunrise", base: "Tequila", ingredients: ["Tequila", "Orange juice", "Grenadine"], garnish: "Orange wheel, cherry" },
      { name: "Tommy's Margarita", base: "Tequila", ingredients: ["Tequila", "Lime juice", "Agave nectar"], garnish: "Lime wheel" },
      { name: "Oaxaca Old Fashioned", base: "Tequila/Mezcal", ingredients: ["Tequila", "Mezcal", "Agave nectar", "Mole bitters"], garnish: "Orange peel" }
    ]
  },

  // Non-Alcoholic Beverages
  non_alcoholic: {
    sodas: [
      { name: "Coca-Cola", brand: "Coca-Cola", type: "Cola", caffeine: true },
      { name: "Pepsi", brand: "PepsiCo", type: "Cola", caffeine: true },
      { name: "Sprite", brand: "Coca-Cola", type: "Lemon-Lime", caffeine: false },
      { name: "7-Up", brand: "Keurig Dr Pepper", type: "Lemon-Lime", caffeine: false },
      { name: "Ginger Ale", brand: "Canada Dry", type: "Ginger", caffeine: false },
      { name: "Club Soda", brand: "Various", type: "Sparkling Water", caffeine: false },
      { name: "Tonic Water", brand: "Schweppes", type: "Tonic", caffeine: false },
      { name: "Orange Fanta", brand: "Coca-Cola", type: "Orange", caffeine: false },
      { name: "Root Beer", brand: "A&W", type: "Root Beer", caffeine: false },
      { name: "Dr Pepper", brand: "Keurig Dr Pepper", type: "Pepper", caffeine: true }
    ],
    juices: [
      { name: "Orange Juice", brand: "Fresh", type: "Citrus", vitamin_c: true },
      { name: "Apple Juice", brand: "Fresh", type: "Fruit", vitamin_c: false },
      { name: "Cranberry Juice", brand: "Ocean Spray", type: "Berry", vitamin_c: true },
      { name: "Pineapple Juice", brand: "Dole", type: "Tropical", vitamin_c: true },
      { name: "Grapefruit Juice", brand: "Fresh", type: "Citrus", vitamin_c: true },
      { name: "Tomato Juice", brand: "Campbell's", type: "Vegetable", vitamin_c: true },
      { name: "Lime Juice", brand: "Rose's", type: "Citrus", vitamin_c: true },
      { name: "Lemon Juice", brand: "Fresh", type: "Citrus", vitamin_c: true }
    ],
    energy_drinks: [
      { name: "Red Bull", brand: "Red Bull", caffeine: 80, taurine: true },
      { name: "Monster Energy", brand: "Monster", caffeine: 160, taurine: true },
      { name: "5-Hour Energy", brand: "Living Essentials", caffeine: 200, taurine: false },
      { name: "Rockstar", brand: "PepsiCo", caffeine: 160, taurine: true }
    ],
    coffee: [
      { name: "Espresso", type: "Coffee", caffeine: 64, preparation: "Espresso machine" },
      { name: "Americano", type: "Coffee", caffeine: 64, preparation: "Espresso + hot water" },
      { name: "Cappuccino", type: "Coffee", caffeine: 64, preparation: "Espresso + steamed milk + foam" },
      { name: "Latte", type: "Coffee", caffeine: 64, preparation: "Espresso + steamed milk" },
      { name: "Macchiato", type: "Coffee", caffeine: 64, preparation: "Espresso + milk foam" },
      { name: "Mocha", type: "Coffee", caffeine: 64, preparation: "Espresso + chocolate + milk" }
    ],
    tea: [
      { name: "Earl Grey", type: "Black Tea", caffeine: 47, origin: "Ceylon" },
      { name: "English Breakfast", type: "Black Tea", caffeine: 47, origin: "Assam/Ceylon" },
      { name: "Green Tea", type: "Green Tea", caffeine: 25, origin: "China/Japan" },
      { name: "Chamomile", type: "Herbal Tea", caffeine: 0, origin: "Egypt" },
      { name: "Peppermint", type: "Herbal Tea", caffeine: 0, origin: "Mediterranean" },
      { name: "Oolong", type: "Oolong Tea", caffeine: 37, origin: "China/Taiwan" }
    ],
    water: [
      { name: "Still Water", brand: "Evian", type: "Still", source: "Natural Spring" },
      { name: "Sparkling Water", brand: "Perrier", type: "Sparkling", source: "Natural Spring" },
      { name: "Mineral Water", brand: "San Pellegrino", type: "Sparkling", source: "Natural Spring" },
      { name: "Alkaline Water", brand: "Essentia", type: "Enhanced", source: "Ionized" }
    ]
  }
};

export default beverageDatabase;