const teamsUrl = "https://caltopo.com/about/teams/";

export function CalTopoTeamsLink() {
  return (
    <a
      className="inline-link"
      href={teamsUrl}
      target="_blank"
      rel="noreferrer"
    >
      CalTopo Teams
    </a>
  );
}

export function CalTopoTeamsText({ text }: { text: string }) {
  const [before, after] = text.split("CalTopo Teams");

  if (after === undefined) {
    return text;
  }

  return (
    <>
      {before}
      <CalTopoTeamsLink />
      {after}
    </>
  );
}
