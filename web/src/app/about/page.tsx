
import Image from "next/image";
import homeStyles from "../page.module.css";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <div className={homeStyles.page}>
      <main>
        {/* Existing About Us Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <span className={styles.sectionLabel}>
                GET TO KNOW US
              </span>

              <h1>About Connect &amp; Thrive</h1>

              <p className={styles.tagline}>
                A place to connect. A community to belong.
              </p>

              <p className={styles.introDescription}>
                Building meaningful friendships through shared
                interests, wholesome activities, and positive
                experiences.
              </p>
            </div>

            <div className={styles.heroImage}>
              <Image
                src="/images/foodie-group.webp"
                alt="Friends enjoying a meal and conversation together"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
              />
            </div>
          </div>
        </section>

        {/* Two-Column About Section */}
        <section className={styles.aboutSection}>
          <div className={styles.aboutGrid}>

            {/* LEFT: Founder's Story */}
            <article className={styles.storyCard}>
              <span className={styles.sectionLabel}>
                THE STORY BEHIND CONNECT &amp; THRIVE
              </span>

              <h2>One Invitation Can Change a Life</h2>

              <div className={styles.storyPhoto}>
                <Image
                  src="/images/kristin-and-tiffany.webp"
                  alt="Kristin and her daughter Tiffany"
                  fill
                  sizes="(max-width: 768px) 180px, 200px"
                  className={styles.storyImage}
                />
              </div>

              <p>
                Connect &amp; Thrive was inspired by watching
                someone I love struggle to find connection
                and belonging during a difficult season of life.
              </p>

              <p>
                My adult daughter was once an active college
                student with big dreams and a promising future.
                When COVID-19 disrupted her plans, she faced
                unexpected uncertainty and isolation. As many
                friends married and began new chapters, she
                struggled to find her own path.
              </p>

              <p>
                I watched her work hard to rebuild her direction
                through education and service, but something
                important was missing: meaningful friendships
                and a community where she felt welcomed
                and included.
              </p>

              <p>
                She found a welcoming group of young adults
                who shared her faith, values, and interests.
                Through hiking, cooking, traveling, games,
                and other activities, she developed genuine
                friendships and rediscovered the joy of
                connecting with others.
              </p>

              <p>
                Watching her happiness return inspired me to
                create Connect &amp; Thrive. I believe many
                young adults long for friendship but find it
                difficult to walk into a large gathering alone.
                Sometimes all they need is a welcoming invitation.
              </p>

              <p>
                This is not a dating app. It is a place to build
                friendships, share experiences, strengthen faith,
                and create a sense of belonging. If romance
                develops naturally, that is wonderful, but
                friendship comes first.
              </p>

              <p className={styles.storyClosing}>
                Because sometimes, one simple invitation
                can change everything.
              </p>

              <p className={styles.storySignature}>
                — Kristin, Founder of Connect &amp; Thrive
              </p>
            </article>

            {/* RIGHT: Abbigail's Mission */}
            <article className={styles.missionCard}>
              <span className={styles.sectionLabel}>
                WHAT WE BELIEVE
              </span>

              <h2>Our Mission</h2>

              <p>
                Connect &amp; Thrive is a faith-centered
                community platform helping young adults ages
                20–35 meet new people, discover shared
                interests, and build lasting friendships.
              </p>

              <p>
                Inspired by the Christian values of The Church
                of Jesus Christ of Latter-day Saints, we
                encourage kindness, respect, integrity,
                service, and wholesome activities that
                bring people together.
              </p>

              <p>
                You do not need to be a member of any particular
                church to participate. We welcome young adults
                from different backgrounds who appreciate
                a positive, values-centered community.
              </p>

              <div className={styles.friendshipNote}>
                <h3>Friendship First</h3>
                <p>
                  Connect &amp; Thrive is about friendship,
                  not dating. Our goal is to help people
                  develop genuine connections and a sense
                  of belonging through shared experiences.
                </p>
              </div>


              <div className={styles.missionLogo}>
                <Image
                  src="/images/connect-thrive-logo.webp"
                  alt="Connect and Thrive - Friendship, Activities, Belonging"
                  width={600}
                  height={400}
                  sizes="(max-width: 900px) 80vw, 350px"
                  className={styles.logoImage}
                />
              </div>

            </article>

          </div>
        </section>
      </main>

      <footer className={homeStyles.footer}>
        <h3>Connect &amp; Thrive</h3>
        <p>
          Building friendships. Creating connections.
          Strengthening communities.
        </p>
        <p className={homeStyles.copyright}>
          © 2026 Connect &amp; Thrive. Senior Project.
        </p>
      </footer>
    </div>
  );
}
