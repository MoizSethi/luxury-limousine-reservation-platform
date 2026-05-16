import { Grid, Card, CardContent, Typography, Box, Stack } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function ContactCards() {
  const info = [
    {
      icon: <PhoneIcon />,
      title: "Phone Number",
      value: "+1 (929) 378-4673",
      helper: "Call us for reservations and support.",
    },
    {
      icon: <EmailIcon />,
      title: "Email Address",
      value: "info@newyorklimoz.com",
      helper: "Send us your booking questions anytime.",
    },
    {
      icon: <LocationOnIcon />,
      title: "Office Location",
      value: "240 Round Hill Dr, Yonkers, NY 10710, USA",
      helper: "Serving NYC, Yonkers, airports, and Tri-State travel.",
    },
  ];

  return (
    <Grid container spacing={3}>
      {info.map((item, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              p: 1,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 18px 45px rgba(15,32,69,0.08)",
              transition: "0.25s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0 28px 70px rgba(15,32,69,0.15)",
                borderColor: "secondary.main",
              },
            }}
          >
            <CardContent>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 58,
                    height: 58,
                    borderRadius: 3,
                    bgcolor: "rgba(212,175,55,0.15)",
                    color: "secondary.dark",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "& svg": { fontSize: 32 },
                  }}
                >
                  {item.icon}
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: 900, color: "primary.main", mb: 1 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography sx={{ fontWeight: 700, mb: 0.8 }}>
                    {item.value}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                    {item.helper}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}