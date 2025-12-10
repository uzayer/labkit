const Feature30 = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-16 md:grid md:grid-cols-3 md:gap-10">
          <div className="bg-muted order-1 flex h-full items-end rounded-lg pt-10 pr-5 md:pt-20 md:pr-10">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-dark-1.svg"
              alt="placeholder"
              className="size-full rounded-tr-lg object-cover"
            />
          </div>
          <div className="bg-muted order-3 rounded-lg pt-10 pl-5 md:order-2 md:col-span-2 md:pt-20 md:pl-10">
            <img
              src="https://www.shadcnblocks.com/images/block/placeholder-dark-8.svg"
              alt="placeholder"
              className="max-h-[500px] w-full rounded-tl-lg object-cover"
            />
          </div>
          <div className="order-2 -mt-6 md:order-3">
            <p className="text-muted-foreground mb-6 text-sm md:mb-12">
              Lorem ipsum dolor sit amet.
            </p>
            <h3 className="mb-3 text-2xl font-medium md:mb-6">Quality and Durability</h3>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi distinctio maiores sint
              cupiditate ab ullam numquam a similique vel itaque.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Feature30
