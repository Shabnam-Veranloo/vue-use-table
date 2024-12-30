async function getData() {
  const data = await fetch("/records.json").then((res) => res.json());

  return data;
}

export default getData;
