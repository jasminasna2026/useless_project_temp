/* ==========================================================================
   TOSS THE UNSURE — Satirical Diagnostic Question Pool
   ========================================================================== */

const SATIRICAL_QUESTIONS = [
  "What is the current emotional temperament of the coin?",
  "On a scale of 1 to 10, how much does the coin trust you?",
  "What is the coin's preferred season?",
  "Has the coin been formally introduced to the room it is about to be flipped in?",
  "What is the estimated weight of the coin, in teaspoons?",
  "Which hand will be performing the flip?",
  "Does the coin have any known allergies?",
  "What was the coin doing five minutes before this ceremony began?",
  "Please state the coin's astrological sign, real or invented.",
  "Is the coin aware that this outcome may be recorded for posterity?",
  "What denomination does the coin believe itself to be, regardless of its actual value?",
  "How many previous owners has this coin had, approximately?",
  "What is the coin's stance on being flipped indoors versus outdoors?",
  "Please describe the coin's relationship with gravity.",
  "What country does the coin consider home, even if it has never been there?",
  "Has the coin given informed consent to this flip?",
  "What is the intended purpose of this flip?",
  "On a scale of calm to chaotic, how is the flipper currently feeling?",
  "What is the ambient room temperature, to the best of your knowledge?",
  "Would the coin rather be a bracelet or a keychain, if given the choice?",
  "How many times has this exact coin been flipped in its lifetime?",
  "What is the coin's favorite unit of currency that is not its own?",
  "Please rate the flipper's confidence level from 'timid' to 'overzealous'.",
  "Is there background music playing, and if so, what genre?",
  "What is the coin's opinion of vending machines?",
  "How far, in approximate meters, has the coin traveled to reach this moment?",
  "What is the flipper's dominant hand, and is it the one being used?",
  "Does the coin have a name? If not, please assign one immediately.",
  "What time of day does the coin feel most photogenic?",
  "Please describe the surface the coin will land on, in botanical terms if possible.",
  "Is the flipper standing, sitting, or in a state of existential limbo?",
  "What is the last thing the coin remembers being purchased with, if anything?",
  "How humid is the room, on a scale of 'desert' to 'rainforest'?",
  "What is the coin's preferred method of transport when not being flipped?",
  "Does the coin believe in destiny, or strictly in physics?",
  "What song best represents the coin's personality?",
  "Please state the flipper's shoe size, for calibration purposes.",
  "Is the coin left-handed or right-handed, hypothetically?",
  "What is the coin's opinion on being kept in a piggy bank long-term?",
  "How many people are currently watching this flip, including pets?",
  "What is the flipper's relationship status with luck in general?",
  "Please describe the coin's morning routine.",
  "Would the coin describe today as a 'heads kind of day' or a 'tails kind of day'?",
  "What is the barometric pressure, as best you can estimate by feeling?",
  "Has the coin ever been flipped by a professional, and if so, were they certified?",
  "What is the coin's preferred flipping height, in hand-widths?",
  "Please describe your breakfast in relation to today's flip.",
  "What is the coin's zodiac-adjacent metal composition?",
  "Is the flipper wearing socks, and does the coin approve?",
  "What is the coin's tolerance for being caught versus landing on the floor?",
  "How many degrees of rotation does the coin consider 'respectful'?",
  "What is the flipper's current heart rate, approximately?",
  "Does the coin have a preference between carpet, tile, or grass landings?",
  "What was the weather like on the day this coin was minted, hypothetically?",
  "Please rate the tension in the room from 'library' to 'game show finale'.",
  "Is the coin currently operating under quantum uncertainty principles?",
  "Does the coin acknowledge the existence of Schrödinger's cat?"
];

function getRandomQuestions(count = 5) {
  const shuffled = SATIRICAL_QUESTIONS.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
