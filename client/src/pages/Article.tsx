import { useEffect, useRef, useState } from "react";
import type { ArticleDetail, Feedback } from "../types";
import API from "../services/api";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import FeedbackDialog from "../components/FeedbackDialog";
import ArticleStatsFooter from "../components/ArticleStatsFooter";
import FinishDialog from "../components/FinishDialog";
import TicketDialog from "../components/TicketDialog";

export default function Article() {
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [dialog, setDialog] = useState<"finish" | "feedback" | "ticket" | null>(
    null,
  );
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  // Prevents StrictMode from starting two sessions for one visit
  const loadedSlug = useRef<string | null>(null);

  const navigate = useNavigate();
  const { slug } = useParams();
  const { signedIn } = useAuth();

  useEffect(() => {
    if (signedIn && slug && loadedSlug.current !== slug) {
      loadedSlug.current = slug;
      getArticle(slug);
    }
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

        const id = await API.startSession(slug);
        if (id) {
          setSessionId(id);
        } else {
          console.error("Unable to start session");
        }
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

  const goToPage = async (index: number) => {
    setPageIndex(index);

    if (!sessionId) return;
    try {
      const saved = await API.updateSession(sessionId, { page: index + 1 });
      if (!saved) console.error("Unable to update session page");
    } catch (e) {
      console.error(e);
    }
  };

  const back = () => {
    if (pageIndex === 0) {
      navigate("/");
    } else {
      goToPage(pageIndex - 1);
    }
  };

  const next = () => {
    if (article && pageIndex < article.pages.length - 1) {
      goToPage(pageIndex + 1);
    }
  };

  const openDialog = (name: "finish" | "feedback" | "ticket") => {
    setDialogError(null);
    setDialog(name);
  };

  const submitFeedback = async (feedback: Feedback) => {
    if (!sessionId) {
      setDialogError("Unable to save feedback - session was not started!");
      return;
    }

    try {
      const saved = await API.updateSession(sessionId, {
        page: pageIndex + 1,
        resolved: true,
        ...feedback,
      });

      if (saved) {
        setDialog(null);
        navigate("/");
      } else {
        setDialogError("Error saving feedback!");
      }
    } catch (e) {
      console.error(e);
      setDialogError("Error saving feedback!");
    }
  };

  const submitTicket = async (description: string) => {
    if (!sessionId) {
      setDialogError("Unable to submit ticket - session was not started!");
      return;
    }

    try {
      const saved = await API.createTicket(
        sessionId,
        pageIndex + 1,
        description,
      );

      if (saved) {
        setDialog(null);
        navigate("/tickets");
      } else {
        setDialogError("Error submitting ticket!");
      }
    } catch (e) {
      console.error(e);
      setDialogError("Error submitting ticket!");
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

          <Divider />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography>Did this fix it?</Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                color="success"
                onClick={() => openDialog("feedback")}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={() => (isLastPage ? openDialog("ticket") : next())}
              >
                No
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button onClick={back}>Back</Button>
        <Button
          variant="contained"
          onClick={() => (isLastPage ? openDialog("finish") : next())}
        >
          {isLastPage ? "Finish" : "Next"}
        </Button>
      </Box>

      <ArticleStatsFooter slug={article.slug} />

      <FinishDialog
        open={dialog === "finish"}
        onClose={() => setDialog(null)}
        onResolved={() => openDialog("feedback")}
        onUnresolved={() => openDialog("ticket")}
      />

      <FeedbackDialog
        open={dialog === "feedback"}
        title="Glad that fixed it!"
        error={dialogError}
        onClose={() => setDialog(null)}
        onSubmit={submitFeedback}
      />

      <TicketDialog
        open={dialog === "ticket"}
        articleTitle={article.title}
        page={pageIndex + 1}
        error={dialogError}
        onClose={() => setDialog(null)}
        onSubmit={submitTicket}
      />
    </Box>
  );
}
