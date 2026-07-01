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

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  mapQuery: string;
}

interface Contact22Props {
  title?: string;
  description?: string;
  locations?: Location[];
  className?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const Contact22 = ({
  title = "Our Locations",
  description = "Visit one of our offices or send us a message. We have locations across the country to better serve you.",
  locations = [
    {
      id: "nyc",
      name: "New York",
      address: "350 Fifth Avenue, Suite 4200",
      city: "New York, NY 10118",
      phone: "+1 (212) 555-0123",
      email: "nyc@lawfirm.com",
      mapQuery: "Empire State Building, New York, NY",
    },
    {
      id: "la",
      name: "Los Angeles",
      address: "633 West 5th Street, Suite 2600",
      city: "Los Angeles, CA 90071",
      phone: "+1 (213) 555-0456",
      email: "la@lawfirm.com",
      mapQuery: "633 West 5th Street, Los Angeles, CA",
    },
    {
      id: "chicago",
      name: "Chicago",
      address: "233 South Wacker Drive, Suite 8400",
      city: "Chicago, IL 60606",
      phone: "+1 (312) 555-0789",
      email: "chicago@lawfirm.com",
      mapQuery: "Willis Tower, Chicago, IL",
    },
    {
      id: "miami",
      name: "Miami",
      address: "1395 Brickell Avenue, Suite 800",
      city: "Miami, FL 33131",
      phone: "+1 (305) 555-0234",
      email: "miami@lawfirm.com",
      mapQuery: "1395 Brickell Avenue, Miami, FL",
    },
    {
      id: "boston",
      name: "Boston",
      address: "100 Federal Street, Suite 2000",
      city: "Boston, MA 02110",
      phone: "+1 (617) 555-0567",
      email: "boston@lawfirm.com",
      mapQuery: "100 Federal Street, Boston, MA",
    },
    {
      id: "seattle",
      name: "Seattle",
      address: "1201 Third Avenue, Suite 5400",
      city: "Seattle, WA 98101",
      phone: "+1 (206) 555-0890",
      email: "seattle@lawfirm.com",
      mapQuery: "1201 Third Avenue, Seattle, WA",
    },
  ],
  className,
  onSubmit,
}: Contact22Props) => {
  const [selectedLocation, setSelectedLocation] = useState<Location>(
    locations[0],
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        console.log("Form submitted:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
    <section className={cn("py-32", className)}>
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-5">
            {/* Locations sidebar */}
            <div className="space-y-2 lg:col-span-2">
              {locations.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setSelectedLocation(location)}
                  className={cn(
                    "w-full rounded-lg p-4 text-left transition-colors",
                    selectedLocation.id === location.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <p className="font-medium">{location.name}</p>
                  <p
                    className={cn(
                      "text-sm",
                      selectedLocation.id === location.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {location.address}
                  </p>
                </button>
              ))}
            </div>

            {/* Map and form */}
            <div className="space-y-6 lg:col-span-3">
              <div className="overflow-hidden rounded-xl">
                <iframe
                  title={`Map of ${selectedLocation.name} office`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(selectedLocation.mapQuery)}&output=embed`}
                  className="aspect-video w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="rounded-xl bg-muted/50 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-medium">
                      {selectedLocation.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedLocation.city}
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 border-t pt-4 text-sm">
                  <a
                    href={`tel:${selectedLocation.phone}`}
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                    {selectedLocation.phone}
                  </a>
                  <a
                    href={`mailto:${selectedLocation.email}`}
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <svg
                      className="size-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                    {selectedLocation.email}
                  </a>
                </div>
              </div>

              <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                {isSubmitted && (
                  <div
                    className={cn(
                      "rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center transition-opacity duration-500",
                      showSuccess ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Thank you! Your message has been sent.
                    </p>
                  </div>
                )}

                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                  </div>

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
                          rows={3}
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
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <LoaderIcon className="mr-2 size-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Contact22 };
