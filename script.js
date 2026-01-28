(() => {
  const initMatrix = () => {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+?<>[]{}";
    const fontSize = 16;
    let columns = 0;
    let drops = [];
    let speeds = [];

    const resize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      columns = Math.floor(innerWidth / fontSize);
      drops = Array.from({ length: columns }, () => -Math.random() * (innerHeight / fontSize));
      speeds = Array.from({ length: columns }, () => 0.2 + Math.random() * 0.3);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(7, 10, 15, 0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(34, 255, 154, 0.85)";
      ctx.font = `${fontSize}px "Space Grotesk", monospace`;

      for (let i = 0; i < drops.length; i += 1) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);
        if (y > canvas.height && Math.random() > 0.96) {
          drops[i] = 0;
          speeds[i] = 0.2 + Math.random() * 0.32;
        } else {
          drops[i] += speeds[i];
          if (Math.random() > 0.995) {
            speeds[i] = 0.2 + Math.random() * 0.32;
          }
        }
      }
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
  };

  initMatrix();

  const h = React.createElement;

  const navLinks = (page) => {
    const onHome = page === "home";
    return [
      { label: "About", href: onHome ? "#about" : "/index.html#about" },
      { label: "Writeups", href: "/writeups.html" },
      { label: "Contact", href: onHome ? "#contact" : "/index.html#contact" },
      { label: "Resume", href: "/resume.html" }
    ];
  };

  const Header = ({ page }) =>
    h(
      "header",
      { className: "site-header" },
      h(
        "nav",
        { className: "nav" },
        h(
          "a",
          { className: "brand", href: "/index.html" },
          h("span", { className: "brand-text" }, "Brandon Wolfe")
        ),
        h(
          "div",
          { className: "nav-links" },
          navLinks(page).map((link) =>
            h(
              "a",
              {
                key: link.label,
                href: link.href,
                className: "nav-link"
              },
              link.label
            )
          )
        )
      )
    );

  const Hero = () =>
    h(
      "section",
      { className: "hero" },
      h("div", { className: "hero-grid" },
        h("div", { className: "hero-content" },
          h("p", { className: "eyebrow" }, "RIT Cybersecurity"),
          h("h1", null, "Welcome to My Website"),
          h(
            "p",
            { className: "hero-sub" },
            "RIT cybersecurity student focused on competition, practical defense, and building things."
          ),
          h(
            "p",
            { className: "hero-note" },
            "Currently seeking 2026 internship/co-op opportunities."
          ),
          h(
            "div",
            { className: "hero-actions" },
            h(
              "a",
              { className: "button primary", href: "/resume.html" },
              "View Resume"
            ),
            h(
              "a",
              { className: "button ghost", href: "/writeups.html" },
              "Read Writeups"
            )
          )
        ),
        h("div", { className: "hero-panel" },
          h("div", { className: "panel-line" }, "Status: ACTIVE"),
          h("div", { className: "panel-title" }, "Focus"),
          h(
            "ul",
            { className: "panel-list" },
            h("li", null, "Forensics"),
            h("li", null, "Incident Response"),
            h("li", null, "Networking")
          )
        )
      )
    );

  const About = () =>
    h(
      "section",
      { id: "about", className: "section" },
      h("div", { className: "section-header" },
        h("h2", null, "About Me"),
        h("p", { className: "section-sub" }, "Cybersecurity student, competitor, and builder.")
      ),
      h(
        "div",
        { className: "about-grid" },
        h("div", { className: "about-card" },
          h("img", {
            src: "images/IMG_9405.jpg",
            alt: "Brandon Wolfe",
            className: "about-image"
          })
        ),
        h(
          "div",
          { className: "about-text" },
          h(
            "p",
            null,
            "Hi! I'm Brandon, a sophomore at RIT majoring in cybersecurity. I'm active in RIT's main cybersecurity club, where I participate in Physical Vulnerability and Incident Response groups. I also play for the men's ultimate frisbee B team where I'm treasurer and safety officer and am involved in the car club. I regularly compete in cybersecurity competitions - most recently, I placed 10th out of about 2,100 participants in the DoD Cyber Sentinel for June 2025 and won $500 USD. I write up some of my competition challenges, which you can read ",
            h("a", { href: "/writeups.html" }, "here"),
            "."
          ),
          h(
            "p",
            null,
            "Outside of school, I enjoy rock climbing and building watches. Lately I've been into forensics and wallet/leatherwork, and I'm also working on a red team tool, so I spend time experimenting and iterating outside of class."
          ),
          h(
            "p",
            null,
            "I'm currently seeking a Summer 2026 co-op or internship. Feel free to view my ",
            h("a", { href: "/resume.html" }, "resume"),
            " or reach out via the contact info below."
          )
        )
      )
    );

  const Contact = () =>
    h(
      "section",
      { id: "contact", className: "section" },
      h("div", { className: "section-header" },
        h("h2", null, "Contact")
      ),
      h(
        "div",
        { className: "contact-card" },
        h(
          "p",
          null,
          "Feel free to reach out to me via email at ",
          h("a", { href: "mailto:brandon@wolfedwelling.com" }, "brandon@wolfedwelling.com"),
          ", or connect with me on ",
          h(
            "a",
            { href: "https://www.linkedin.com/in/bmw-cyber/", target: "_blank", rel: "noopener noreferrer" },
            "LinkedIn"
          ),
          "."
        )
      )
    );

  const Writeups = () =>
    h(
      "section",
      { className: "section" },
      h("div", { className: "section-header" },
        h("h2", null, "Challenge Writeups"),
        h("p", { className: "section-sub" }, "Click any card below to view or download the PDF.")
      ),
      h(
        "div",
        { className: "card-grid" },
        h(
          "a",
          {
            className: "card",
            href: "Writeups/GraphQL_Heist_CTF_writeup.pdf",
            target: "_blank",
            rel: "noopener noreferrer"
          },
          h("h3", null, "Juche Jaguar GraphQL Heist, DoD Cyber Sentinel June 2025, Hard Challenge"),
          h("p", null, "SSRF + GraphQL introspection exploit writeup.")
        )
      )
    );

  const Resume = () =>
    h(
      "section",
      { className: "section" },
      h("div", { className: "section-header" },
        h("h2", null, "Resume"),
        h("p", { className: "section-sub" }, "The downloadable PDF is much prettier and fully formatted.")
      ),
      h(
        "div",
        { className: "resume-actions" },
        h(
          "a",
          { href: "Wolfe_Brandon_Resume.pdf", download: true, className: "button primary" },
          "Download Resume (PDF)"
        )
      ),
      h(
        "div",
        { className: "resume-card" },
        h("h3", { className: "resume-name" }, "Brandon Wolfe"),
        h(
          "div",
          { className: "resume-contact" },
          h("span", null, "Seattle, WA"),
          h("span", { className: "divider" }, "|") ,
          h("a", { href: "mailto:brandon@wolfedwelling.com" }, "brandon@wolfedwelling.com"),
          h("span", { className: "divider" }, "|"),
          h("a", { href: "tel:+1-206-295-2995" }, "206-295-2995"),
          h("span", { className: "divider" }, "|"),
          h(
            "a",
            { href: "https://www.linkedin.com/in/bmw-cyber/", target: "_blank", rel: "noopener noreferrer" },
            "LinkedIn"
          )
        ),
        h("h4", { className: "resume-section" }, "Education"),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Rochester Institute of Technology"),
          h("span", { className: "resume-date" }, "Class of 2029")
        ),
        h("p", { className: "resume-sub" }, "B.S./M.S. in Cybersecurity"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Related Coursework: Intro to Cybersecurity, Routing and Switching I, Software Development I & II")
        ),
        h("h4", { className: "resume-section" }, "Experience"),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Webmaster and Board Member | ISSA Puget Sound"),
          h("span", { className: "resume-date" }, "March 2023 - August 2024")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Managed website through WordPress"),
          h("li", null, "Implemented front- and back-end solutions and recommendations from board members"),
          h("li", null, "Contributed to strategic planning for the chapter's future")
        ),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Lifeguard | Mercer Island Country Club"),
          h("span", { className: "resume-date" }, "June 2021 - June 2025")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "CPR/AED/Lifeguard certified June 2021; recertified March 2023 and December 2024"),
          h("li", null, "Inspected pool equipment and facilities to maintain cleanliness and safety"),
          h("li", null, "Enforced pool rules, ensuring a safe environment"),
          h("li", null, "Collaborated with staff to coordinate daily operations"),
          h("li", null, "Accumulated 600+ hours of service")
        ),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Lifeguard | Seattle Parks and Recreation (Seasonal)"),
          h("span", { className: "resume-date" }, "June 2024 - August 2025")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "NW test certified June 2024"),
          h("li", null, "Ensured public safety and smooth beach operations"),
          h("li", null, "Performed daily fitness training and emergency drills"),
          h("li", null, "Conducted maintenance of facilities and beach area"),
          h("li", null, "Lead training for junior staff in both passive and active boat and paddleboard rescues"),
          h("li", null, "Accumulated 500+ hours of service"),
          h("li", null, "Recommended for promotion, August 2025")
        ),
        h("h4", { className: "resume-section" }, "Cybersecurity"),
        h("h5", { className: "resume-subhead" }, "Awards"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "National Cyber Scholar, placed #3 in Washington State"),
          h("li", null, "CyberStart Gold Award"),
          h("li", null, "CyberPatriot XVI Platinum placement (top 150 in Semifinals)"),
          h("li", null, "GIAC GFACT - certified"),
          h("li", null, "IT Specialist - certified")
        ),
        h("h5", { className: "resume-subhead" }, "Competitions"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "DoD Cyber Sentinel June 2025, placed #10 out of 2100 overall"),
          h("li", null, "NCAE Cyber 2025, placed #2 in East Overflow Region"),
          h("li", null, "RITSEC CTF 2025, placed 48th out of 305 teams"),
          h("li", null, "SILLYCTF 2025, placed 12th out of 50 teams"),
          h("li", null, "BugCrowdCTF 2025, placed 19th out of 61 teams")
        ),
        h("h4", { className: "resume-section" }, "Technical Skills"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Languages: Java, C++, Python, HTML, CSS"),
          h("li", null, "Technologies: Steghide, Wireshark, Hashcat, Ghidra, Cisco Packet Tracer, WordPress, MS Office Suite")
        )
      )
    );

  const Footer = () =>
    h(
      "footer",
      { className: "site-footer" },
      h("p", null, "© 2026 Brandon Wolfe. All rights reserved."),
      h(
        "div",
        { className: "social-links" },
        h(
          "a",
          { href: "https://github.com/bdawg295", target: "_blank", rel: "noopener noreferrer" },
          "Github"
        ),
        h("a", { href: "mailto:brandon@wolfedwelling.com" }, "Email me!"),
        h(
          "a",
          { href: "https://www.linkedin.com/in/bmw-cyber/", target: "_blank", rel: "noopener noreferrer" },
          "LinkedIn"
        )
      )
    );

  const App = ({ page }) =>
    h(
      "div",
      { className: "app" },
      h(Header, { page }),
      h(
        "main",
        { className: "main" },
        page === "home" ? h(React.Fragment, null, h(Hero), h(About), h(Contact)) : null,
        page === "writeups" ? h(Writeups) : null,
        page === "resume" ? h(Resume) : null
      ),
      h(Footer)
    );

  const rootEl = document.getElementById("app");
  if (!rootEl) return;

  const page = document.body.dataset.page || "home";
  const root = ReactDOM.createRoot(rootEl);
  root.render(h(App, { page }));
})();

