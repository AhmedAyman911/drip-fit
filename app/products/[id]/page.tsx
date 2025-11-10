import SingleItem from "@/components/Product page/SingleItem";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <SingleItem id={id} />
  );

}