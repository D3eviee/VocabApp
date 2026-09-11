"use client";
import { useEffect, useState } from "react";
import { DeleteDeckDialog } from "../../dialogs/DeleteDeckDialog";
import { ResetDeckDialog } from "../../dialogs/ResetDeckDialog";
import { DeleteItemDialog } from "../../dialogs/DeleteItemDialog";
import { EditSecurityDialog } from "../../dialogs/EditSecurityDialog";
import { DeleteAccountDialog } from "../../dialogs/DeleteAccountDialog";
import { EditPersonalDialog } from "../../dialogs/EditPersonalDialog";
import { SubscriptionDialog } from "../../dialogs/SubscriptionDialog";
import { CreateFlashardsDeckModal } from "../../modals/CreateFlashardsDeckModal";
import { CreateStoryboardModal } from "../../modals/CreateStoryboardModal";
import { CreatePlaygroundModal } from "../../modals/CreatePlaygroundModal";
import { CreateWithAIModal } from "@/components/modals/CreateWithAIModal";

export const WindowsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateFlashardsDeckModal />
      <CreateStoryboardModal />
      <CreatePlaygroundModal/>
      <CreateWithAIModal/>

      <DeleteDeckDialog/>
      <ResetDeckDialog/>
      <DeleteItemDialog/>
      <EditPersonalDialog/>
      <EditSecurityDialog/>
      <DeleteAccountDialog/>
      <SubscriptionDialog/>
    </>
  );
};