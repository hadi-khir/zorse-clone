"use client"

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

interface ScreenKeyboardProps {
  onKeyPress: (key: string) => void;
}

const ScreenKeyboard = ({ onKeyPress }: ScreenKeyboardProps) => {

  const iosLayout = {
    default: ["Q W E R T Y U I O P", "A S D F G H J K L", "Z X C V B N M {bksp}"],
  };

  const iosDisplay = {
    "{bksp}": "⌫"
  };

  const handleKeyPress = (button: string) => {

    const key = button === "{bksp}" ? "BACKSPACE" : button;
    onKeyPress(key);
  };

  return (
    <Keyboard
      layout={iosLayout}
      display={iosDisplay}
      theme="hg-theme-default myTheme"
      onKeyPress={handleKeyPress}
      buttonTheme={[
        { class: "hg-button hg-backspace", buttons: "{bksp}" }
      ]}
      className="dark:bg-gray-800 dark:text-black"
    />
  )
}

export default ScreenKeyboard;