import { createContext, useContext } from 'react';

/** `done` is false while the cinematic intro covers the page. Hero animations wait for it. */
export const IntroContext = createContext({ done: true });
export const useIntro = () => useContext(IntroContext);
