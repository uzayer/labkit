### A View from the Trenches: The PI's Narrative

**I am**: A tenure-track Principal Investigator (PI) or Lab Manager who runs a small, high-churn research group. I live and die by my publication record and grant funding, not my bounce rate. I have zero budget for "marketing" and zero patience for software that requires maintenance.

**Trying to**: Establish academic credibility, archive my lab's output (publications/datasets) for grant reporting, and attract high-quality students.

**But**: The Institutional Firewall, the "Zombie" Risk, and the Data Entry Tax get in the way.

**Which makes me feel**: Resigned to using Google Sites or raw HTML because they are the only tools that don't eventually turn into a liability, even though I know they make my world-class research look outdated.

# Main Problem It Solves

- They are functional in the sense they get the job done while demanding nothing but also giving nothing.
  
- Directors and PIs view their website as a living CV not a Product Landing Page.
  
- Brutalist design where "substance over style" is a cultural force. Polished and marketing heavy sites harm academic credibility and signal product selling tendencies over "serious academic research"

## Information Density Utility for UX

- The primary user behavior is **scanning** not browsing
  
- A Google Sites website can list multiple citations in one dense view and an interested researcher can just `cmd + f` to find a paper instantly so the site's ugliness is ignored as this works like a data retrieval interface.
  
- Most researchers only really care about the publication list
  
- A modern card or bento layout is more useful for marketing products, there's no pre-built UI components for academia that also look great

## Bureaucratic Hurdles like a University IT Firewall

- Biggest reason why "SaaS for Labs" fails. Many `.edu` domains are restricted, and PIs cannot point DNS records to external SaaS providers

- Many University IT departments have strict policies against external IT solutions as a preventative measure against ransomware and data leaks. They will not let a lab point a `.edu` subdomain to an external server like Vercel or Digital Ocean.
  
- The ugly site survives because it is just a folder of HTML files dropped onto the university's internal FTP server. It requires no security review, no maintenance, and costs nothing
## Data Interoperability

- Old HTML sites are incredibly easy to scrape. Google Scholar and other indexers love simple HTML. Modern React/Next.js sites (Client-Side Rendering) can sometimes hurt discoverability if not heavily optimised (SSR/SEO).
	- solved this via schema.org & openalex mappings -> json-ld header injection

# Constraints in building academic sites

## Labs are inherently a high-churn environment

- A fancy website is a liability

- A student who builds a site for the lab eventually graduates and without maintenance docs or knowledge the site simply dies.
	- This is the "zombie" risk. the site will break and the PI won't know how to fix it.
	
- An academic lab is a high-churn environment by default. All core infrastructural design must keep this in mind.

## The Data Entry Bottleneck

- To update the website, a grad student has to manually find, copy, paste, and format new publications. This is manageable if the only thing being updated is the publication list.
	- The target audience being prioritised here is other researchers who care about academic credibility. They will conveniently ignore that the news section hasn't been updated in years.
	- This in turn deters new talent joining the lab. When the news section stagnates it indicates a stagnant culture at the lab.

- The Competitor Failure: Most CMSs still require manual _input_. They don't automate the fetch, which is the real administrative busywork that takes time away from research.
	- My current solution doesn't do this either but it does make it easier

- ResearchGate/Academia.edu
	- These solve the "network" problem, but the PI doesn't own the data. They can't customise the look and they have to deal with ads or paywalls.
  
- University Profiles: These are rigid, ugly, and usually managed by HR/Admin, not the lab. They list "Courses Taught" but rarely "Lab Culture" or "News." 

## The Mismatch with Current Tools

- Wix/Squarespace: Built for "Products" and "Blogs."
	- E.g. an academic publication is not a blog post. It is a `<ScholarlyArticle>` defined by schema.org     

- Academia: Built for "Papers" and "People."

- The Gap: A Lab is a specific entity. It is a collection of Grants, Alumni, Datasets, and more interconnected data collections.
	- e.g. In Wix, linking a "Grant" to a "Student" to a "Paper" requires manual hyperlinking.
	- For an academic site's CMS this should be native. No generic builder solves this relational web.

---

The sites are effectively "Roaches" - ugly, but they survive everything (server rot, student churn, IT audits). To win, a new solution cannot just be a "Prettier Roach." It must be an "Automated Roach."