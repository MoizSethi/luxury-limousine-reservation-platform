import { Helmet } from "react-helmet-async";
import { Box, Container } from "@mui/material";

import ContactHero from "./components/ContactHero";
import ContactForm from "./components/ContactForm";
import ContactCards from "./components/ContactCards";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact New York Limoz | NYC Chauffeur & Limo Service</title>
        <meta
          name="description"
          content="Contact New York Limoz for luxury limo service, airport transfers, corporate chauffeur rides, and private transportation in NYC and Yonkers."
        />
        <link rel="canonical" href="https://newyorklimoz.com/contact" />
      </Helmet>

      <Box sx={{ bgcolor: "background.default", overflow: "hidden" }}>
        <ContactHero />

        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <ContactCards />

          <Box sx={{ mt: { xs: 6, md: 9 } }}>
            <ContactForm />
          </Box>
        </Container>
      </Box>
    </>
  );
}