import { Helmet } from "react-helmet-async";
import { Container, Box } from "@mui/material";

import HeroBanner from "./components/HeroBanner";
import WhoWeAre from "./components/WhoWeAre";
import WhyChooseUs from "./components/WhyChooseUs";
import CTASection from "./components/CTASection";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About New York Limoz | Luxury Chauffeur Service NYC</title>
        <meta
          name="description"
          content="Learn about New York Limoz, a premium NYC limo and chauffeur service offering airport transfers, corporate travel, hourly rides, and luxury transportation."
        />
        <meta
          name="keywords"
          content="about New York Limoz, NYC limo company, chauffeur service NYC, luxury car service New York, airport limo service NYC"
        />
        <link rel="canonical" href="https://newyorklimoz.com/about" />
      </Helmet>

      <Box sx={{ bgcolor: "background.default", overflow: "hidden" }}>
        <HeroBanner />

        <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
          <WhoWeAre />
          <WhyChooseUs />
          <CTASection />
        </Container>
      </Box>
    </>
  );
}