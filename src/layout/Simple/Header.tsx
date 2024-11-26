import { useState, cloneElement, ReactElement, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';

// project-imports
import { ThemeDirection } from 'config';
import IconButton from 'components/@extended/IconButton';
import Dot from 'components/@extended/Dot';
import Logo from 'components/logo';
import { handlerComponentDrawer, useGetMenuMaster } from 'api/menu';
import { useIspValue } from 'hooks/useIspValue';
import { Login, UserAdd, Logout } from 'iconsax-react';
import useAuth from 'hooks/useAuth';

interface ElevationScrollProps {
  layout: string;
  children: ReactElement;
  window?: Window | Node;
}

// elevation scroll
function ElevationScroll({ children, window }: ElevationScrollProps) {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 10,
    target: window ? window : undefined
  });

  return cloneElement(children, {
    style: {
      boxShadow: trigger ? '0 8px 6px -10px rgba(0, 0, 0, 0.5)' : 'none',
      backgroundColor: trigger ? alpha(theme.palette.background.default, 0.8) : alpha(theme.palette.background.default, 0.1)
    }
  });
}

interface Props {
  layout?: string;
}

// ==============================|| COMPONENTS - APP BAR ||============================== //

export default function Header({ layout = 'landing', ...others }: Props) {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, isLoggedIn } = useAuth();
  const { menuMaster } = useGetMenuMaster();
  const ispValueAvailable = useIspValue();

  const url = ispValueAvailable ? 'https://1.envato.market/OrJ5nn' : 'https://1.envato.market/zNkqj6';

  return (
    <ElevationScroll layout={layout} {...others}>
      <AppBar
        sx={{
          bgcolor: alpha(theme.palette.background.default, 0.1),
          backdropFilter: 'blur(8px)',
          color: theme.palette.text.primary,
          boxShadow: 'none'
        }}
      >
        <Container maxWidth="xl" disableGutters={matchDownMd}>
          <Toolbar sx={{ px: { xs: 1.5, sm: 4, md: 0, lg: 0 }, py: 1 }}>
            <Stack direction="row" sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} alignItems="center">
              <Typography sx={{ textAlign: 'left', display: 'inline-block' }}>
                <Logo to="/" />
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{
                '& .header-link': { fontWeight: 500, '&:hover': { color: 'primary.main' } },
                display: { xs: 'none', md: 'block' }
              }}
              spacing={3}
            >
              <Link
                className="header-link"
                sx={{ ml: theme.direction === ThemeDirection.RTL ? 3 : 0 }}
                color="secondary.main"
                component={RouterLink}
                to={ispValueAvailable ? '/' : '/'}
                underline="none"
              >
                About Us
              </Link>
              <Link
                className="header-link"
                sx={{ ml: theme.direction === ThemeDirection.RTL ? 3 : 0 }}
                color="secondary.main"
                component={RouterLink}
                to={ispValueAvailable ? '/donate' : '/donate'}
                underline="none"
              >
                Donate
              </Link>
              <Link
                className="header-link"
                color="secondary.main"
                component={RouterLink}
                to={ispValueAvailable ? '/application_form' : '/application_form'}
                underline="none"
              >
                Application Form
              </Link>
              <Link
                className="header-link"
                color="secondary.main"
                href="https://phoenixcoded.gitbook.io/able-pro"
                target="_blank"
                underline="none"
              >
                Contact Us
              </Link>
              {isLoggedIn ? (
                <IconButton
                  size="large"
                  shape="rounded"
                  color="secondary"
                  onClick={logout}
                  sx={{
                    bgcolor: 'error.light',
                    color: 'secondary.darker',
                    '&:hover': { color: 'secondary.lighter', bgcolor: 'secondary.darker' }
                  }}
                >
                  <Logout />
                </IconButton>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<Login />}
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#14783D',
                      '&:hover': {
                        bgcolor: '#0f5c2f'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    startIcon={<UserAdd />}
                    variant="outlined"
                    size="small"
                    sx={{
                      color: '#14783D',
                      borderColor: '#14783D',
                      '&:hover': {
                        bgcolor: 'transparent',
                        borderColor: '#0f5c2f',
                        color: '#0f5c2f'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Stack>
            <Box
              sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                display: { xs: 'flex', md: 'none' }
              }}
            >
              <Typography sx={{ textAlign: 'left', display: 'inline-block' }}>
                <Logo to="/" />
              </Typography>
              <Stack direction="row" spacing={2}>
                {isLoggedIn ? (
                  <IconButton
                    size="large"
                    shape="rounded"
                    color="secondary"
                    onClick={logout}
                    sx={{
                      bgcolor: 'error.light',
                      color: 'secondary.darker',
                      '&:hover': { color: 'secondary.lighter', bgcolor: 'secondary.darker' }
                    }}
                  >
                    <Logout />
                  </IconButton>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/login"
                      startIcon={<Login />}
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: '#14783D',
                        '&:hover': {
                          bgcolor: '#0f5c2f'
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/register"
                      startIcon={<UserAdd />}
                      variant="outlined"
                      size="small"
                      sx={{
                        color: '#14783D',
                        borderColor: '#14783D',
                        '&:hover': {
                          bgcolor: 'transparent',
                          borderColor: '#0f5c2f',
                          color: '#0f5c2f'
                        }
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Stack>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
}
