(() => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const initialHash = window.location.hash;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const enableMotion = () => {
    document.documentElement.classList.add("motion-ready");
  };

  if (document.readyState === "complete") {
    setTimeout(enableMotion, 350);
  } else {
    window.addEventListener("load", () => setTimeout(enableMotion, 350), { once: true });
  }

  const initMatrix = () => {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;
    const smallScreen = window.matchMedia("(max-width: 720px)");
    let frame = 0;

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
      frame = requestAnimationFrame(draw);
    };

    const syncMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (reducedMotion.matches || smallScreen.matches) return;
      resize();
      draw();
    };
    syncMotion();
    reducedMotion.addEventListener("change", syncMotion);
    smallScreen.addEventListener("change", syncMotion);
    window.addEventListener("resize", () => {
      if (frame) resize();
    });
  };

  const waitForMotion = () => {
    if (document.documentElement.classList.contains("motion-ready")) {
      initMatrix();
      return;
    }
    setTimeout(waitForMotion, 60);
  };

  waitForMotion();

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
      { label: "Projects", href: "/projects.html" },
      { label: "Contact", href: onHome ? "#contact" : "/index.html#contact" }
    ];
  };

  const contactInfo = {
    emailUser: "brandon",
    emailDomain: "wolfedwelling.com"
  };

  const getEmail = () => `${contactInfo.emailUser}@${contactInfo.emailDomain}`;

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
    const headerRef = React.useRef(null);
    React.useLayoutEffect(() => {
      const updateHeight = () => {
        document.documentElement.style.setProperty("--header-height", `${headerRef.current.getBoundingClientRect().height}px`);
      };
      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      observer.observe(headerRef.current);
      return () => observer.disconnect();
    }, []);
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

    return h("header", { className: "site-header", ref: headerRef }, nav);
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
            "RIT cybersecurity student interested in investigating threats and building smarter, more secure systems."
          ),
          h(
            "p",
            { className: "hero-note" },
            "Currently seeking Spring or Summer 2027 internship/co-op opportunities."
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
          h("div", { className: "panel-line" }, "Status: LOOKING FOR WORK"),
          h("div", { className: "panel-title" }, "Focus"),
            h(
              "ul",
              { className: "panel-list" },
              h("li", null, "Security Operations"),
              h("li", null, "Digital Forensics"),
              h("li", null, "Intelligent Systems")
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
            src: "images/brandon-wolfe-2026-900.jpg",
            srcSet: "images/brandon-wolfe-2026-480.jpg 480w, images/brandon-wolfe-2026-900.jpg 900w, images/brandon-wolfe-2026-1400.jpg 1400w",
            sizes: "(max-width: 559px) calc(100vw - 90px), (max-width: 1100px) calc(50vw - 82px), 468px",
            alt: "Brandon Wolfe",
            className: "about-image",
            width: 4000,
            height: 6000,
            loading: "lazy",
            decoding: "async"
          })
        ),
        h(
          "div",
          { className: "about-text" },
          h(
            "p",
            null,
            "Hi! I'm Brandon, a junior at RIT majoring in Cybersecurity and minoring in Criminal Justice. I'm a member of RITSEC, RIT's cybersecurity club. I also play for the men's ultimate frisbee B team, where I'm treasurer and safety officer. I regularly compete in cybersecurity competitions, including a first-place finish at Eaton CTF 2025 and 10th out of about 2,100 participants in the June 2025 DoD Cyber Sentinel. I write up some of my competition challenges, which you can read ",
            h("a", { href: "/writeups.html" }, "here"),
            "."
          ),
          h(
            "p",
            null,
            "Outside of school, I really enjoy rock climbing, reading, cooking, and baking. I also like to build things, especially wallets and other leatherwork, and I spend time on my homelab. I'm from the beautiful state of Washington but go to school in Rochester, NY."
          ),
          h(
            "p",
            null,
            "I'm seeking Spring or Summer 2027 co-op or internship opportunities. Feel free to view my ",
            h("a", { href: "/resume.html" }, "resume"),
            " or reach out via the contact info ",
            h("a", { href: "#contact" }, "below"),
            "."
          )
        )
      )
    );

  const projects = [
    {
      id: "homelab",
      title: "Homelab | Networking and Virtualization",
      date: "2025 - Present",
      summary: "Virtualization, network monitoring, remote access, and self-hosted services.",
      overview: "I run an evolving homelab with Proxmox-hosted Windows and Linux VMs and a separate Ubuntu service host. My work spans network security, monitoring, DNS, remote access, and asset inventory.",
      sections: [
        {
          title: "Networking and remote access",
          text: "I configured OPNsense with Zenarmor at the network edge and repurposed my previous router as a wireless access point. I deployed Pi-hole and Unbound earlier in the lab's history, later moving DNS to the OPNsense setup. After testing WireGuard behind carrier-grade NAT, I adopted Tailscale subnet routing for remote access."
        },
        {
          title: "Network monitoring",
          text: "I initially attempted an ELK deployment at home, then switched to ntopng, InfluxDB, and Grafana because of limited RAM. I configured switch port mirroring, collected traffic measurements, and built dashboards. I no longer use those monitoring stacks in my homelab; Zenarmor now provides the network visibility I need."
        },
        {
          title: "Self-hosted services",
          text: "I deployed Snipe-IT on the repurposed Ubuntu host using Docker Compose and MariaDB, and explored API-based inventory updates and discovery agents as potential next steps."
        }
      ],
      stack: "Proxmox VE, OPNsense, Zenarmor, Tailscale, Unbound, Docker Compose, Snipe-IT. Previously used: ntopng, InfluxDB, Grafana, Pi-hole."
    },
    {
      id: "elk",
      title: "ELK SIEM Deployment",
      date: "Sept 2025 - Dec 2025 | RITSEC SIEM Mentorship Group",
      summary: "Centralized Windows and Linux security telemetry, dashboards, and alerting.",
      overview: "Through RITSEC's SIEM group, I deployed an Elastic SIEM in an environment separate from my earlier homelab attempt.",
      sections: [
        {
          title: "Deployment and collection",
          text: "I deployed Elasticsearch and Kibana on Ubuntu Server and connected Windows and Linux endpoints through Fleet Server and Elastic Agent. I collected Windows Security and Sysmon events, Linux system and authentication logs, and host metrics."
        },
        {
          title: "Monitoring and investigation",
          text: "I configured Kibana dashboards and alerting workflows for reviewing endpoint activity and investigating security events. I verified event ingestion and also experimented with Heartbeat-based service monitoring."
        }
      ],
      stack: "Elasticsearch, Kibana, Fleet Server, Elastic Agent, Sysmon, Ubuntu Server, Windows, Heartbeat"
    }
  ];

  const Projects = () => {
    const [selected, setSelected] = React.useState(null);
    const dialogRef = React.useRef(null);

    React.useEffect(() => {
      if (!selected) return;
      const dialog = dialogRef.current;
      dialog.showModal();
      document.body.classList.add("project-dialog-open");
      return () => {
        dialog.close();
        document.body.classList.remove("project-dialog-open");
      };
    }, [selected]);

    return h(
      "section",
      { className: "section", id: "projects" },
      h("div", { className: "section-header" },
        h("h1", null, "Projects"),
        h("p", { className: "section-sub" }, "Explore my hands-on work. Select a project for a closer look.")
      ),
      h(
        "div",
        { className: "card-grid" },
        projects.map((project) => h(
          "button",
          {
            key: project.id,
            type: "button",
            className: "card project-card",
            "aria-haspopup": "dialog",
            onClick: () => setSelected(project)
          },
          h("span", { className: "project-card-title" }, project.title),
          h("span", { className: "project-card-summary" }, project.summary),
          h("span", { className: "project-card-prompt" }, "View project details")
        ))
      ),
      h(
        "dialog",
        {
          ref: dialogRef,
          className: "project-dialog",
          "aria-labelledby": "project-dialog-title",
          onClose: () => setSelected(null),
          onClick: (event) => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right ||
                event.clientY < bounds.top || event.clientY > bounds.bottom) {
              event.currentTarget.close();
            }
          }
        },
        selected && h("div", { className: "project-dialog-content" },
          h("div", { className: "project-dialog-header" },
            h("h2", { id: "project-dialog-title" }, selected.title),
            h("button", {
              type: "button",
              className: "button ghost",
              autoFocus: true,
              onClick: () => dialogRef.current.close()
            }, "Close")
          ),
          h("p", { className: "section-sub" }, selected.date),
          h("p", null, selected.overview),
          selected.sections.map((section) => h("section", { key: section.title },
            h("h3", { className: "resume-subhead" }, section.title),
            h("p", null, section.text)
          )),
          h("section", null,
            h("h3", { className: "resume-subhead" }, "Tools and platforms"),
            h("p", null, selected.stack)
          )
        )
      )
    );
  };

  const Contact = () =>
    h(
      "section",
      { id: "contact", className: "section contact-section" },
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
          h("a", { href: `mailto:${getEmail()}` }, getEmail()),
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
        h("h1", null, "Challenge Writeups"),
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
        h("h1", null, "Resume"),
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
          h("a", { href: `mailto:${getEmail()}` }, getEmail()),
          h("span", { className: "divider" }, "|"),
          h(
            "a",
            { href: "https://www.linkedin.com/in/bmw-cyber/", target: "_blank", rel: "noopener noreferrer" },
            "LinkedIn"
          )
        ),
        h("h4", { className: "resume-section" }, "Objective"),
        h(
          "p",
          { className: "resume-sub resume-sub-strong" },
          "Cybersecurity student seeking an internship for Spring or Summer 2027."
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
          h("span", { className: "resume-sub resume-sub-strong" }, "Bachelor of Science in Cybersecurity, Minoring in Criminal Justice")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Relevant Coursework: Networking Services, Endpoint Security Engineering, Reverse Engineering, Systems Administration, Cryptography, C & Assembly Programming")
        ),
        h("h4", { className: "resume-section" }, "Experience"),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "SOC Analyst and Incident Response Intern | Lynden Incorporated"),
          h("span", { className: "resume-date" }, "May 2026 - Aug 2026")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Triaged Darktrace alerts involving anomalous network and authentication activity, documenting dispositions and escalations through Jira"),
          h("li", null, "Investigated phishing and spoofed emails, analyzing sender authentication, links, attachments, and recipient exposure using Microsoft 365 Defender, Darktrace/Email, and Joe Sandbox"),
          h("li", null, "Audited privileged access, Active Directory groups, and security policies; authored four Netwrix Access Reviews playbooks supporting an enterprise rollout"),
          h("li", null, "Created 9 of 15 phishing simulation emails for a company-wide awareness campaign, coordinating scenario approvals and employee education"),
          h("li", null, "Developed ES|QL queries and Kibana dashboard designs to improve security visibility across authentication, network, and alert telemetry"),
          h("li", null, "Authored a technical business case for Darktrace SDK integration to automate threat intelligence workflows and expand ELK/Kibana visibility")
        ),
        h("h4", { className: "resume-section", id: "resume-projects" }, "Projects"),
        h(
          "div",
          { className: "resume-row resume-anchor", id: "resume-projects-homelab" },
          h("span", { className: "resume-title" }, "Homelab | Networking and Virtualization"),
          h("span", { className: "resume-date" }, "2025 - Present")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Deployed OPNsense with Zenarmor for firewalling and deep packet inspection"),
          h("li", null, "Configured Tailscale subnet routing for secure remote access and deployed Proxmox VE for virtualized Linux and Windows environments"),
          h("li", null, "Deployed Snipe-IT using Docker on Ubuntu Server for centralized asset management")
        ),
        h(
          "div",
          { className: "resume-row resume-anchor", id: "resume-projects-elk" },
          h("span", { className: "resume-title" }, "ELK SIEM Deployment | RITSEC SIEM Mentorship Group"),
          h("span", { className: "resume-date" }, "Sept 2025 - Dec 2025")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Deployed an ELK SIEM environment with Elasticsearch, Kibana, and Elastic Agent across Windows and Linux hosts"),
          h("li", null, "Ingested Windows Security, Sysmon, and Linux system logs to centralize endpoint security telemetry"),
          h("li", null, "Configured Kibana dashboards and alerting workflows to support security monitoring and event investigation")
        ),
        h("h4", { className: "resume-section" }, "Extracurriculars"),
        h("h5", { className: "resume-subhead" }, "Competitions and Challenges"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "IRSEC 2025 and ISTS 2026 — Black team scoring member; created score checks for monitoring uptime and updated the scoring engine"),
          h("li", null, "Eaton CTF 2025 — 1st place; web and memory forensics"),
          h("li", null, "DoD Cyber Sentinel 2025 — Top 10/2100"),
          h("li", null, "NCAE Cyber 2025 — 2nd place, East Division"),
          h("li", null, "Bugcrowd CTF 2025 — 12/66"),
          h("li", null, "CyberPatriot XVI — Top 150")
        ),
        h("h5", { className: "resume-subhead" }, "Clubs"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "RITSEC: Hardware Reversing (telecoms and automotive modules) and Web Application Pentesting mentorship groups; Physical Security interest group (lockpicking and bypassing)")
        ),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Treasurer and Safety Officer | Ultimate Frisbee B Team")
        ),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Managed budget, equipment procurement, and player safety protocols")
        ),
        h("h4", { className: "resume-section" }, "Other Experience"),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Lifeguard | Seattle Parks and Recreation (Seasonal)"),
          h("span", { className: "resume-date" }, "Jun 2024 - Aug 2025")
        ),
        h(
          "div",
          { className: "resume-row" },
          h("span", { className: "resume-title" }, "Webmaster | ISSA Puget Sound"),
          h("span", { className: "resume-date" }, "Mar 2023 - Aug 2024")
        ),
        h("h4", { className: "resume-section" }, "Technical Skills"),
        h(
          "ul",
          { className: "resume-list" },
          h("li", null, "Languages: Python, PowerShell, Java, C, HTML, Assembly (x86)"),
          h("li", null, "Security Tools: Darktrace, Microsoft 365 Defender, Rapid7, Netwrix, ELK/Kibana, Wazuh, Wireshark, Volatility 3, Joe Sandbox"),
          h("li", null, "Infrastructure: OPNsense, pfSense, Proxmox VE, Docker, Tailscale, Snipe-IT, Unbound, Grafana, n8n"),
          h("li", null, "Certifications: Microsoft Certified: Azure Fundamentals (AZ-900), GIAC GFACT, IT Specialist"),
          h("li", null, "Operating Systems: Windows 10/11, Windows Server 2022/2025, Rocky Linux 9, Ubuntu Server, Kali Linux")
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
        h("a", { href: `mailto:${getEmail()}` }, "Email me!"),
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
        page === "home" ? h(React.Fragment, null, h(Hero), h(About), h(Contact)) : null,
        page === "projects" ? h(Projects) : null,
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

  const scrollToHash = (hash, attempt = 0) => {
    if (!hash) return;
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "start" });
      return;
    }
    if (attempt < 12) {
      requestAnimationFrame(() => scrollToHash(hash, attempt + 1));
    }
  };

  if (initialHash) {
    setTimeout(() => scrollToHash(initialHash), 50);
  }
  window.addEventListener("hashchange", () => scrollToHash(window.location.hash));
})();


