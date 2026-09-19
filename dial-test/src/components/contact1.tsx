"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextLink } from "@/components/editorial";
import { CropMarks, MarginNote, Squiggle, StampRing } from "@/components/marks";
import { enterStep } from "@/lib/motion";
import { label, lede, pageTitle } from "@/lib/typography";
import { cn } from "@/lib/utils";

const linkClass =
  "underline decoration-border underline-offset-[6px] transition-colors hover:decoration-current";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface Contact1Props {
  /** Lab contact details, from LabInfo. */
  email: string;
  address: string;
  scholarUrl?: string | null;
  className?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const Contact1 = ({ email, address, scholarUrl, className, onSubmit }: Contact1Props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: { name: "", email: "", message: "" },
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
          headers["cf-turnstile-token"] =
            (document.querySelector<HTMLInputElement>(
              "[name=cf-turnstile-response]",
            )?.value ?? "");
        }
        const response = await fetch("/api/form-submissions", {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error("Contact form request failed");
        }
      }
      setIsSubmitted(true);
      setShowSuccess(true);
      form.reset();
      setTimeout(() => setShowSuccess(false), 4500);
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      form.setError("root", {
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    // Contact was the last surface still outside the system: no crop marks, no
    // composition, no drawn marks. It is a printed sheet like every other page.
    <section className={cn("relative isolate container pt-16 pb-24 md:pt-24", className)}>
      {/* No bleeding composition here, deliberately: every other page has an
          open right margin for one, and this page has a form in it. The stamp
          does the work instead — which is the right mark for a contact page. */}
      <CropMarks className="ink-mark-soft top-8 md:top-10" />
      <p className={cn(label, "enter")} style={enterStep(0)}>
        Contact
      </p>
      <div className="enter relative mt-4 w-fit" style={enterStep(1)}>
        <h1 className={pageTitle}>Get in touch</h1>
        <Squiggle className="ink-mark mt-1 max-w-md" />
      </div>

      <div className="relative mt-10 grid gap-12 pt-6 lg:grid-cols-[1fr_minmax(0,30rem)] lg:gap-24">
        <span aria-hidden className="enter-rule absolute inset-x-0 top-0 h-px bg-border" style={enterStep(2)} />
        <div className="enter flex flex-col gap-10" style={enterStep(3)}>
          <p className={lede}>For collaboration, media, and general enquiries.</p>

          <dl className="text-sm">
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-pretty">{address}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-4 border-y border-border py-3">
              <dt className="text-muted-foreground">Elsewhere</dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-1">
                {scholarUrl && (
                  <a href={scholarUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Google Scholar
                  </a>
                )}
                <a
                  href="https://www.researchgate.net/profile/Nova_Ahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  ResearchGate
                </a>
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <TextLink href="/join-us" className="text-muted-foreground hover:text-foreground">
              Looking to join the lab? See open positions
            </TextLink>
            {/* Restates the line above it; the note adds no new claim. */}
            <MarginNote className="pb-0.5">that is a different door</MarginNote>
          </div>

          {/* The Lab's own stamp, in the open space under the address. */}
          <StampRing className="sticker ink-mark-soft mt-4 size-52 max-lg:hidden" />
        </div>

            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="enter z-10 w-full"
              style={enterStep(4)}
            >
              <div className="w-full">
                {isSubmitted && (
                  <p
                    role="status"
                    className={cn(
                      "mb-6 border-l-2 border-brand py-1 pl-3 text-sm text-brand transition-opacity duration-300",
                      showSuccess ? "opacity-100" : "opacity-0",
                    )}
                  >
                    Thank you. We&apos;ll be in touch soon.
                  </p>
                )}

                <FieldGroup className="gap-6">
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Name <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Your name"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Email <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type="email"
                          aria-invalid={fieldState.invalid}
                          placeholder="you@example.com"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="message"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Message <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="How can we help you?"
                          rows={5}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {form.formState.errors.root && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.root.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-fit rounded-full px-5 transition-transform duration-150 ease-snappy active:scale-[0.97]"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <LoaderIcon className="mr-2 size-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                </FieldGroup>
              </div>
            </form>
      </div>
    </section>
  );
};

export { Contact1 };
