"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";

export type InnerBackHandler = () => boolean;

type ReadingBackContextValue = {
  registerHandler: (handler: InnerBackHandler) => void;
  unregisterHandler: () => void;
  tryInnerBack: () => boolean;
};

const handlerRef = { current: null as InnerBackHandler | null };

const ReadingBackContext = createContext<ReadingBackContextValue | null>(null);

export function ReadingBackProvider({ children }: { children: ReactNode }) {
  const registerHandler = useCallback((handler: InnerBackHandler) => {
    handlerRef.current = handler;
  }, []);
  const unregisterHandler = useCallback(() => {
    handlerRef.current = null;
  }, []);
  const tryInnerBack = useCallback(() => {
    const fn = handlerRef.current;
    if (typeof fn === "function") return fn();
    return false;
  }, []);

  return (
    <ReadingBackContext.Provider value={{ registerHandler, unregisterHandler, tryInnerBack }}>
      {children}
    </ReadingBackContext.Provider>
  );
}

export function useReadingBack(): ReadingBackContextValue | null {
  return useContext(ReadingBackContext);
}
