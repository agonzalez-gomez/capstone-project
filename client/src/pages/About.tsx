import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const steps = [
  {
    label: "Choose your product",
    description:
      "Start by selecting the device or software you need help with.",
  },
  {
    label: "Narrow down the issue",
    description:
      "Answer a few questions to find the guide that matches what you are seeing.",
  },
  {
    label: "Work through the steps",
    description:
      "Follow each troubleshooting step and report back whether it helped.",
  },
  {
    label: "Resolve or escalate",
    description:
      "Record that the issue is resolved, or escalate it to a support agent with your progress attached.",
  },
];

const audiences = [
  {
    title: "Device Users",
    description:
      "People using our devices in the field, such as an EMT working with a blood storage unit, who need answers without waiting for a support agent.",
  },
  {
    title: "Support Teams",
    description:
      "Support personnel who manage troubleshooting content and review which issues come up and how they get resolved.",
  },
];

export default function About() {
  const navigate = useNavigate();
  const { signedIn } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxWidth: "768px",
          textAlign: "center",
        }}
      >
        <Typography variant="h3">About</Typography>
        <Typography variant="h6" color="text.secondary">
          Interactive troubleshooting for medical devices, available whenever
          you need it.
        </Typography>
      </Box>

      <Card elevation={4} sx={{ maxWidth: "768px", width: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h5">Our Goal</Typography>
          <Typography>
            This app helps users of our devices complete basic troubleshooting
            on their own, without waiting for a support agent to become
            available. Each session also helps us learn which issues come up
            most often and which steps resolve them, so we can keep improving
            our products.
          </Typography>
        </CardContent>
      </Card>

      <Card elevation={4} sx={{ maxWidth: "768px", width: "100%" }}>
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="h5">How It Works</Typography>
          <Stepper orientation="vertical" activeStep={-1}>
            {steps.map((step) => (
              <Step key={step.label} expanded>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          maxWidth: "768px",
          width: "100%",
          gap: 4,
        }}
      >
        {audiences.map((audience) => (
          <Card key={audience.title} elevation={4}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Typography variant="h5">{audience.title}</Typography>
              <Typography>{audience.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Alert severity="warning" sx={{ maxWidth: "768px", width: "100%" }}>
        If a device fails during patient care, follow your organization's
        procedures first. This app is meant for routine troubleshooting.
      </Alert>

      <Button
        variant="contained"
        size="large"
        onClick={() => navigate(signedIn ? "/" : "/signup")}
      >
        {signedIn ? "Browse Articles" : "Get Started"}
      </Button>
    </Box>
  );
}
