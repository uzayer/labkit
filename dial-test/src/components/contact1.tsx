"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, LoaderIcon, Mail, MapPin } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  className?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const Contact1 = ({ className, onSubmit }: Contact1Props) => {
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
    <section className={cn("relative py-32", className)}>
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 bg-[radial-gradient(ellipse_35%_15%_at_40%_55%,var(--accent)_0%,transparent_100%)] lg:bg-[radial-gradient(ellipse_12%_20%_at_60%_45%,var(--accent)_0%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 bg-[radial-gradient(ellipse_35%_20%_at_70%_75%,var(--accent)_0%,transparent_80%)] lg:bg-[radial-gradient(ellipse_15%_30%_at_70%_65%,var(--accent)_0%,transparent_80%)]" />
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-20 bg-[radial-gradient(var(--accent-foreground)_1px,transparent_1px)] opacity-10 [mask-image:radial-gradient(ellipse_60%_60%_at_65%_50%,#000_0%,transparent_80%)] [background-size:8px_8px]" />

      <div className="container grid w-full grid-cols-1 gap-x-32 overflow-hidden lg:grid-cols-2">
        {/* Info sidebar */}
        <div className="w-full pb-10 md:pb-0">
          <div className="flex h-full flex-col justify-between gap-12 md:max-w-[40rem]">
            <div className="space-y-8">
              <div className="space-y-3">
                <h1 className="text-4xl font-medium lg:text-5xl">
                  Get in touch
                </h1>
                <p className="text-muted-foreground md:text-base lg:text-lg">
                  For collaboration, media, and general enquiries.
                </p>
              </div>

              <a
                href="mailto:nova.ahmed@northsouth.edu"
                className="flex items-center gap-2.5 text-lg font-medium transition-colors hover:text-muted-foreground"
              >
                <Mail className="size-5 shrink-0" />
                nova.ahmed@northsouth.edu
              </a>

              <div className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin className="mt-0.5 size-5 shrink-0" />
                <span>
                  SAC 1060, North South University, Dhaka, Bangladesh
                </span>
              </div>

              <div className="space-y-3">
                <a
                  href="https://scholar.google.com/citations?user=rXMM2MwAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GraduationCap className="size-4" />
                  Google Scholar
                </a>
                <a
                  href="https://www.researchgate.net/profile/Nova_Ahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68a3.193 3.193 0 0 0-.112.437 8.365 8.365 0 0 0-.078.53 9 9 0 0 0-.05.727c-.01.282-.013.621-.013 1.016a31.121 31.123 0 0 0 .014 1.017 9 9 0 0 0 .05.727 7.946 7.946 0 0 0 .077.53 3.198 3.198 0 0 0 .115.438c.243.743.65 1.303 1.214 1.68.565.376 1.256.564 2.075.564.8 0 1.536-.213 2.105-.603.57-.39.94-.916 1.163-1.544a4.224 4.224 0 0 0 .107-.358c.037-.157.07-.325.098-.508.028-.18.05-.37.062-.567.013-.197.02-.408.02-.624a31.129 31.123 0 0 0-.014-1.017 9 9 0 0 0-.05-.727 7.946 7.946 0 0 0-.077-.53 3.198 3.198 0 0 0-.115-.438c-.243-.743-.65-1.303-1.214-1.68C21.092.19 20.401 0 19.586 0zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.586 3.875c.484 0 .906.089 1.264.267.36.178.648.45.864.82.215.37.324.82.324 1.35v.072c0 .53-.109.98-.324 1.35-.216.37-.504.64-.864.82-.358.178-.78.267-1.264.267s-.906-.089-1.264-.267c-.36-.178-.648-.45-.864-.82C17.323 7.352 17.214 6.9 17.214 6.384v-.072c0-.53.109-.98.324-1.35.216-.37.504-.64.864-.82.358-.178.78-.267 1.264-.267zm-9.172.04h2.758c.98 0 1.748.248 2.304.744.556.496.834 1.193.834 2.09 0 .656-.16 1.212-.48 1.668-.32.456-.78.796-1.378 1.02l2.164 4.044H13.5l-1.926-3.712h-1.024v3.712H8.938V3.915zm1.612 1.358v2.64h1.02c.504 0 .888-.124 1.152-.37.264-.248.396-.6.396-1.056 0-.456-.13-.8-.39-1.032-.26-.232-.65-.348-1.17-.348H11.026z" />
                  </svg>
                  ResearchGate
                </a>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Looking to join the lab?{" "}
              <a
                href="/join-us"
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                See open positions →
              </a>
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex w-full justify-center lg:mt-2.5">
          <div className="relative flex w-full max-w-[30rem] min-w-[20rem] flex-col items-center overflow-visible md:min-w-[24rem]">
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="z-10 w-full"
            >
              <div className="w-full rounded-xl border border-border bg-card px-6 py-8 shadow-sm">
                {isSubmitted && (
                  <div
                    className={cn(
                      "mb-6 rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center transition-opacity duration-500",
                      showSuccess ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Thank you — we&apos;ll be in touch soon.
                    </p>
                  </div>
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
                    className="w-full"
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
        </div>
      </div>
    </section>
  );
};

export { Contact1 };
