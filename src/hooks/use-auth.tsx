import {Amplify, Auth} from "aws-amplify";
import AwsConfigAuth from "../aws/auth";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {CognitoUserAttribute} from "amazon-cognito-identity-js";

console.log(AwsConfigAuth);
Amplify.configure({Auth: AwsConfigAuth, ssr: true});

interface UseAuth {
    isLoading: boolean;
    isAuthenticated: boolean;
    isSignedIn: boolean;
    username: string;
    groups: string[];
    email: string;
    currentUser: () => Promise<Result>;
    signIn: (username: string, password: string) => Promise<Result>;
    signOut: () => Promise<Result>;
    completeNewPassword: (newPassword: string) => Promise<Result>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<Result>;
    forgotPassword: (username: string) => Promise<Result>;
    forgotPasswordSubmit: (username: string, verificationCode: string, newPassword: string) => Promise<Result>;
    updateUserAttributes: (attr: UserAttributes) => Promise<Result>;
    verifyCurrentUserAttributeSubmit: (verificationCode: string) => Promise<Result>;
    verifyCurrentUserAttribute: () => Promise<Result>;
}

interface Result {
    success: boolean;
    message: string;
}

const authContext = createContext({} as UseAuth);

type Props = {
    children?: ReactNode;
};

export const ProvideAuth: React.FC = ({children}: Props) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
    return useContext(authContext);
};

