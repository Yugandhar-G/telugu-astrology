export interface NakshatraInfo {
  name: string;
  teluguName: string;
  syllables: string[];
  lord: string;
  deity: string;
  gana: 'దేవగణము' | 'మానవగణము' | 'రాక్షసగణము';
  gender: 'పురుష' | 'స్త్రీ' | 'ఉభయ';
  animal: string;
  bird: string;
  tree: string;
  gem: string;
  nadi: 'ఆదినాడి' | 'మధ్యనాడి' | 'అంత్యనాడి';
  rashi: string;
  navamshaLords: [string, string, string, string];
  padaDoshas: [string, string, string, string];
}

export const NAKSHATRA_DATA: NakshatraInfo[] = [
  {
    name: 'Ashwini', teluguName: 'అశ్విని',
    syllables: ['చూ', 'చే', 'చో', 'లా'],
    lord: 'కేతువు', deity: 'అశ్వినీదేవతలు', gana: 'దేవగణము', gender: 'పురుష',
    animal: 'గుర్రము', bird: 'గరుడము', tree: 'జీడిమామిడి', gem: 'వైడూర్యం', nadi: 'ఆదినాడి', rashi: 'మేషము',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['శిశువునకు, తండ్రికి', 'దోషంలేదు', 'దోషంలేదు', 'సామాన్యదోషం'],
  },
  {
    name: 'Bharani', teluguName: 'భరణి',
    syllables: ['లీ', 'లూ', 'లే', 'లో'],
    lord: 'శుక్రుడు', deity: 'యముడు', gana: 'మానవగణము', gender: 'స్త్రీ',
    animal: 'ఏనుగు', bird: 'పింగళ', tree: 'ఉసిరిక', gem: 'వజ్రము', nadi: 'మధ్యనాడి', rashi: 'మేషము',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['సామాన్యదోషం', 'దోషంలేదు', 'మగ-తండ్రికి, ఆడ-తల్లికి', 'శిశువునకు'],
  },
  {
    name: 'Krittika', teluguName: 'కృత్తిక',
    syllables: ['ఆ', 'ఈ', 'ఊ', 'ఏ'],
    lord: 'సూర్యుడు', deity: 'అగ్ని', gana: 'రాక్షసగణము', gender: 'పురుష',
    animal: 'మేక', bird: 'కాకము', tree: 'అత్తి', gem: 'కెంపు', nadi: 'అంత్యనాడి', rashi: 'మేషము / వృషభం',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మగ-తండ్రికి, ఆడ-తల్లికి', 'తల్లికి'],
  },
  {
    name: 'Rohini', teluguName: 'రోహిణి',
    syllables: ['ఈ', 'వా', 'వీ', 'వూ'],
    lord: 'చంద్రుడు', deity: 'బ్రహ్మ', gana: 'మానవగణము', gender: 'పురుష',
    animal: 'సర్పం', bird: 'కుకుటము', tree: 'నేరేడు', gem: 'ముత్యం', nadi: 'అంత్యనాడి', rashi: 'వృషభం',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['మేనమామకు, తల్లికి', 'మేనమామకు, తల్లికి', 'మేనమామకు, తల్లికి', 'మేనమామకు, తండ్రికి'],
  },
  {
    name: 'Mrigashirsha', teluguName: 'మృగశిర',
    syllables: ['వే', 'వో', 'కా', 'కీ'],
    lord: 'కుజుడు', deity: 'చంద్రుడు', gana: 'దేవగణము', gender: 'ఉభయ',
    animal: 'సర్పం', bird: 'మయూరము', tree: 'మారేడు', gem: 'పగడం', nadi: 'మధ్యనాడి', rashi: 'వృషభం / మిథునం',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Ardra', teluguName: 'ఆర్ద్ర',
    syllables: ['కూ', 'ఖం', 'జ', 'ఛా'],
    lord: 'రాహువు', deity: 'రుద్రుడు', gana: 'మానవగణము', gender: 'పురుష',
    animal: 'శునకం', bird: 'గరుడము', tree: 'చింత', gem: 'గోమేధికం', nadi: 'ఆదినాడి', rashi: 'మిథునం',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'తల్లికి'],
  },
  {
    name: 'Punarvasu', teluguName: 'పునర్వసు',
    syllables: ['కే', 'కో', 'హ', 'హీ'],
    lord: 'గురువు', deity: 'అధితి', gana: 'దేవగణము', gender: 'పురుష',
    animal: 'మార్జాలం (పిల్లి)', bird: 'పింగళ', tree: 'వెదురు', gem: 'కనక పుష్యరాగం', nadi: 'ఆదినాడి', rashi: 'మిథునం / కర్కాటకం',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Pushya', teluguName: 'పుష్యమి',
    syllables: ['హు', 'హే', 'హో', 'డా'],
    lord: 'శని', deity: 'బృహస్పతి', gana: 'దేవగణము', gender: 'పురుష',
    animal: 'మేక', bird: 'కాకము', tree: 'పిప్పిలి', gem: 'నీలం', nadi: 'మధ్యనాడి', rashi: 'కర్కాటకం',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['సామాన్యదోషం', 'పగలు-తండ్రికి, రాత్రి-తల్లికి', 'పగలు-తండ్రికి, రాత్రి-తల్లికి', 'సామాన్యదోషం'],
  },
  {
    name: 'Ashlesha', teluguName: 'ఆశ్లేష',
    syllables: ['డీ', 'డూ', 'డే', 'డో'],
    lord: 'బుధుడు', deity: 'సర్పము', gana: 'రాక్షసగణము', gender: 'స్త్రీ',
    animal: 'మార్జాలం', bird: 'కుకుటము', tree: 'సంపంగి', gem: 'పచ్చ', nadi: 'అంత్యనాడి', rashi: 'కర్కాటకం',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['దోషంలేదు', 'శిశువునకు, ధనమునకు', 'తల్లికి', 'తండ్రికి'],
  },
  {
    name: 'Magha', teluguName: 'మఖ',
    syllables: ['మా', 'మి', 'మూ', 'మే'],
    lord: 'కేతువు', deity: 'పితృదేవతలు', gana: 'రాక్షసగణము', gender: 'పురుష',
    animal: 'మూషికం', bird: 'మయూరము', tree: 'మర్రి', gem: 'వైడూర్యం', nadi: 'అంత్యనాడి', rashi: 'సింహం',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['శిశువుకు, తండ్రికి', 'మగ-తండ్రికి, ఆడ-తల్లికి', 'మగ-తండ్రికి, ఆడ-తల్లికి', 'మంచిది'],
  },
  {
    name: 'PurvaPhalguni', teluguName: 'పూర్వ ఫల్గుణి (పుబ్బ)',
    syllables: ['మో', 'టా', 'టీ', 'టూ'],
    lord: 'శుక్రుడు', deity: 'భర్గుడు', gana: 'మానవగణము', gender: 'స్త్రీ',
    animal: 'మూషికం', bird: 'గరుడము', tree: 'మోదుగ', gem: 'వజ్రం', nadi: 'మధ్యనాడి', rashi: 'సింహం',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'తల్లికి'],
  },
  {
    name: 'UttaraPhalguni', teluguName: 'ఉత్తర ఫల్గుణి',
    syllables: ['టే', 'టో', 'పా', 'పీ'],
    lord: 'సూర్యుడు', deity: 'ఆర్యముడు', gana: 'మానవగణము', gender: 'స్త్రీ',
    animal: 'గోవు', bird: 'పింగళ', tree: 'జువ్వి', gem: 'కెంపు', nadi: 'ఆదినాడి', rashi: 'సింహం / కన్య',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['మగ-తండ్రికి', 'మంచిది', 'మంచిది', 'మగ-తండ్రికి'],
  },
  {
    name: 'Hasta', teluguName: 'హస్త',
    syllables: ['వూ', 'షం', 'ణా', 'ఢా'],
    lord: 'చంద్రుడు', deity: 'సూర్యుడు', gana: 'దేవగణము', gender: 'పురుష',
    animal: 'మహిషము', bird: 'కాకము', tree: 'కుంకుడు', gem: 'ముత్యం', nadi: 'ఆదినాడి', rashi: 'కన్య',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మగ-తండ్రికి, ఆడ-తల్లికి', 'మంచిది'],
  },
  {
    name: 'Chitra', teluguName: 'చిత్త',
    syllables: ['పే', 'పో', 'రా', 'రి'],
    lord: 'కుజుడు', deity: 'విశ్వకర్మ', gana: 'రాక్షసగణము', gender: 'స్త్రీ',
    animal: 'వ్యాఘ్రం (పులి)', bird: 'కుక్కుటము', tree: 'మారేడు', gem: 'పగడం', nadi: 'మధ్యనాడి', rashi: 'కన్య / తుల',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['మగ-తండ్రికి', 'తండ్రికి', 'తండ్రికి', 'సామాన్యదోషం'],
  },
  {
    name: 'Swati', teluguName: 'స్వాతి',
    syllables: ['రూ', 'రే', 'రో', 'తా'],
    lord: 'రాహువు', deity: 'వాయు దేవుడు', gana: 'దేవగణము', gender: 'స్త్రీ',
    animal: 'మహిషి', bird: 'మయూరము', tree: 'మద్ది', gem: 'గోమేధికం', nadi: 'అంత్యనాడి', rashi: 'తుల',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Vishakha', teluguName: 'విశాఖ',
    syllables: ['తీ', 'తూ', 'తే', 'తో'],
    lord: 'గురువు', deity: 'ఇంద్రుడు, అగ్ని', gana: 'రాక్షసగణము', gender: 'స్త్రీ',
    animal: 'వ్యాఘ్రము (పులి)', bird: 'గరుడము', tree: 'వెలగ', gem: 'కనక పుష్యరాగం', nadi: 'అంత్యనాడి', rashi: 'తుల / వృశ్చికం',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['మగ-బావమరది, ఆడ-మరదలు', 'మగ-బావమరది, ఆడ-మరదలు', 'మగ-బావమరది, ఆడ-మరదలు', 'మగ-తల్లికి, బావమరది, ఆడ-మరదలు'],
  },
  {
    name: 'Anuradha', teluguName: 'అనూరాధ',
    syllables: ['నా', 'నీ', 'నూ', 'నే'],
    lord: 'శని', deity: 'సూర్యుడు', gana: 'దేవగణము', gender: 'పురుష',
    animal: 'జింక', bird: 'పింగళ', tree: 'పొగడ', gem: 'నీలం', nadi: 'మధ్యనాడి', rashi: 'వృశ్చికం',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Jyeshtha', teluguName: 'జ్యేష్ఠ',
    syllables: ['నో', 'యా', 'యీ', 'యూ'],
    lord: 'బుధుడు', deity: 'ఇంద్రుడు', gana: 'రాక్షసగణము', gender: 'స్త్రీ',
    animal: 'లేడి', bird: 'కాకము', tree: 'విష్టి', gem: 'పచ్చ', nadi: 'ఆదినాడి', rashi: 'వృశ్చికం',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['సౌఖ్యహాని, తల్లికి', 'సోదరులకు, మేనమామకు', 'శిశువుకు, తల్లికి, పెదతండ్రికి', 'తండ్రికి, అన్నకు'],
  },
  {
    name: 'Mula', teluguName: 'మూల',
    syllables: ['యే', 'యో', 'బా', 'బీ'],
    lord: 'కేతువు', deity: 'నిరుతి', gana: 'రాక్షసగణము', gender: 'ఉభయ',
    animal: 'శునకం', bird: 'కుక్కుటము', tree: 'వేగిస', gem: 'వైడూర్యం', nadi: 'ఆదినాడి', rashi: 'ధనస్సు',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['తండ్రికి', 'తల్లికి', 'ధనమునకు', 'మంచిది'],
  },
  {
    name: 'PurvaAshadha', teluguName: 'పూర్వాషాఢ',
    syllables: ['బూ', 'ధా', 'భా', 'ఢా'],
    lord: 'శుక్రుడు', deity: 'గంగ', gana: 'మానవగణము', gender: 'స్త్రీ',
    animal: 'వానరం', bird: 'మయూరము', tree: 'అశోక', gem: 'వజ్రం', nadi: 'మధ్యనాడి', rashi: 'ధనస్సు',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మగ-తండ్రికి, ఆడ-తల్లికి', 'మంచిది'],
  },
  {
    name: 'UttaraAshadha', teluguName: 'ఉత్తరాషాఢ',
    syllables: ['బే', 'బో', 'జా', 'జీ'],
    lord: 'సూర్యుడు', deity: 'విశ్వేదేవతలు', gana: 'మానవగణము', gender: 'స్త్రీ',
    animal: 'ముంగిస', bird: 'గరుడము', tree: 'పనస', gem: 'కెంపు', nadi: 'అంత్యనాడి', rashi: 'ధనస్సు / మకరం',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Shravana', teluguName: 'శ్రవణం',
    syllables: ['జూ', 'జే', 'జో', 'ఖా'],
    lord: 'చంద్రుడు', deity: 'మహావిష్ణువు', gana: 'దేవగణము', gender: 'పురుష',
    animal: 'వానరం', bird: 'పింగళ', tree: 'జిల్లేడు', gem: 'ముత్యం', nadi: 'అంత్యనాడి', rashi: 'మకరం',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Dhanishta', teluguName: 'ధనిష్ఠ',
    syllables: ['గా', 'గీ', 'గూ', 'గే'],
    lord: 'కుజుడు', deity: 'అష్టవసుడు', gana: 'రాక్షసగణము', gender: 'స్త్రీ',
    animal: 'సింహము', bird: 'కాకము', tree: 'జమ్మి', gem: 'పగడం', nadi: 'మధ్యనాడి', rashi: 'మకరం / కుంభం',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Shatabhisha', teluguName: 'శతభిషం',
    syllables: ['గో', 'సా', 'సీ', 'సూ'],
    lord: 'రాహువు', deity: 'వరుణుడు', gana: 'రాక్షసగణము', gender: 'ఉభయ',
    animal: 'అశ్వం (గుర్రం)', bird: 'కుక్కుటము', tree: 'కడిమి', gem: 'గోమేధికం', nadi: 'ఆదినాడి', rashi: 'కుంభం',
    navamshaLords: ['గురువు', 'శని', 'శని', 'గురువు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'PurvaBhadrapada', teluguName: 'పూర్వాభాద్ర',
    syllables: ['సే', 'సో', 'దా', 'దీ'],
    lord: 'గురువు', deity: 'అజైకపాదుడు', gana: 'మానవగణము', gender: 'పురుష',
    animal: 'సింహం', bird: 'మయూరము', tree: 'మామిడి', gem: 'కనక పుష్యరాగం', nadi: 'ఆదినాడి', rashi: 'కుంభం / మీనం',
    navamshaLords: ['కుజుడు', 'శుక్రుడు', 'బుధుడు', 'చంద్రుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'UttaraBhadrapada', teluguName: 'ఉత్తరాభాద్ర',
    syllables: ['ధు', 'శ్చం', 'చా', 'ధా'],
    lord: 'శని', deity: 'అహిర్పద్యువుడు', gana: 'మానవగణము', gender: 'పురుష',
    animal: 'గోవు', bird: 'మయూరము', tree: 'వేప', gem: 'నీలం', nadi: 'మధ్యనాడి', rashi: 'మీనం',
    navamshaLords: ['రవి', 'బుధుడు', 'శుక్రుడు', 'కుజుడు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'మంచిది'],
  },
  {
    name: 'Revati', teluguName: 'రేవతి',
    syllables: ['దే', 'దో', 'చా', 'చీ'],
    lord: 'బుధుడు', deity: 'పూషణుడు', gana: 'దేవగణము', gender: 'స్త్రీ',
    animal: 'ఏనుగు', bird: 'మయూరము', tree: 'విప్ప', gem: 'పచ్చ', nadi: 'అంత్యనాడి', rashi: 'మీనం',
    navamshaLords: ['గురువు', 'శని', 'బుధుడు', 'గురువు'],
    padaDoshas: ['మంచిది', 'మంచిది', 'మంచిది', 'తండ్రికి దోషం'],
  },
];

const SEARCH_INDEX: Record<string, number> = {};
NAKSHATRA_DATA.forEach((n, i) => {
  SEARCH_INDEX[n.name.replace(/\s/g, '').toLowerCase()] = i;
  SEARCH_INDEX[n.teluguName.replace(/[\s()]/g, '')] = i;
});
// vedic-math.ts uses slightly different names
const EXTRA_ALIASES: Record<string, number> = {
  'mrigashira': 4,
  'purva phalguni': 10, 'purvaphalguni': 10,
  'uttara phalguni': 11, 'uttaraphalguni': 11,
  'purva ashadha': 19, 'purvaashadha': 19,
  'uttara ashadha': 20, 'uttaraashadha': 20,
  'purva bhadrapada': 24, 'purvabhadrapada': 24,
  'uttara bhadrapada': 25, 'uttarabhadrapada': 25,
  'shravana': 21,
};
Object.entries(EXTRA_ALIASES).forEach(([k, v]) => { SEARCH_INDEX[k] = v; });

export function findNakshatraByName(englishName: string): NakshatraInfo | undefined {
  const key = englishName.replace(/\s/g, '').toLowerCase().trim();
  const idx = SEARCH_INDEX[key];
  if (idx !== undefined) return NAKSHATRA_DATA[idx];
  const keyWithSpaces = englishName.toLowerCase().trim();
  const idx2 = SEARCH_INDEX[keyWithSpaces];
  if (idx2 !== undefined) return NAKSHATRA_DATA[idx2];
  return NAKSHATRA_DATA.find(n =>
    n.name.replace(/\s/g, '').toLowerCase() === key ||
    n.teluguName.includes(englishName)
  );
}
