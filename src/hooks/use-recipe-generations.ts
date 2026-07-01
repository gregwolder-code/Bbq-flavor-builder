"use client";

import { useState, useEffect } from "react";

const GENERATIONS_KEY = "bbq-flavor-builder-generations";
const UNLIMITED_KEY = "bbq-flavor-builder-unlimited";
const MAX_FREE = 3;

export function useRecipeGenerations() {
  const [generations, setGenerations] = useState<number>(0);
  const [isUnlimited, setIsUnlimitedState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedGenerations = localStorage.getItem(GENERATIONS_KEY);
    const storedUnlimited = localStorage.getItem(UNLIMITED_KEY);

    if (storedGenerations) {
      setGenerations(parseInt(storedGenerations, 10));
    }
    if (storedUnlimited === "true") {
      setIsUnlimitedState(true);
    }
    setIsLoading(false);
  }, []);

  const getRemaining = () => {
    if (isUnlimited) return Infinity;
    return Math.max(0, MAX_FREE - generations);
  };

  const useGeneration = () => {
    if (isUnlimited) return Infinity;
    const newCount = generations + 1;
    setGenerations(newCount);
    localStorage.setItem(GENERATIONS_KEY, newCount.toString());
    return Math.max(0, MAX_FREE - newCount);
  };

  const setUnlimited = () => {
    setIsUnlimitedState(true);
    localStorage.setItem(UNLIMITED_KEY, "true");
  };

  const checkUnlimited = () => {
    return isUnlimited;
  };

  return {
    generations,
    getRemaining,
    useGeneration,
    isUnlimited: checkUnlimited(),
    setUnlimited,
    isLoading,
    maxFree: MAX_FREE
  };
}
