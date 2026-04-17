"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type NumerologyInstantNavValue = {
  instantPath: string;
  navigate: (path: string) => void;
};

const NumerologyInstantNavContext = createContext<NumerologyInstantNavValue | null>(null);

export function NumerologyInstantNavProvider({
  instantPath,
  navigate,
  children,
}: {
  instantPath: string;
  navigate: (path: string) => void;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ instantPath, navigate }), [instantPath, navigate]);
  return <NumerologyInstantNavContext.Provider value={value}>{children}</NumerologyInstantNavContext.Provider>;
}

/** 仅在 `NumerologyWorkspaceShell` 内有效；寰宇之门嵌入导航用于与侧栏一致的即时路径与跳转。 */
export function useNumerologyInstantNav(): NumerologyInstantNavValue | null {
  return useContext(NumerologyInstantNavContext);
}
