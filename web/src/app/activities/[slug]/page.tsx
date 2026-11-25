import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";

export const instant = false;

const activityImages: Record<string, string> = {
  "river-rafting": "/images/rafting.webp",
  "hiking": "/images/hiking.webp",
  "skiing": "/images/skiing.webp",
  "boating": "/images/boating.webp",
  "fishing": "/images/fishing.webp",
  "utah-national-parks": "/images/national-parks.webp",
  "stargazing": "/images/star gazing.webp",
  "hot-air-ballooning": "/images/hot air balloons.webp",
  "rock-climbing": "/images/rock-climbing.webp",
  "dumpling-making": "/images/cooking dumplings.webp",
  "team-cooking": "/images/couple cooking.webp",
  "asian-inspired-cooking": "/images/orange-chicken-bowl.webp",
  "homemade-ravioli": "/images/homemade-ravioli.webp",
  "fruit-tart-baking": "/images/fruit-tart.webp",
  "french-croissants": "/images/croissants.webp",
  "sourdough-bread-baking": "/images/sourdough.webp",
  "sushi-making": "/images/sushi.webp",
  "cake-decorating": "/images/cake-decorating.webp",
  "board-game-nights": "/images/boardgames.jpg",
  "pickleball-social-nights": "/images/pickleball.webp",
  "bonfire-smores": "/images/bonfire.webp",
  "potlucks-dessert-nights": "/images/potluck.webp",
  "murder-mystery-nights": "/images/murder-mystery.webp",
  "movie-popcorn-nights": "/images/popcorn.webp",
  "karaoke-nights": "/images/karaoke.webp",
  "escape-room-challenges": "/images/escape-rooms.webp",
  "puzzle-nights": "/images/puzzle-night.webp",
  "basketball": "/images/basketball.webp",
  "beach-volleyball": "/images/beach volleyball.webp",
  "soccer": "/images/group soccer.webp",
  "cycling": "/images/cycling.webp",
  "football": "/images/football-game.webp",
  "dancing": "/images/dancing on beach.webp",
  "mountain-climbing": "/images/mountain-climbing.webp",
  "arch-hiking": "/images/Arch hike.webp",
  "cross-country-skiing": "/images/cross-country-skiing.webp",
  "service-projects-care-kits": "/images/service-kits.webp",
  "community-cleanup-projects": "/images/community-cleanup.webp",
  "food-drives-donations": "/images/food-drive.webp",
  "helping-neighbors": "/images/helping-neighbors.webp",
  "blankets-handmade-donations": "/images/making-blankets.webp",
  "community-gardens-outdoor-service": "/images/community-garden.webp",
  "animal-shelter-volunteering": "/images/service-animal-shelter.webp",
  "community-meal-preparation": "/images/service-meal-prep.webp",
  "senior-center-volunteering": "/images/service-senior-center.webp",
  "painting-workshops": "/images/painting-class.webp",
  "cultural-exploration-traditions": "/images/cultural-event.webp",
  "book-clubs-discussions": "/images/book-club.webp",
  "gospel-study-discussions": "/images/gospel-study.webp",
  "life-skills-workshops": "/images/life-skills.webp",
  "music-talent-nights": "/images/music-night.webp",
  "pottery-workshops": "/images/pottery-class.webp",
  "photography-workshops": "/images/photography-workshop.webp",
  "guitar-classes": "/images/guitar-classes.webp",
};

export default async function ActivityDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const image = activityImages[slug] || "/images/rafting.webp";

  return (
    <div className={styles.page}>
      <main className={styles.main} style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px" }}>
        <Link href="/activities" style={{ color: "var(--teal)", marginBottom: "20px", display: "inline-block" }}>
          ← Back to activities
        </Link>

        <h1 style={{ fontSize: "2.4rem", color: "var(--navy)", margin: "20px 0" }}>{title}</h1>

        <div style={{ position: "relative", width: "100%", height: "320px", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
          <Image
            src={image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "#526171" }}>
          More details about this activity will appear here, including date, time, location, and how to participate.
        </p>

        <div style={{ marginTop: "30px", padding: "20px", background: "var(--cream)", borderRadius: "12px" }}>
          <h3 style={{ color: "var(--teal)", marginTop: 0 }}>Activity Info</h3>
          <p><strong>Location:</strong> South Jordan area</p>
          <p><strong>Date:</strong> To be announced</p>
          <p><strong>Participation:</strong> Open to young adults 20–35</p>
        </div>

        <div style={{ marginTop: "40px" }}>
          <h3 style={{ color: "var(--navy)" }}>Explore More</h3>
          <Link href="/activities" style={{ color: "var(--coral)", fontWeight: 600 }}>
            Browse all activity categories →
          </Link>
        </div>
      </main>
            <footer className={styles.footer}>
        <h3>Connect & Thrive</h3>
        <p>
          Building friendships. Creating connections. Strengthening communities.
        </p>
        <p className={styles.copyright}>
          © 2026 Connect & Thrive. Senior Project.
        </p>
      </footer>
    </div>
  );
}