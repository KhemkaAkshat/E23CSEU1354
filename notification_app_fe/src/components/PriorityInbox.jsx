import { Stack } from '@mui/material'
import NotificationCard from './NotificationCard'

function PriorityInbox({ notifications }) {
  return (
    <Stack spacing={2.5}>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </Stack>
  )
}

export default PriorityInbox
