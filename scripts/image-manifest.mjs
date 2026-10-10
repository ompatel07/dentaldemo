/**
 * EVERY IMAGE SLOT IN THE TEMPLATE, IN ONE LIST.
 *
 * This file is the contract between /content and /public/images. Each slot
 * has exact pixel dimensions and a note on what the photograph should show,
 * so a real clinic's photographer can be handed one list.
 *
 * `photo` is the Unsplash photo id used for the DEMO. They are free-licence
 * stock images, there to make the template feel like a real clinic; replace
 * every one of them with the client's own photography before launch.
 *   npm run photos              download + crop every demo photo
 *   npm run photos -- --force   rebuild all of them
 *
 * `position` is the crop anchor (any sharp gravity, or "attention").
 * `crop` is an explicit crop of the source, as fractions [left, top, width, height].
 * `derive` builds a slot from another slot instead of downloading.
 */

export const images = [
  // ---- Hero ---------------------------------------------------------
  { path: "images/hero-chair.jpg", width: 1200, height: 1500, photo: "1598256989800-fe5f95da9787", crop: [0.12, 0, 0.5334, 1],
    label: "Hero: the chair", note: "The treatment chair in its room, bright and empty. The single most important photograph on the site - it also carries the headline on phones, so the lower third should be calm and fairly dark." },
  { path: "images/hero-clinic.jpg", width: 1200, height: 900, photo: "1629909613654-28e377c37b09", position: "centre",
    label: "Hero clinic", note: "The treatment room, wide, empty and bright." },
  { path: "images/og-default.jpg", width: 1200, height: 630,
    label: "Open Graph default", note: "Social share card. Not a photograph: `npm run og` captures it from the live hero, so it always matches the brand." },

  // ---- Manifesto ----------------------------------------------------
  { path: "images/manifesto-portrait.jpg", width: 1000, height: 1300, photo: "1590424693420-634a0b0b782c", position: "centre",
    label: "Manifesto: the bench", note: "Hands at work on a crown. Craft, not equipment." },
  { path: "images/manifesto-detail.jpg", width: 1000, height: 1000, photo: "1606811856475-5e6fcdc6e509", position: "centre",
    label: "Manifesto: instruments", note: "Mirror and explorer on a clean surface. Still life." },

  // ---- Treatments (portrait 4:5) ------------------------------------
  { path: "images/treatment-implants.jpg", width: 1200, height: 1500, photo: "1593022356769-11f762e25ed9", position: "centre",
    label: "Treatment: implants", note: "Implant model or a finished crown. Object, not procedure." },
  { path: "images/treatment-aligners.jpg", width: 1200, height: 1500, photo: "1564420228450-d9a5bc8d6565", position: "centre",
    label: "Treatment: aligners", note: "Clear trays in hand, visible edge detail." },
  { path: "images/treatment-veneers.jpg", width: 1200, height: 1500, photo: "1664529845836-433c172142ca", position: "centre",
    label: "Treatment: veneers", note: "Macro of finished front teeth." },
  { path: "images/treatment-whitening.jpg", width: 1200, height: 1500, photo: "1677026010083-78ec7f1b84ed", position: "attention",
    label: "Treatment: whitening", note: "A bright, natural smile in profile." },
  { path: "images/treatment-root-canal.jpg", width: 1200, height: 1500, photo: "1642844744022-d76a9af3711a", position: "centre",
    label: "Treatment: root canal", note: "Instruments, dark and precise. Reassuring, never gory." },
  { path: "images/treatment-kids.jpg", width: 1200, height: 1500, photo: "1631051103633-24959376b92d", position: "attention",
    label: "Treatment: kids", note: "A child at ease in the chair." },

  // ---- Before / after ----------------------------------------------
  // The demo "before" frames are derived from the "after" frames so the
  // pair lines up pixel for pixel. Real cases need real paired photographs,
  // identically framed and lit.
  { path: "images/case-01-after.jpg", width: 1400, height: 1050, photo: "1663182234283-28941e7612da", position: "centre", label: "Case 01 after", note: "Gap closed." },
  { path: "images/case-01-before.jpg", width: 1400, height: 1050, derive: { from: "images/case-01-after.jpg", look: "before" }, label: "Case 01 before", note: "Same framing and light as its after." },
  { path: "images/case-02-after.jpg", width: 1400, height: 1050, photo: "1654373535457-383a0a4d00f9", position: "centre", label: "Case 02 after", note: "Implant crowns placed." },
  { path: "images/case-02-before.jpg", width: 1400, height: 1050, derive: { from: "images/case-02-after.jpg", look: "before" }, label: "Case 02 before", note: "Two missing premolars." },
  { path: "images/case-03-after.jpg", width: 1400, height: 1050, photo: "1567516364473-233c4b6fcfbe", position: "attention", label: "Case 03 after", note: "Six veneers, restrained shade." },
  { path: "images/case-03-before.jpg", width: 1400, height: 1050, derive: { from: "images/case-03-after.jpg", look: "before" }, label: "Case 03 before", note: "Worn, chipped front teeth." },
  { path: "images/case-04-after.jpg", width: 1400, height: 1050, photo: "1675526607070-f5cbd71dde92", position: "attention", label: "Case 04 after", note: "Cleaned and whitened." },
  { path: "images/case-04-before.jpg", width: 1400, height: 1050, derive: { from: "images/case-04-after.jpg", look: "before" }, label: "Case 04 before", note: "Gum-line staining." },

  // ---- Doctors (portrait 4:5, consistent treatment) -------------------
  { path: "images/doctor-ira-mehta.jpg", width: 1000, height: 1250, photo: "1683349370055-7eba66a404c6", position: "attention", label: "Doctor: Ira Mehta", note: "In the clinic, relaxed, not a corporate headshot." },
  { path: "images/doctor-kabir-shah.jpg", width: 1000, height: 1250, photo: "1612531386530-97286d97c2d2", position: "attention", label: "Doctor: Kabir Shah", note: "Same lens and light as the rest of the team." },
  { path: "images/doctor-anaya-raval.jpg", width: 1000, height: 1250, photo: "1662837775286-7e6258c7c595", position: "attention", label: "Doctor: Anaya Raval", note: "Same lens and light as the rest of the team." },
  { path: "images/doctor-vivaan-desai.jpg", width: 1000, height: 1250, photo: "1674775372058-c4c8813c6611", position: "attention", label: "Doctor: Vivaan Desai", note: "Same lens and light as the rest of the team." },
  { path: "images/doctors-group.jpg", width: 1600, height: 1000, photo: "1588776814546-daab30f310ce", position: "centre", label: "Doctors page: at work", note: "The team mid-procedure. Candid, not a line-up." },

  // ---- Technology (landscape 4:3) -------------------------------------
  { path: "images/tech-intraoral-scanner.jpg", width: 1400, height: 1050, photo: "1667133295311-e6911e6e22db", position: "centre", label: "Tech: intraoral scanner", note: "The scan on screen, patient in frame." },
  { path: "images/tech-cbct.jpg", width: 1400, height: 1050, photo: "1600170311833-c2cf5280ce49", position: "centre", label: "Tech: CBCT", note: "3D imaging on a display." },
  { path: "images/tech-laser.jpg", width: 1400, height: 1050, photo: "1606811971618-4486d14f3f99", position: "centre", label: "Tech: laser", note: "Fine work, close up." },
  { path: "images/tech-smile-design.jpg", width: 1400, height: 1050, photo: "1588776814546-1ffcf47267a5", position: "centre", label: "Tech: smile design", note: "Planning from the imaging." },

  // ---- Comfort, quiz, booking ----------------------------------------
  { path: "images/comfort-room.jpg", width: 1200, height: 1500, photo: "1728342057953-94bfad8f0e7e", position: "centre", label: "Comfort: the quiet room", note: "An empty chair by a window. Calm, daylight." },
  { path: "images/comfort-detail.jpg", width: 1000, height: 1000, photo: "1607613009820-a29f7bb81c04", position: "centre", label: "Comfort: detail", note: "A soft still life. Nothing clinical." },
  { path: "images/quiz-portrait.jpg", width: 1000, height: 1250, photo: "1609840113929-b130355987e1", position: "attention", label: "Quiz portrait", note: "A patient with an aligner, playful." },
  { path: "images/booking-room.jpg", width: 1600, height: 1000, photo: "1722586663860-a0a372da5c57", position: "centre", label: "Booking: the chair", note: "The chair, waiting. Moody and inviting." },

  // ---- Testimonials ---------------------------------------------------
  { path: "images/testimonial-meera-poster.jpg", width: 900, height: 1200, photo: "1494790108377-be9c29b29330", position: "attention", label: "Video poster: Meera", note: "First frame of /video/testimonial-meera.mp4." },
  { path: "images/testimonial-rohan-poster.jpg", width: 900, height: 1200, photo: "1595152772835-219674b2a8a6", position: "attention", label: "Video poster: Rohan", note: "First frame of /video/testimonial-rohan.mp4." },
  { path: "images/patient-01.jpg", width: 400, height: 400, photo: "1535295972055-1c762f4483e5", position: "attention", label: "Patient avatar 01", note: "Square crop of a real patient, with consent." },
  { path: "images/patient-02.jpg", width: 400, height: 400, photo: "1611695434369-a8f5d76ceb7b", position: "attention", label: "Patient avatar 02", note: "Square crop of a real patient, with consent." },
  { path: "images/patient-03.jpg", width: 400, height: 400, photo: "1603654983938-a3ac86145bd2", position: "attention", label: "Patient avatar 03", note: "Square crop of a real patient, with consent." },

  // ---- Menu overlay hover previews -------------------------------------
  { path: "images/menu-treatments.jpg", width: 800, height: 1000, photo: "1593022356769-11f762e25ed9", position: "centre", label: "Menu preview: treatments", note: "Shown on hover in the fullscreen menu." },
  { path: "images/menu-transformations.jpg", width: 800, height: 1000, photo: "1654373535457-383a0a4d00f9", position: "centre", label: "Menu preview: transformations", note: "Shown on hover in the fullscreen menu." },
  { path: "images/menu-atelier.jpg", width: 800, height: 1000, photo: "1642844744022-d76a9af3711a", position: "centre", label: "Menu preview: the atelier", note: "Shown on hover in the fullscreen menu." },
  { path: "images/menu-dentists.jpg", width: 800, height: 1000, photo: "1683349370055-7eba66a404c6", position: "attention", label: "Menu preview: dentists", note: "Shown on hover in the fullscreen menu." },
  { path: "images/menu-pricing.jpg", width: 800, height: 1000, photo: "1607613009820-a29f7bb81c04", position: "centre", label: "Menu preview: pricing", note: "Shown on hover in the fullscreen menu." },
  { path: "images/menu-contact.jpg", width: 800, height: 1000, photo: "1609207825181-52d3214556dd", position: "centre", label: "Menu preview: contact", note: "Shown on hover in the fullscreen menu." },

  // ---- Inner pages ------------------------------------------------------
  { path: "images/contact-exterior.jpg", width: 1600, height: 1000, photo: "1609207825181-52d3214556dd", position: "centre", label: "Contact: the room", note: "The clinic, wide, daylight through the window." },
];

/** Video slots cannot be generated - they must be supplied. */
export const videos = [
  { path: "video/testimonial-meera.mp4", note: "6 to 10s muted loop, 720p, under 2MB. Plays on hover." },
  { path: "video/testimonial-rohan.mp4", note: "6 to 10s muted loop, 720p, under 2MB. Plays on hover." },
];
