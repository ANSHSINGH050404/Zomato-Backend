"use client";

import { fallbackModeToFallbackField } from "next/dist/lib/fallback";
import React, { useCallback, useEffect, useRef, useState } from "react";

const page = () => {
  const [password, setPassword] = useState("");
  const [lenght, setLength] = useState(8);
  const [number, setNumber] = useState(false);
  const [char, setChar] = useState(false);

  const passRef=useRef(null)

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSThcjkbsdkdjnvlneukbfviewnlvbyuoijoi";
    if (number) str += "0123456789";
    if (char) str += "!@#$%^&*()_+?><:";

    for (let i = 1; i <= lenght; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [lenght, number, char]);

  const copypast = useCallback(()=>{

    window.navigator.clipboard.writeText(password)
  },[password])

  useEffect(()=>{
    passwordGenerator()
  },[lenght, number, char])

  return (
    <div className="w-full max-w-md rounded-2xl mx-auto px-4 my-4 bg-gray-800 flex flex-col">
      <h1 className="text-white text-center">PassWord Generator</h1>
      <div className="flex shadow rounded-2xl overflow-hidden mb-4 ">
        <input
          type="text"
          value={password}
          className="outline-none w-full py-1 px-3"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          readOnly
          placeholder="Password"
          ref={passRef}
        />
        <button 
        onClick={copypast}
        className="outline-none bg-blue-700 text-white">Copy</button>
     
     
      </div>
         <input type="range"
        min={6}
        max={100}
        value={lenght}
        onChange={(e)=>{setLength(parseInt(e.target.value, 10))}}
      
        />
        <label>Length:{lenght}</label>
        <label htmlFor="">Number</label>
        <input
        type="checkbox"
        defaultChecked={number}
        onChange={()=>{setNumber((p)=>!p)}}
        />
    </div>
  );
};

export default page;
