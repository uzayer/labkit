import { ProductSpecsDesignVersion } from './config'
import ProductSpecs1 from '@/blocks/ProductSpecs/product-specs1'
import ProductSpecs2 from '@/blocks/ProductSpecs/product-specs2'

type ProductSpecs<T extends string = string> = Required<
  Record<ProductSpecsDesignVersion, React.FC<any>>
> &
  Record<T, React.FC<any>>

const productSpecs: ProductSpecs = {
  PRODUCTSPECS1: ProductSpecs1,
  PRODUCTSPECS2: ProductSpecs2,
}

export const ProductSpecsBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'product-specs') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const ProductSpecsToRender = productSpecs[designVersion as ProductSpecsDesignVersion]

  if (!ProductSpecsToRender) return null

  return <ProductSpecsToRender {...props} />
}

export default ProductSpecsBlock
