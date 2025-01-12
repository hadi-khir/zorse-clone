"use client"

import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

interface ScreenKeyboardProps {
  onKeyPress: (key: string) => void;
}

const ScreenKeyboard = ({ onKeyPress }: ScreenKeyboardProps) => {

  const iosLayout = {
    default: ["Q W E R T Y U I O P {bksp}", "A S D F G H J K L", "Z X C V B N M"],
  };

  const iosDisplay = {
    "{bksp}": "⌫",
    "{numbers}": "123",
    "{default}": "ABC"
  };

  return (
    <Keyboard
      layout={iosLayout}
      display={iosDisplay}
      theme="hg-theme-default myTheme"
      onKeyPress={onKeyPress}
      buttonTheme={[
        { class: "hg-button hg-space", buttons: "{space}" },
        { class: "hg-button hg-backspace", buttons: "{backspace}" }
      ]}
      className="dark:bg-gray-800 dark:text-black"
    />
  )
}

export default ScreenKeyboard;