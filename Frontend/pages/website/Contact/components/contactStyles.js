export const styles = {
  root: {
    maxWidth: 1400,
    mx: "auto",
    p: { xs: 2, md: 4 }
  },

  heading: {
    fontWeight: "bold",
    mb: 2,
    fontSize: { xs: "1.8rem", md: "2.2rem" }
  },

  subheading: {
    mb: 4,
    px: { xs: 2, md: 20 },
    fontSize: { xs: "0.9rem", md: "1rem" }
  },

  gridContainer: {
    alignItems: "stretch"
  },

  formContainer: {
    p: { xs: 2, md: 3 },
    border: "1px solid #e0e0e0",
    borderRadius: 2
  },

  mapContainer: {
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
    height: "100%"
  },

  mapBox: {
    width: "100%",
    height: { xs: 250, sm: 300, md: 350, lg: 400 }
  },

  submitBtn: {
    py: 1.4,
    backgroundColor: "#000",
    "&:hover": { backgroundColor: "#333" }
  },

  socialRow: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    mt: 4
  }
};
