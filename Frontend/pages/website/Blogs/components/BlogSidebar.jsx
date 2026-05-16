import { Box, Typography, Stack, Button, TextField } from "@mui/material";

export default function BlogSidebar({ glass, blogs }) {
  return (
    <Box sx={{ position: "sticky", top: 96 }}>
      <Box sx={{ p: 2, mb: 3, ...glass }}>
        <Typography variant="h6">About this blog</Typography>
        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
          Weekly stories, guides, and updates.
        </Typography>
      </Box>

      <Box sx={{ p: 2, mb: 3, ...glass }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Popular Posts</Typography>
        <Stack spacing={1}>
          {blogs.slice(0, 4).map((p) => (
            <Stack direction="row" key={p.id} spacing={1} alignItems="center">
              <img src={p.cover} width="72" height="48" style={{ borderRadius: 6, objectFit: "cover" }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {p.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">{p.date}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: 2, ...glass }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Newsletter</Typography>
        <Stack spacing={1}>
          <TextField size="small" placeholder="Your email" />
          <Button variant="contained">Subscribe</Button>
        </Stack>
      </Box>
    </Box>
  );
}
