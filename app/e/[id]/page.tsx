export default async function EmergencyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <pre>{JSON.stringify(resolvedParams, null, 2)}</pre>
  );
}