"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, MessageCircle, Mail, RotateCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { InvitationStatusTimeline } from "./InvitationStatusTimeline";

interface InvitationData {
  athleteName: string;
  category: string;
  primaryEvent: string;
  groupName: string;
  invitationCode: string;
  inviteUrl: string;
  status: "pending" | "viewed" | "joined" | "expired";
}

interface InvitationCreatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData | null;
}

export function InvitationCreatedModal({ isOpen, onClose, data }: InvitationCreatedModalProps) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.invitationCode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0A0C10] border border-[#1F2937] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#1F2937] flex items-center justify-between bg-[#11141A]">
                <div>
                  <h2 className="text-lg font-bold text-white">Invitation Created</h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">Share this invite with your athlete</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#1F2937] hover:bg-[#374151] flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-8 bg-gradient-to-b from-[#11141A] to-[#0A0C10]">
                
                {/* QR Code & Invite Code Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* QR Card */}
                  <div className="relative group shrink-0">
                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-[#8B5CF6] to-[#EC4899] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-white p-3 rounded-2xl shadow-xl">
                      <QRCodeSVG value={data.inviteUrl} size={140} level="H" includeMargin={false} />
                    </div>
                  </div>

                  {/* Code & Details */}
                  <div className="flex-1 w-full flex flex-col gap-4">
                    <div className="bg-[#1F2937]/50 border border-[#374151] rounded-xl p-4 flex flex-col items-center justify-center relative cursor-pointer hover:bg-[#1F2937] transition-colors" onClick={handleCopyCode}>
                      <span className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-wider absolute top-2 left-3">Invite Code</span>
                      <span className="text-3xl font-mono font-bold tracking-[0.2em] text-white mt-4">
                        {data.invitationCode}
                      </span>
                    </div>

                    <div className="bg-[#11141A] border border-[#1F2937] rounded-xl p-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#6B7280]">Athlete</span>
                        <span className="font-semibold text-[#E5E7EB]">{data.athleteName || 'Unnamed Athlete'}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#6B7280]">Group</span>
                        <span className="font-medium text-[#E5E7EB]">{data.groupName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-[#6B7280]">Classification</span>
                        <span className="font-medium text-[#8B5CF6]">{data.category} / {data.primaryEvent}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="py-2">
                  <InvitationStatusTimeline status={data.status} />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      copied 
                        ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30' 
                        : 'bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    }`}
                  >
                    <Copy size={16} /> {copied ? 'Link Copied!' : 'Copy Invite Link'}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const text = encodeURIComponent(`Join my training squad on CoachOS! Tap the link to accept: ${data.inviteUrl}`);
                        window.open(`https://wa.me/?text=${text}`, '_blank');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-medium text-xs bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 transition-colors"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        const subject = encodeURIComponent(`Invitation to join CoachOS`);
                        const body = encodeURIComponent(`Hi ${data.athleteName},\n\nYou've been invited to join the training squad on CoachOS.\n\nClick the link below to accept:\n${data.inviteUrl}\n\nOr enter code: ${data.invitationCode}`);
                        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl font-medium text-xs bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 border border-[#3B82F6]/30 transition-colors"
                    >
                      <Mail size={16} /> Email
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
