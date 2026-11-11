import Link from "next/link";
import styles from "./page.module.css";

const adventures = [
  {
    title: "River Rafting",
    description:
      "Experience the excitement of rafting together! Enjoy beautiful scenery, teamwork, and an unforgettable adventure on the water.",
    image: "/images/rafting.webp",
  },
  {
    title: "Hiking",
    description:
      "Explore scenic trails, enjoy fresh mountain air, and make new friends while discovering the beauty of nature.",
    image: "/images/hiking.webp",
  },
  {
    title: "Skiing",
    description:
      "Hit the slopes for a fun winter adventure! Enjoy skiing, learning new skills, and spending time with friends.",
    image: "/images/skiing.webp",
  },
  {
    title: "Boating",
    description:
      "Spend a day on the lake enjoying sunshine, beautiful views, and great company.",
    image: "/images/boating.webp",
  },
  {
    title: "Fishing",
    description:
      "Relax by the water, learn fishing techniques, and enjoy meaningful conversations with friends.",
    image: "/images/fishing.webp",
  },
  {
    title: "Utah National Parks",
    description:
      "Discover Utah's incredible national parks, from Zion and Bryce Canyon to Arches, Canyonlands, and Capitol Reef.",
    image: "/images/national-parks.webp",
  },
  {
    title: "Stargazing",
    description:
      "Spend an evening under the stars, explore constellations, and enjoy peaceful conversations while making new friends.",
    image: "/images/star gazing.webp",
  },
  {
    title: "Hot Air Ballooning",
    description:
      "Enjoy breathtaking views and a memorable adventure floating above the landscape with friends.",
    image: "/images/hot air balloons.webp",
  },
  {
    title: "Rock Climbing",
    description:
      "Challenge yourself, learn climbing skills, and encourage one another while exploring new heights.",
    image: "/images/rock-climbing.webp",
  },
];


export default function OutdoorAdventures() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/activities" className={styles.backLink}>
          ← Back to all activities
        </Link>

        <header className={styles.heading}>
          <p className={styles.eyebrow}>EXPLORE THE OUTDOORS</p>
          <h1>Outdoor Adventures</h1>
          <p>
            Discover new places, enjoy exciting experiences,
            and build lasting friendships along the way.
          </p>
        </header>

        <section className={styles.grid} aria-label="Outdoor activity ideas">
          {adventures.map((adventure) => (
            <article className={styles.card} key={adventure.title}>
              <img
                src={adventure.image}
                alt={adventure.title}
                className={styles.cardImage}
              />
              <div className={styles.cardContent}>
                <h2>{adventure.title}</h2>
                <p>{adventure.description}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
