"use client";

import { createContext, useContext } from "react";

/**
 * Lets above-the-fold animations wait for the preloader curtain instead of
 * firing underneath it. The default is `true`, so any component used outside
 * the provider (inner pages, Storybook, tests) animates immediately.
 */

export const IntroContext = createContext<boolean>(true);

export const useIntroReady = () => useContext(IntroContext);
