import { useEffect, useMemo, useState } from "react";
import {
  Drawer,
  Typography,
  Button,
  Backdrop,
  Divider,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Alert,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ClipboardList, Send } from "lucide-react";
import {
  useGetAiSurveyQuestionsQuery,
  useSaveAiSurveyResponseMutation,
} from "../../services/aiSurvey";
import { getAiSurveyEmpCode } from "../../helper/aiSurveyStorage";
import { updateStoredUserDisplayAISurvey } from "../../helper/userStorage";
import {
  buildSavePayload,
  parseOption,
  questionFieldKey,
  validateSurveyAnswers,
  type SurveyAnswersState,
} from "../../helper/aiSurveyUtils";
import type { AiSurveyQuestion } from "../../types/ai-survey-types";
import { useToast } from "../../hooks/useToast";

interface AISurveyDialogProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const StyledBackdrop = styled(Backdrop)({
  backgroundColor: "rgba(0, 0, 0, 0.35)",
  backdropFilter: "blur(3px)",
  WebkitBackdropFilter: "blur(3px)",
});

type QuestionBlockProps = {
  question: AiSurveyQuestion;
  index: number;
  answers: SurveyAnswersState;
  onSingleChange: (key: string, value: string) => void;
  onMultiToggle: (key: string, value: string) => void;
};

const QuestionBlock = ({
  question,
  index,
  answers,
  onSingleChange,
  onMultiToggle,
}: QuestionBlockProps) => {
  const fieldKey = questionFieldKey(question, index);
  const options = question.options.map(parseOption);
  const isMulti = question.type === "multipleChoice";
  const selectedMulti = (answers[fieldKey] as string[] | undefined) ?? [];

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <FormControl component="fieldset" fullWidth>
        <FormLabel
          component="legend"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            fontSize: "0.95rem",
            mb: 1.5,
            "&.Mui-focused": { color: "text.primary" },
          }}
        >
          {index + 1}. {question.question}
          {question.required && (
            <Typography component="span" color="error" sx={{ ml: 0.5 }}>
              *
            </Typography>
          )}
        </FormLabel>

        {isMulti ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={selectedMulti.includes(option.value)}
                    onChange={() => onMultiToggle(fieldKey, option.value)}
                    sx={{
                      color: "#2eacb3",
                      "&.Mui-checked": { color: "#2eacb3" },
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </Box>
        ) : (
          <RadioGroup
            value={(answers[fieldKey] as string) ?? ""}
            onChange={(e) => onSingleChange(fieldKey, e.target.value)}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    sx={{
                      color: "#2eacb3",
                      "&.Mui-checked": { color: "#2eacb3" },
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </RadioGroup>
        )}
      </FormControl>
    </Box>
  );
};

const AISurveyDialog: React.FC<AISurveyDialogProps> = ({
  open,
  onClose,
  onComplete,
}) => {
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<SurveyAnswersState>({});

  useEffect(() => {
    if (open) {
      setAnswers({});
    }
  }, [open]);

  const { data, isLoading, isError, isFetching } = useGetAiSurveyQuestionsQuery(
    undefined,
    { skip: !open }
  );
  const [saveResponse, { isLoading: isSaving }] =
    useSaveAiSurveyResponseMutation();

  const section = data?.data?.[0];
  const questions = section?.questions ?? [];
  const isLoadingState = isLoading || isFetching;

  const answeredCount = useMemo(() => {
    return questions.reduce((count, question, index) => {
      const key = questionFieldKey(question, index);
      const value = answers[key];
      if (question.type === "multipleChoice") {
        return Array.isArray(value) && value.length > 0 ? count + 1 : count;
      }
      return typeof value === "string" && value ? count + 1 : count;
    }, 0);
  }, [answers, questions]);

  const handleSingleChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  
  };

  const handleMultiToggle = (key: string, value: string) => {
    setAnswers((prev) => {
      const current = (prev[key] as string[] | undefined) ?? [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const handleDismiss = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const validationError = validateSurveyAnswers(questions, answers);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    const empCode = getAiSurveyEmpCode();
    if (!empCode) {
      showToast("Employee code not found. Please sign in again.", "error");
      return;
    }

    const payload = buildSavePayload(empCode, questions, answers);

    try {
      const response: any = await saveResponse(payload).unwrap();
      if (response?.success === false) {
        showToast(
          response?.message || "Failed to save survey response.",
          "error"
        );
        return;
      }

      updateStoredUserDisplayAISurvey("N");
      showToast(
        response?.message || "Survey submitted successfully. Thank you!",
        "success"
      );
      onComplete();
    } catch (err: any) {
      showToast(
        err?.data?.message ||
          err?.message ||
          "Failed to save survey response. Please try again.",
        "error"
      );
    }
  };



  return (
    <Drawer
      anchor="top"
      open={open}
      onClose={(__, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        handleDismiss();
      }}
      ModalProps={{
        BackdropComponent: StyledBackdrop,
      }}
      SlideProps={{ timeout: 600 }}
      PaperProps={{
        sx: {
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          pt: 3,
          pb: 2,
          background: "linear-gradient(135deg, #2eacb3 0%, #1f8a90 100%)",
          color: "white",
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
          <ClipboardList className="h-7 w-7 shrink-0" />
          <Typography variant="overline" sx={{ letterSpacing: 1.2, opacity: 0.9 }}>
            Employee feedback
          </Typography>
        </div>
    
        </div>
        {section?.title && (
          <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
            {section.title}
          </Typography>
        )}
        {section?.description && (
          <Typography
            variant="body2"
            sx={{ mt: 1.5, opacity: 0.95, whiteSpace: "pre-line" }}
          >
            {section.description}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2, sm: 4 },
          py: 3,
          bgcolor: "#f8fafb",
        }}
      >
        {isLoadingState && (
          <div className="flex justify-center py-12">
            <CircularProgress sx={{ color: "#2eacb3" }} />
          </div>
        )}

        {!isLoadingState && isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Unable to load survey questions. Please try again later.
          </Alert>
        )}

        {!isLoadingState && !isError && (
          <>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Progress: {answeredCount} / {questions.length} answered
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  minWidth: 120,
                  maxWidth: 280,
                  height: 6,
                  bgcolor: "#e0e0e0",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
                    bgcolor: "#2eacb3",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>

        

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {questions.map((question, index) => (
                <QuestionBlock
                  key={questionFieldKey(question, index)}
                  question={question}
                  index={index}
                  answers={answers}
                  onSingleChange={handleSingleChange}
                  onMultiToggle={handleMultiToggle}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      <Divider />
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          py: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          justifyContent: "flex-end",
          bgcolor: "background.paper",
        }}
      >
        {/* <Button
          variant="outlined"
          onClick={handleDismiss}
          disabled={isLoadingState || isSaving}
          sx={{
            borderColor: "#2eacb3",
            color: "#2eacb3",
            "&:hover": {
              borderColor: "#279aa0",
              bgcolor: "rgba(46, 172, 179, 0.06)",
            },
          }}
        >
          Skip for now
        </Button> */}
        <Button
          onClick={handleSubmit}
          disabled={isLoadingState || isSaving || isError}
          variant="contained"
          endIcon={
            isSaving ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <Send className="h-4 w-4" />
            )
          }
          sx={{
            minWidth: 160,
            backgroundColor: "#2eacb3",
            "&:hover": { backgroundColor: "#279aa0" },
            fontWeight: "bold",
          }}
        >
          {isSaving ? "Submitting..." : "Submit Survey"}
        </Button>
      </Box>
    </Drawer>
  );
};

export default AISurveyDialog;
