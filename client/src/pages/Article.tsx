import { useEffect, useState } from "react";
import type { ArticleDetail } from "../types";
import API from "../services/api";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Article() {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [pageIndex, setPageIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { slug } = useParams();
  const { signedIn } = useAuth();

  useEffect(() => {
    if (signedIn && slug) getArticle(slug);
  }, [signedIn, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageIndex]);

  const getArticle = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await API.getArticle(slug);

      if (result && result.pages.length > 0) {
        setArticle(result);
        setPageIndex(0);
        setLoading(false);
      } else {
        setError("Article not found!");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("Error loading article!");
      setLoading(false);
    }
  };

  const back = () => {
    if (pageIndex === 0) {
      navigate("/");
    } else {
      setPageIndex(pageIndex - 1);
    }
  };

  const next = () => {
    if (article && pageIndex < article.pages.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

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

  const page = article?.pages[pageIndex];

  if (error || !article || !page) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: "640px" }}>
          {error ?? "Article not found!"}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Box>
    );
  }

  const isLastPage = pageIndex === article.pages.length - 1;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "768px",
        mx: "auto",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 1,
        }}
      >
        <Typography variant="h4">{article.title}</Typography>
        <Typography color="text.secondary">
          Page {pageIndex + 1} of {article.pages.length}
        </Typography>
      </Box>

      <Card elevation={4}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5">{page.title}</Typography>

          {page.imgURL && (
            <CardMedia
              component="img"
              image={page.imgURL}
              alt={page.title}
              sx={{ borderRadius: 1 }}
            />
          )}

          <Typography>{page.content}</Typography>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={back}>Back</Button>
        <Button variant="contained" disabled={isLastPage} onClick={next}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
