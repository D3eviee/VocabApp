"use client";
import { useEffect, useState } from "react";
import { DeleteDeckDialog } from "../../dialogs/DeleteDeckDialog";
import { ResetDeckDialog } from "../../dialogs/ResetDeckDialog";
import { DeleteItemDialog } from "../../dialogs/DeleteItemDialog";
import { EditSecurityDialog } from "../../dialogs/EditSecurityDialog";
import { DeleteAccountDialog } from "../../dialogs/DeleteAccountDialog";
import { EditPersonalDialog } from "../../dialogs/EditPersonalDialog";
import { SubscriptionDialog } from "../../dialogs/SubscriptionDialog";
import { CreateDeckModal } from "../../modals/CreateDeckModal";
import { CreateStoryboardModal } from "../../modals/CreateStoryboardModal";
import { AiDeckModal } from "../../modals/AiDeckModal";
import { CreatePlaygroundModal } from "../../modals/CreatePlaygroundModal";

export const WindowsProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateDeckModal />
      <CreateStoryboardModal />
      <CreatePlaygroundModal/>
      <AiDeckModal/>

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