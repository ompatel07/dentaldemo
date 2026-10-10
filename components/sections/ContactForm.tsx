"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitEnquiry, type Enquiry } from "@/lib/contact";
import { site } from "@/content/site.config";
import { telHref } from "@/lib/format";
import { cx } from "@/lib/utils";

const empty: Enquiry = { name: "", phone: "", email: "", message: "", preferred: "phone" };

/**
 * The contact form.
 *
 * Four fields, because every extra one costs replies. Name and one way to
 * reach them is genuinely all that is needed; the message is optional and
 * says so.
 *
 * Like booking, it posts nowhere by default - lib/contact.ts is the single
 * seam to wire at launch.
 */
export function ContactForm() {
  const [data, setData] = useState<Enquiry>(empty);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [touched, setTouched] = useState(false);

  const nameOk = data.name.trim().length > 1;
  const reachOk = data.phone.trim().length > 5 || /.+@.+\..+/.test(data.email);
  const valid = nameOk && reachOk;

  const set = <K extends keyof Enquiry>(k: K, v: Enquiry[K]) => setData((d) => ({ ...d, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setState("sending");
    const res = await submitEnquiry(data);
    setState(res.ok ? "sent" : "error");
  };

  if (state === "sent") {
    return (
      <div className="rounded-mask border border-line bg-surface p-[clamp(1.5rem,3vw,2.5rem)]">
        <p className="display text-h2">Message received.</p>
        <p className="mt-4 max-w-[44ch] text-muted">
          Someone from the atelier will reply within two working hours. If it is urgent, please call rather than
          wait.
        </p>
        <a href={telHref(site.contact.emergencyPhone)} className="label mt-6 inline-block text-accent underline underline-offset-8">
          {site.contact.emergencyPhone}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field
        id="ct-name"
        label="Your name"
        value={data.name}
        onChange={(v) => set("name", v)}
        required
        invalid={touched && !nameOk}
        autoComplete="name"
      />
      <Field
        id="ct-phone"
        label="Phone"
        type="tel"
        value={data.phone}
        onChange={(v) => set("phone", v)}
        invalid={touched && !reachOk}
        autoComplete="tel"
      />
      <div className="sm:col-span-2">
        <Field
          id="ct-email"
          label="Email"
          type="email"
          value={data.email}
          onChange={(v) => set("email", v)}
          invalid={touched && !reachOk}
          autoComplete="email"
          hint="A phone number or an email - either is enough."
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="ct-message" className="label">
          Anything you would like us to know
        </label>
        <textarea
          id="ct-message"
          rows={4}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          className="mt-3 w-full resize-none rounded-md border border-line bg-transparent px-4 py-3 focus-visible:border-accent"
        />
        <p className="label mt-2">Optional. Nervous, in pain, or just comparing prices - all useful.</p>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="label">Best way to reach you</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["phone", "whatsapp", "email"] as const).map((option) => (
            <label
              key={option}
              className={cx(
                "cursor-pointer rounded-pill border px-5 py-2.5 transition-colors",
                data.preferred === option ? "border-accent bg-accent-bright text-accent-fg" : "border-line hover:border-accent",
              )}
            >
              <input
                type="radio"
                name="preferred"
                value={option}
                checked={data.preferred === option}
                onChange={() => set("preferred", option)}
                className="sr-only"
              />
              <span className="label !text-current capitalize">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {state === "error" ? (
        <p role="alert" className="text-sm text-accent sm:col-span-2">
          That did not send. Please call{" "}
          <a href={telHref(site.contact.phone)} className="underline underline-offset-4">
            {site.contact.phone}
          </a>
          .
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={state === "sending"} cursorLabel="Send" magnetic={false}>
          {state === "sending" ? "Sending" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  invalid,
  autoComplete,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  invalid?: boolean;
  autoComplete?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "mt-3 w-full rounded-md border bg-transparent px-4 py-3 focus-visible:border-accent",
          invalid ? "border-accent" : "border-line",
        )}
      />
      {hint ? <p className="label mt-2">{hint}</p> : null}
    </div>
  );
}
