import { Box, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'

const filterOptions = ['All', 'Placement', 'Result', 'Event']

function FilterBar({ selectedType, onChange }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle1">
        Filter by type
      </Typography>
      <Box
        sx={{
          p: 1,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: '#f8fafc',
        }}
      >
        <ToggleButtonGroup
          value={selectedType}
          exclusive
          onChange={(_, value) => {
            if (value !== null) {
              onChange(value)
            }
          }}
          color="primary"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {filterOptions.map((option) => (
            <ToggleButton
              key={option}
              value={option}
              sx={{
                border: '1px solid !important',
                borderColor: 'divider !important',
                borderRadius: '12px !important',
                px: 2,
                py: 1,
                minWidth: { xs: 'calc(50% - 4px)', sm: 110 },
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.primary',
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: '#eef4ff',
                },
                '&.Mui-selected': {
                  backgroundColor: '#1f3a5f',
                  borderColor: '#1f3a5f !important',
                  color: '#ffffff',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#17304f',
                  color: '#ffffff',
                },
              }}
            >
              {option}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>
    </Stack>
  )
}

export default FilterBar
