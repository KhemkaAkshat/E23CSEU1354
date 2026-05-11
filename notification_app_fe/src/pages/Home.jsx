import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import FilterBar from '../components/FilterBar'
import PriorityInbox from '../components/PriorityInbox'
import Log from '../../../logging_middleware/logger.js'

const ITEMS_PER_PAGE = 5
const BACKEND_URL = 'http://localhost:3000/notifications'

function getPriorityScore(notification) {
  let score = 0

  if (notification.type === 'Placement') score += 3
  else if (notification.type === 'Result') score += 2
  else score += 1

  if (!notification.isRead) score += 2

  return score
}

function Home() {
  const [selectedType, setSelectedType] = useState('All')
  const [page, setPage] = useState(1)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadNotifications() {
      setLoading(true)
      setError('')

      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: String(ITEMS_PER_PAGE),
        })

        if (selectedType !== 'All') {
          query.set('notification_type', selectedType)
        }

        const response = await fetch(`${BACKEND_URL}?${query.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load notifications')
        }

        const loadedNotifications = data.data.map((notification) => ({
          ...notification,
          priorityScore:
            notification.priorityScore ?? getPriorityScore(notification),
        }))

        setNotifications(loadedNotifications)
        setPagination(data.pagination)
        setUnreadCount(data.unreadCount ?? 0)

        await Log(
          'frontend',
          'info',
          'component',
          'Notifications loaded successfully',
        )
      } catch (loadError) {
        setNotifications([])
        setPagination({
          page: 1,
          limit: ITEMS_PER_PAGE,
          total: 0,
          totalPages: 1,
        })
        setUnreadCount(0)
        setError(loadError.message)

        await Log(
          'frontend',
          'error',
          'component',
          `Frontend error: ${loadError.message}`,
        )
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [page, selectedType])

  async function handleFilterChange(value) {
    setSelectedType(value)
    setPage(1)

    await Log(
      'frontend',
      'info',
      'component',
      `Filter changed to ${value}`,
    )
  }

  async function handlePageChange(_, value) {
    setPage(value)

    await Log(
      'frontend',
      'info',
      'component',
      `Pagination changed to page ${value}`,
    )
  }

  return (
    <Box
      sx={{
        background:
          'linear-gradient(180deg, #eef2f6 0%, #f6f7f5 220px, #f6f7f5 100%)',
        minHeight: '100vh',
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              background:
                'linear-gradient(135deg, #ffffff 0%, #fbfcfd 100%)',
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box maxWidth={560}>
                  <Typography variant="h4" gutterBottom>
                    Notification Dashboard
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    A clean inbox for placement, result, and event updates,
                    sorted by what matters first.
                  </Typography>
                </Box>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  alignItems="flex-start"
                >
                  <Chip
                    label={`${pagination.total} total`}
                    sx={{ backgroundColor: '#f2f4f7', color: 'text.primary' }}
                  />
                  <Chip
                    label={`${unreadCount} unread`}
                    sx={{ backgroundColor: '#eef4ff', color: 'primary.main' }}
                  />
                </Stack>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Highest priority
                    </Typography>
                    <Typography variant="h5">Placement</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Extra weight
                    </Typography>
                    <Typography variant="h5">Unread first</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Page size
                    </Typography>
                    <Typography variant="h5">5 items</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
            <FilterBar selectedType={selectedType} onChange={handleFilterChange} />
          </Paper>

          <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4 }}>
            <Stack spacing={3}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={1}
              >
                <Typography variant="h5">
                  Priority Inbox
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sorted by type priority, unread status, and latest timestamp.
                </Typography>
              </Stack>

              {loading && (
                <Stack alignItems="center" py={4}>
                  <CircularProgress />
                </Stack>
              )}

              {!loading && error && (
                <Alert severity="error">{error}</Alert>
              )}

              {!loading && !error && notifications.length > 0 && (
                <PriorityInbox notifications={notifications} />
              )}

              {!loading && !error && notifications.length === 0 && (
                <Typography variant="body1" color="text.secondary">
                  No notifications found for the selected filter.
                </Typography>
              )}

              {!loading && !error && pagination.totalPages > 1 && (
                <Box display="flex" justifyContent="center">
                  <Pagination
                    count={pagination.totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}

export default Home
