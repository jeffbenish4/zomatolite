import RestaurantClient from "./restaurant-client";

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RestaurantClient restaurantId={id} />;
}
