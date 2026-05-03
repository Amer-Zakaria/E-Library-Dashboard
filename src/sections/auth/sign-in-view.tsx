import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { storeToken } from 'src/utils/token';

import { signin } from 'src/api/auth';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(async () => {
    const from = location.state?.from || '/';
    try {
      setIsLoading(true);
      const token = await signin(username, password);

      setIsLoading(false);
      storeToken(token);
    } catch (err: any) {
      setIsLoading(false);
      toast.error(err?.validation?.[0]?.message || err?.message || 'Unexpected error');
      return;
    }
    router.push(from);
  }, [router, username, password, location]);

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      {/* <TextField
        fullWidth
        name="email"
        label="Email address"
        defaultValue="hello@gmail.com"
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      /> */}

      {/* <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link> */}
      <TextField
        fullWidth
        name="username"
        label="Username"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <TextField
        fullWidth
        name="password"
        label="Password"
        placeholder="Enter you password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        disabled={isLoading}
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        {isLoading ? <CircularProgress sx={{ color: 'gray' }} size={25} /> : 'Sign in'}
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Sign in</Typography>
        {/* <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography> */}
      </Box>
      {renderForm}
      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>
      <Box
        sx={{
          gap: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:google" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:github" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify width={22} icon="socials:twitter" />
        </IconButton>
      </Box> */}
    </>
  );
}
