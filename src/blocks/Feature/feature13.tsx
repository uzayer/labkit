const Feature13 = () => {
  return (
    <section className="py-32">
      <div className="container max-w-7xl">
        <h2 className="text-3xl font-medium lg:text-4xl">A better way to build websites</h2>
        <div className="mt-20 grid gap-9 lg:grid-cols-2">
          <div className="bg-accent flex flex-col justify-between rounded-lg">
            <div className="flex justify-between gap-10 border-b">
              <div className="flex flex-col justify-between gap-14 py-6 pl-4 md:py-10 md:pl-8 lg:justify-normal">
                <p className="text-muted-foreground text-xs">FOR DESIGNERS</p>
                <h3 className="text-2xl md:text-4xl">Built for artists and designers</h3>
              </div>
              <div className="md:1/3 w-2/5 shrink-0 rounded-r-lg border-l">
                <img
                  src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
                  alt="placeholder"
                  className="size-full object-cover"
                />
              </div>
            </div>
            <div className="text-muted-foreground p-4 md:p-8">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima doloribus illum,
              labore quis facilis molestias!
            </div>
          </div>
          <div className="bg-accent flex flex-col justify-between rounded-lg">
            <div className="flex justify-between gap-10 border-b">
              <div className="flex flex-col justify-between gap-14 py-6 pl-4 md:py-10 md:pl-8 lg:justify-normal">
                <p className="text-muted-foreground text-xs">FOR DEVELOPERS</p>
                <h3 className="text-2xl md:text-4xl">Built for coders and developers</h3>
              </div>
              <div className="md:1/3 w-2/5 shrink-0 rounded-r-lg border-l">
                <img
                  src="https://www.shadcnblocks.com/images/block/placeholder-4.svg"
                  alt="placeholder"
                  className="size-full object-cover"
                />
              </div>
            </div>
            <div className="text-muted-foreground p-4 md:p-8">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Minima doloribus illum,
              labore quis facilis molestias!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feature13
