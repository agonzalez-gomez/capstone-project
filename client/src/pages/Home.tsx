import { useEffect, useMemo, useState } from "react";
import type { ArticleList } from "../types";
import API from "../services/api";
import {
  Autocomplete,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [articles, setArticles] = useState<ArticleList>([]);

  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    listArticles();
  }, []);

  const listArticles = async () => {
    try {
      setLoading(true);
      const list = await API.listArticles();

      if (list && list.length > 0) {
        console.log(`${list.length} Articles found`);
        setArticles(list);
        setLoading(false);
      } else {
        // setError("No Articles found!");
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      // setError("Error loading articles!");
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

  if (loading) {
    return (
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "center",
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
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        padding: 4,
        mt: 4,
        width: "100%",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Autocomplete
        options={articles}
        getOptionLabel={(option) => option.title}
        getOptionValue={(option) => option.slug}
        groupBy={(option) => option.category}
        onChange={(_, val) => navigate(`/article/${val}`)}
        renderInput={(params) => (
          <TextField {...params} label="Search Articles..." />
        )}
        sx={{
          width: "50vw",
        }}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          maxWidth: "1024px",
          gap: 4,
        }}
      >
        {groupedArticles.map((category) => {
          return (
            <Card elevation={4}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="h5">{category.category}</Typography>

                {category.articles.map((article) => {
                  return (
                    <Card
                      sx={{
                        p: 1,
                      }}
                    >
                      <CardActionArea
                        onClick={() => navigate("/articles/" + article.slug)}
                        sx={{
                          display: "",
                        }}
                      >
                        <Typography>{article.title}</Typography>

                        <Typography variant="caption">
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
    </Box>
  );
}
