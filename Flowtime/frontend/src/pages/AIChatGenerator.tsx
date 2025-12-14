import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    TextareaAutosize,
    Button,
    Paper,
    Typography,
    CircularProgress,
    Stack,
    Divider,
    Grow,
} from "@mui/material";

import api from "../api";
import PageLayout from "../components/layout/PageLayout";
import Header from "../components/layout/Header";
import { flexbox } from "@mui/system";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const AIChatGenerator: React.FC<{ disableCustomTheme?: boolean }> = (props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages: Message[] = [
            ...messages,
            { role: "user", content: input },
        ];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await api.post("/api/ai/chat/", {
                messages: newMessages,
            });
            const aiMessage = response.data.response;
            setMessages([
                ...newMessages,
                { role: "assistant", content: aiMessage },
            ]);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "Désolé, une erreur s'est produite.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateProject = async () => {
        setIsGenerating(true);
        try {
            const response = await api.post("/api/ai/generate_project/", {
                messages,
            });
            const { project_id } = response.data;
            navigate(`/project/${project_id}`);
        } catch (error) {
            console.error("Error generating project:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <PageLayout {...props}>
            <Header pageTitle="AI Project Generator" />
            <Divider sx={{ my: 2 }} />

            {/* Boîte de dialogue avec AI pour disctuer et générer des projets et des tâches */}
            <Stack spacing={2} sx={{ width: "100%", maxWidth: "md" }}>
                <Paper elevation={3} sx={{ height: "60vh", overflowY: "auto" }}>
                    {messages.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                color: "grey.500",
                                mt: "20%",
                            }}
                        >
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Commencez la conversation !
                            </Typography>

                            <Typography variant="body1" sx={{ mt: 5 }}>
                                Décrivez le projet que vous souhaitez créer.
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{ fontStyle: "italic" }}
                            >
                                Ex: "Je veux créer un site e-commerce pour
                                vendre des plantes."
                            </Typography>
                        </Box>
                    ) : (
                        messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    mb: 2,
                                    p: 2,
                                    textAlign:
                                        msg.role === "user" ? "right" : "left",
                                }}
                            >
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        display: "inline-block",
                                        maxWidth: "80%",
                                        bgcolor:
                                            msg.role === "user"
                                                ? "primary.main"
                                                : "background.default",
                                        color:
                                            msg.role === "user"
                                                ? "primary.contrastText"
                                                : "text.primary",
                                    }}
                                >
                                    <Typography variant="body1">
                                        {msg.content}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))
                    )}
                    {isLoading && (
                        <Box sx={{ mb: 2, p: 5 }}>
                            <CircularProgress
                                size={24}
                                sx={{ display: "block", margin: "auto" }}
                            />
                        </Box>
                    )}
                </Paper>

                {/* Champ pour envoyer des messages à l'AI */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{ width: "100%", alignItems: "stretch" }}
                >
                    {/* <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Votre message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && !isLoading && handleSend()
                        }
                    /> */}

                    <TextareaAutosize
                        placeholder="Votre message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        minRows={1}
                        maxRows={5}
                        style={{
                            flex: 1,
                            boxSizing: "border-box",
                            borderRadius: 4,
                            fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                            fontSize: "0.875rem",
                            flexGrow: 1,
                            padding: "12px",
                            border: "1px solid #ccc",
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                if (e.shiftKey) {
                                    // Si Shift+Enter: ajouter une nouvelle ligne
                                    e.preventDefault();
                                    setInput(input + "\n");
                                } else if (!e.shiftKey && !isLoading) {
                                    // Si Enter seul: envoyer le message
                                    e.preventDefault();
                                    handleSend();
                                }
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSend}
                        disabled={isLoading}
                    >
                        Envoyer
                    </Button>
                </Stack>

                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGenerateProject}
                        disabled={messages.length < 2 || isGenerating}
                        startIcon={
                            isGenerating ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                ""
                            )
                        }
                    >
                        {isGenerating
                            ? "Génération en cours..."
                            : "Générer le Projet"}
                    </Button>
                </Box>
            </Stack>
        </PageLayout>
    );
};

export default AIChatGenerator;
