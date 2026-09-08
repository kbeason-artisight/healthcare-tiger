import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";

export default function PageHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: SvgIconComponent;
  title: string;
  subtitle?: string;
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
      <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
        <Icon />
      </Avatar>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
