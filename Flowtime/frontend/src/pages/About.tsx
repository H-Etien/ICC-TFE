import React from "react";
import {
    Box,
    Container,
    Typography,
    Divider,
    Stack,
    Link,
} from "@mui/material";
import PageLayout from "../components/layout/PageLayout";
import Header from "../components/layout/Header";

export default function About(props: { disableCustomTheme?: boolean }) {
    return (
        <PageLayout {...props}>
            <Header pageTitle="About" />
            <Divider sx={{ my: 2 }} />

            <Container maxWidth="md">
                <Stack spacing={4}>
                    {/* Section À propos */}
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            À propos de Flowtime
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: "text.secondary", lineHeight: 1.8 }}
                        >
                            Flowtime est une application de gestion de projets
                            et de tâches développée comme travail de fin
                            d'études (TFE). Elle permet aux utilisateurs de
                            créer, organiser et suivre leurs projets et tâches
                            de manière efficace, avec l'aide d'une intelligence
                            artificielle pour générer des projets.
                        </Typography>
                    </Box>

                    <Divider />

                    {/* Section Politique de confidentialité */}
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            Politique de confidentialité
                        </Typography>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    1. Données collectées
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Nous collectons les données suivantes lors
                                    de votre inscription:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        ml: 2,
                                        mt: 1,
                                    }}
                                >
                                    • Nom d'utilisateur
                                    <br />
                                    • Adresse email
                                    <br />
                                    • Projets et tâches créés
                                    <br />• Préférences utilisateur
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    2. Utilisation des données
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Vos données sont utilisées exclusivement
                                    pour:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        ml: 2,
                                        mt: 1,
                                    }}
                                >
                                    • Fournir et améliorer nos services
                                    <br />
                                    • Vous permettre d'utiliser l'application
                                    <br />
                                    • Vous envoyer des notifications pertinentes
                                    <br />• Respecter les obligations légales
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    3. Vos droits GDPR
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Conformément au RGPD, vous avez le droit de:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        ml: 2,
                                        mt: 1,
                                    }}
                                >
                                    • Accéder à vos données personnelles
                                    <br />
                                    • Rectifier vos données incorrectes
                                    <br />
                                    • Supprimer vos données ("droit à l'oubli")
                                    <br />
                                    • Exporter vos données
                                    <br />• Retirer votre consentement
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    4. Cookies
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Nous utilisons les cookies pour:
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        ml: 2,
                                        mt: 1,
                                    }}
                                >
                                    • Maintenir votre session authentifiée
                                    <br />
                                    • Sauvegarder vos préférences
                                    <br />• Analyser l'utilisation du site
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    5. Durée de conservation
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Vos données sont conservées tant que votre
                                    compte est actif. Après suppression de votre
                                    compte, vos données seront effacées dans un
                                    délai de 30 jours, sauf obligation légale
                                    contraire.
                                </Typography>
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    6. Partage des données
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary" }}
                                >
                                    Nous ne partageons pas vos données
                                    personnelles avec des tiers, sauf si cela
                                    est nécessaire pour fournir le service ou
                                    respecter la loi.
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Section Conditions d'utilisation */}
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            Conditions d'utilisation
                        </Typography>
                        <Stack spacing={2}>
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                En utilisant Flowtime, vous acceptez de:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary", ml: 2 }}
                            >
                                • Utiliser l'application de manière légale et
                                responsable
                                <br />
                                • Ne pas créer plusieurs comptes pour contourner
                                les restrictions
                                <br />
                                • Ne pas accéder aux données d'autres
                                utilisateurs
                                <br />
                                • Respecter les droits d'auteur et les droits de
                                propriété intellectuelle
                                <br />• Accepter que nous puissions modifier le
                                service
                            </Typography>
                        </Stack>
                    </Box>

                    <Divider />

                    {/* Section Contact */}
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{ mb: 2, fontWeight: 600 }}
                        >
                            Nous contacter
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                        >
                            Pour toute question concernant vos données
                            personnelles ou l'application, contactez-nous à:{" "}
                            <Link
                                href="mailto:contact@flowtime.com"
                                sx={{ color: "primary.main" }}
                            >
                                contact@flowtime.com
                            </Link>
                        </Typography>
                    </Box>

                    <Box sx={{ py: 2, textAlign: "center" }}>
                        <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                        >
                            Dernière mise à jour:{" "}
                            {new Date().toLocaleDateString("fr-FR")}
                        </Typography>
                    </Box>
                </Stack>
            </Container>
        </PageLayout>
    );
}