const useProvideAuth = (): UseAuth => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [groups, setGroups] = useState<string[]>([]);
    const [signedUpUser, setSignedUpUser] = useState(null);
    const [isSignedIn, setIsSignedIn] = useState(false);

    const router = useRouter();

    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: false})
            .then((result) => {
                console.log(result)
                // Auth.currentSession().then(session => {
                //    console.log(session);
                //     const { payload } = session.getIdToken();
                //     if (payload && payload['cognito:groups'] ) {
                //         setGroups(payload['cognito:groups']);
                //     }
                // });
                const session = result.signInUserSession;
                const {payload} = session.getIdToken();
                if (payload && payload['cognito:groups']) {
                    setGroups(payload['cognito:groups']);
                }
                setUsername(result.username);
                setEmail(result.attributes.email);
                setIsAuthenticated(true);
                setIsSignedIn(true);
                setIsLoading(false);
                console.log('already authenticated.')
            })
            .catch(() => {
                setUsername('');
                setEmail('');
                setIsAuthenticated(false);
                setIsSignedIn(false);
                setIsLoading(false);
                console.log('not authenticated.');
            });
    }, []);

    const signIn = async (username: string, password: string) => {
        return await Auth.signIn(username, password).then((result) => {
            console.log(result);
            setUsername(result.username);
            setSignedUpUser(result);
            setIsSignedIn(true);
            const challengeName = result.challengeName;
            console.log('challengeName:' + challengeName);
            if (challengeName === 'NEW_PASSWORD_REQUIRED') {
                router.push('password/new').then();
            } else {
                setEmail(result.attributes.email);
                setIsAuthenticated(true);
            }

            return {success: true, message: ''};
        }).catch(e => {
            console.error(e.code + ': ' + e.message);
            if (e.code === 'PasswordResetRequiredException') {
                router.push('password/forgot').then();
                return {
                    success: false,
                    message: 'required to change password',
                };
            }
            return {
                success: false,
                message: 'failed to sign in...',
            };
        });

    };

    const signOut = async () => {
        return await Auth.signOut().then((result) => {
            console.log(result);
            setUsername('');
            setIsAuthenticated(false);
            setIsSignedIn(false);
            return {success: true, message: ''};
        }).catch(e => {
            console.error(e.code + ': ' + e.message);
            return {
                success: false,
                message: 'failed to sign out...',
            };
        });
    };

    const completeNewPassword = async (newPassword: string) => {
        return Auth.completeNewPassword(signedUpUser, newPassword).then((result) => {
            console.log(result);
            setIsAuthenticated(true);
            return {success: true, message: ''};
        }).catch((e) => {
            console.error(e.code + ': ' + e.message);
            return {
                success: false,
                message: 'failed to change password...',
            }
        });
    }

    const changePassword = async (oldPassword: string, newPassword: string) => {
        try {
            const user = await Auth.currentAuthenticatedUser();
            console.log(user)
            return Auth.changePassword(user, oldPassword, newPassword).then((result) => {
                console.log(result);
                setIsAuthenticated(true);
                return {success: true, message: ''};
            }).catch((e) => {
                console.error(e.code + ': ' + e.message);
                return {
                    success: false,
                    message: 'failed to change password...',
                }
            });
        } catch (e) {
            debugger
            return {
                success: false,
                message: 'failed to change password...',
            }
        }
    };

    const forgotPassword = async (username: string) => {
        return await Auth.forgotPassword(username)
            .then((result) => {
                console.log(result);
                return {success: true, message: ''};
            }).catch((e) => {
                console.error(e.code + ': ' + e.message);
                return {
                    success: false,
                    message: 'failed to reset password...',
                }
            });
    };

    const forgotPasswordSubmit = async (username: string, verificationCode: string, newPassword: string) => {
        return await Auth.forgotPasswordSubmit(username, verificationCode, newPassword)
            .then((result) => {
                console.log(result);
                return {success: true, message: ''};
            }).catch((e) => {
                console.error(e.code + ': ' + e.message);
                if (e.code === 'CodeMismatchException') {
                    return {
                        success: false,
                        message: 'verification code expired.',
                    }
                }
                if (e.code === 'LimitExceededException') {
                    debugger
                    return {
                        success: false,
                        message: 'reached the limit. account has been temporarily locked.',
                    }
                }
                return {
                    success: false,
                    message: 'failed to reset password...',
                }
            });
    };

    const updateUserAttributes = async (attr: UserAttributes) => {
        try {
            debugger
            const user = await Auth.currentAuthenticatedUser();
            return await Auth.updateUserAttributes(user, attr)
                .then(result => {
                    console.log(result);
                    if (attr.email !== null && typeof attr.email !== undefined) {
                        setEmail(attr.email!);
                    }
                    return {success: true, message: ''};
                })
                .catch(e => {
                    console.error(e.code + ': ' + e.message);
                    return {
                        success: false,
                        message: 'failed to update user attribute...',
                    }
                })
        } catch (e) {
            return {
                success: false,
                message: 'not authorized...',
            }
        }
    };

    const verifyCurrentUserAttributeSubmit = async (verificationCode: string) => {
        return await Auth.verifyCurrentUserAttributeSubmit('email', verificationCode)
            .then((result) => {
                console.log(result);
                return {success: true, message: ''};
            }).catch((e) => {
                console.error(e.code + ': ' + e.message);
                if (e.code === 'ExpiredCodeException') {
                    return {
                        success: false,
                        message: 'your verification code is expired. please re-send verification code.',
                    }
                } else if (e.code === 'CodeMismatchException') {
                    return {
                        success: false,
                        message: 'your verification code is mismatched. please check.',
                    }
                }
                return {
                    success: false,
                    message: 'failed to verify email...',
                }
            });
    };

    const verifyCurrentUserAttribute = async () => {
        return await Auth.verifyCurrentUserAttribute('email')
            .then((result) => {
                console.log(result);
                return {success: true, message: ''};
            }).catch((e) => {
                console.error(e.code + ': ' + e.message);
                return {
                    success: false,
                    message: 'failed to re-send verification code...',
                }
            });
    };

    const currentUser = async () => {
        return await Auth.currentUserInfo();
    };

    return {
        isLoading,
        isAuthenticated,
        isSignedIn: isSignedIn,
        username,
        groups,
        email,
        currentUser,
        signIn,
        signOut,
        completeNewPassword,
        changePassword,
        forgotPassword,
        forgotPasswordSubmit,
        updateUserAttributes,
        verifyCurrentUserAttributeSubmit,
        verifyCurrentUserAttribute,
    };
};

export type UserAttributes = {
    username?: string,
    email?: string,
};
