import { Box, Divider, Rating, Typography } from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import type { ArticleStats } from "../types";
import API from "../services/api";

function StatTile({
  label,
  value,
  caption,
}: {
  label: string;
  value: ReactNode;
  caption: string;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      {value}
      <Typography variant="caption" color="text.secondary">
        {caption}
      </Typography>
    </Box>
  );
}

export default function ArticleStatsFooter({ slug }: { slug: string }) {
  const [stats, setStats] = useState<ArticleStats | null>(null);

  useEffect(() => {
    getStats();
  }, [slug]);

  const getStats = async () => {
    try {
      const result = await API.getArticleStats(slug);

      if (result) {
        setStats(result);
      } else {
        console.error("Unable to load article stats");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!stats) return null;

  const resolvedPercent =
    stats.sessions > 0
      ? Math.round((stats.resolved / stats.sessions) * 100)
      : 0;

  const topPage = stats.resolvedByPage.reduce<
    ArticleStats["resolvedByPage"][number] | null
  >((top, row) => (!top || row.count > top.count ? row : top), null);

  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 2,
      }}
    >
      <Divider />

      {stats.sessions === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: "center" }}>
          No one has used this guide yet. Your feedback will be the first!
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          <StatTile
            label="Average Rating"
            value={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Rating
                  value={stats.averageRating ?? 0}
                  precision={0.5}
                  size="small"
                  readOnly
                />
                <Typography>
                  {stats.averageRating !== null
                    ? stats.averageRating.toFixed(1)
                    : "-"}
                </Typography>
              </Box>
            }
            caption={`${stats.ratings} ${
              stats.ratings === 1 ? "rating" : "ratings"
            }`}
          />
          <StatTile
            label="Resolved"
            value={<Typography variant="h6">{resolvedPercent}%</Typography>}
            caption={`${stats.resolved} of ${stats.sessions} sessions`}
          />
          <StatTile
            label="Times Used"
            value={<Typography variant="h6">{stats.sessions}</Typography>}
            caption="sessions started"
          />
          <StatTile
            label="Most Resolved On"
            value={
              <Typography variant="h6">
                {topPage ? `Page ${topPage.page}` : "-"}
              </Typography>
            }
            caption={
              topPage
                ? `${topPage.count} ${
                    topPage.count === 1 ? "resolution" : "resolutions"
                  }`
                : "no resolutions yet"
            }
          />
        </Box>
      )}
    </Box>
  );
}
