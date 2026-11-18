import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";


const members = [
    {
        name: "Emily",
        image: "/images/emily.webp",
        age: 30,
        location: "South Jordan, Utah",
        occupation: "Nursing Student",
        title: "Walking in Faith and Finding Friendship",
        interests: ["Travel", "Reading", "Cooking", "Hiking"],
        story:
            "Originally from Colorado, I've lived in Utah for four years while pursuing my dream of becoming a nurse. One of the most meaningful experiences of my life was studying at the Jerusalem Center in Israel. Walking where the Savior walked strengthened my testimony of Jesus Christ and gave me a deeper love for the scriptures, especially Isaiah. I love exploring the world, spending time outdoors, and meeting people who share my love for faith and adventure.",
    },
    {
        name: "Daniel",
        image: "/images/daniel.webp",
        age: 28,
        location: "Salt Lake City, Utah",
        occupation: "Software Developer",
        title: "Building Friendships Through Service",
        interests: ["Basketball", "Board Games", "Service", "Technology"],
        story:
            "Moving to a new city taught me how important genuine friendships are. I started volunteering at community events and discovered that serving others is one of the best ways to make connections. My faith in Jesus Christ reminds me to look for people who might feel left out and help them feel welcome. I'm always up for basketball, game nights, or a good conversation.",
    },
    {
        name: "Grace",
        image: "/images/grace.webp",
        age: 26,
        location: "Provo, Utah",
        occupation: "Elementary School Teacher",
        title: "Finding Christ in Everyday Moments",
        interests: ["Music", "Baking", "Photography", "Travel"],
        story:
            "Teaching children has helped me appreciate the small and simple things in life. My testimony of Jesus Christ has grown through daily prayer, scripture study, and opportunities to serve. I believe Heavenly Father knows each of us personally and guides us as we seek Him. I love music, baking with friends, and discovering beautiful places.",
    },
    {
        name: "Mateo",
        image: "/images/mateo.webp",
        age: 32,
        location: "Utah County, Utah",
        occupation: "Physical Therapist",
        title: "Finding Purpose Through Connection",
        interests: ["Hiking", "Soccer", "Cooking", "National Parks"],
        story:
            "Life hasn't always gone according to my plans, but those experiences have helped me trust in Jesus Christ more deeply. I've learned that faith doesn't mean having every answer. Sometimes it means taking the next step and trusting that God will guide us. I enjoy exploring national parks, playing soccer, and bringing people together for good food and meaningful conversations.",
    },
];


export default function MembersPage() {
    return (
        <div className={styles.membersPage}>
            {/* Navigation header */}
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    Connect <span>&</span> Thrive
                </Link>

                <nav className={styles.nav} aria-label="Main navigation">
                    <Link href="/">Home</Link>
                    <Link href="/activities">Explore Activities</Link>
                    <Link href="/members">Meet Our Members</Link>
                    <Link href="/#about">About Us</Link>
                    <Link href="/#join" className={styles.navButton}>
                        Join Us
                    </Link>
                </nav>
            </header>

            <main
                style={{
                    padding: "20px 6% 50px",
                    textAlign: "center",
                }}
            >

            <div className={styles.membersBanner}>
                <div className={styles.membersBannerInner}>


                        <p
                            style={{
                                color: "#087b83",
                                fontWeight: 700,
                                letterSpacing: "2px",
                                fontSize: "0.75rem",
                                margin: "0 0 6px",
                            }}
                        >
                            FAITH • FRIENDSHIP • CONNECTION
                        </p>

                        <h1
                            style={{
                                color: "#20364d",
                                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                                lineHeight: 1.15,
                                margin: "0 0 8px",
                            }}
                        >
                            Meet Our Members
                        </h1>

                        <h2
                            style={{
                                color: "#087b83",
                                fontSize: "1.15rem",
                                margin: "0 0 8px",
                            }}
                        >
                            Every Story Matters. Every Journey Is Unique.
                        </h2>

                        <p
                            style={{
                                maxWidth: "780px",
                                margin: "0 auto",
                                color: "#475569",
                                fontSize: "0.95rem",
                                lineHeight: 1.5,
                            }}
                        >
                            Get to know the people behind our community. Discover their interests,
                            experiences, and the ways faith in Jesus Christ has shaped their lives.
                            Through shared stories, we hope you&apos;ll find inspiration,
                            friendship, and a place where you belong.
                        </p>

                </div>
            </div>


            <section
                aria-label="Sample member stories"
                style={{
                    maxWidth: "1200px",
                    margin: "15px auto 0",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "24px",
                    textAlign: "left",
                }}
            >
                {members.map((member) => (
                    <article
                        key={member.name}
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "18px",
                            padding: "28px",
                            boxShadow: "0 12px 30px rgba(32, 54, 77, 0.18)",
                            borderTop: "6px solid #087b83",
                        }}
                    >

                            {/* Member portrait */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginBottom: "24px",
                                }}
                            >
                                <Image
                                    src={member.image}
                                    alt={`Portrait of ${member.name}, fictional sample member`}
                                    width={110}
                                    height={110}
                                    style={{
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "4px solid #f28b82",
                                        boxShadow: "0 4px 12px rgba(32, 54, 77, 0.15)",
                                    }}
                                />
                            </div>
    
                            {/* Member spotlight label */}
                            <p
                                style={{
                                    color: "#087b83",
                                    fontWeight: 700,
                                    letterSpacing: "1px",
                                    fontSize: "0.8rem",
                                }}
                            >
                                MEMBER SPOTLIGHT
                        </p>

                        <h2 style={{ color: "#20364d", marginTop: "12px" }}>
                            {member.name}, {member.age}
                        </h2>

                        <p style={{ color: "#64748b", marginTop: "6px" }}>
                            {member.occupation} · {member.location}
                        </p>

                        <h3
                            style={{
                                color: "#087b83",
                                marginTop: "24px",
                                fontSize: "1.15rem",
                            }}
                        >
                            {member.title}
                        </h3>

                        <p
                            style={{
                                color: "#475569",
                                lineHeight: 1.7,
                                marginTop: "14px",
                            }}
                        >
                            {member.story}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                marginTop: "24px",
                            }}
                        >
                            {member.interests.map((interest) => (
                                <span
                                    key={interest}
                                    style={{
                                        backgroundColor: "#e6f3f2",
                                        color: "#087b83",
                                        padding: "7px 12px",
                                        borderRadius: "20px",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </section>

            <p
                style={{
                    marginTop: "35px",
                    color: "#64748b",
                    fontSize: "0.85rem",
                }}
            >
                These are fictional sample profiles created for demonstration.
            </p>

            </main>
            </div>
    );
}
