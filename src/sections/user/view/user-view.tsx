import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';

import { getCurrentWeekStats, type WeeklyStats } from 'src/services/api';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function UserView() {
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCurrentWeekStats();
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleRow = (name: string) => {
    setOpenRows(prev => ({ ...prev, [name]: !prev[name] }));
  };

  if (loading) return <div>Loading...</div>;
  if (!stats?.developers_rankings) return <div>No data available</div>;

  const developers = Object.values(stats.developers_rankings);

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Developer Performance Analysis
      </Typography>
      
      <Card>
        <Scrollbar>
          <TableContainer>
            <Table>
              <TableBody>
                {developers.map((developer) => (
                  <React.Fragment key={developer.name}>
                    <TableRow hover>
                      <TableCell padding="checkbox">
                        <IconButton size="small" onClick={() => toggleRow(developer.name)}>
                          <Iconify
                            icon={openRows[developer.name] ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{developer.name}</Typography>
                      </TableCell>
                      <TableCell>Score: {developer.average_score || 'N/A'}</TableCell>
                      <TableCell>Reviews: {developer.total_reviews}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Chip 
                            label={`Quality Issues: ${developer.total_quality_issues}`} 
                            color="warning" 
                            size="small"
                          />
                          <Chip 
                            label={`Critical Issues: ${developer.total_critical_issues}`} 
                            color="error" 
                            size="small"
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={openRows[developer.name]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Stack spacing={3}>
                              <Box>
                                <Typography variant="subtitle2" color="primary" gutterBottom>
                                  Strengths
                                </Typography>
                                <Typography variant="body2">
                                  {developer.strength}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" color="warning.main" gutterBottom>
                                  Areas for Improvement
                                </Typography>
                                <Typography variant="body2">
                                  {developer.areas_for_improvement}
                                </Typography>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" color="info.main" gutterBottom>
                                  Suggested Resources
                                </Typography>
                                <ul>
                                  {developer.suggested_resources.map((resource, index) => (
                                    <li key={index}>
                                      <Typography variant="body2">{resource}</Typography>
                                    </li>
                                  ))}
                                </ul>
                              </Box>

                              <Box>
                                <Typography variant="subtitle2" color="success.main" gutterBottom>
                                  Learning References
                                </Typography>
                                <ul>
                                  {developer.learning_reference_links.map((link, index) => (
                                    <li key={index}>
                                      <a href={link} target="_blank" rel="noopener noreferrer">
                                        {link}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </Box>
                            </Stack>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>
    </DashboardContent>
  );
}
