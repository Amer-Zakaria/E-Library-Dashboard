import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { getStats } from 'src/api/stats';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsUserTable } from '../analytics-user-table';

// ----------------------------------------------------------------------

type StatsData = {
  totalViews: number;
  totalDownloads: number;
  totalSessions: number;
  mostViewed: {
    frequency: number;
    name: string;
  };
};

export function OverviewAnalyticsView() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await getStats();
        setStats(response as any);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    })();
  }, []);

  const renderCard = (title: string, total: number, icon: string) => (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        boxShadow: 'none',
        height: '100%',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>
          {total}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 48,
          height: 48,
          display: 'flex',
          borderRadius: 1.5,
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          backgroundColor: (theme) => theme.palette.action.hover,
        }}
      >
        <Iconify icon={icon as any} width={28} />
      </Box>
    </Card>
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.lighter} 0%, ${theme.palette.primary.light} 100%)`,
              borderRadius: 2,
              boxShadow: 'none',
              height: '100%',
              color: 'primary.darker',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Iconify
                icon={'solar:star-bold-duotone' as any}
                width={32}
                sx={{ color: 'primary.main', mr: 1.5 }}
              />
              <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 700 }}>
                Most Viewed Book
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {stats?.mostViewed.name ?? 'No data'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Typography variant="h2" sx={{ fontWeight: 800, mr: 1 }}>
                {stats?.mostViewed.frequency ?? 0}
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                total views
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 12 }}>
              {renderCard('Total Views', stats?.totalViews ?? 0, 'solar:eye-bold-duotone')}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {renderCard(
                'Total Downloads',
                stats?.totalDownloads ?? 0,
                'solar:download-bold-duotone'
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {renderCard(
                'Total Sessions',
                stats?.totalSessions ?? 0,
                'solar:users-group-rounded-bold-duotone'
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <AnalyticsUserTable title="User Activities" subheader="Engagement metrics by user" />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
