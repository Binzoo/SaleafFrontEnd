// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import logoimg from '../../assets/images/SaleafClear.png';
// third-party
import { motion } from 'framer-motion';

// project-imports
import Logo from 'components/logo';

// assets
import { Dribbble, Facebook, Link2, Youtube, Xrp } from 'iconsax-react';

// link - custom style
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover, &:active': {
    color: theme.palette.primary.main
  }
}));

type showProps = {
  isFull?: boolean;
};

// ==============================|| LANDING - FOOTER PAGE ||============================== //

export default function FooterBlock({ isFull }: showProps) {
  const theme = useTheme();

  const linkSX = {
    color: theme.palette.text.secondary,
    fontWeight: 400,
    opacity: '0.6',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1'
    }
  };

  return (
    <>
      <Box sx={{ pt: isFull ? 5 : 10, pb: 10, bgcolor: 'secondary.200', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <img src={logoimg} alt="Company Logo" style={{ width: '50%' }} />
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={{ xs: 5, md: 2 }}>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">Company</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="/" target="_blank" underline="none">
                        About Us
                      </FooterLink>
                      <FooterLink href="/donate" target="_blank" underline="none">
                        Donate
                      </FooterLink>
                      <FooterLink href="/application_form" target="_blank" underline="none">
                        Application Form
                      </FooterLink>
                      <FooterLink href="https://www.facebook.com/saleafsa/" target="_blank" underline="none">
                        Follow us
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          py: 2.4,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'secondary.200'
        }}
      >
        <Container>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}></Grid>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'flex-end' }}>
                <Grid item>
                  <Tooltip title="Facebook">
                    <Link href="https://www.facebook.com/saleafsa/" underline="none" target="_blank" sx={linkSX}>
                      <Facebook variant="Bold" size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Youtube">
                    <Link href="https://youtu.be/PWBGFM2wD94" underline="none" target="_blank" sx={linkSX}>
                      <Youtube variant="Bold" size={20} />
                    </Link>
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
