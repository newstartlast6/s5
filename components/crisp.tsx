"use client"

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("4c10a0ef-83bc-4be3-b669-8ffc08f36885");
  });

  return null;
}

export default CrispChat;
