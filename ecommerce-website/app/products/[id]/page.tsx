import ProductDetail from '@/components/products/ProductDetail';

/**
 * Product Detail Page
 * Dynamic route for individual product pages
 */
export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetail productId={params.id} />;
}
