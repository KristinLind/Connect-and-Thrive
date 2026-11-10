import Link from "next/link";

export default function ServiceOpportunities() {
  return (
    <div style={{ padding: "80px 6%", textAlign: "center" }}>
      <h1>Service Opportunities</h1>
      <p>Activities for this category will appear here.</p>
      <Link href="/activities">← Back to all categories</Link>
    </div>
  );
}