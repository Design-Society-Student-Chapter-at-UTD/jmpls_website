import logoUrl from "../assets/logo.jpeg";

export function Head() {
  return (
    <>
      <title>UTD JMPLS | The John Marshall Pre-Law Society</title>
      <meta name="description" content="Official website of the John Marshall Pre-Law Society at UT Dallas. Empowering future legal professionals through mentorship, events, and resources." />
      <link rel="icon" href={`${logoUrl}?v=2`} />
      <link rel="apple-touch-icon" href={`${logoUrl}?v=2`} />
      <link rel="apple-touch-icon-precomposed" href={`${logoUrl}?v=2`} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Segoe+UI&display=swap" rel="stylesheet" />
    </>
  );
}
