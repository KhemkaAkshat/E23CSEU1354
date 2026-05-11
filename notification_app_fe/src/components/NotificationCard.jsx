import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

const typeStyles = {
  Placement: {
    label: 'Placement',
    backgroundColor: '#e8f0fb',
    color: '#1f3a5f',
  },
  Result: {
    label: 'Result',
    backgroundColor: '#eaf5ee',
    color: '#256142',
  },
  Event: {
    label: 'Event',
    backgroundColor: '#fbf2e5',
    color: '#8a5a12',
  },
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function NotificationCard({ notification }) {
  const typeStyle = typeStyles[notification.type] || typeStyles.Event

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: notification.isRead ? 'divider' : 'primary.light',
        borderRadius: 4,
        backgroundColor: notification.isRead ? 'background.paper' : '#fcfdff',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.25}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
            spacing={1.5}
          >
            <Stack spacing={0.75}>
              <Typography variant="h6" fontWeight={600} color="text.primary">
                {notification.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(notification.createdAt)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={typeStyle.label}
                size="small"
                sx={{
                  backgroundColor: typeStyle.backgroundColor,
                  color: typeStyle.color,
                }}
              />
              <Chip
                label={notification.isRead ? 'Read' : 'Unread'}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: notification.isRead ? 'divider' : '#f0c7c7',
                  color: notification.isRead ? 'text.secondary' : '#b42318',
                  backgroundColor: notification.isRead ? 'transparent' : '#fff5f5',
                }}
              />
            </Stack>
          </Stack>

          <Divider />

          <Typography variant="body1" color="text.secondary">
            {notification.message}
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              backgroundColor: '#f7f8fa',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Priority score: {notification.priorityScore}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default NotificationCard
