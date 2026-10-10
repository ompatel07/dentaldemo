import type { ComfortItem } from "./types";

/**
 * The comfort menu for section 08, laid out like a spa menu. Notes read as
 * prices but say "included" - that contrast is the point of the section.
 */

export const comfort: ComfortItem[] = [
  {
    name: "Noise-cancelling headphones",
    body: "The drill is a sound before it is a sensation. Bring your own playlist or use ours, and we will tap your shoulder rather than talk over it.",
    note: "Included",
  },
  {
    name: "The raised hand",
    body: "Lift a hand at any point and everything stops - mid-drill, mid-sentence, mid-anything. No explanation needed, no sighing, no finishing just this bit first.",
    note: "Always",
  },
  {
    name: "Told before it is done",
    body: "Every instrument is named and shown before it goes near you. If you would rather not know, say so once and we will stay quiet instead.",
    note: "Your choice",
  },
  {
    name: "Sedation, three ways",
    body: "Inhalation sedation for the mildly uneasy, oral sedation for the dreading, and intravenous sedation with an anaesthetist for the genuinely phobic.",
    note: "Quoted upfront",
  },
  {
    name: "Weighted blanket",
    body: "Fourteen pounds across the chest and lap. It sounds trivial and it is the single most requested thing on this list.",
    note: "Included",
  },
  {
    name: "A first visit with no treatment",
    body: "Sit in the chair, meet the room, ask everything, and leave without anything being done. Many patients need two of these before the third.",
    note: "Free",
  },
  {
    name: "Appointments at the quiet end of the day",
    body: "First slot of the morning or last of the evening, when the waiting room is empty and nothing behind you is running late.",
    note: "On request",
  },
  {
    name: "Someone in the room with you",
    body: "A partner, a parent, a friend, holding your hand throughout. We will work around them.",
    note: "Always",
  },
];
