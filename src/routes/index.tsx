import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PlanUP — Groceries, Recipes & Budget Planner" },
      {
        name: "description",
        content:
          "PlanUP helps you plan groceries, recipes, budgets and insights in one smooth mobile-first planner.",
      },
      { property: "og:title", content: "PlanUP — Smart Grocery & Meal Planner" },
      {
        property: "og:description",
        content:
          "Plan groceries, recipes and budgets with PlanUP — lists, insights and reminders in one app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const APP_URL = "/planup/index.html";

function Index() {
  useEffect(() => {
    window.location.replace(APP_URL);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <h1 className="text-sm text-muted-foreground">
        Opening PlanUP… <a className="underline" href={APP_URL}>continue</a>
      </h1>
    </main>
  );
}
