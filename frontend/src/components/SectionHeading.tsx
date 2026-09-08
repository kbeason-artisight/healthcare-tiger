import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function SectionHeading({ children }: { children: string }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
      <Typography variant="overline" color="primary.main" fontWeight={800} letterSpacing={1.2} whiteSpace="nowrap">
        {children}
      </Typography>
      <Divider sx={{ flexGrow: 1 }} />
    </Stack>
  );
}
