try {
  const saved = JSON.parse(localStorage.getItem("cabanaslarustica_paleta"));
  const keys = [
    "--color-bg",
    "--color-bg-alt",
    "--color-text",
    "--color-text-muted",
    "--color-primary",
    "--color-secondary",
    "--color-cta",
    "--color-cta-text",
  ];
  if (saved && keys.every((key) => /^#[0-9a-f]{6}$/i.test(saved.vars?.[key]))) {
    keys.forEach((key) =>
      document.documentElement.style.setProperty(key, saved.vars[key]),
    );
  }
} catch {}
