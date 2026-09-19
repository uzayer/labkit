import { Contact1 } from "@/components/contact1";
import { director, labInfo } from "@/data";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with the DIAL lab for collaboration, media, and general enquiries.",
};

export default function ContactPage() {
  const pi = director();
  return (
    <Contact1
      email={labInfo.email ?? ""}
      address={labInfo.address ?? labInfo.institution}
      scholarUrl={pi?.socials?.find((s) => s.platform === "google-scholar")?.url}
    />
  );
}
