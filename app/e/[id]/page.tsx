export default async function EmergencyPage(props: any) {
  console.log("FULL PROPS:", props);

  return (
    <div>
      <h1>DEBUG</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
      <p>Current URL route hit</p>
    </div>
  );
}