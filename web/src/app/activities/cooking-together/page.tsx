import Image from "next/image";
import Link from "next/link";
import homeStyles from "../../page.module.css";
import styles from "./page.module.css";
import UpcomingEventsBanner from "@/components/UpcomingEventsBanner";

const cookingActivities = [
  {
    title: "Dumpling Making",
    description:
      "Learn to fold and prepare delicious dumplings while sharing laughs and discovering new cooking techniques.",
    image: "/images/cooking dumplings.webp",
  },
  {
    title: "Team Cooking",
    description:
      "Work together to prepare a delicious meal, share favorite recipes, and build friendships through teamwork in the kitchen.",
    image: "/images/couple cooking.webp",
  },
  {
    title: "Asian-Inspired Cooking",
    description:
      "Learn to prepare flavorful dishes like orange chicken bowls and enjoy a homemade meal together.",
    image: "/images/orange-chicken-bowl.webp",
  },
  {
    title: "Homemade Ravioli",
    description:
      "Make fresh pasta from scratch, create delicious fillings, and enjoy an authentic Italian cooking experience.",
    image: "/images/homemade-ravioli.webp",
  },
  {
    title: "Fruit Tart Baking",
    description:
      "Create beautiful fruit tarts with pastry cream, fresh berries, and delicious homemade crusts.",
    image: "/images/fruit-tart.webp",
  },
  {
    title: "French Croissants",
    description:
      "Discover the art of making buttery, flaky croissants while learning classic French baking techniques.",
    image: "/images/croissants.webp",
  },
  {
    title: "Sourdough Bread Baking",
    description:
      "Learn how to care for a sourdough starter, shape dough, and bake beautiful artisan bread together.",
    image: "/images/sourdough.webp",
  },
  {
    title: "Sushi Making",
    description:
      "Practice rolling sushi, experiment with fresh ingredients, and create delicious Japanese-inspired dishes with friends.",
    image: "/images/sushi.webp",
  },
  {
    title: "Cake Decorating",
    description:
      "Get creative with frosting, piping techniques, and colorful decorations while making beautiful cakes with friends.",
    image: "/images/cake-decorating.webp",
  },
];

export default function CookingTogether() {
  return (
    <div className={homeStyles.page}>
      <header className={homeStyles.header}>
        <Link href="/" className={homeStyles.logo}>
          Connect <span>&</span> Thrive
        </Link>

        <nav
          className={homeStyles.nav}
          aria-label="Main navigation"
        >
          <Link href="/">Home</Link>
          <Link href="/activities">
            Explore Activities
          </Link>
          <Link href="/#about">About Us</Link>
          <Link
            href="/#join"
            className={homeStyles.navButton}
          >
            Join Us
          </Link>
        </nav>
      </header>

      <main className={styles.page}>
        <section className={styles.titleBanner}>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>
              CREATE SOMETHING DELICIOUS
            </span>

            <h1>Cooking Together</h1>

            <p>
              Discover new recipes, learn cooking techniques,
              and build meaningful friendships through
              delicious experiences in the kitchen.
            </p>

            <Link
              href="/activities"
              className={styles.backLink}
            >
              ← Back to all activities
            </Link>
          </div>
        </section>

        <section className={styles.main}>
          <div className={styles.sectionHeading}>
            <h2>Activities to Explore</h2>
            <p>
              Learn new recipes, discover cooking techniques,
              and create delicious memories with friends.
            </p>
          </div>

          <div className={styles.grid}>
            {cookingActivities.map((activity) => (
              <article
                key={activity.title}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className={styles.cardImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h2>{activity.title}</h2>
                  <p>{activity.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <UpcomingEventsBanner
          description="Discover cooking gatherings, baking activities, and opportunities to share delicious food."
        />
      </main>

      <footer className={homeStyles.footer}>
        <h3>Connect & Thrive</h3>
        <p>
          Building friendships. Creating connections.
          Strengthening communities.
        </p>
        <p className={homeStyles.copyright}>
          © 2026 Connect & Thrive. Senior Project.
        </p>
      </footer>
    </div>
  );
}

