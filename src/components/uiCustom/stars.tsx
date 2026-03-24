import { Star } from 'lucide-react'

export const Stars: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {rating &&
        Array.from({ length: Math.floor(rating) }).map((_, i) => (
          <Star className="size-5 fill-yellow-400 text-yellow-400" key={i} />
        ))}
      {rating && rating % 1 !== 0 && rating % 1 > 0.8 && (
        <Star className="size-5 fill-yellow-400 text-yellow-400" />
      )}
      {rating && rating % 1 !== 0 && rating % 1 <= 0.8 && (
        <div className="relative">
          <Star className="size-5 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="size-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )}
    </div>
  )
}
