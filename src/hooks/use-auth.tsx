import {Amplify, Auth} from "aws-amplify";
import AwsConfigAuth from "../aws/auth";
import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useRouter} from "next/router";

console.log(AwsConfigAuth);
Amplify.configure({Auth: AwsConfigAuth, ssr: true});

interface UseAuth {
    isLoading: boolean;
    isAuthenticated: boolean;
    isSignedUp: boolean;
    username: string;
    signUp: (username: string, password: string) => Promise<Result>;
    confirmSignUp: (verificationCode: string) => Promise<Result>;
    signIn: (username: string, password: string) => Promise<Result>;
    signOut: () => Promise<Result>;
    completeNewPassword: (newPassword: string) => Promise<Result>;
    changePassword: (oldPassword: string, newPassword: string) => Promise<Result>;
    forgotPassword: (username: string) => Promise<Result>;
    forgotPasswordSubmit: (username: string, verificationCode: string, newPassword: string) => Promise<Result>;
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
    const [password, setPassword] = useState('');
    const [signedUpUser, setSignedUpUser] = useState(null);
    const [isSignedUp, setIsSignedUp] = useState(false);

    const router = useRouter();

    useEffect(() => {
        Auth.currentAuthenticatedUser({bypassCache: false})
            .then((result) => {
                console.log(result)
                setUsername(result.username);
                setIsAuthenticated(true);
                setIsSignedUp(true);
                setIsLoading(false);
                console.log('already authenticated.')
            })
            .catch(() => {
                setUsername('');
                setIsAuthenticated(false);
                setIsSignedUp(true);
                setIsLoading(false);
                console.log('not authenticated.');
            });
    }, []);

    const signUp = async (username: string, password: string) => {
        try {
            await Auth.signUp({username, password});
            setUsername(username);
            setPassword(password);
            return {success: true, message: ''};
        } catch (error) {
            return {
                success: false,
                message: 'failed to sign up...',
            };
        }
    };

    const confirmSignUp = async (verificationCode: string) => {
        try {
            await Auth.confirmSignUp(username, verificationCode);
            const result = await signIn(username, password);
            setPassword('');
            return result;
        } catch (error) {
            return {
                success: false,
                message: 'failed to sign up...',
            };
        }
    };

    const signIn = async (username: string, password: string) => {
        try {
            return await Auth.signIn(username, password).then((result) => {
                setUsername(result.username);
                setSignedUpUser(result);
                setIsSignedUp(true);
                const challengeName = result.challengeName;
                console.log('challengeName:' + challengeName);
                if (challengeName === 'NEW_PASSWORD_REQUIRED') {
                    router.push('password/new').then();
                } else {
                    setIsAuthenticated(true);
                }
                return {success: true, message: ''};
            }).catch(e => {
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


        } catch (error) {
            return {
                success: false,
                message: 'failed to sign in...',
            };
        }
    };

    const signOut = async () => {
        try {
            await Auth.signOut();
            setUsername('');
            setIsAuthenticated(false);
            setIsSignedUp(false);
            return {success: true, message: ''};
        } catch (error) {
            return {
                success: false,
                message: 'failed to sign out...',
            };
        }
    };

    const completeNewPassword = async (newPassword: string) => {
        try {
            return Auth.completeNewPassword(signedUpUser, newPassword).then((result) => {
                console.log(result);
                setIsAuthenticated(true);
                return {success: true, message: ''};
            }).catch((e) => {
                debugger
                console.error(e.message);
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
                debugger
                console.error(e.message);
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
      try {
          return await Auth.forgotPassword(username)
              .then((result) => {
                  console.log(result);
                  return {success: true, message: ''};
              }).catch((e) => {
                  debugger
                  console.error(e.message);
                  return {
                      success: false,
                      message: 'failed to reset password...',
                  }
              });
      } catch (e) {
          debugger
          return {
              success: false,
              message: 'failed to reset password...',
          }
      }
    };

    const forgotPasswordSubmit = async (username: string, verificationCode: string, newPassword: string) => {
        try {
            return await Auth.forgotPasswordSubmit(username, verificationCode, newPassword)
                .then((result) => {
                    console.log(result);
                    return {success: true, message: ''};
                }).catch((e) => {
                    debugger
                    console.error(e.message);
                    return {
                        success: false,
                        message: 'failed to reset password...',
                    }
                });
        } catch (e) {
            debugger
            return {
                success: false,
                message: 'failed to reset password...',
            }
        }
    };

    return {
        isLoading,
        isAuthenticated,
        isSignedUp,
        username,
        signUp,
        confirmSignUp,
        signIn,
        signOut,
        completeNewPassword,
        changePassword,
        forgotPassword,
        forgotPasswordSubmit,
    };
}
