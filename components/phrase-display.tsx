import Tile from "./tile";

const PhraseDisplay = () => {
  const phrase = "WIN BY A HAIR ON THE DOG";
  const words = phrase.split(" ");

  return (
    <div className="flex flex-wrap gap-6 justify-center w-5/6">
      {words.map((word, wordIndex) => (
        <div key={wordIndex} className="flex justify-center gap-1">
          {word.split("").map((letter, letterIndex) => (
            <Tile key={letterIndex} letter={letter} isVisible={true} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default PhraseDisplay;
