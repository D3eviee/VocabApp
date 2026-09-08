"use client";
import { useTransition } from "react";
import { useModal } from "@/store/modal-store";
import { Loader2, X, Sparkles, CreditCard, ExternalLink, AlertCircle } from "lucide-react";
import { createStripeSession, createCustomerPortalSession } from "@/app/actions/stripe";
import { BaseDialog } from "./BaseDialog";

export const SubscriptionDialog = () => {
  const { isOpen, type, onClose, data } = useModal();
  const [isPending, startTransition] = useTransition();

  // GET USER DATA -> Provided throught modal
  const isPro = data?.subscription?.isPro || false;
  const periodEnd = data?.subscription?.periodEnd;
  const cancelAtPeriodEnd = data?.subscription?.cancelAtPeriodEnd || false;

  const handleAction = () => {
    startTransition(async () => {
      // IF USER ALREAFDY SUBBED, THEN REDIRECT TO DASHBOARD, ELSE GO CHECKOUT
      const response = isPro ? await createCustomerPortalSession() : await createStripeSession();
      if (response.url) window.location.href = response.url;
    });
  };

  return (
    <BaseDialog isOpen={isOpen} type={type} targetType="subscription" onClose={onClose}>
      <header className="flex items-center justify-between mb-6">
        <button 
          onClick={onClose}
          className="h-9 w-9 bg-[#F2F2F2] text-[#494949] hover:text-[#494949] hover:cursor-pointer active:scale-95 transition-all rounded-full flex items-center justify-center"
        >
          <X size={20} strokeWidth={2.5} />
        </button>
        <h1 className="text-15 font-semibold text-[#494949] tracking-tight">Subscription</h1>
        <div className="w-9" /> {/* Pusty div dla wyśrodkowania tytułu */}
      </header>

      {/* WIDOK DLA UŻYTKOWNIKA PRO */}
      {isPro ? (
        <div className="flex flex-col items-center mb-2">
          <div className="w-16 h-16 bg-linear-to-tr from-[#4F39F6] to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-md shadow-purple-500/20">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-950">VocabApp PRO</h2>
          
          {/* Status Subskrypcji */}
          {cancelAtPeriodEnd ? (
            <p className="text-[13px] text-orange-600 font-bold bg-orange-50 px-3 py-1 rounded-full mt-2 flex items-center gap-1.5">
              <AlertCircle size={14} strokeWidth={2.5} /> Cancels at period end
            </p>
          ) : (
            <p className="text-[13px] text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full mt-2">
              Active Subscription
            </p>
          )}
          
          <div className="w-full bg-[#F2F2F7] rounded-2xl p-5 mt-6 border border-gray-200">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
              <span className="text-15 text-gray-600 font-medium">Current Plan</span>
              <span className="text-15 text-gray-950 font-bold">$8.00 / month</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-15 text-gray-600 font-medium">
                {cancelAtPeriodEnd ? "Access until" : "Next billing date"}
              </span>
              <span className="text-15 text-gray-950 font-bold">
                {periodEnd ? new Date(periodEnd).toLocaleDateString() : "-"}
              </span>
            </div>
          </div>

          <button 
            onClick={handleAction}
            disabled={isPending}
            className="w-full mt-6 bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {isPending ? <Loader2 size={20} className="animate-spin text-gray-500" /> : <ExternalLink size={18} strokeWidth={2.5} />}
            Manage in Stripe Portal
          </button>
        </div>
      ) : (
       

        // FREE TIER VIEW
        <div className="flex flex-col gap-4 mb-2">
          <div className="bg-[#F2F2F2] border-[0.5px] border-[#E1E1E1] rounded-3xl overflow-hidden p-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3">
              <span className="text-15 text-black font-medium">Current Plan</span>
              <span className="text-15 text-gray-950 font-bold">Free</span>
            </div>
            <ul className="space-y-2 mt-2">
              <li className="text-[14px] text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Up to 3 Decks
              </li>
              <li className="text-[14px] text-gray-600 flex items-center gap-2"> 1 Storyboard
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> 
              </li>
            </ul>
          </div>

          {/* Ciemny przycisk akcji na jasnym tle */}
          <div className="bg-gray-950 rounded-3xl p-6 text-white text-center shadow-lg">
            <h3 className="text-2xl font-bold mb-1">Go Pro</h3>
            <p className="text-gray-400 text-xs font-medium mb-6">Unlimited decks & storyboards for just $8/month.</p>
            
            <button 
              onClick={handleAction}
              disabled={isPending}
              className="w-full bg-white text-gray-950 hover:bg-gray-100 py-3.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 size={20} className="animate-spin text-gray-950" /> : <CreditCard size={18} strokeWidth={2.5} className="text-gray-950" />}
              Upgrade
            </button>
          </div>
        </div>
      )}
    </BaseDialog>
  );
};