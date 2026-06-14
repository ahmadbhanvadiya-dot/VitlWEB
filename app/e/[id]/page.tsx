export default async function EmergencyPage(props: any) {
  console.log("FULL PROPS:", JSON.stringify(props, null, 2));

  return (
    <pre>
      {JSON.stringify(props, null, 2)}
    </pre>
  );
}