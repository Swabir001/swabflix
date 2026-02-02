import { useState, useEffect } from 'react';
import { Movie } from '../types';

export function useMyList() {
  const [myList, setMyList] = useState<Movie[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedList = localStorage.getItem('swabflix_mylist');
    if (savedList) {
      try {
        setMyList(JSON.parse(savedList));
      } catch (e) {
        console.error('Error parsing my list:', e);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem('swabflix_mylist', JSON.stringify(myList));
  }, [myList]);

  const addToList = (movie: Movie) => {
    if (!isInList(movie.id)) {
      setMyList((prev) => [movie, ...prev]);
    }
  };

  const removeFromList = (movieId: number) => {
    setMyList((prev) => prev.filter((m) => m.id !== movieId));
  };

  const isInList = (movieId: number) => {
    return myList.some((m) => m.id === movieId);
  };

  const toggleMyList = (movie: Movie) => {
    if (isInList(movie.id)) {
      removeFromList(movie.id);
    } else {
      addToList(movie);
    }
  };

  return {
    myList,
    addToList,
    removeFromList,
    isInList,
    toggleMyList
  };
}