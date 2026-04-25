"use client";
import { useEffect, useState } from "react";
import CreateDeckModal from "./CreateDeckModal";
import CreateRoadmapModal from "./CreateRoadmapModal";
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateDeckModal />
      <CreateRoadmapModal />
    </>
  );
};