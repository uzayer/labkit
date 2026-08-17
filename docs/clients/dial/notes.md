- need to decide on architecture for the block based auto populate based approach and template based detail pages the way payload does it.

- finally nailed the collection schemas, there’s a schema.md file with great info
- did a lot of back and forth between designing UI and redesigning schema to fit UI
    - since schema definition is done, lock it in
    - finish UI based on schema, no more schema updates
    - most blocks are done
    - news schema left to implement
- decide on authors in publication block
    - one approach is adding everyone to the team collection but that’s unmaintainable over time
    - might help with researchnet graphdb though
    - another option is creatable select so all fields optional except name
    - might run into first name last name issue with openalex api
    - could resort to text string 

- learn rust, find old nova project that’s kinda cool, redesign it (maybe), add llm use case, run model on embedded systems using rust
    - could use for bangla speech to text or synthesis
    - bigass project 2026 lesgo?!
- Blocks to add
    - CTA3

- research information management system SOLVED ‼️‼️
    - what can payload cms be used as a backend for
    - how does this tie into foundational software infra for dial
    - the research group collection APIs, whats up with that? any protection/rate limiting?
- research funders and partnerships pages

- team page
    - add dual CTA block that says contact us or join our team with link to frappe
    - build out individual pages for team members
        - great way to build exposure for people who don’t have a professional online presence yet, esp helpful for undergrads
- how can we insert photos in the projectpost block?
- photo gallery page
- build out nova ahmed block
- need to understand the strategy behind payblock’s implementation of the admin panel for block types and where it makes sense
    - since blocks are grouped by blocktype they assume that certain things will be shared between each block
    - this issue came up while connecting the about blocks to the CMS
    - it’s an inheritance problem, what’s the balance between shared controls on the admin panel between design variants and giving variant specific controls for each block
        - look at the mess inside about block admin panel config
        - features blocks has the same issue, could maybe understand from there
- need to think about how the block pulls and renders data because
    - project pages need to display publications only related to that project
        - projects already has relationships to publications, it can render from that list same way team members are rendered with avatars
    - publication page should display everything
- news page with news types, need to edit posts collection for that
- json-ld and AI SEO check out what that is


- create tone and style for copywriting
    - good to document
    - can put inside handbook

- adapt vetswhocode questions for researchers
    - tell them it’s formalising a growth structure and planning growth and accountability

- cool AI feature would be use deepseek ocr and do a sanity check if it’s a CV and a pdf upload can automatically add data to the database

- verify this 
- The JSON-LD Payload This is the "Silent Killer" feature. You mentioned Schema.org.
    - Don't lazy load this. Use Next.js generateMetadata or a jsonLd script tag in the server component.
    - The specific value: When Google Scholar crawls the site, if your ScholarlyArticle schema is perfect, DIAL's papers rank higher. This is a metric you can actually show the PI in Google Search Console after 3 months.

- set up doppler
- set up tailscale access to vps
- set up imgbot optimisation

- team block image upload needs 1:1 aspect ratio + convert to webp needed

- find a use for the demo website github action
    - cancel the workflow for now
    - could work great for a feature like link google scholar profile and it shows you an mvp of different combos to do with the schema
- integrate zod schemas for safety

notes on building academic websites for the global south

- will the shadcnblocks template license let me opensource this code because technically i did make a lot changes to it
    - it's MIT, so yes
- there is a fine balance of trying to showcase local wins and cultures and methodologies but the credibility factor is cutthroat because we’re automatically not getting the credibility a research lab should
- this doubles down on design where the focus is more on concrete wins in the academic world like publications and awards
- MIT gets to say things like “what if we could fly?” with a very speculative tone because it doesn’t have to worry about credibility
- we are trying to balance our own achievements vs inheriting credibility via western standards
    - this shows up in the DIAL alumni page
    - people going for a PhD abroad, people getting SWE jobs abroad
    - scholarship is tied to moving abroad which inherently discredits what is possible locally
- this is also why for social proof i had to put the collaboration logos smack beneath the hero which kinda sucked but i intentionally made them greyscale so we have that look of we know what we’re doing


notes on dial website

- resources4 append to project page to display publications
- resources2 can use for publications page
    - need to adapt heavily for displaying publications
    - also reuse for resources page
- casestudy3 use for project page
    - need to adapt custom block
    - blogpost type thing
