import { useEffect, useMemo, useState } from "react";
import type { ArticleList } from "../types";
import API from "../services/api";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const [articles, setArticles] = useState<ArticleList>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signedIn } = useAuth();

  useEffect(() => {
    if (signedIn) listArticles();
  }, [signedIn]);

  const listArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await API.listArticles();

      if (list && list.length > 0) {
        console.log(`${list.length} Articles found`);
        setArticles(list);
        setLoading(false);
      } else {
        setError("No Articles found!");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("Error loading articles!");
      setLoading(false);
    }
  };

  const groupedArticles = useMemo(() => {
    const out: {
      category: string;
      articles: ArticleList;
    }[] = [];

    articles.forEach((article) => {
      const exists = out.find((cat) => cat.category === article.category);

      if (!exists) {
        out.push({
          category: article.category,
          articles: [article],
        });
      } else {
        exists.articles.push(article);
      }
    });

    return out;
  }, [articles]);

  const visibleCategories = selectedCategory
    ? groupedArticles.filter((cat) => cat.category === selectedCategory)
    : groupedArticles;

  if (loading) {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size="10rem" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          textAlign: "center",
        }}
      >
        <Typography variant="h3">How can we help?</Typography>
        <Typography variant="h6" color="text.secondary">
          Search for your issue or browse troubleshooting guides by category.
        </Typography>
      </Box>

      <Autocomplete
        options={articles}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.slug}
        groupBy={(option) => option.category}
        onChange={(_, val) => {
          if (val) navigate("/articles/" + val);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Search Articles..." />
        )}
        sx={{
          width: "100%",
          maxWidth: "640px",
        }}
      />

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => listArticles()}>
              Retry
            </Button>
          }
          sx={{ width: "100%", maxWidth: "640px" }}
        >
          {error}
        </Alert>
      )}

      {groupedArticles.length > 1 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Chip
            label="All"
            color="primary"
            variant={selectedCategory === null ? "filled" : "outlined"}
            onClick={() => setSelectedCategory(null)}
          />
          {groupedArticles.map((category) => (
            <Chip
              key={category.category}
              label={category.category}
              color="primary"
              variant={
                selectedCategory === category.category ? "filled" : "outlined"
              }
              onClick={() => setSelectedCategory(category.category)}
            />
          ))}
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          width: "100%",
          maxWidth: "1024px",
          gap: 4,
        }}
      >
        {visibleCategories.map((category) => {
          return (
            <Card key={category.category} elevation={4}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h5">{category.category}</Typography>
                  <Chip
                    size="small"
                    label={`${category.articles.length} ${
                      category.articles.length === 1 ? "guide" : "guides"
                    }`}
                  />
                </Box>

                {category.articles.map((article) => {
                  return (
                    <Card
                      key={article.slug}
                      variant="outlined"
                      sx={{
                        p: 1,
                      }}
                    >
                      <CardActionArea
                        onClick={() => navigate("/articles/" + article.slug)}
                      >
                        <Typography>{article.title}</Typography>

                        <Typography variant="caption" color="text.secondary">
                          {article.subtitle}
                        </Typography>
                      </CardActionArea>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Card
        elevation={0}
        sx={{ width: "100%", maxWidth: "1024px", bgcolor: "action.hover" }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h5">Still need help?</Typography>
          <Typography color="text.secondary">
            If none of these guides solve your issue, contact your support
            representative and let them know which steps you have already
            tried.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
