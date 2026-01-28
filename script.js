(() => {
  const initMatrix = () => {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    if (window.matchMedia("(max-width: 720px)").matches) return;

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

  const getRippleOffset = (durationSeconds) => {
    const key = "rippleStartTs";
    const stored = sessionStorage.getItem(key);
    const start = stored ? Number(stored) : Date.now();
    if (!stored) {
      sessionStorage.setItem(key, String(start));
    }
    const elapsed = (Date.now() - start) / 1000;
    return elapsed % durationSeconds;
  };

  const navLinks = (page) => {
    const onHome = page === "home";
    return [
      { label: "About", href: onHome ? "#about" : "/index.html#about" },
      { label: "Resume", href: "/resume.html" },
      { label: "Projects", href: onHome ? "#projects" : "/index.html#projects" },
      { label: "Contact", href: onHome ? "#contact" : "/index.html#contact" }
    ];
  };

  const rippleText = (text, baseDelay = 0, offset = 0) =>
    text.split("").map((char, index) =>
      h(
        "span",
        {
          key: `ripple-${text}-${index}`,
          className: "ripple-letter",
          style: { animationDelay: `${baseDelay + index * 0.06 - offset}s` }
        },
        char === " " ? "\u00A0" : char
      )
    );

  const Header = ({ page }) => {
    const brandText = "Brandon Wolfe";
    const letterStep = 0.06;
    const gap = 0.01;
    const baseStart = brandText.length * letterStep + gap;
    const links = navLinks(page);
    const lastLink = links[links.length - 1];
    const lastLinkIndex = links.length - 1;
    const lastLinkDelay = baseStart + lastLinkIndex * (lastLink.label.length * letterStep + gap);
    const lastLetterDelay = lastLinkDelay + (lastLink.label.length - 1) * letterStep;
    const totalDuration = Number((lastLetterDelay + 1.5).toFixed(2));
    const rippleOffset = getRippleOffset(totalDuration);

    const nav = h(
      "nav",
      {
        className: "nav",
        style: { "--ripple-duration": `${totalDuration}s` }
      },
        h(
          "a",
          {
            className: "brand",
            href: "/index.html#top"
          },
          h("span", { className: "brand-text" }, rippleText(brandText, 0, rippleOffset))
        ),
      h(
        "div",
        { className: "nav-links" },
        links.map((link, linkIndex) => {
          const delay = baseStart + linkIndex * (link.label.length * letterStep + gap);
          return h(
            "a",
            {
              key: link.label,
              href: link.href,
              className: "nav-link"
            },
            rippleText(link.label, delay, rippleOffset)
          );
        })
      )
    );

    return h("header", { className: "site-header" }, nav);
  };

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
            "RIT cybersecurity student focused on forensics, practical defense, and building things."
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
            h("li", null, "Networking"),
              h("li", null, "Incident Response")
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
            "Hi! I'm Brandon, a sophomore at RIT majoring in Cyber and minoring in Criminal Justice. I'm active in RIT's main cybersecurity club, where I participate in Physical Vulnerability and Incident Response groups. I also play for the men's ultimate frisbee B team where I'm treasurer and safety officer. I regularly compete in cybersecurity competitions - most recently, I placed 10th out of about 2,100 participants in the DoD Cyber Sentinel for June 2025 and won $500 USD. I write up some of my competition challenges, which you can read ",
            h("a", { href: "/writeups.html" }, "here"),
            "."
          ),
          h(
            "p",
            null,
            "Outside of school, I really enjoy rock climbing and reading. I also like to build things. Most recently, I've been into wallets and leatherwork, and I spend time on my homelab. I'm also working on a red team tool, but it's not ready to release yet. I'm from the beautiful state of Washington but I go to school in Rochester, NY."
          ),
          h(
            "p",
            null,
            "I'm also seeking 2026 co-op or internship opportunities. Feel free to view my ",
            h("a", { href: "/resume.html" }, "resume"),
            " or reach out via the contact info ",
            h("a", { href: "#contact" }, "below"),
            "."
          )
        )
      )
    );

  const ProjectsStrip = () =>
    h(
      "section",
      { className: "section projects-strip", id: "projects" },
      h("div", { className: "section-header" },
        h("h2", null, "Projects"),
        h("p", { className: "section-sub" }, "A few highlights from my hands-on work.")
      ),
      h(
        "div",
        { className: "card-grid" },
        h(
          "a",
          { className: "card", href: "/resume.html#resume-projects-homelab" },
          h("h3", null, "Homelab | System Monitoring and Virtualization"),
          h("p", null, "Proxmox, network monitoring stack, DNS filtering, and remote access.")
        ),
        h(
          "a",
          { className: "card", href: "/resume.html#resume-projects-elk" },
          h("h3", null, "ELK SIEM Deployment"),
          h("p", null, "Multi-host ELK stack with log forwarding and tuned alerting.")
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
          h("p", null, "SSRF + GraphQL introspection writeup.")
        )
      )
    );

  const Resume = () =>
    h(
      "section",
      { className: "section resume-section" },
      h("div", { className: "section-header resume-header" },
        h("h2", null, "Resume"),
      ),
      h(
        "div",
        { className: "resume-card" },
        h(
          "div",
          { className: "resume-top" },
          h("h3", { className: "resume-name" }, "Brandon Wolfe"),
          h(
            "a",
            { href: "Wolfe_Brandon_Resume.pdf", download: true, className: "button primary resume-download" },
            "Download Resume (PDF)"
          )
        ),
        h(
          "div",
          { className: "resume-contact" },
          h("span", null, "Seattle, Washington"),
          h("span", { className: "divider" }, "|"),
          h("a", { href: "mailto:brandon@wolfedwelling.com" }, "brandon@wolfedwelling.com"),
          h("span", { className: "divider" }, "|"),
          h(
            "a",
            { href: "https://www.linkedin.com/in/bmw-cyber/", target: "_blank", rel: "noopener noreferrer" },
            "LinkedIn"
          ),
          h("span", { className: "divider" }, "|"),
          h("a", { href: "tel:+1-206-295-2995" }, "206-295-2995")
        ),
        h("h4", { className: "resume-section" }, "Objective"),
        h(
          "p",
          { className: "resume-sub resume-sub-strong" },
          "Seeking an internship in Cybersecurity or Information Security, with interests in Forensics, SOC and NOC operations, SIEMs, and Networking."
        ),
        h("h4", { className: "resume-section" }, "Education"),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Rochester Institute of Technology"),
          h("span", { className: "resume-date" }, "Expected Dec. 2027")
        ),
        h(
          "div",
          { className: "resume-row" },
        h("span", { className: "resume-sub resume-sub-strong" }, "Bachelor of Science in Cybersecurity, Minoring in Criminal Justice"),
          h("span", { className: "resume-date" }, "GPA: 3.11")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Relevant Coursework: Routing and Switching I, Software Development I & II, C & Assembly Programming, Reverse Engineering Fundamentals, Systems Administration I, Networking Services")
        ),
        h("h4", { className: "resume-section", id: "resume-projects" }, "Projects"),
        h(
          "div",
          { className: "resume-row resume-anchor", id: "resume-projects-homelab" },
          h("span", { className: "resume-title" }, "Homelab | System Monitoring and Virtualization"),
          h("span", { className: "resume-date" }, "Aug 2025 - Present")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Deployed Proxmox for isolated virtual machines and N8n hosting"),
          h("li", null, "Built a network monitoring stack using ntopng, InfluxDB, and Grafana on Ubuntu Server"),
          h("li", null, "Configured port mirroring for full LAN traffic capture and visualization"),
          h("li", null, "Deployed Pi-hole and Unbound for internal DNS resolution and network-wide ad blocking, and Tailscale for remote access")
        ),
        h(
          "div",
          { className: "resume-row resume-anchor", id: "resume-projects-elk" },
          h("span", { className: "resume-title" }, "ELK SIEM Deployment | RITSEC SIEM Interest Group"),
          h("span", { className: "resume-date" }, "Sept 2025 - Dec 2025")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Deployed and configured ELK stack (Elasticsearch, Logstash, Kibana) across Linux and Windows hosts"),
          h("li", null, "Established log forwarding and service monitoring for multi host visibility"),
          h("li", null, "Tuned dashboards and notifications for efficient alerting and event correlation")
        ),
        h("h4", { className: "resume-section" }, "Extracurriculars"),
        h("h5", { className: "resume-subhead" }, "Competitions and Challenges"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "DoD Cyber Sentinel 2025 — Top 10 (individual, #10/2100); solved web exploitation, crypto, OSINT, and forensics challenges including SSRF exploit writeup"),
          h("li", null, "Eaton CTF 2025 — 1st place (team, 1/16); memory forensics, crypto, and web exploitation"),
          h("li", null, "Bugcrowd Student Finale CTF 2025 — 12/66 (team); crypto and forensics challenges"),
          h("li", null, "NCAE Cyber 2025 — 2nd place (team, East Overflow)"),
          h("li", null, "CyberPatriot XVI — Platinum Tier (Top 150); Linux and Windows system hardening under timed scoring")
        ),
        h("h5", { className: "resume-subhead" }, "Clubs"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Active member of RITSEC: SIEM Interest Group, Physical Security and Incident Response Groups; focus on lockpicking, bypassing, and incident analysis")
        ),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Treasurer and Safety Officer | Ultimate Frisbee B Team"),
          h("span", { className: "resume-date" }, "2025 - Present")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Managing team budgeting, equipment procurement, and player safety protocols")
        ),
        h("h4", { className: "resume-section" }, "Experience"),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Lifeguard | Seattle Parks and Recreation (Seasonal)"),
          h("span", { className: "resume-date" }, "Jun 2024 - Aug 2025")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Ensured public safety and smooth beach operations"),
          h("li", null, "Led daily fitness training and emergency drills"),
          h("li", null, "Conducted maintenance of facilities and beach area"),
          h("li", null, "Recommended for promotion, Aug 2025")
        ),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Webmaster | ISSA Puget Sound"),
          h("span", { className: "resume-date" }, "Mar 2023 - Aug 2024")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Managed and maintained WordPress site for the Puget Sound chapter"),
          h("li", null, "Implemented Board Member and Sponsor pages to support growth initiatives")
        ),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Lifeguard | Mercer Island Country Club"),
          h("span", { className: "resume-date" }, "Jun 2021 - Jun 2025")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "CPR/AED/Lifeguard certified June 2021; recertified 2023, Dec 2024"),
          h("li", null, "Inspected pool equipment and facilities for safety compliance"),
          h("li", null, "Coordinated operations with staff; accumulated 600+ hours")
        ),
        h("h4", { className: "resume-section" }, "Technical Skills"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Languages: Java, C, Python, HTML, C, Assembly"),
          h("li", null, "Technologies: Steghide, Wireshark, Grafana, Hashcat, gdb, Cisco Packet Tracer, MS Office Suite, Wazuh, ELK (Elasticsearch, Logstash, Kibana), WordPress, ntopng, Influx Database, Pi-hole, Unbound, n8n, volatility3"),
          h("li", null, "Certifications: GIAC GFACT, IT Specialist")
        )
      )
    );

  const Footer = () => {
    const shimmerText = "© 2026 Brandon Wolfe. All rights reserved.";
    const shimmerLetters = shimmerText.split("").map((char, index) =>
      h(
        "span",
        {
          key: `shimmer-${index}`,
          className: "shimmer-letter",
          style: { animationDelay: `${index * 0.04}s` }
        },
        char === " " ? "\u00A0" : char
      )
    );

    return h(
      "footer",
      { className: "site-footer" },
      h("p", { className: "shimmer-text" }, shimmerLetters),
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
  };

  const App = ({ page }) =>
    h(
      "div",
      { className: "app" },
      h(Header, { page }),
      h(
        "main",
        { className: "main" },
        h("div", { id: "top" }),
        page === "home" ? h(React.Fragment, null, h(Hero), h(ProjectsStrip), h(About), h(Contact)) : null,
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

  const scrollToHash = () => {
    const { hash } = window.location;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const offset = 90;
      window.scrollBy({ top: -offset, left: 0, behavior: "auto" });
    }
  };

  setTimeout(scrollToHash, 0);
  window.addEventListener("hashchange", scrollToHash);
})();
