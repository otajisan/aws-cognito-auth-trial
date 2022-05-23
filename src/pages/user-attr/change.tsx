import {GetServerSideProps, NextPage} from "next";
import Router from 'next/router'
import React, {PropsWithChildren, useState} from "react";
import '@aws-amplify/ui-react/styles.css';
import {useAuth, UserAttributes} from "../../hooks/use-auth";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {Alert} from "@mui/material";


/**
 * Change user attributes page
 *
 * @see https://github.com/mui/material-ui/blob/v5.6.2/docs/data/material/getting-started/templates/sign-in/SignIn.tsx
 *
 * @param props
 * @constructor
 */
const ChangeUserAttributes: NextPage = (props: PropsWithChildren<Props>) => {
    const auth = useAuth();
    const [email, setEmail] = useState('');
    const [isAuthFailed, setAuthFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const updateUserAttributes = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const attr = {} as UserAttributes;
        if (email !== '') {
            attr.email = email;
        }
        const result = await auth.updateUserAttributes(attr);
        if (result.success) {
            await Router.push('/user-attr/verification-submit');
        } else {
            setAuthFailed(true);
            setErrorMessage(result.message);
        }
    };

    const theme = createTheme();

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        update your attributes.
                    </Typography>
                    <Box component="form" onSubmit={updateUserAttributes} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="groups"
                            label="Groups"
                            name="groups"
                            defaultValue={auth.groups.join(',')}
                            contentEditable={false}
                            disabled={true}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            defaultValue={auth.username}
                            contentEditable={false}
                            disabled={true}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            defaultValue={auth.email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{mt: 3, mb: 2}}
                        >
                            update
                        </Button>
                        <Grid container>
                            {isAuthFailed ? (<Alert severity="error">{errorMessage}</Alert>) : (<></>)}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

type Props = {};

export default ChangeUserAttributes;

