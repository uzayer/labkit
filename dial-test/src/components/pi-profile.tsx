import { TextLink } from "@/components/editorial";
import { label } from "@/lib/typography";
import { InitialTile } from "@/components/initial-tile";
import { OptionalImage } from "@/components/optional-image";
import { cn } from "@/lib/utils";

export interface PIProfileData {
  name: string;
  title: string;
  photo?: string | null;
  bio?: string | null;
  awards: string[];
  scholarUrl?: string | null;
  email?: string | null;
  profileHref: string;
}

interface PIProfileProps {
  pi: PIProfileData;
  className?: string;
}

/** The Lab's director, featured above the roster. */
const PIProfile = ({ pi, className }: PIProfileProps) => (
  <section className={cn("container", className)}>
    <div className="grid gap-10 border-t border-border pt-6 md:grid-cols-[minmax(0,20rem)_1fr] md:gap-16">
      {pi.photo ? (
        <div className="relative w-full max-w-80">
          <OptionalImage
            src={pi.photo}
            alt={pi.name}
            overlay={<span aria-hidden className="tape -top-3 left-8 z-10" />}
            frameClassName="aspect-[4/5] w-full rounded-sm shadow-[0_1px_0_0_var(--paper-line),0_12px_28px_-18px_rgba(0,0,0,0.55)]"
            className="h-full w-full object-cover object-top"
            fallback={<InitialTile name={pi.name} className="aspect-[4/5] h-auto w-full max-w-80 rounded-lg font-display text-7xl" />}
          />
        </div>
      ) : (
        <InitialTile
          name={pi.name}
          className="aspect-[4/5] h-auto w-full max-w-80 rounded-lg font-display text-7xl"
        />
      )}

      <div className="flex flex-col">
        <p className={label}>Director</p>
        <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Dr. {pi.name}</h2>
        <p className="mt-2 text-muted-foreground">{pi.title}</p>

        {pi.bio && <p className="mt-6 max-w-prose text-pretty leading-relaxed md:text-lg">{pi.bio}</p>}

        {pi.awards.length > 0 && (
          <ul className="mt-8 max-w-prose divide-y divide-border border-y border-border text-sm">
            {pi.awards.map((award) => (
              <li key={award} className="py-2.5">
                {award}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          <TextLink href={pi.profileHref}>Full profile</TextLink>
          {pi.scholarUrl && (
            <TextLink href={pi.scholarUrl} external className="text-muted-foreground hover:text-foreground">
              Google Scholar
            </TextLink>
          )}
          {pi.email && (
            <a
              href={`mailto:${pi.email}`}
              className="text-sm text-muted-foreground underline decoration-border underline-offset-[6px] transition-colors hover:text-foreground"
            >
              {pi.email}
            </a>
          )}
        </div>
      </div>
    </div>
  </section>
);

export { PIProfile };
